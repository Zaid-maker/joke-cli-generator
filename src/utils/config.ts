import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Store in the project root directory
export const CONFIG_DIR = join(__dirname, "..", "..", "data");
export const STORAGE_FILE = "ratings.json";
