import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";
export default function TeamDetails() {
  const { id } = useParams();
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [dbs, setDbs] = useState<any[]>([]);
  const [audit, setAudit] = useState<any[]>([]);
  // Optionally, impersonate or suspend/reactivate team here
  useEffect(() => {
    api.get(`/teams/${id}`).then((r) => setTeam(r.data.team));
    api.get(`/teams/${id}/members`).then((r) => setMembers(r.data.members));
    api.get(`/db/list?team_id=${id}`).then((r) => setDbs(r.data.databases));
    api
      .get(`/observability/events?team_id=${id}`)
      .then((r) => setAudit(r.data.events));
  }, [id]);
  if (!team) return <>Loading…</>;
  return (
    <div>
      <h2>Team: {team.name}</h2>
      <div>
        Owner: {team.owner_id} | Status:{" "}
        {team.is_active ? "Active" : "Suspended"}
      </div>
      <h3>Members</h3>
      <ul>
        {members.map((m) => (
          <li key={m.user_id}>
            {m.user_id} ({m.role})
          </li>
        ))}
      </ul>
      <h3>Databases</h3>
      <ul>
        {dbs.map((db) => (
          <li key={db.id}>
            {db.name} ({db.status})
          </li>
        ))}
      </ul>
      <h3>Audit</h3>
      <ul>
        {audit.slice(0, 10).map((e) => (
          <li key={e.id}>
            {e.created_at}: {e.type} ({e.user_id})
          </li>
        ))}
      </ul>
      {/* TODO: Buttons to Impersonate or Suspend/Reactivate */}
    </div>
  );
}
