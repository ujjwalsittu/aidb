import { Command } from "commander";
import { cliLogin } from "../auth";
import { saveConfig } from "../config";
import inquirer from "inquirer";
import chalk from "chalk";

export const loginCmd = new Command("login")
  .description("Log in to AIDB")
  .action(async () => {
    await cliLogin();
  });

loginCmd
  .command("logout")
  .description("Log out and clear token")
  .action(() => {
    saveConfig({});
    console.log(chalk.yellow("Logged out and config cleared."));
  });
