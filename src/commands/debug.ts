import chalk from "chalk";
import { CONFIG_DIR, STORAGE_FILE } from "../utils/config.js";
import { checkStorage } from "../storage.js";
import { access, constants, mkdir } from "fs/promises";
import { join, relative } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..", "..");

export async function debugStorage(): Promise<void> {
  console.log(chalk.cyan("\n🔍 Running Storage Diagnostics"));
  console.log(chalk.cyan("════════════════════════════"));

  // Check config directory
  try {
    await access(CONFIG_DIR, constants.R_OK | constants.W_OK);
    console.log(chalk.green("✓ Data directory exists and is accessible"));
  } catch (error) {
    console.log(
      chalk.yellow("! Data directory not found, attempting to create...")
    );
    try {
      await mkdir(CONFIG_DIR, { recursive: true });
      console.log(chalk.green("✓ Data directory created successfully"));
    } catch (error) {
      console.error(chalk.red("✗ Failed to create data directory"));
      console.error(error);
    }
  }

  // Check storage file
  const storageFilePath = join(CONFIG_DIR, STORAGE_FILE);
  try {
    await access(storageFilePath, constants.R_OK | constants.W_OK);
    console.log(chalk.green("✓ Storage file exists and is accessible"));
  } catch (error) {
    console.log(chalk.yellow("! Storage file not found or not accessible"));
  }

  // Check storage functionality
  const storageWorks = checkStorage();
  if (storageWorks) {
    console.log(chalk.green("✓ Storage system is working properly"));
  } else {
    console.log(chalk.red("✗ Storage system is not working properly"));
  }

  console.log(chalk.cyan("\nStorage Information:"));
  console.log(chalk.gray(`Project Root: ${projectRoot}`));
  console.log(
    chalk.gray(`Data Directory: ${relative(projectRoot, CONFIG_DIR)}`)
  );
  console.log(
    chalk.gray(`Storage File: ${relative(projectRoot, storageFilePath)}`)
  );
}
