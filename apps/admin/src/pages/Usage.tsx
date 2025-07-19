import { useState, useEffect } from "react";
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
    api
      .get("/observability/usage?metric=db_create")
      .then((r) => setData(r.data.usage));
  }, []);
  return (
    <div>
      <h2>DBs Created (Last 30d)</h2>
      <ResponsiveContainer width="95%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ts" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
