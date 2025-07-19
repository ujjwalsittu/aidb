import { Command } from "commander";
import { aidbApi } from "../api";
import inquirer from "inquirer";
import { logOk, logErr } from "../utils";

export const branchCmd = new Command("branch");

branchCmd.description("Manage branching/forking of DBs");

branchCmd
  .command("create")
  .description("Create a branch/fork from a DB")
  .action(async () => {
    const { from_db_id, name, schema_only } = await inquirer.prompt([
      { name: "from_db_id", message: "From which DB id?" },
      { name: "name", message: "Branch name:" },
      {
        name: "schema_only",
        message: "Schema only? (y/N)",
        type: "confirm",
        default: false,
      },
    ]);
    try {
      const r = await aidbApi.post("/db/branch", {
        from_db_id,
        name,
        schema_only,
      });
      logOk("Created branch " + r.data.branch.name);
    } catch (e: any) {
      logErr(e.message);
    }
  });
