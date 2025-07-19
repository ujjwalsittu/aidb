export interface Replica {
  id: string;
  db_id: string;
  team_id: string;
  connection_url: string;
  is_readonly: boolean;
  created_at: Date;
  status: "provisioning" | "active" | "failed" | "deleting";
}
