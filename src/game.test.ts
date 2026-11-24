import { describe, expect, it } from "vitest";
import {
  createGame,
  isPositionLocked,
  MAX_WRONG_GUESSES,
  submitGuess,
  swapTiles,
  type GameState
} from "./game";

function boardState(tiles: GameState["tiles"]): GameState {
  return { ...createGame(), tiles };
}

describe("Double Cross Connect rules", () => {
  it("swaps two unlocked tiles without changing the prior board", () => {
    const game = createGame();
    const moved = swapTiles(game, 0, 1);

    expect(moved.tiles.slice(0, 2)).toEqual(["lava", "wine"]);
    expect(game.tiles.slice(0, 2)).toEqual(["wine", "lava"]);
  });

  it("does not allow a swap from or into a solved row or column", () => {
    const game = { ...createGame(), solvedRows: [{ index: 0, categoryId: "red" }] };
    const columnLocked = { ...createGame(), solvedColumns: [{ index: 0, categoryId: "eyes" }] };

    expect(isPositionLocked(game, 1)).toBe(true);
    expect(swapTiles(game, 1, 3)).toBe(game);
    expect(swapTiles(game, 3, 5).tiles.slice(3, 6)).toEqual(["coffee", "stars", "river"]);
    expect(isPositionLocked(columnLocked, 3)).toBe(true);
    expect(swapTiles(columnLocked, 4, 3)).toBe(columnLocked);
  });

  it("counts a guess as wrong only when it solves no new lines", () => {
    expect(submitGuess(createGame()).wrongGuesses).toBe(1);

    const solvedRow = boardState([
      "hair",
      "river",
      "wine",
      "lava",
      "coffee",
      "stars",
      "water",
      "champagne",
      "sun"
    ]);
    const solved = submitGuess(solvedRow);
    expect(solved.solvedRows).toEqual([{ index: 0, categoryId: "red" }]);
    expect(solved.solvedColumns).toEqual([]);
    expect(solved.wrongGuesses).toBe(0);
    expect(solved.isWon).toBe(false);
    expect(isPositionLocked(solved, 0)).toBe(true);
    expect(swapTiles(solved, 1, 3)).toBe(solved);

    const wrong = submitGuess(solved);
    expect(wrong.wrongGuesses).toBe(1);
    expect(wrong.solvedRows).toEqual([{ index: 0, categoryId: "red" }]);
  });

  it("recognizes a column category in any column without requiring the whole puzzle", () => {
    const game = boardState([
      "lava",
      "hair",
      "coffee",
      "river",
      "sun",
      "water",
      "wine",
      "stars",
      "champagne"
    ]);

    const solved = submitGuess(game);

    expect(solved.solvedColumns).toEqual([{ index: 1, categoryId: "eyes" }]);
    expect(solved.solvedRows).toEqual([]);
    expect(solved.wrongGuesses).toBe(0);
    expect(isPositionLocked(solved, 1)).toBe(true);
  });

  it("recognizes a row category in any row", () => {
    const game = boardState([
      "hair",
      "stars",
      "river",
      "water",
      "wine",
      "champagne",
      "sun",
      "lava",
      "coffee"
    ]);

    const solved = submitGuess(game);

    expect(solved.solvedRows).toEqual([{ index: 2, categoryId: "hot" }]);
    expect(solved.solvedColumns).toEqual([]);
    expect(solved.wrongGuesses).toBe(0);
  });

  it("ends the game after three incorrect guesses and rejects further guesses", () => {
    let game = createGame();
    for (let guess = 0; guess < MAX_WRONG_GUESSES; guess += 1) {
      game = submitGuess(game);
    }

    expect(game.wrongGuesses).toBe(3);
    expect(game.isComplete).toBe(true);
    expect(game.isWon).toBe(false);
    expect(submitGuess(game)).toBe(game);
    expect(swapTiles(game, 0, 1)).toBe(game);
  });

  it("locks solved columns and completes when every row and column is solved", () => {
    const solved = submitGuess(
      boardState(["hair", "river", "wine", "sun", "lava", "coffee", "stars", "water", "champagne"])
    );

    expect(solved.solvedColumns).toEqual([
      { index: 0, categoryId: "eyes" },
      { index: 1, categoryId: "flows" },
      { index: 2, categoryId: "drink" }
    ]);
    expect(solved.solvedRows).toEqual([
      { index: 0, categoryId: "red" },
      { index: 1, categoryId: "hot" },
      { index: 2, categoryId: "sparkles" }
    ]);
    expect(solved.isComplete).toBe(true);
    expect(solved.isWon).toBe(true);
    expect(isPositionLocked(solved, 6)).toBe(true);
  });

  it("can finish the example puzzle after locking early solved lines", () => {
    let game = createGame();
    game = swapTiles(game, 0, 2);
    game = swapTiles(game, 1, 3);
    game = submitGuess(game);

    expect(game.solvedRows).toEqual([{ index: 0, categoryId: "red" }]);
    expect(game.solvedColumns).toEqual([{ index: 2, categoryId: "drink" }]);

    game = swapTiles(game, 3, 7);
    game = swapTiles(game, 7, 6);
    game = swapTiles(game, 6, 4);
    expect(game.tiles).toEqual(["hair", "river", "wine", "sun", "lava", "coffee", "stars", "water", "champagne"]);

    const solved = submitGuess(game);
    expect(solved.isWon).toBe(true);
    expect(solved.wrongGuesses).toBe(0);
  });

  it("ends a blocked game when solved rows lock every remaining tile", () => {
    const blocked = submitGuess(
      boardState(["hair", "river", "wine", "sun", "coffee", "lava", "champagne", "stars", "water"])
    );

    expect(blocked.solvedRows).toEqual([
      { index: 0, categoryId: "red" },
      { index: 1, categoryId: "hot" },
      { index: 2, categoryId: "sparkles" }
    ]);
    expect(blocked.isComplete).toBe(true);
    expect(blocked.isWon).toBe(false);
  });
});
