import chalk from "chalk";
import ora from "ora";
import readline from "readline";
import { join, relative } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {
  saveRating,
  getAverageRating,
  checkStorage,
  getLastUser,
  saveLastUser,
} from "../storage.js";
import { getCurrentUTCDateTime } from "../utils/dateTime.js";
import { CONFIG_DIR } from "../utils/config.js";
import type { Joke } from "../types/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..", "..");

async function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(chalk.blue(question), (answer: string) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function getUserName(): Promise<string> {
  const lastUser = getLastUser();
  let username = "";

  if (lastUser) {
    const useLastUser = await promptUser(
      chalk.yellow(
        `Welcome back! Would you like to continue as ${lastUser}? (y/n): `
      )
    );

    if (useLastUser.toLowerCase() === "y") {
      return lastUser;
    }
  }

  while (!username) {
    username = await promptUser("\nPlease enter your name: ");
    if (!username) {
      console.log(chalk.red("Username cannot be empty!"));
    }
  }

  saveLastUser(username);
  return username;
}

async function getRating(joke: Joke): Promise<number> {
  const rating = await promptUser("\nRate this joke (1-10): ");
  const ratingNum = parseInt(rating);

  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 10) {
    console.log(chalk.red("Please enter a valid rating between 1 and 10"));
    return getRating(joke);
  }

  return ratingNum;
}

export async function fetchAndRateJoke(): Promise<void> {
  let spinner = ora("Checking storage...").start();

  try {
    // Verify storage is working
    const storageCheck = checkStorage();
    if (!storageCheck) {
      spinner.fail(
        "Storage system is not working properly. Ratings will not be saved."
      );
      return;
    }
    spinner.succeed("Storage system ready");

    // Fetch joke
    spinner = ora("Fetching a joke...").start();
    const response = await fetch(
      "https://official-joke-api.appspot.com/random_joke"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const joke = (await response.json()) as Joke;
    spinner.succeed("Got a fresh joke!");

    // Display joke with formatting
    console.log("\n" + chalk.cyan("════════════════════════════════"));
    console.log(chalk.yellow("🎭 Random Joke 🎭"));
    console.log(chalk.cyan("════════════════════════════════"));
    console.log(chalk.gray(`Time: ${getCurrentUTCDateTime()}`));
    console.log(chalk.cyan("────────────────────────────────"));
    console.log(chalk.white("Setup: ") + chalk.green(joke.setup));
    console.log(chalk.white("Punchline: ") + chalk.green(joke.punchline));
    console.log(chalk.cyan("────────────────────────────────"));

    // Get username
    const username = await getUserName();
    console.log(chalk.green(`\nRating as: ${username}`));

    // Get rating from user
    const rating = await getRating(joke);

    // Save rating with spinner
    spinner = ora("Saving your rating...").start();
    saveRating(joke, rating, username);
    const avgRating = getAverageRating(joke.setup);
    spinner.succeed("Rating saved successfully!");

    // Display results
    console.log(
      chalk.yellow(
        `\nAverage rating for this joke: ${avgRating.toFixed(1)}/10 ⭐`
      )
    );

    // Display storage location relative to project root
    const storageLocation = relative(
      projectRoot,
      join(CONFIG_DIR, "ratings.json")
    );
    console.log(chalk.gray(`\nRatings are stored in: ${storageLocation}`));

    // Display helpful commands
    console.log(chalk.cyan("\nHelpful commands:"));
    console.log(
      chalk.gray("• View all ratings: ") + chalk.white("bun run start ratings")
    );
    console.log(
      chalk.gray("• Get another joke: ") + chalk.white("bun run start get")
    );
    console.log(
      chalk.gray("• Check storage: ") + chalk.white("bun run start debug")
    );
  } catch (error) {
    spinner.fail("An error occurred");
    console.error(
      chalk.red("Error details:"),
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
