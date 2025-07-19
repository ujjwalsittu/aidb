import { Command } from "commander";
import { aidbApi } from "../api";
import inquirer from "inquirer";
import { logOk, logErr, logInfo } from "../utils";

export const billingCmd = new Command("billing");

billingCmd.description("Billing, plans, subscriptions");

billingCmd
  .command("plans [provider]")
  .description("List plans for provider (stripe/razorpay)")
  .action(async (provider = "stripe") => {
    try {
      const r = await aidbApi.get(`/billing/plans/${provider}`);
      r.data.plans.forEach((plan: any) =>
        console.log(
          [
            plan.name,
            plan.price_id,
            plan.amount_cents / 100,
            plan.interval,
            plan.currency,
          ].join(" | ")
        )
      );
    } catch (e: any) {
      logErr(e.message);
    }
  });

billingCmd
  .command("subscribe")
  .description("Subscribe/buy a plan")
  .action(async () => {
    const { provider, plan_id } = await inquirer.prompt([
      {
        name: "provider",
        type: "list",
        message: "Choose provider:",
        choices: ["stripe", "razorpay"],
      },
      { name: "plan_id", message: "Plan id:" },
    ]);
    try {
      if (provider === "stripe") {
        const r = await aidbApi.post("/billing/stripe/checkout", { plan_id });
        logInfo("Open this URL in your browser: " + r.data.url);
      } else {
        const r = await aidbApi.post("/billing/razorpay/subscribe", {
          plan_id,
        });
        logInfo(
          "Razorpay subscription info: " + JSON.stringify(r.data, null, 2)
        );
      }
    } catch (e: any) {
      logErr(e.message);
    }
  });

billingCmd
  .command("portal")
  .description("Open Stripe portal")
  .action(async () => {
    try {
      const r = await aidbApi.get("/billing/stripe/portal");
      logInfo("Billing portal: " + r.data.url);
    } catch (e: any) {
      logErr(e.message);
    }
  });

billingCmd
  .command("mine")
  .description("Your team subscriptions")
  .action(async () => {
    try {
      const r = await aidbApi.get("/billing/mine");
      r.data.subscriptions.forEach((sub: any) =>
        console.log(
          [
            sub.plan_id,
            sub.status,
            sub.current_period_start,
            sub.current_period_end,
          ].join(" | ")
        )
      );
    } catch (e: any) {
      logErr(e.message);
    }
  });
