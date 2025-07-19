import { useEffect, useState } from "react";
import { api } from "../lib/api";
export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    api.get("/db/list").then((r) => setData(r.data));
  }, []);
  return (
    <div>
      <h2>Overview</h2>
      {!data && "Loading..."}
      {data && (
        <ul>
          {data.databases.map((db: any) => (
            <li key={db.id}>
              {db.name} — {db.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
