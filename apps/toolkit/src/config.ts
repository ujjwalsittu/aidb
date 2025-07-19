// config.ts
import fs from "fs";
import path from "path";

const CONF_PATH = path.join(process.env.HOME || "", ".aidbrc.json");

export function loadConfig(): {
  token?: string;
  apiUrl?: string;
  team?: string;
} {
  if (!fs.existsSync(CONF_PATH)) return {};
  return JSON.parse(fs.readFileSync(CONF_PATH, "utf-8"));
}
export function saveConfig(cfg: any) {
  fs.writeFileSync(CONF_PATH, JSON.stringify(cfg, null, 2));
}
