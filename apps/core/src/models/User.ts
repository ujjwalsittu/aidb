export type UserRole = "admin" | "customer" | "support";

export interface User {
  id: string;
  email: string;
  password_hash?: string;
  name: string;
  role: UserRole;
  team_id: string | null;
  created_at: Date;
  last_login_at: Date | null;
  is_active: boolean;
  is_email_verified: boolean;
}
