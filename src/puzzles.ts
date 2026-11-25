export type TileId = string;

export interface Category {
  id: string;
  label: string;
  members: TileId[];
}

export interface PuzzleTile {
  id: TileId;
  label: string;
}

export interface PuzzleDefinition {
  id: string;
  number: number;
  author: string;
  categories: Category[];
  tiles: Record<TileId, PuzzleTile>;
  initialTiles: TileId[];
}

export const PUZZLES: PuzzleDefinition[] = [
  {
    id: "double-cross-001",
    number: 1,
    author: "@newspire",
    categories: [
      { id: "red", label: "red", members: ["hair", "river", "wine"] },
      { id: "hot", label: "hot", members: ["sun", "lava", "coffee"] },
      {
        id: "sparkles",
        label: "Things that sparkle",
        members: ["stars", "water", "champagne"]
      },
      { id: "eyes", label: "In your eyes", members: ["hair", "sun", "stars"] },
      { id: "flows", label: "flows", members: ["river", "lava", "water"] },
      { id: "drink", label: "drink", members: ["wine", "coffee", "champagne"] }
    ],
    tiles: {
      hair: { id: "hair", label: "hair" },
      river: { id: "river", label: "river" },
      wine: { id: "wine", label: "wine" },
      sun: { id: "sun", label: "sun" },
      lava: { id: "lava", label: "lava" },
      coffee: { id: "coffee", label: "coffee" },
      stars: { id: "stars", label: "stars" },
      water: { id: "water", label: "water" },
      champagne: { id: "champagne", label: "Champagne" }
    },
    initialTiles: ["wine", "lava", "hair", "river", "stars", "coffee", "water", "sun", "champagne"]
  },
  {
    id: "double-cross-002",
    number: 2,
    author: "@newspire",
    categories: [
      { id: "red", label: "red", members: ["rose", "ruby", "cherry"] },
      { id: "blue", label: "blue", members: ["iris", "sapphire", "blueberry"] },
      { id: "green", label: "green", members: ["clover", "emerald", "lime"] },
      { id: "flowers", label: "flowers", members: ["rose", "iris", "clover"] },
      { id: "gemstones", label: "gemstones", members: ["ruby", "sapphire", "emerald"] },
      { id: "fruits", label: "fruits", members: ["cherry", "blueberry", "lime"] }
    ],
    tiles: {
      rose: { id: "rose", label: "rose" },
      ruby: { id: "ruby", label: "ruby" },
      cherry: { id: "cherry", label: "cherry" },
      iris: { id: "iris", label: "iris" },
      sapphire: { id: "sapphire", label: "sapphire" },
      blueberry: { id: "blueberry", label: "blueberry" },
      clover: { id: "clover", label: "clover" },
      emerald: { id: "emerald", label: "emerald" },
      lime: { id: "lime", label: "lime" }
    },
    initialTiles: ["sapphire", "rose", "blueberry", "clover", "ruby", "lime", "iris", "emerald", "cherry"]
  },
  {
    id: "double-cross-003",
    number: 3,
    author: "@newspire",
    categories: [
      { id: "music", label: "music", members: ["trumpet", "guitar", "sheet music"] },
      { id: "sports", label: "sports", members: ["racket", "bat", "scorecard"] },
      { id: "travel", label: "travel", members: ["compass", "oar", "map"] },
      { id: "metal", label: "made of metal", members: ["trumpet", "racket", "compass"] },
      { id: "wood", label: "made of wood", members: ["guitar", "bat", "oar"] },
      { id: "paper", label: "made of paper", members: ["sheet music", "scorecard", "map"] }
    ],
    tiles: {
      trumpet: { id: "trumpet", label: "trumpet" },
      guitar: { id: "guitar", label: "guitar" },
      "sheet music": { id: "sheet music", label: "sheet music" },
      racket: { id: "racket", label: "racket" },
      bat: { id: "bat", label: "bat" },
      scorecard: { id: "scorecard", label: "scorecard" },
      compass: { id: "compass", label: "compass" },
      oar: { id: "oar", label: "oar" },
      map: { id: "map", label: "map" }
    },
    initialTiles: ["compass", "guitar", "map", "sheet music", "trumpet", "bat", "oar", "scorecard", "racket"]
  }
];

export function getPuzzleById(puzzleId: string): PuzzleDefinition {
  const puzzle = PUZZLES.find((candidate) => candidate.id === puzzleId);
  if (!puzzle) {
    throw new Error(`Unknown puzzle id: ${puzzleId}`);
  }
  return puzzle;
}
