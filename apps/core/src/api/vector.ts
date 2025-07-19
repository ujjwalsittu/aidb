import express from "express";
import { requireAuth } from "../middleware/auth";
import { VectorService } from "../services/VectorService";

const router = express.Router();

/** POST /api/vector/insert — add vector row to a table in a DB */
router.post("/insert", requireAuth, async (req, res, next) => {
  try {
    const { db_connection_url, table, id, vector } = req.body;
    if (!db_connection_url || !table || !id || !vector)
      return res.status(400).json({ error: "All fields required" });
    await VectorService.insertVector(db_connection_url, table, id, vector);
    res.json({ success: true });
  } catch (e) {
    next(e);
  }
});

/** POST /api/vector/search — NN search */
router.post("/search", requireAuth, async (req, res, next) => {
  try {
    const { db_connection_url, table, vector, limit = 10 } = req.body;
    if (!db_connection_url || !table || !vector)
      return res.status(400).json({ error: "All fields required" });
    const results = await VectorService.searchVectors(
      db_connection_url,
      table,
      vector,
      limit
    );
    res.json({ results });
  } catch (e) {
    next(e);
  }
});

export default router;
