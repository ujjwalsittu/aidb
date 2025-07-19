import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { env } from "../utils/env";
import { Replica } from "../models/Replica";

const pool = new Pool({ connectionString: env.DB_URL });

export class ReplicaService {
  // Provision a read-only replica (actual work handled by DB orchestrator)
  static async createReplica(db_id: string, team_id: string): Promise<Replica> {
    const id = uuidv4();
    const connURL = `postgres://readonly:<PASS>@internal-host/replica_${id}`;
    const res = await pool.query(
      `INSERT INTO replicas
        (id, db_id, team_id, connection_url, is_readonly, created_at, status)
       VALUES ($1,$2,$3,$4,TRUE,NOW(),'provisioning') RETURNING *`,
      [id, db_id, team_id, connURL]
    );
    // Here trigger an async orchestration job (K8s, etc) to actually provision
    return res.rows[0];
  }

  static async listReplicas(db_id: string): Promise<Replica[]> {
    const res = await pool.query("SELECT * FROM replicas WHERE db_id=$1", [
      db_id,
    ]);
    return res.rows;
  }

  static async deleteReplica(id: string, db_id: string): Promise<void> {
    await pool.query(
      "UPDATE replicas SET status='deleting' WHERE id=$1 AND db_id=$2",
      [id, db_id]
    );
    // Actual destroy handled by orchestrator
  }
}
