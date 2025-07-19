import { useEffect, useState } from "react";
import { api } from "../lib/api";
export default function Branches() {
  const [branches, setBranches] = useState<any[]>([]);
  useEffect(() => {
    api.get("/db/list").then((r) => {
      setBranches(r.data.databases.filter((db: any) => !db.is_primary));
    });
  }, []);
  async function branchDb() {
    const from_db_id = prompt("Branch from DB id?");
    const name = prompt("Branch name?");
    if (from_db_id && name) {
      await api.post("/db/branch", { from_db_id, name, schema_only: false });
      window.location.reload();
    }
  }
  return (
    <div>
      <h2>Branches</h2>
      <button onClick={branchDb}>+ New Branch</button>
      <ul>
        {branches.map((b) => (
          <li key={b.id}>
            {b.name} (from {b.branch_of})
          </li>
        ))}
      </ul>
    </div>
  );
}
