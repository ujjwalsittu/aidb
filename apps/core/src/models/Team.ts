export interface Team {
  id: string;
  name: string;
  owner_id: string;
  created_at: Date;
  is_active: boolean;
}

// Team membership
export interface TeamMembership {
  id: string;
  team_id: string;
  user_id: string;
  role: "owner" | "member";
  invited_by?: string;
  joined_at: Date;
}
