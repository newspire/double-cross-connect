// Copyright (c) 2026 Andy Yates. All rights reserved.
import { createGame, submitGuess, swapTiles, type GameState } from "./game";
import { getPuzzleById } from "./puzzles";
import type { PlayerData } from "./player";

export const DEMO_SEEN_KEY = "double-cross-connect.demo-seen.v1";

export const DEMO_PUZZLE = {
  ...getPuzzleById("double-cross-000"),
  initialTiles: [
    "banana", "cardinal", "rose",
    "apple", "canary", "lime",
    "sunflower", "clover", "frog"
  ]
};

interface DemoFrame {
  game: GameState;
  selected: number | null;
  message: string;
  connect: boolean;
}

const initial = createGame(DEMO_PUZZLE);
const firstSwap = swapTiles(initial, 0, 3);
const firstConnect = submitGuess(firstSwap, DEMO_PUZZLE);
const secondSwap = swapTiles(firstConnect, 5, 6);
const secondConnect = submitGuess(secondSwap, DEMO_PUZZLE);

export const DEMO_FRAMES: DemoFrame[] = [
  { game: initial, selected: 0, message: "Tap a tile, then another to swap them.", connect: false },
  { game: firstSwap, selected: null, message: "The tiles swap places.", connect: false },
  { game: firstSwap, selected: null, message: "Press Connect to check your lines.", connect: true },
  { game: firstConnect, selected: null, message: "A connection is found and its tiles lock.", connect: false },
  { game: firstConnect, selected: 5, message: "Swap two of the remaining open tiles.", connect: false },
  { game: secondSwap, selected: null, message: "The tiles swap places again.", connect: false },
  { game: secondSwap, selected: null, message: "Press Connect to check again.", connect: true },
  { game: secondConnect, selected: null, message: "More connections found! Every tile belongs to two groups.", connect: false }
];

type DemoStorage = Pick<Storage, "getItem" | "setItem">;

export function shouldShowDemo(player: PlayerData, storage: DemoStorage): boolean {
  return player.results.length === 0 && storage.getItem(DEMO_SEEN_KEY) === null;
}

export function markDemoSeen(storage: DemoStorage): void {
  storage.setItem(DEMO_SEEN_KEY, "1");
}
