import { describe, expect, it } from "vitest";
import {
  createPlayerData,
  getOldestUnplayedPuzzle,
  loadPlayerData,
  PLAYER_STORAGE_KEY,
  recordPuzzleResult,
  savePlayerData,
  summarizePlayerData
} from "./player";
import { PUZZLES } from "./puzzles";

function memoryStorage(initialValue: string | null = null) {
  let value = initialValue;
  return {
    getItem: (key: string) => key === PLAYER_STORAGE_KEY ? value : null,
    setItem: (key: string, nextValue: string) => {
      if (key === PLAYER_STORAGE_KEY) value = nextValue;
    }
  };
}

describe("local player data", () => {
  it("chooses the oldest puzzle without a recorded result", () => {
    const data = createPlayerData();
    const afterFirst = recordPuzzleResult(data, PUZZLES[0], "won", 2, "2026-01-01T00:00:00.000Z");
    const afterThird = recordPuzzleResult(afterFirst, PUZZLES[2], "lost", 4, "2026-01-03T00:00:00.000Z");

    expect(getOldestUnplayedPuzzle([...PUZZLES].reverse(), afterThird).id).toBe(PUZZLES[1].id);
  });

  it("stores results locally and leaves a replay of a played puzzle unrecorded", () => {
    const storage = memoryStorage();
    const data = recordPuzzleResult(createPlayerData(), PUZZLES[0], "won", 1, "2026-01-01T00:00:00.000Z");
    const duplicate = recordPuzzleResult(data, PUZZLES[0], "lost", 3, "2026-01-02T00:00:00.000Z");

    savePlayerData(data, storage);

    expect(loadPlayerData(storage)).toEqual(data);
    expect(duplicate).toBe(data);
  });

  it("rejects malformed saved player data", () => {
    const invalid = memoryStorage(JSON.stringify({
      version: 1,
      results: [{
        puzzleId: PUZZLES[0].id,
        puzzleNumber: 1,
        author: "@newspire",
        outcome: "won",
        guesses: 1,
        completedAt: "not-a-date"
      }]
    }));

    expect(() => loadPlayerData(invalid)).toThrow("Saved player data has an invalid format.");
  });

  it("summarizes wins by the number of submitted guesses and counts losses", () => {
    let data = createPlayerData();
    data = recordPuzzleResult(data, PUZZLES[0], "won", 1, "2026-01-01T00:00:00.000Z");
    data = recordPuzzleResult(data, PUZZLES[1], "won", 2, "2026-01-02T00:00:00.000Z");
    data = recordPuzzleResult(data, PUZZLES[2], "lost", 4, "2026-01-03T00:00:00.000Z");

    expect(summarizePlayerData(data)).toEqual({
      wins: 2,
      losses: 1,
      winsByGuessCount: [
        { guesses: 1, count: 1 },
        { guesses: 2, count: 1 },
        { guesses: 3, count: 0 },
        { guesses: 4, count: 0 },
        { guesses: 5, count: 0 },
        { guesses: 6, count: 0 },
        { guesses: 7, count: 0 },
        { guesses: 8, count: 0 }
      ]
    });
  });
});
