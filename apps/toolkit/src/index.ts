import { Command } from "commander";
import figlet from "figlet";
import chalk from "chalk";
import { loginCmd } from "./commands/login";
import { dbCmd } from "./commands/db";
import { branchCmd } from "./commands/branch";
import { pitrCmd } from "./commands/pitr";
import { replicaCmd } from "./commands/replica";
import { vectorCmd } from "./commands/vector";
import { billingCmd } from "./commands/billing";
import { whoamiCmd } from "./commands/whoami";

const program = new Command();

console.log(chalk.cyan(figlet.textSync("AIDB")));

// Register sub-commands
program.addCommand(loginCmd);
program.addCommand(dbCmd);
program.addCommand(branchCmd);
program.addCommand(pitrCmd);
program.addCommand(replicaCmd);
program.addCommand(vectorCmd);
program.addCommand(billingCmd);
program.addCommand(whoamiCmd);

program.parse(process.argv);
