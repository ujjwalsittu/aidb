import { useEffect, useState } from "react";
import { api } from "../lib/api";
export default function Billing() {
  const [plans, setPlans] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  useEffect(() => {
    api.get("/billing/plans/stripe").then((r) => setPlans(r.data.plans));
    api.get("/billing/mine").then((r) => setSubs(r.data.subscriptions));
  }, []);
  function subscribe(plan_id: string) {
    api
      .post("/billing/stripe/checkout", { plan_id })
      .then((r) => window.open(r.data.url, "_blank"));
  }
  return (
    <div>
      <h2>Billing & Plans</h2>
      <ul>
        {plans.map((p) => (
          <li key={p.id}>
            {p.name} — {(p.amount_cents / 100).toFixed(2)} {p.currency} /
            {p.interval}
            <button onClick={() => subscribe(p.id)} style={{ marginLeft: 7 }}>
              Buy
            </button>
          </li>
        ))}
      </ul>
      <h3>Subscriptions</h3>
      <ul>
        {subs.map((s) => (
          <li key={s.id}>
            {s.plan_id} — {s.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
