import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [teams, setTeams] = useState<any[]>([]);
  const [audit, setAudit] = useState<any[]>([]);

  useEffect(() => {
    api.get(`/users/${id}`).then((r) => setUser(r.data.user));
    api.get(`/teams/member/${id}`).then((r) => setTeams(r.data.teams));
    api
      .get(`/observability/events?user_id=${id}`)
      .then((r) => setAudit(r.data.events));
  }, [id]);

  if (!user) return <div>Loading...</div>;
  return (
    <div>
      <h2>User: {user.name || user.email}</h2>
      <div>
        <strong>User ID:</strong> {user.id}
      </div>
      <div>
        <strong>Email:</strong> {user.email}
      </div>
      <div>
        <strong>Role:</strong> {user.role}
      </div>
      <div>
        <strong>Status:</strong> {user.is_active ? "Active" : "Suspended"}
      </div>
      <div>
        <strong>Joined:</strong> {new Date(user.created_at).toLocaleString()}
      </div>
      <h3 style={{ marginTop: 18 }}>Team Memberships</h3>
      <ul>
        {teams.map((t) => (
          <li key={t.id}>
            Team: {t.name} &mdash; Role: {t.role}
          </li>
        ))}
      </ul>
      <h3 style={{ marginTop: 18 }}>Audit Log</h3>
      <ul>
        {audit.slice(0, 10).map((ev) => (
          <li key={ev.id}>
            {ev.created_at}: {ev.type} - {ev.message?.substr(0, 80)}
          </li>
        ))}
      </ul>
    </div>
  );
}
