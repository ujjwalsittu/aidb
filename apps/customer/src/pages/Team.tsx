import { useEffect, useState } from "react";
import { api } from "../lib/api";
export default function Team() {
  const [team, setTeam] = useState<any>({});
  const [members, setMembers] = useState<any[]>([]);
  useEffect(() => {
    api.get("/teams/my").then((r) => {
      if (r.data.teams.length) {
        setTeam(r.data.teams[0]);
        api
          .get(`/teams/${r.data.teams[0].id}/members`)
          .then((memr) => setMembers(memr.data.members));
      }
    });
  }, []);
  async function invite() {
    const email = prompt("Invite email?");
    if (email) {
      await api.post("/teams/invite", {
        team_id: team.id,
        email,
        role: "member",
      });
      alert("Invite sent!");
    }
  }
  return (
    <div>
      <h2>Team: {team.name}</h2>
      <button onClick={invite}>Invite Member</button>
      <ul>
        {members.map((m) => (
          <li key={m.user_id}>
            {m.user_id} ({m.role})
          </li>
        ))}
      </ul>
    </div>
  );
}
