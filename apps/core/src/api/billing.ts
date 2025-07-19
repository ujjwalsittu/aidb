import express from "express";
import Stripe from "stripe";
import Razorpay from "razorpay";
import { env } from "../utils/env";
import { requireAuth, requireRole } from "../middleware/auth";
import { BillingService } from "../services/BillingService";

// Stripe/Razorpay setup
const stripe = new Stripe(env.STRIPE_SECRET);
const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

const router = express.Router();

/* ========== PLAN MANAGEMENT (Admin/Support only) ========== */

// Create a new plan (admin/support only)
router.post(
  "/plans",
  requireAuth,
  requireRole("admin"),
  async (req, res, next) => {
    try {
      const { name, provider, price_id, amount_cents, currency, interval } =
        req.body;
      const plan = await BillingService.createPlan(
        name,
        provider,
        price_id,
        amount_cents,
        currency,
        interval
      );
      res.status(201).json({ plan });
    } catch (e) {
      next(e);
    }
  }
);

// List plans (per provider)
router.get("/plans/:provider", requireAuth, async (req, res, next) => {
  try {
    const plans = await BillingService.listPlans(req.params.provider);
    res.json({ plans });
  } catch (e) {
    next(e);
  }
});

/* ========== CHECKOUT — CUSTOMER ========== */

// Get Stripe Checkout Session URL for a plan
router.post("/stripe/checkout", requireAuth, async (req, res, next) => {
  try {
    const { plan_id } = req.body;
    const user = (req as any).user;

    // Get team info, plan info, etc
    const plan = (await BillingService.listPlans("stripe")).find(
      (p) => p.id === plan_id
    );
    if (!plan) return res.status(400).json({ error: "Plan not found" });

    // Ensure the team has a stripe customer; if not, create one
    let provider = await BillingService.getTeamProvider(user.team_id, "stripe");
    if (!provider) {
      const customer = await stripe.customers.create({
        metadata: { team_id: user.team_id },
      });
      await BillingService.attachCustomer(user.team_id, "stripe", customer.id);
      provider = {
        provider: "stripe",
        team_id: user.team_id,
        customer_id: customer.id,
      };
    }
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: provider.customer_id,
      payment_method_types: ["card"],
      line_items: [{ price: plan.price_id, quantity: 1 }],
      mode: "subscription",
      success_url: "https://aidb.io/app/billing/success", // TODO: production
      cancel_url: "https://aidb.io/app/billing/cancel",
    });
    res.json({ url: session.url });
  } catch (e) {
    next(e);
  }
});

// Get Razorpay subscription page (returns order info, frontend completes payment)
router.post("/razorpay/subscribe", requireAuth, async (req, res, next) => {
  try {
    const { plan_id } = req.body;
    const user = (req as any).user;
    const plan = (await BillingService.listPlans("razorpay")).find(
      (p) => p.id === plan_id
    );
    if (!plan) return res.status(400).json({ error: "Plan not found" });

    // Ensure Razorpay customer exists for team
    let provider = await BillingService.getTeamProvider(
      user.team_id,
      "razorpay"
    );
    if (!provider) {
      const rzpCustomer = await razorpay.customers.create({
        name: user.name,
        email: user.email,
        notes: { team_id: user.team_id },
      });
      await BillingService.attachCustomer(
        user.team_id,
        "razorpay",
        rzpCustomer.id
      );
      provider = {
        provider: "razorpay",
        team_id: user.team_id,
        customer_id: rzpCustomer.id,
      };
    }

    // Create subscription at Razorpay
    const subscription = await razorpay.subscriptions.create({
      plan_id: plan.price_id,
      customer_notify: 1,
      total_count: 12, // e.g., 1 year, monthly
    });
    // Return frontend everything needed for Razorpay Checkout
    res.json({
      rzp_subscription_id: subscription.id,
      key_id: env.RAZORPAY_KEY_ID,
      order_info: subscription,
    });
  } catch (e) {
    next(e);
  }
});

// List your subscriptions
router.get("/mine", requireAuth, async (req, res, next) => {
  try {
    const subs = await BillingService.getSubscriptions(
      (req as any).user.team_id
    );
    res.json({ subscriptions: subs });
  } catch (e) {
    next(e);
  }
});

/* ========== BILLING PORTAL ACCESS ========== */

// Stripe customer portal link
router.get("/stripe/portal", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const prov = await BillingService.getTeamProvider(user.team_id, "stripe");
    if (!prov) return res.status(404).json({ error: "Not subscribed" });
    const session = await stripe.billingPortal.sessions.create({
      customer: prov.customer_id,
      return_url: "https://aidb.io/app/billing",
    });
    res.json({ url: session.url });
  } catch (e) {
    next(e);
  }
});

/* ========== STRIPE WEBHOOK ========== */

router.post(
  "/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig!,
        env.STRIPE_WEBHOOK
      );
      // Handle relevant events here
      if (
        event.type === "customer.subscription.updated" ||
        event.type === "customer.subscription.created" ||
        event.type === "customer.subscription.deleted"
      ) {
        const sub = event.data.object as Stripe.Subscription;
        // Find our plan mapping
        const plan_id = sub.items?.data[0]?.plan?.id || "";
        // Look up team by customer id (you'll want a mapping for customers)
        const customer_id = sub.customer as string;
        // (Add logic to get team_id for customer)
        // For demo, team_id = customer_id (you will map in DB)
        await BillingService.upsertSubscription(
          customer_id,
          plan_id,
          "stripe",
          sub.id,
          sub.status,
          new Date(sub.current_period_start * 1000),
          new Date(sub.current_period_end * 1000)
        );
      }
      res.send({ received: true });
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
);

/* ========== RAZORPAY WEBHOOK ========== */

router.post("/razorpay/webhook", express.json(), async (req, res) => {
  // For Razorpay: webhook secret configured on dashboard
  // Event: subscription.activated || subscription.completed etc.
  // Validate: req.headers['x-razorpay-signature']
  // Handle event here
  const event = req.body.event;
  // You'll need to implement the signature check as per Razorpay docs
  // Example:
  if (event === "subscription.activated") {
    const { subscription } = req.body.payload;
    // Update status in our DB
    // customer_id, plan_id, etc
  }
  res.json({ received: true });
});

export default router;
