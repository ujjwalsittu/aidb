import { useEffect, useState } from "react";
import { api } from "../lib/api";
export default function Teams() {
  const [teams, setTeams] = useState<any[]>([]);
  useEffect(() => {
    api.get("/teams/my").then((r) => setTeams(r.data.teams));
  }, []);
  return (
    <div>
      <h2>Teams</h2>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            {team.name} (Owner: {team.owner_id})
          </li>
        ))}
      </ul>
    </div>
  );
}
