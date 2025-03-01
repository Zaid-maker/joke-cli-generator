import Conf from "conf";
import type { Joke, Rating, StorageData } from "./types/index.js";
import { getCurrentUTCDateTime } from "./utils/dateTime.js";
import { CONFIG_DIR, STORAGE_FILE } from "./utils/config.js";

const config = new Conf<StorageData>({
  projectName: "joke-cli",
  cwd: CONFIG_DIR,
  configName: STORAGE_FILE,
  fileExtension: "json",
  accessPropertiesByDotNotation: true,
  schema: {
    ratings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          timestamp: { type: "string" },
          user: { type: "string" },
          joke: {
            type: "object",
            properties: {
              id: { type: "number" },
              setup: { type: "string" },
              punchline: { type: "string" },
              type: { type: "string" },
            },
          },
          rating: { type: "number" },
        },
      },
      default: [],
    },
  },
});

export function saveRating(jokeData: Joke, rating: number): Rating[] {
  try {
    const currentRatings = config.get("ratings") as Rating[];
    const newRating: Rating = {
      timestamp: getCurrentUTCDateTime(),
      user: process.env.USER || "Zaid-maker", // Default to provided user
      joke: jokeData,
      rating: rating,
    };

    const updatedRatings = [...currentRatings, newRating];
    config.set("ratings", updatedRatings);

    // Verify the save was successful
    const savedRatings = config.get("ratings") as Rating[];
    if (savedRatings.length !== updatedRatings.length) {
      throw new Error("Rating was not saved correctly");
    }

    return updatedRatings;
  } catch (error) {
    console.error("Error saving rating:", error);
    throw error;
  }
}

export function getRatings(): Rating[] {
  try {
    return config.get("ratings") as Rating[];
  } catch (error) {
    console.error("Error getting ratings:", error);
    return [];
  }
}

export function getAverageRating(jokeSetup: string): number {
  try {
    const ratings = getRatings();
    const jokeRatings = ratings.filter((r) => r.joke.setup === jokeSetup);
    if (jokeRatings.length === 0) return 0;
    return (
      jokeRatings.reduce((acc, curr) => acc + curr.rating, 0) /
      jokeRatings.length
    );
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return 0;
  }
}

// Add a utility function to check if storage is working
export function checkStorage(): boolean {
  try {
    const testRating: Rating = {
      timestamp: getCurrentUTCDateTime(),
      user: "test-user",
      joke: {
        id: 0,
        setup: "test-setup",
        punchline: "test-punchline",
        type: "test",
      },
      rating: 5,
    };

    const currentRatings = getRatings();
    config.set("ratings", [...currentRatings, testRating]);
    config.set("ratings", currentRatings); // Reset to original state
    return true;
  } catch (error) {
    console.error("Storage check failed:", error);
    return false;
  }
}
