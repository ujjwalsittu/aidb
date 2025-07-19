import express from "express";
import { requireAuth, requireRole } from "../middleware/auth";
import { StorageManager } from "../services/StorageManager";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "/tmp" }); // For uploads

const storage = new StorageManager();

/** POST /api/storage/upload-backup */
router.post(
  "/upload-backup",
  requireAuth,
  upload.single("file"),
  async (req, res, next) => {
    try {
      const file = req.file!;
      const key = `backups/${(req as any).user.team_id}/${Date.now()}_${
        file.originalname
      }`;
      await storage.uploadObject(key, file.path, file.mimetype);
      res.json({ key });
    } catch (e) {
      next(e);
    }
  }
);

/** GET /api/storage/download?key=xxx */
router.get("/download", requireAuth, async (req, res, next) => {
  try {
    const { key } = req.query as { key: string };
    if (!key) return res.status(400).json({ error: "key required" });
    const data = await storage.downloadObject(key);
    res.setHeader("Content-Type", "application/octet-stream");
    res.send(data);
  } catch (e) {
    next(e);
  }
});

/** DELETE /api/storage/remove?key=xxx */
router.delete(
  "/remove",
  requireAuth,
  requireRole("admin"),
  async (req, res, next) => {
    try {
      const { key } = req.query as { key: string };
      await storage.deleteObject(key);
      res.json({ deleted: true });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
