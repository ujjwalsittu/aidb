import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { ObservabilityService } from "../services/ObservabilityService";

export async function auditLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // After the request (res.on('finish')), record to audit log
  res.on("finish", async () => {
    const user = (req as any).user;
    if (user) {
      await ObservabilityService.recordAudit(
        user.team_id,
        user.id,
        req.method + " " + req.path,
        req.body?.id || null,
        JSON.stringify(req.body || {})
      );
    }
    logger.info({
      url: req.url,
      method: req.method,
      user: user?.id ?? null,
      body: req.body,
    });
  });
  next();
}
