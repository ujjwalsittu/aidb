import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";

export default function Audit() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.get("/observability/events").then((r) => setRows(r.data.events));
  }, []);
  const columns = [
    { field: "created_at", headerName: "Time", width: 170 },
    { field: "type", headerName: "Type", width: 120 },
    { field: "user_id", headerName: "User", width: 160 },
    { field: "message", headerName: "Message", flex: 1 },
  ];
  return (
    <div>
      <h2>Audit Trail</h2>
      {!rows ? (
        <CircularProgress />
      ) : (
        <DataGrid autoHeight rows={rows} columns={columns} />
      )}
    </div>
  );
}
