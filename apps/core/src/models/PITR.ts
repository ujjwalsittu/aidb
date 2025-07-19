export interface PITRRestore {
  id: string;
  db_id: string;
  restore_point: Date | number; // timestamp or Postgres LSN
  requested_by: string;
  status: "requested" | "restoring" | "done" | "failed";
  created_at: Date;
  completed_at?: Date;
}
