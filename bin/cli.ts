#!/usr/bin/env bun

import { Command } from "commander";
import figlet from "figlet";
import chalk from "chalk";
import { fetchAndRateJoke } from "../src/commands/joke.js";
import { viewRatings } from "../src/commands/ratings.js";
import { debugStorage } from "../src/commands/debug.js";

const program = new Command();

const displayBanner = async (): Promise<void> => {
  console.log(
    chalk.yellow(
      figlet.textSync("Joke CLI", {
        horizontalLayout: "full",
        font: "Standard",
      })
    )
  );
};

const main = async (): Promise<void> => {
  await displayBanner();

  program
    .version("1.0.0")
    .description("A CLI tool for fetching and rating random jokes");

  program
    .command("get")
    .description("Get a random joke and rate it")
    .action(fetchAndRateJoke);

  program
    .command("ratings")
    .description("View your joke rating history")
    .action(viewRatings);

  program
    .command("debug")
    .description("Run storage diagnostics")
    .action(debugStorage);

  program.parse(process.argv);

  // Show help if no command is provided
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};

// Execute the CLI
main().catch((error) => {
  console.error(chalk.red("Error:"), error);
  process.exit(1);
});
