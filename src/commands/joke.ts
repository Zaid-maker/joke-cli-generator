import chalk from "chalk";
import ora from "ora";
import readline from "readline";
import { saveRating, getAverageRating, checkStorage } from "../storage.js";
import { getCurrentUTCDateTime } from "../utils/dateTime.js";
import type { Joke } from "../types/index.js";

async function getRating(joke: Joke): Promise<number> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(chalk.blue("\nRate this joke (1-10): "), (answer: string) => {
      const rating = parseInt(answer);
      rl.close();

      if (isNaN(rating) || rating < 1 || rating > 10) {
        console.log(chalk.red("Please enter a valid rating between 1 and 10"));
        resolve(getRating(joke));
      } else {
        resolve(rating);
      }
    });
  });
}

export async function fetchAndRateJoke(): Promise<void> {
  // Verify storage is working
  const storageCheck = checkStorage();
  if (!storageCheck) {
    console.error(
      chalk.red(
        "Storage system is not working properly. Ratings will not be saved."
      )
    );
    return;
  }

  const spinner = ora("Fetching a joke...").start();

  try {
    const response = await fetch(
      "https://official-joke-api.appspot.com/random_joke"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const joke = (await response.json()) as Joke;
    spinner.succeed("Got a fresh joke!");

    console.log("\n" + chalk.cyan("════════════════════════════════"));
    console.log(chalk.yellow("🎭 Random Joke 🎭"));
    console.log(chalk.cyan("════════════════════════════════"));
    console.log(chalk.gray(`Time: ${getCurrentUTCDateTime()}`));
    console.log(chalk.gray(`User: ${process.env.USER || "Zaid-maker"}`));
    console.log(chalk.cyan("────────────────────────────────"));
    console.log(chalk.white("Setup: ") + chalk.green(joke.setup));
    console.log(chalk.white("Punchline: ") + chalk.green(joke.punchline));
    console.log(chalk.cyan("────────────────────────────────"));

    const rating = await getRating(joke);

    try {
      saveRating(joke, rating);
      const avgRating = getAverageRating(joke.setup);

      console.log(chalk.green("\n✅ Rating saved successfully!"));
      console.log(
        chalk.yellow(
          `Average rating for this joke: ${avgRating.toFixed(1)}/10 ⭐`
        )
      );

      // Display storage location
      console.log(
        chalk.gray("\nRatings are stored in: ~/.config/joke-cli/ratings.json")
      );
    } catch (error) {
      console.error(
        chalk.red("\nFailed to save rating:"),
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  } catch (error) {
    spinner.fail("Failed to fetch joke");
    console.error(
      chalk.red("Error:"),
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
}
