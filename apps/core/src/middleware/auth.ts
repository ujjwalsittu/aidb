import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../utils/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers.authorization || "").replace(/^Bearer /, "");
  if (!token) return res.status(401).json({ error: "No token" });
  const data = verifyJWT<{ id: string; role: string }>(token);
  if (!data) return res.status(401).json({ error: "Invalid token" });
  (req as any).user = data;
  next();
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (((req as any).user?.role ?? "") !== role) {
      return res.status(403).json({ error: `Requires ${role} role` });
    }
    next();
  };
}
