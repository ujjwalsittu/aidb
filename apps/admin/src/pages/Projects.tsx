import { useEffect, useState } from "react";
import { api } from "../lib/api";
export default function Projects() {
  const [dbs, setDbs] = useState<any[]>([]);
  useEffect(() => {
    api.get("/db/list").then((r) => setDbs(r.data.databases));
  }, []);
  async function provisionDb() {
    const name = prompt("New DB name?");
    if (name) {
      await api.post("/db/provision", { name });
      window.location.reload();
    }
  }
  async function deleteDb(id: string) {
    if (window.confirm("Delete DB?")) {
      await api.delete(`/db/${id}`);
      window.location.reload();
    }
  }
  return (
    <div>
      <h2>Databases & Branches</h2>
      <button onClick={provisionDb}>+ New Database</button>
      <ul>
        {dbs.map((db) => (
          <li key={db.id}>
            <b>{db.name}</b> ({db.status})
            <button
              onClick={() => deleteDb(db.id)}
              style={{ color: "red", marginLeft: 8 }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
