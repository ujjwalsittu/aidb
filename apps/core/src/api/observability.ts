import express from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { ObservabilityService } from "../services/ObservabilityService";

const router = express.Router();

/** GET /api/observability/events — Get audit logs for your team */
router.get("/events", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const events = await ObservabilityService.listAudit(user.team_id, 100);
    res.json({ events });
  } catch (e) {
    next(e);
  }
});

/** GET /api/observability/usage?metric=db_create&start=...&end=... */
router.get("/usage", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const metric = req.query.metric as string;
    const start = req.query.start
      ? new Date(req.query.start as string)
      : new Date(Date.now() - 30 * 24 * 3600 * 1000); // last 30 days
    const end = req.query.end ? new Date(req.query.end as string) : new Date();
    const points = await ObservabilityService.listUsage(
      user.team_id,
      metric,
      start,
      end
    );
    res.json({ usage: points });
  } catch (e) {
    next(e);
  }
});

// (Optional) Admin: download all events
router.get(
  "/events/all",
  requireAuth,
  requireRole("admin"),
  async (req, res, next) => {
    try {
      // Add admin-level access to fetch all events, e.g., CSV export
      res.status(501).json({ error: "Not implemented" });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
