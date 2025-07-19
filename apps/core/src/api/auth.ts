import express from "express";
import { UserService } from "../services/UserService";
import { signJWT } from "../utils/jwt";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

const RegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(["customer", "admin", "support"]).optional().default("customer"),
});

/**
 * POST /api/auth/register
 * Register a new user (customer self-serve or admin create)
 */
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, role } = RegisterSchema.parse(req.body);
    // Disallow self-admin unless seeded or already admin (handle externally)
    const exists = await UserService.findByEmail(email);
    if (exists) return res.status(409).json({ error: "User exists" });

    // Team association/enforcement done in /api/teams (else null for solo users)
    const user = await UserService.createUser(
      email,
      password,
      name,
      role!,
      null
    );
    // TODO: Send verification email (stub)
    res.status(201).json({
      message: "User registered",
      user: { id: user.id, email: user.email },
    });
  } catch (e) {
    next(e);
  }
});

/**
 * POST /api/auth/login
 * Login with email+password. Returns JWT on success.
 */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.verifyPassword(email, password);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    if (!user.is_active)
      return res.status(403).json({ error: "User not active" });
    // Token includes id and role
    const token = signJWT({
      id: user.id,
      role: user.role,
      team_id: user.team_id,
    });
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

/**
 * GET /api/auth/me
 * Get current user's info (token required)
 */
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await UserService.findById((req as any).user.id);
    if (!user) return res.status(404).json({ error: "Not found" });
    res.json({ user });
  } catch (e) {
    next(e);
  }
});

export default router;
