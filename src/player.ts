import type { PuzzleDefinition } from "./puzzles";
import { GRID_SIZE, MAX_WRONG_GUESSES } from "./game";

export const PLAYER_STORAGE_KEY = "double-cross-connect.player.v1";

export interface PuzzleResult {
  puzzleId: string;
  puzzleNumber: number;
  author: string;
  outcome: "won" | "lost";
  guesses: number;
  completedAt: string;
}

export interface PlayerData {
  version: 1;
  results: PuzzleResult[];
}

export interface PlayerSummary {
  wins: number;
  losses: number;
  winsByGuessCount: { guesses: number; count: number }[];
}

type PlayerStorage = Pick<Storage, "getItem" | "setItem">;

export function createPlayerData(): PlayerData {
  return { version: 1, results: [] };
}

function isPuzzleResult(value: unknown): value is PuzzleResult {
  if (typeof value !== "object" || value === null) return false;
  const result = value as Record<string, unknown>;
  return (
    typeof result.puzzleId === "string" &&
    typeof result.puzzleNumber === "number" &&
    Number.isInteger(result.puzzleNumber) &&
    typeof result.author === "string" &&
    (result.outcome === "won" || result.outcome === "lost") &&
    typeof result.guesses === "number" &&
    Number.isInteger(result.guesses) &&
    result.guesses > 0 &&
    typeof result.completedAt === "string" &&
    !Number.isNaN(Date.parse(result.completedAt))
  );
}

function isPlayerData(value: unknown): value is PlayerData {
  if (typeof value !== "object" || value === null) return false;
  const data = value as Record<string, unknown>;
  return data.version === 1 && Array.isArray(data.results) && data.results.every(isPuzzleResult);
}

export function loadPlayerData(storage: PlayerStorage = window.localStorage): PlayerData {
  const saved = storage.getItem(PLAYER_STORAGE_KEY);
  if (saved === null) return createPlayerData();

  const parsed: unknown = JSON.parse(saved);
  if (!isPlayerData(parsed)) {
    throw new Error("Saved player data has an invalid format.");
  }
  return parsed;
}

export function savePlayerData(data: PlayerData, storage: PlayerStorage = window.localStorage): void {
  storage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(data));
}

export function hasPlayedPuzzle(data: PlayerData, puzzleId: string): boolean {
  return data.results.some((result) => result.puzzleId === puzzleId);
}

export function getOldestUnplayedPuzzle(
  puzzles: PuzzleDefinition[],
  data: PlayerData
): PuzzleDefinition {
  const ordered = [...puzzles].sort((a, b) => a.number - b.number);
  const nextPuzzle = ordered.find((puzzle) => !hasPlayedPuzzle(data, puzzle.id));
  if (nextPuzzle) return nextPuzzle;
  if (ordered.length === 0) throw new Error("At least one puzzle is required.");
  return ordered[0];
}

export function recordPuzzleResult(
  data: PlayerData,
  puzzle: PuzzleDefinition,
  outcome: PuzzleResult["outcome"],
  guesses: number,
  completedAt = new Date().toISOString()
): PlayerData {
  if (hasPlayedPuzzle(data, puzzle.id)) return data;
  return {
    ...data,
    results: [
      ...data.results,
      {
        puzzleId: puzzle.id,
        puzzleNumber: puzzle.number,
        author: puzzle.author,
        outcome,
        guesses,
        completedAt
      }
    ]
  };
}

export function summarizePlayerData(data: PlayerData): PlayerSummary {
  const wins = data.results.filter((result) => result.outcome === "won");
  const maxGuesses = Math.max(
    MAX_WRONG_GUESSES - 1 + GRID_SIZE * 2,
    ...wins.map((result) => result.guesses)
  );
  const winsByGuessCount = Array.from({ length: maxGuesses }, (_, index) => {
    const guesses = index + 1;
    return { guesses, count: wins.filter((result) => result.guesses === guesses).length };
  });
  return {
    wins: wins.length,
    losses: data.results.length - wins.length,
    winsByGuessCount
  };
}
