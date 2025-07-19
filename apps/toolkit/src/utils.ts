import ora from "ora";
import chalk from "chalk";

export function spinner(msg: string) {
  return ora({ text: msg, color: "cyan" }).start();
}

export function logOk(msg: string) {
  console.log(chalk.green("✔"), msg);
}
export function logWarn(msg: string) {
  console.log(chalk.yellow("!"), msg);
}
export function logErr(msg: string) {
  console.log(chalk.red("✘"), msg);
}
export function logInfo(msg: string) {
  console.log(chalk.cyan("ℹ"), msg);
}
