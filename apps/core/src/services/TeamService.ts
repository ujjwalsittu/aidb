import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import { env } from "../utils/env";
import { Team, TeamMembership } from "../models/Team";

const pool = new Pool({ connectionString: env.DB_URL });

export class TeamService {
  // Create Team
  static async createTeam(name: string, owner_id: string): Promise<Team> {
    const id = uuidv4();
    const teamRes = await pool.query(
      `INSERT INTO teams (id, name, owner_id, created_at, is_active)
       VALUES ($1,$2,$3,NOW(),TRUE) RETURNING *`,
      [id, name, owner_id]
    );
    // Add owner's membership as 'owner'
    await pool.query(
      `INSERT INTO team_memberships (id, team_id, user_id, role, joined_at)
       VALUES ($1,$2,$3,$4,NOW())`,
      [uuidv4(), id, owner_id, "owner"]
    );
    return teamRes.rows[0];
  }

  // Invite member to team (creates pending invite)
  static async inviteMember(
    team_id: string,
    email: string,
    invited_by: string,
    role: string
  ): Promise<void> {
    // Ensure team exists
    const exists = await pool.query("SELECT id FROM teams WHERE id = $1", [
      team_id,
    ]);
    if (!exists.rowCount) throw new Error("Team not found");

    // Create or fetch user by email
    let userRes = await pool.query("SELECT id FROM users WHERE email=$1", [
      email,
    ]);
    let user_id = "";
    if (!userRes.rowCount) {
      // Minimal stub user (user completes registration by invite link)
      userRes = await pool.query(
        `INSERT INTO users (id,email,role,is_active,is_email_verified,created_at)
         VALUES ($1,$2,'customer',FALSE,FALSE,NOW()) RETURNING id`,
        [uuidv4(), email]
      );
    }
    user_id = userRes.rows[0].id;
    // Add to memberships as 'member' (joining happens after acceptance)
    await pool.query(
      `INSERT INTO team_memberships (id, team_id, user_id, role, invited_by, joined_at)
       VALUES ($1,$2,$3,$4,$5,NOW()) ON CONFLICT DO NOTHING`,
      [uuidv4(), team_id, user_id, role, invited_by]
    );
    // TODO: send invite email with tokenized link
  }

  // List teams user is in
  static async listTeamsForUser(user_id: string): Promise<Team[]> {
    const res = await pool.query(
      `
      SELECT t.* FROM teams t
      JOIN team_memberships m ON m.team_id = t.id
      WHERE m.user_id = $1 AND t.is_active = TRUE
    `,
      [user_id]
    );
    return res.rows;
  }

  // List all team members (with roles)
  static async listMembers(team_id: string): Promise<TeamMembership[]> {
    const res = await pool.query(
      `SELECT * FROM team_memberships WHERE team_id=$1`,
      [team_id]
    );
    return res.rows;
  }

  // Transfer team ownership
  static async transferOwnership(
    team_id: string,
    new_owner_id: string
  ): Promise<void> {
    await pool.query(`UPDATE teams SET owner_id=$1 WHERE id=$2`, [
      new_owner_id,
      team_id,
    ]);
    await pool.query(
      `UPDATE team_memberships SET role='owner' WHERE team_id=$1 AND user_id=$2`,
      [team_id, new_owner_id]
    );
  }
}
