import Conf from "conf";
import type { Joke, Rating, StorageData } from "./types/index.js";
import { getCurrentUTCDateTime } from "./utils/dateTime.js";

const config = new Conf<StorageData>({
  projectName: "joke-cli-generator",
  fileExtension: "json",
  schema: {
    ratings: {
      type: "array",
      default: [],
    },
  },
});

export function saveRating(jokeData: Joke, rating: number): Rating[] {
  const ratings = config.get("ratings") || [];
  const newRating: Rating = {
    timestamp: getCurrentUTCDateTime(),
    user: process.env.USER || "anonymous",
    joke: jokeData,
    rating: rating,
  };

  ratings.push(newRating);
  config.set("ratings", ratings);
  return ratings;
}

export function getRatings(): Rating[] {
  return config.get("ratings") || [];
}

export function getAverageRating(jokeSetup: string): number {
  const ratings = getRatings();
  const jokeRatings = ratings.filter((r) => r.joke.setup === jokeSetup);
  if (jokeRatings.length === 0) return 0;
  return (
    jokeRatings.reduce((acc, curr) => acc + curr.rating, 0) / jokeRatings.length
  );
}
