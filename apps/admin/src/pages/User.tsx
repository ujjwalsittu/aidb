import { useEffect, useState } from "react";
import { api } from "../lib/api";
export default function Users() {
  const [members, setMembers] = useState<any[]>([]);
  useEffect(() => {
    // Display users for the first available team
    api.get("/teams/my").then((r) => {
      if (r.data.teams.length) {
        api
          .get(`/teams/${r.data.teams[0].id}/members`)
          .then((membersResp) => setMembers(membersResp.data.members));
      }
    });
  }, []);
  return (
    <div>
      <h2>Team Members</h2>
      <ul>
        {members.map((u) => (
          <li key={u.user_id}>
            {u.user_id} — {u.role} (invited: {u.invited_by})
          </li>
        ))}
      </ul>
    </div>
  );
}
