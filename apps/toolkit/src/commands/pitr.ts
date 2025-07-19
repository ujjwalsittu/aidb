import { Command } from "commander";
import { aidbApi } from "../api";
import inquirer from "inquirer";
import { logOk, logErr, logInfo } from "../utils";

export const pitrCmd = new Command("pitr");

pitrCmd.description("Point-in-time recovery");

pitrCmd
  .command("restore")
  .description("Restore DB to a timestamp")
  .action(async () => {
    const { db_id, restore_point } = await inquirer.prompt([
      { name: "db_id", message: "DB id:" },
      { name: "restore_point", message: "Restore to ISO-8601 timestamp:" },
    ]);
    try {
      const r = await aidbApi.post("/pitr/restore", { db_id, restore_point });
      logOk("Restore requested: " + r.data.restore.id);
    } catch (e: any) {
      logErr(e.message);
    }
  });

pitrCmd
  .command("list <db_id>")
  .description("List PITR restores for DB")
  .action(async (db_id) => {
    try {
      const r = await aidbApi.get(`/pitr/${db_id}/list`);
      r.data.restores.forEach((rstr: any) =>
        logInfo(`${rstr.id} ${rstr.restore_point} status=${rstr.status}`)
      );
    } catch (e: any) {
      logErr(e.message);
    }
  });
