import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { env } from "../utils/env";
import { PITRRestore } from "../models/PITR";

const pool = new Pool({ connectionString: env.DB_URL });

export class PITRService {
  // Request a restore for a DB at a specific point in time
  static async requestRestore(
    db_id: string,
    restore_point: Date,
    requested_by: string
  ): Promise<PITRRestore> {
    const id = uuidv4();
    const res = await pool.query(
      `INSERT INTO pitr_restores 
        (id, db_id, restore_point, requested_by, status, created_at)
      VALUES ($1,$2,$3,$4,'requested',NOW())
      RETURNING *`,
      [id, db_id, restore_point, requested_by]
    );
    // Here an async job should be started to actually run the PITR against your storage
    return res.rows[0];
  }

  static async listForDB(db_id: string): Promise<PITRRestore[]> {
    const res = await pool.query(
      "SELECT * FROM pitr_restores WHERE db_id=$1 ORDER BY created_at DESC",
      [db_id]
    );
    return res.rows;
  }
}
