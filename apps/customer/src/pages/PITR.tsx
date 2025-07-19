import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function PITR() {
  const [dbs, setDbs] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [restores, setRestores] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [restorePoint, setRestorePoint] = useState<string>("");

  // Fetch user's DBs
  useEffect(() => {
    api.get("/db/list").then((r) => setDbs(r.data.databases));
  }, []);

  // Fetch PITR events for selected DB
  useEffect(() => {
    if (selected) {
      api
        .get(`/pitr/${selected}/list`)
        .then((r) => setRestores(r.data.restores));
    }
  }, [selected]);

  async function onRestore() {
    await api.post("/pitr/restore", {
      db_id: selected,
      restore_point: restorePoint,
    });
    setShowForm(false);
    setRestorePoint("");
    // Refresh restores
    api.get(`/pitr/${selected}/list`).then((r) => setRestores(r.data.restores));
  }

  return (
    <div>
      <h2>PITR (Restore)</h2>
      <label>
        Choose DB:
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          style={{ marginLeft: 12 }}
        >
          <option value="">-Choose-</option>
          {dbs.map((db: any) => (
            <option key={db.id} value={db.id}>
              {db.name}
            </option>
          ))}
        </select>
      </label>

      <button
        disabled={!selected}
        style={{ marginLeft: 15 }}
        onClick={() => setShowForm(true)}
      >
        Restore to Point-in-Time
      </button>

      {showForm && (
        <form
          style={{ marginTop: 20 }}
          onSubmit={(e) => {
            e.preventDefault();
            onRestore();
          }}
        >
          <label>
            Restore ISO8601/UTC Timestamp:&nbsp;
            <input
              value={restorePoint}
              onChange={(e) => setRestorePoint(e.target.value)}
              placeholder="YYYY-MM-DDTHH:MM:SSZ"
              style={{ width: 250 }}
            />
          </label>
          <button type="submit" disabled={!restorePoint}>
            Request PITR
          </button>
        </form>
      )}

      <h3 style={{ marginTop: 30 }}>Restore history</h3>
      <ul>
        {restores.map((r) => (
          <li key={r.id}>
            {r.restore_point} ({r.status}) at {r.created_at}
          </li>
        ))}
      </ul>
    </div>
  );
}
