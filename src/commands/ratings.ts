import chalk from "chalk";
import { getRatings } from "../storage.js";
import type { Rating } from "../types/index.js";

export function viewRatings(): void {
  const ratings: Rating[] = getRatings();

  if (ratings.length === 0) {
    console.log(chalk.yellow("\nNo ratings found yet. Rate some jokes first!"));
    return;
  }

  console.log(chalk.cyan("\n📊 Joke Ratings History 📊"));
  console.log(chalk.cyan("════════════════════════════════"));

  ratings.forEach((rating: Rating, index: number) => {
    console.log(chalk.yellow(`\nJoke #${index + 1}`));
    console.log(chalk.gray(`Time: ${rating.timestamp}`));
    console.log(chalk.gray(`User: ${rating.user}`));
    console.log(chalk.white(`Setup: ${rating.joke.setup}`));
    console.log(chalk.white(`Punchline: ${rating.joke.punchline}`));
    console.log(chalk.green(`Rating: ${rating.rating}/10 ⭐`));
    console.log(chalk.cyan("────────────────────────────────"));
  });

  const avgRating =
    ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;
  console.log(
    chalk.yellow(`\nOverall Average Rating: ${avgRating.toFixed(1)}/10 ⭐`)
  );
}
