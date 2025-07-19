import express from "express";
import { TeamService } from "../services/TeamService";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

/** POST /api/teams/create  — Create team (owner becomes creator) */
router.post("/create", requireAuth, async (req, res, next) => {
  try {
    const { name } = req.body;
    const owner_id = (req as any).user.id;
    const team = await TeamService.createTeam(name, owner_id);
    res.status(201).json({ team });
  } catch (e) {
    next(e);
  }
});

/** POST /api/teams/invite — Invite member (email), set role */
router.post("/invite", requireAuth, async (req, res, next) => {
  try {
    const { email, role = "member", team_id } = req.body;
    if (!email || !team_id)
      return res.status(400).json({ error: "Missing fields" });
    const invited_by = (req as any).user.id;
    await TeamService.inviteMember(team_id, email, invited_by, role);
    // TODO: In real, send email with link/token
    res.status(201).json({ message: "Invite sent" });
  } catch (e) {
    next(e);
  }
});

/** GET /api/teams/my — List teams user is member of */
router.get("/my", requireAuth, async (req, res, next) => {
  try {
    const teams = await TeamService.listTeamsForUser((req as any).user.id);
    res.json({ teams });
  } catch (e) {
    next(e);
  }
});

/** GET /api/teams/:id/members — Get team members/roles */
router.get("/:id/members", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const members = await TeamService.listMembers(id);
    res.json({ members });
  } catch (e) {
    next(e);
  }
});

/** PATCH /api/teams/:id/transfer — Transfer ownership */
router.patch("/:id/transfer", requireAuth, async (req, res, next) => {
  try {
    const { new_owner_id } = req.body;
    await TeamService.transferOwnership(req.params.id, new_owner_id);
    res.json({ message: "Ownership transferred" });
  } catch (e) {
    next(e);
  }
});

export default router;
