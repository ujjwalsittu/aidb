export interface Database {
  id: string;
  name: string;
  team_id: string;
  branch_of: string | null; // If this is a branch, stores source DB id
  connection_url: string;
  created_at: Date;
  updated_at: Date;
  status: "active" | "provisioning" | "deleting" | "deleted" | "error";
  engine_version: string;
  is_primary: boolean;
}
