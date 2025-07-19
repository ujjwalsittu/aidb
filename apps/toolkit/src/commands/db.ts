import { Command } from "commander";
import { aidbApi } from "../api";
import inquirer from "inquirer";
import { logOk, logErr } from "../utils";

export const dbCmd = new Command("db").description(
  "Database/provision/branch ops"
);

dbCmd
  .command("list")
  .description("List all DBs/branches for your team")
  .action(async () => {
    try {
      const r = await aidbApi.get("/db/list");
      r.data.databases.forEach((db: any) =>
        console.log([db.id, db.name, db.connection_url, db.status].join(" | "))
      );
    } catch (e: any) {
      logErr(e.message);
    }
  });

dbCmd
  .command("provision")
  .description("Provision new main DB")
  .action(async () => {
    const { name } = await inquirer.prompt([
      { name: "name", message: "DB name:" },
    ]);
    try {
      const r = await aidbApi.post("/db/provision", { name });
      logOk(`Provisioned: ${r.data.database.name} (id ${r.data.database.id})`);
    } catch (e: any) {
      logErr(e.message);
    }
  });

dbCmd
  .command("delete <id>")
  .description("Delete DB/branch")
  .action(async (id) => {
    try {
      await aidbApi.delete(`/db/${id}`);
      logOk("Marked for destruction");
    } catch (e: any) {
      logErr(e.message);
    }
  });

dbCmd
  .command("connection-url <id>")
  .description("Print DB connect URL")
  .action(async (id) => {
    try {
      const r = await aidbApi.get(`/db/${id}/connection_url`);
      console.log(r.data.connection_url);
    } catch (e: any) {
      logErr(e.message);
    }
  });

dbCmd
  .command("diff <a_id> <b_id>")
  .description("Schema diff between branches")
  .action(async (a_id, b_id) => {
    try {
      const r = await aidbApi.post("/db/diff", { dbA_id: a_id, dbB_id: b_id });
      console.log(r.data.diff);
    } catch (e: any) {
      logErr(e.message);
    }
  });
