import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error({ err }, "API Error");
  res.status(err.status || 500).json({ error: err.message || "Unknown error" });
}
