import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { DataGrid } from "@mui/x-data-grid";

export default function Usage() {
  const [usage, setUsage] = useState([]);
  const [metric, setMetric] = useState("db_create");
  const [teamId, setTeamId] = useState("");
  const [dbId, setDbId] = useState("");

  useEffect(() => {
    let url = `/observability/usage?metric=${metric}`;
    if (teamId) url += `&team_id=${teamId}`;
    if (dbId) url += `&db_id=${dbId}`;
    api.get(url).then((r) => setUsage(r.data.usage));
  }, [metric, teamId, dbId]);

  return (
    <div>
      <h2>Usage Metering</h2>
      <select value={metric} onChange={(e) => setMetric(e.target.value)}>
        <option value="db_create">DBs Created</option>
        <option value="api_call">API Calls</option>
        <option value="storage_bytes">Storage</option>
        {/* Add additional usage metrics */}
      </select>
      <input
        style={{ marginLeft: 8, width: 160 }}
        value={teamId}
        onChange={(e) => setTeamId(e.target.value)}
        placeholder="Filter by Team ID"
      />
      <input
        style={{ marginLeft: 8, width: 160 }}
        value={dbId}
        onChange={(e) => setDbId(e.target.value)}
        placeholder="Filter by DB ID"
      />
      <DataGrid
        sx={{ mt: 2 }}
        autoHeight
        rows={usage}
        columns={[
          { field: "id", headerName: "ID", width: 120 },
          { field: "team_id", headerName: "Team", width: 120 },
          { field: "db_id", headerName: "DB", width: 120 },
          { field: "metric", headerName: "Metric", width: 120 },
          { field: "value", headerName: "Value", width: 100 },
          { field: "ts", headerName: "Timestamp", width: 170 },
        ]}
      />
    </div>
  );
}
