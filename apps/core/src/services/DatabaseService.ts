import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { env } from "../utils/env";
import { Database } from "../models/Database";

const pool = new Pool({ connectionString: env.DB_URL });

/** NOTE: The actual provision/fork methods would call job runners/kubernetes APIs.
  For now, these methods stub and only create metadata records;
  you’ll need to connect orchestration code later.*/
export class DatabaseService {
  // Provision a new database for a team (primary or as a branch)
  static async provision(
    team_id: string,
    name: string,
    source_db_id: string | null = null,
    schema_only = false
  ): Promise<Database> {
    const id = uuidv4();
    // Ideally builds a unique DB Postgres name per-tenant
    const db_name = `aidb_${team_id.slice(0, 6)}_${name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")}`;
    // In prod: call out to orchestrator—here, just record it
    const connURL = `postgres://<CREATED_USER>:<PASS>@internal-host:5432/${db_name}`;
    const res = await pool.query(
      `INSERT INTO databases
        (id, name, team_id, branch_of, connection_url, created_at, updated_at, status, engine_version, is_primary)
       VALUES ($1,$2,$3,$4,$5,NOW(),NOW(),'provisioning','16.3', $6)
       RETURNING *`,
      [id, db_name, team_id, source_db_id, connURL, !source_db_id] // true if primary, false if branch
    );
    // (Call async orchestrator for "real" provisioning here)
    return res.rows[0];
  }

  // Mark as deleted (and async destroy)
  static async markDeleted(id: string, team_id: string): Promise<void> {
    await pool.query(
      "UPDATE databases SET status='deleting', updated_at=NOW() WHERE id=$1 AND team_id=$2",
      [id, team_id]
    );
    // Async: orchestrator destroy job
  }

  // List DBs for team
  static async list(team_id: string): Promise<Database[]> {
    const res = await pool.query(
      "SELECT * FROM databases WHERE team_id=$1 AND status!='deleted'",
      [team_id]
    );
    return res.rows;
  }

  // Get DB connection info for UI/CLI
  static async getConnectionInfo(
    id: string,
    team_id: string
  ): Promise<{ connection_url: string } | null> {
    const res = await pool.query(
      "SELECT connection_url FROM databases WHERE id=$1 AND team_id=$2 AND status='active'",
      [id, team_id]
    );
    return res.rowCount ? res.rows[0] : null;
  }

  // Schema diff between branches -- stub
  static async diffSchemas(dbA_id: string, dbB_id: string): Promise<string> {
    // In real: pg_dump --schema-only; use tool such as "migra" to diff
    // Here: stub
    return "-- schema difference logic here --";
  }
}
