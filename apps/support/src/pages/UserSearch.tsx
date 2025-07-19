import { useState } from "react";
import { api } from "../lib/api";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

export default function UserSearch() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const navigate = useNavigate();

  async function search() {
    const r = await api.get("/users/search?q=" + encodeURIComponent(q));
    setRows(r.data.users);
  }

  return (
    <div>
      <h2>Search Users</h2>
      <input
        style={{ padding: 8, margin: 8 }}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Email or User ID"
      />
      <button onClick={search}>Search</button>
      <DataGrid
        autoHeight
        rows={rows}
        columns={[
          { field: "id", headerName: "User ID", width: 160 },
          { field: "email", headerName: "Email", width: 190 },
          { field: "name", headerName: "Name", width: 130 },
          { field: "role", headerName: "Role", width: 90 },
          {
            field: "is_active",
            headerName: "Active",
            width: 90,
            type: "boolean",
          },
        ]}
        getRowId={(row) => row.id}
        onRowClick={(params) => navigate(`/user/${params.row.id}`)}
        sx={{ mt: 2 }}
      />
    </div>
  );
}
