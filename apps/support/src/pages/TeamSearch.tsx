import { useState } from "react";
import { api } from "../lib/api";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
export default function TeamSearch() {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  async function search() {
    const r = await api.get("/teams/search?q=" + encodeURIComponent(q));
    setRows(r.data.teams);
  }
  return (
    <div>
      <h2>Search Teams</h2>
      <input
        style={{ padding: 8, margin: 8 }}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Team name or id"
      />
      <button onClick={search}>Search</button>
      <DataGrid
        autoHeight
        rows={rows}
        columns={[
          { field: "id", headerName: "ID", width: 160 },
          { field: "name", headerName: "Name", width: 160 },
          { field: "owner_id", headerName: "Owner", width: 140 },
        ]}
        getRowId={(row) => row.id}
        onRowClick={(params) => navigate(`/team/${params.row.id}`)}
      />
    </div>
  );
}
