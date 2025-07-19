import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { DataGrid } from "@mui/x-data-grid";

export default function Audit() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api
      .get("/observability/events?limit=2000")
      .then((r) => setRows(r.data.events));
  }, []);
  const columns = [
    { field: "created_at", headerName: "Time", width: 170 },
    { field: "type", headerName: "Type", width: 120 },
    { field: "team_id", headerName: "Team", width: 140 },
    { field: "user_id", headerName: "User", width: 140 },
    { field: "message", headerName: "Message", flex: 1 },
  ];
  return (
    <div>
      <h2>Global Audit Trail</h2>
      <DataGrid autoHeight rows={rows} columns={columns} />
    </div>
  );
}
