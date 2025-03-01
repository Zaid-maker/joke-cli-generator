export interface Joke {
  id: number;
  setup: string;
  punchline: string;
  type: string;
}

export interface Rating {
  timestamp: string;
  user: string;
  joke: Joke;
  rating: number;
}

export interface StorageData {
  ratings: Rating[];
  lastUser?: string; // Add this to optionally remember the last user
}
