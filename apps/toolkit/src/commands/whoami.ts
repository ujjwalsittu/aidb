import { Command } from "commander";
import { aidbApi } from "../api";
import { logInfo, logErr } from "../utils";

export const whoamiCmd = new Command("whoami")
  .description("Show your AIDB identity and selected team/project")
  .action(async () => {
    try {
      const r = await aidbApi.get("/auth/me");
      logInfo(`User: ${r.data.user.email} (${r.data.user.id})`);
      logInfo(`Name: ${r.data.user.name}`);
      logInfo(`Team: ${r.data.user.team_id}`);
      logInfo(`Role: ${r.data.user.role}`);
    } catch (e: any) {
      logErr(e.message);
    }
  });
