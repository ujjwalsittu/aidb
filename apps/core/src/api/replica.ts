import express from "express";
import { requireAuth } from "../middleware/auth";
import { ReplicaService } from "../services/ReplicaService";

const router = express.Router();

/** POST /api/replica/create — provision new read replica */
router.post("/create", requireAuth, async (req, res, next) => {
  try {
    const { db_id } = req.body;
    const user = (req as any).user;
    if (!db_id) return res.status(400).json({ error: "db_id required" });
    const replica = await ReplicaService.createReplica(db_id, user.team_id);
    res.status(201).json({ replica });
  } catch (e) {
    next(e);
  }
});

/** GET /api/replica/list/:db_id — list read replicas for a DB */
router.get("/list/:db_id", requireAuth, async (req, res, next) => {
  try {
    const items = await ReplicaService.listReplicas(req.params.db_id);
    res.json({ replicas: items });
  } catch (e) {
    next(e);
  }
});

/** DELETE /api/replica/:id/:db_id — destroy replica */
router.delete("/:id/:db_id", requireAuth, async (req, res, next) => {
  try {
    await ReplicaService.deleteReplica(req.params.id, req.params.db_id);
    res.json({ message: "Replica marked for destroy" });
  } catch (e) {
    next(e);
  }
});

export default router;
