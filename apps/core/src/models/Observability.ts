export interface AuditEvent {
  id: string;
  team_id: string;
  user_id: string;
  type: string;
  ref: string | null;
  message: string;
  created_at: Date;
}

export interface UsageMetering {
  id: string;
  team_id: string;
  db_id: string | null;
  metric: string;
  value: number;
  ts: Date;
}
