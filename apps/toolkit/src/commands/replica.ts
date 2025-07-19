import { Command } from "commander";
import { aidbApi } from "../api";
import inquirer from "inquirer";
import { logOk, logErr } from "../utils";

export const replicaCmd = new Command("replica");

replicaCmd.description("Read-only replicas");

replicaCmd
  .command("create")
  .description("Create read replica")
  .action(async () => {
    const { db_id } = await inquirer.prompt([
      { name: "db_id", message: "DB id:" },
    ]);
    try {
      const r = await aidbApi.post(`/replica/create`, { db_id });
      logOk("Replica id=" + r.data.replica.id);
    } catch (e: any) {
      logErr(e.message);
    }
  });

replicaCmd
  .command("list <db_id>")
  .description("List replicas for DB")
  .action(async (db_id) => {
    try {
      const r = await aidbApi.get(`/replica/list/${db_id}`);
      r.data.replicas.forEach((rep: any) =>
        console.log([rep.id, rep.connection_url, rep.status].join(" | "))
      );
    } catch (e: any) {
      logErr(e.message);
    }
  });

replicaCmd
  .command("destroy <id> <db_id>")
  .description("Destroy replica")
  .action(async (id, db_id) => {
    try {
      await aidbApi.delete(`/replica/${id}/${db_id}`);
      logOk("Replica destroy requested.");
    } catch (e: any) {
      logErr(e.message);
    }
  });
