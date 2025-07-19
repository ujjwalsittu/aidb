import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { env } from "../utils/env";
import { AuditEvent, UsageMetering } from "../models/Observability";

const pool = new Pool({ connectionString: env.DB_URL });

export class ObservabilityService {
  static async recordAudit(
    team_id: string,
    user_id: string,
    type: string,
    ref: string | null,
    message: string
  ) {
    const id = uuidv4();
    await pool.query(
      `
      INSERT INTO audit_events (id, team_id, user_id, type, ref, message, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
    `,
      [id, team_id, user_id, type, ref, message]
    );
  }

  static async listAudit(team_id: string, limit = 100): Promise<AuditEvent[]> {
    const result = await pool.query(
      `SELECT * FROM audit_events WHERE team_id=$1 ORDER BY created_at DESC LIMIT $2`,
      [team_id, limit]
    );
    return result.rows;
  }

  static async recordUsage(
    team_id: string,
    db_id: string | null,
    metric: string,
    value: number
  ) {
    await pool.query(
      `
      INSERT INTO usage_metering (id, team_id, db_id, metric, value, ts)
      VALUES ($1, $2, $3, $4, $5, NOW())
    `,
      [uuidv4(), team_id, db_id, metric, value]
    );
  }

  static async listUsage(
    team_id: string,
    metric: string,
    start: Date,
    end: Date
  ): Promise<UsageMetering[]> {
    const res = await pool.query(
      `SELECT * FROM usage_metering WHERE team_id=$1 AND metric=$2 AND ts BETWEEN $3 AND $4 ORDER BY ts DESC`,
      [team_id, metric, start, end]
    );
    return res.rows;
  }
}
