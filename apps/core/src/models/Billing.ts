export interface BillingProvider {
  provider: "stripe" | "razorpay";
  customer_id: string; // e.g., Stripe/Razorpay customer
  team_id: string;
}

export interface Subscription {
  id: string;
  team_id: string;
  plan_id: string;
  provider: "stripe" | "razorpay";
  provider_subscription_id: string;
  status:
    | "active"
    | "trialing"
    | "canceled"
    | "past_due"
    | "incomplete"
    | "unpaid";
  current_period_start: Date;
  current_period_end: Date;
  created_at: Date;
}

export interface Plan {
  id: string;
  name: string;
  provider: "stripe" | "razorpay";
  price_id: string; // Stripe price/Razorpay plan id
  amount_cents: number;
  currency: string;
  interval: "month" | "year";
  created_at: Date;
}
