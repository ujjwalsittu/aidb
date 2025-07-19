import { useEffect, useState } from "react";
import { api } from "../lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Usage() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    api.get("/observability/usage?metric=db_create").then((r) =>
      setData(
        r.data.usage.map((u: any) => ({
          ...u,
          ts: new Date(u.ts).toLocaleDateString(),
        }))
      )
    );
  }, []);
  return (
    <div>
      <h2>Databases Created (last 30d)</h2>
      <ResponsiveContainer width="99%" height={360}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ts" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2196f3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
