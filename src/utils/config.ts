import { join } from "path";
import { homedir } from "os";

export const CONFIG_DIR = join(homedir(), ".config", "joke-cli");
export const STORAGE_FILE = "ratings.json";
