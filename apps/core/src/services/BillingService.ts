import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import Razorpay from "razorpay";
import { env } from "../utils/env";
import { Subscription, Plan, BillingProvider } from "../models/Billing";

// Initialize Stripe and Razorpay SDKs
const stripe = new Stripe(env.STRIPE_SECRET);

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});
const pool = new Pool({ connectionString: env.DB_URL });

export class BillingService {
  // Plans are mapped to Stripe price/rzp plan id
  static async createPlan(
    name: string,
    provider: "stripe" | "razorpay",
    price_id: string,
    amount_cents: number,
    currency: string,
    interval: string
  ): Promise<Plan> {
    const id = uuidv4();
    const result = await pool.query(
      `
      INSERT INTO plans
        (id, name, provider, price_id, amount_cents, currency, interval, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *`,
      [id, name, provider, price_id, amount_cents, currency, interval]
    );
    return result.rows[0];
  }

  static async listPlans(provider: "stripe" | "razorpay"): Promise<Plan[]> {
    const result = await pool.query("SELECT * FROM plans WHERE provider=$1", [
      provider,
    ]);
    return result.rows;
  }

  static async attachCustomer(
    team_id: string,
    provider: "stripe" | "razorpay",
    customer_id: string
  ) {
    await pool.query(
      "INSERT INTO billing_providers (provider, customer_id, team_id) VALUES ($1,$2,$3) ON CONFLICT (provider, team_id) DO UPDATE SET customer_id=EXCLUDED.customer_id",
      [provider, customer_id, team_id]
    );
  }

  static async getTeamProvider(
    team_id: string,
    provider: "stripe" | "razorpay"
  ): Promise<BillingProvider | null> {
    const r = await pool.query(
      "SELECT * FROM billing_providers WHERE provider=$1 AND team_id=$2",
      [provider, team_id]
    );
    return r.rowCount ? r.rows[0] : null;
  }

  static async upsertSubscription(
    team_id: string,
    plan_id: string,
    provider: "stripe" | "razorpay",
    provider_sub_id: string,
    status: string,
    start: Date,
    end: Date
  ) {
    // Upsert pattern for subscriptions
    await pool.query(
      `
      INSERT INTO subscriptions (id, team_id, plan_id, provider, provider_subscription_id, status, current_period_start, current_period_end, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT (provider, provider_subscription_id)
      DO UPDATE SET status=EXCLUDED.status, current_period_start=EXCLUDED.current_period_start, current_period_end=EXCLUDED.current_period_end
      `,
      [
        uuidv4(),
        team_id,
        plan_id,
        provider,
        provider_sub_id,
        status,
        start,
        end,
      ]
    );
  }

  static async getSubscriptions(team_id: string): Promise<Subscription[]> {
    const r = await pool.query("SELECT * FROM subscriptions WHERE team_id=$1", [
      team_id,
    ]);
    return r.rows;
  }
}
