import express from "express";
import { requireAuth } from "../middleware/auth";
import { PITRService } from "../services/PITRService";

const router = express.Router();

/** POST /api/pitr/restore — request DB restore at given time */
router.post("/restore", requireAuth, async (req, res, next) => {
  try {
    const { db_id, restore_point } = req.body;
    const user = (req as any).user;
    if (!db_id || !restore_point)
      return res
        .status(400)
        .json({ error: "db_id and restore_point required" });
    const restore = await PITRService.requestRestore(
      db_id,
      new Date(restore_point),
      user.id
    );
    res.status(201).json({ restore });
  } catch (e) {
    next(e);
  }
});

/** GET /api/pitr/:db_id/list — List PITR attempts for a DB */
router.get("/:db_id/list", requireAuth, async (req, res, next) => {
  try {
    const items = await PITRService.listForDB(req.params.db_id);
    res.json({ restores: items });
  } catch (e) {
    next(e);
  }
});

export default router;
