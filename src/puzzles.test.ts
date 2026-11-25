import { describe, expect, it } from "vitest";
import { createGame, submitGuess } from "./game";
import { PUZZLES } from "./puzzles";

describe("puzzle collection", () => {
  it("uses unique tracking ids and consecutive puzzle numbers starting at one", () => {
    expect(new Set(PUZZLES.map((puzzle) => puzzle.id)).size).toBe(PUZZLES.length);
    expect(PUZZLES.map((puzzle) => puzzle.number)).toEqual(
      Array.from({ length: PUZZLES.length }, (_, index) => index + 1)
    );
  });

  it("defines a complete 3-by-3 set of unique category intersections for each puzzle", () => {
    for (const puzzle of PUZZLES) {
      expect(puzzle.categories).toHaveLength(6);
      expect(puzzle.initialTiles).toHaveLength(9);
      expect(new Set(puzzle.initialTiles).size).toBe(9);
      expect(new Set(puzzle.categories.map((category) => category.id)).size).toBe(6);

      const expectedTiles = puzzle.categories.slice(0, 3).flatMap((rowCategory) =>
        puzzle.categories.slice(3).map((columnCategory) => {
          const shared = rowCategory.members.filter((tileId) => columnCategory.members.includes(tileId));
          expect(shared).toHaveLength(1);
          return shared[0];
        })
      );

      expect(new Set(expectedTiles).size).toBe(9);
      expect(expectedTiles.sort()).toEqual([...puzzle.initialTiles].sort());
    }
  });

  it("can complete every registered puzzle from its category intersections", () => {
    for (const puzzle of PUZZLES) {
      const solution = puzzle.categories.slice(0, 3).flatMap((rowCategory) =>
        puzzle.categories.slice(3).map((columnCategory) => {
          const shared = rowCategory.members.filter((tileId) => columnCategory.members.includes(tileId));
          expect(shared).toHaveLength(1);
          return shared[0] ?? "";
        })
      );
      const game = { ...createGame(puzzle), tiles: solution };

      expect(submitGuess(game, puzzle).isWon).toBe(true);
    }
  });
});
