// auth.ts
import inquirer from "inquirer";
import { aidbApi } from "./api";
import { saveConfig } from "./config";
import chalk from "chalk";

export async function cliLogin() {
  const { email, password } = await inquirer.prompt([
    { name: "email", message: "AIDB Email:" },
    { name: "password", type: "password", message: "Password:" },
  ]);
  const res = await aidbApi.post("/auth/login", { email, password });
  if (res.data.token) {
    saveConfig({ token: res.data.token });
    console.log(chalk.green("Login successful."));
    return;
  }
  throw "Login failed";
}
