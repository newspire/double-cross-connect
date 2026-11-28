// Copyright (c) 2026 Andy Yates. All rights reserved.
import { describe, expect, it } from "vitest";
import { DEMO_FRAMES, DEMO_PUZZLE, markDemoSeen, shouldShowDemo } from "./demo";
import { createPlayerData, recordPuzzleResult } from "./player";
import { PUZZLES } from "./puzzles";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); }
  };
}

describe("first-visit demo", () => {
  it("only opens automatically for a player without saved results or a dismissal", () => {
    const storage = memoryStorage();
    const player = createPlayerData();
    expect(shouldShowDemo(player, storage)).toBe(true);
    const returning = recordPuzzleResult(player, PUZZLES[0], "lost", 3);
    expect(shouldShowDemo(returning, storage)).toBe(false);
    markDemoSeen(storage);
    expect(shouldShowDemo(player, storage)).toBe(false);
  });

  it("shows two legal swaps and two genuine submissions, with connections locking", () => {
    const [initial, firstSwap, , firstConnect, , secondSwap, , secondConnect] = DEMO_FRAMES;
    expect(DEMO_PUZZLE.number).toBe(0);
    expect(DEMO_PUZZLE.initialTiles).not.toEqual(PUZZLES[0].initialTiles);
    expect(initial.game.hasStarted).toBe(false);
    expect(firstSwap.game.hasStarted).toBe(true);
    expect(firstConnect.game.guesses).toBe(1);
    expect(firstConnect.game.solvedRows.length + firstConnect.game.solvedColumns.length).toBe(1);
    expect(secondSwap.game.tiles).not.toEqual(firstConnect.game.tiles);
    expect(secondConnect.game.guesses).toBe(2);
    expect(secondConnect.game.solvedRows.length + secondConnect.game.solvedColumns.length).toBeGreaterThan(1);
    expect(secondConnect.game.wrongGuesses).toBe(0);
  });
});
