import { useEffect, useState } from "react";
import { api } from "../lib/api";
export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    Promise.all([
      api.get("/teams/all"),
      api.get("/users/all"),
      api.get("/db/all"),
    ]).then(([teams, users, dbs]) =>
      setStats({
        teams: teams.data.teams.length,
        users: users.data.users.length,
        dbs: dbs.data.databases.length,
      })
    );
  }, []);
  return (
    <div>
      <h2>Support Dashboard</h2>
      {stats ? (
        <ul>
          <li>Total teams: {stats.teams}</li>
          <li>Total users: {stats.users}</li>
          <li>Total DBs: {stats.dbs}</li>
        </ul>
      ) : (
        "Loading..."
      )}
    </div>
  );
}
