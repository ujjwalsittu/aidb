import { Pool } from "pg";
import { env } from "../utils/env";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const pool = new Pool({ connectionString: env.DB_URL });

export class UserService {
  static async createUser(
    email: string,
    password: string,
    name: string,
    role: string,
    team_id: string | null = null
  ): Promise<User> {
    const hash = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO users (id, email, password_hash, name, role, team_id, created_at, last_login_at, is_active, is_email_verified)
        VALUES ($1,$2,$3,$4,$5,$6,NOW(),NULL,TRUE,FALSE) RETURNING *`,
      [id, email, hash, name, role, team_id]
    );
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  }

  static async findById(id: string): Promise<User | undefined> {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  }

  static async verifyPassword(
    email: string,
    password: string
  ): Promise<User | undefined> {
    const user = await this.findByEmail(email);
    if (!user || !user.password_hash) return undefined;
    const match = await bcrypt.compare(password, user.password_hash);
    return match ? user : undefined;
  }
}
