import express from "express";
import { requireAuth } from "../middleware/auth";
import { DatabaseService } from "../services/DatabaseService";

const router = express.Router();

/** POST /api/db/provision
 * Create a new database for team (baseline/main branch)
 * Body: { name }
 */
router.post("/provision", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });
    // By default, provision as main branch
    const db = await DatabaseService.provision(user.team_id, name, null, false);
    res.status(201).json({ database: db });
  } catch (e) {
    next(e);
  }
});

/** POST /api/db/branch
 * Create a new branch (fork) from an existing DB (copy-on-write)
 * Body: { from_db_id, name, schema_only? }
 */
router.post("/branch", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const { from_db_id, name, schema_only = false } = req.body;
    if (!from_db_id || !name)
      return res.status(400).json({ error: "from_db_id and name required" });
    const branch = await DatabaseService.provision(
      user.team_id,
      name,
      from_db_id,
      schema_only
    );
    res.status(201).json({ branch });
  } catch (e) {
    next(e);
  }
});

/** GET /api/db/list
 * List all databases/branches for your team */
router.get("/list", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const items = await DatabaseService.list(user.team_id);
    res.json({ databases: items });
  } catch (e) {
    next(e);
  }
});

/** DELETE /api/db/:id
 * Delete (mark for destroy) a DB/branch */
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    await DatabaseService.markDeleted(id, user.team_id);
    res.json({ message: "Marked for destroy" });
  } catch (e) {
    next(e);
  }
});

/** GET /api/db/:id/connection_url
 * Get DB connect string */
router.get("/:id/connection_url", requireAuth, async (req, res, next) => {
  try {
    const user = (req as any).user;
    const info = await DatabaseService.getConnectionInfo(
      req.params.id,
      user.team_id
    );
    if (!info) return res.status(404).json({ error: "Not found" });
    res.json(info);
  } catch (e) {
    next(e);
  }
});

/** POST /api/db/diff
 * Diff two branches (databases): { dbA_id, dbB_id }
 */
router.post("/diff", requireAuth, async (req, res, next) => {
  try {
    const { dbA_id, dbB_id } = req.body;
    if (!dbA_id || !dbB_id)
      return res.status(400).json({ error: "dbA_id and dbB_id required" });
    const diff = await DatabaseService.diffSchemas(dbA_id, dbB_id);
    res.json({ diff });
  } catch (e) {
    next(e);
  }
});

export default router;
