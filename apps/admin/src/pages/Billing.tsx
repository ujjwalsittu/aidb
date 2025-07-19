import { useEffect, useState } from "react";
import { api } from "../lib/api";
export default function Billing() {
  const [plans, setPlans] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  useEffect(() => {
    api.get("/billing/plans/stripe").then((r) => setPlans(r.data.plans));
    api.get("/billing/mine").then((r) => setSubs(r.data.subscriptions));
  }, []);
  return (
    <div>
      <h2>Billing & Plans</h2>
      <div>
        <h4>Plans</h4>
        <ul>
          {plans.map((p) => (
            <li key={p.id}>
              {p.name} — {p.amount_cents / 100} {p.currency} /{p.interval}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Subscriptions</h4>
        <ul>
          {subs.map((s) => (
            <li key={s.id}>
              {s.plan_id} — {s.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
