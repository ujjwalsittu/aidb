// src/pages/DBSearch.tsx

import { useState } from "react";
import { api } from "../lib/api";
import { DataGrid } from "@mui/x-data-grid";

export default function DBSearch() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    try {
      const result = await api.get("/db/search?q=" + encodeURIComponent(q));
      setRows(result.data.databases);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Search Databases</h2>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Name/ID/Team/Status"
        style={{ padding: 8, margin: 8, width: 300 }}
      />
      <button onClick={search} style={{ marginLeft: 8 }}>
        Search
      </button>
      <DataGrid
        sx={{ mt: 2 }}
        loading={loading}
        rows={rows}
        columns={[
          { field: "id", headerName: "DB ID", width: 160 },
          { field: "name", headerName: "Name", width: 160 },
          { field: "team_id", headerName: "Team", width: 130 },
          { field: "status", headerName: "Status", width: 100 },
          {
            field: "is_primary",
            headerName: "Primary",
            width: 90,
            type: "boolean",
          },
          { field: "created_at", headerName: "Created", width: 165 },
          { field: "engine_version", headerName: "Engine", width: 90 },
        ]}
        getRowId={(row) => row.id}
        autoHeight
      />
    </div>
  );
}
