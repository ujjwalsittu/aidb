import { Command } from "commander";
import { aidbApi } from "../api";
import inquirer from "inquirer";
import { logOk, logErr } from "../utils";

export const vectorCmd = new Command("vector");

vectorCmd.description("Insert/query vectors (pgvector)");

vectorCmd
  .command("insert")
  .description("Insert embedding/vector")
  .action(async () => {
    const { db_connection_url, table, id, vector } = await inquirer.prompt([
      { name: "db_connection_url", message: "DB connect URL:" },
      { name: "table", message: "Table:" },
      { name: "id", message: "Row id:" },
      { name: "vector", message: "Embedding (JSON array):" },
    ]);
    try {
      const vParsed = JSON.parse(vector);
      await aidbApi.post(`/vector/insert`, {
        db_connection_url,
        table,
        id,
        vector: vParsed,
      });
      logOk("Inserted.");
    } catch (e: any) {
      logErr(e.message);
    }
  });

vectorCmd
  .command("search")
  .description("Search nearest vectors")
  .action(async () => {
    const { db_connection_url, table, vector, limit } = await inquirer.prompt([
      { name: "db_connection_url", message: "DB connect URL:" },
      { name: "table", message: "Table:" },
      { name: "vector", message: "Query embedding (JSON):" },
      { name: "limit", message: "How many?", default: 10 },
    ]);
    try {
      const vParsed = JSON.parse(vector);
      const r = await aidbApi.post(`/vector/search`, {
        db_connection_url,
        table,
        vector: vParsed,
        limit: Number(limit),
      });
      r.data.results.forEach((row: any) =>
        console.log(JSON.stringify(row, null, 2))
      );
    } catch (e: any) {
      logErr(e.message);
    }
  });
