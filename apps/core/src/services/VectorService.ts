import { Pool } from "pg";
import { env } from "../utils/env";

// This connects to the actual customer Postgres instance with pgvector EXTENSION enabled!
export class VectorService {
  // Store a vector (example: embeddings for a row)
  static async insertVector(
    db_connection_url: string,
    table: string,
    id: string,
    vector: number[]
  ): Promise<void> {
    const pool = new Pool({ connectionString: db_connection_url });
    await pool.query(`INSERT INTO ${table} (id, vec) VALUES ($1, $2)`, [
      id,
      vector,
    ]);
    await pool.end();
  }

  // Search vectors (nearest neighbors)
  static async searchVectors(
    db_connection_url: string,
    table: string,
    vector: number[],
    limit: number = 10
  ): Promise<any[]> {
    const pool = new Pool({ connectionString: db_connection_url });
    // Using pgvector's <-> distance operator
    const res = await pool.query(
      `SELECT * FROM ${table} ORDER BY vec <-> $1 LIMIT $2`,
      [vector, limit]
    );
    await pool.end();
    return res.rows;
  }
}
