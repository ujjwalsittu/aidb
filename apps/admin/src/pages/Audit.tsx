import { useEffect, useState } from "react";
import { api } from "../lib/api";
export default function Audit() {
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    api.get("/observability/events").then((r) => setEvents(r.data.events));
  }, []);
  return (
    <div>
      <h2>Audit Events</h2>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>User</th>
            <th>Message</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id}>
              <td>{e.type}</td>
              <td>{e.user_id}</td>
              <td>{e.message}</td>
              <td>{e.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
