// Copyright (c) 2026 Andy Yates. All rights reserved.
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
  },
  {
    id: "double-cross-004",
    number: 4,
    author: "@newspire",
    categories: [
      { id: "monkey", label: "Monkey", members: ["wrench", "business", "bread"] },
      { id: "orange", label: "Orange", members: ["twist", "fire", "pumpkin"] },
      { id: "hole", label: "Hole", members: ["screw", "post", "pot"] },
      { id: "turn", label: "Turn", members: ["wrench", "twist", "screw"] },
      { id: "man", label: "Man", members: ["business", "fire", "post"] },
      { id: "pie", label: "Pie", members: ["bread", "pumpkin", "pot"] }
    ],
    tiles: {
      wrench: { id: "wrench", label: "wrench" },
      business: { id: "business", label: "business" },
      bread: { id: "bread", label: "bread" },
      twist: { id: "twist", label: "twist" },
      fire: { id: "fire", label: "fire" },
      pumpkin: { id: "pumpkin", label: "pumpkin" },
      screw: { id: "screw", label: "screw" },
      post: { id: "post", label: "post" },
      pot: { id: "pot", label: "pot" }
    },
    initialTiles: ["fire", "bread", "screw", "post", "pumpkin", "wrench", "twist", "pot", "business"]
  },
  {
    id: "double-cross-005",
    number: 5,
    author: "Copilot",
    categories: [
      { id: "cow", label: "Associated with a cow", members: ["moo", "milk", "barn"] },
      { id: "chicken", label: "Associated with a chicken", members: ["cluck", "egg", "coop"] },
      { id: "bee", label: "Associated with a bee", members: ["buzz", "honey", "hive"] },
      { id: "sounds", label: "Animal sounds", members: ["moo", "cluck", "buzz"] },
      { id: "foods", label: "Foods produced by animals", members: ["milk", "egg", "honey"] },
      { id: "homes", label: "Animal homes", members: ["barn", "coop", "hive"] }
    ],
    tiles: {
      moo: { id: "moo", label: "moo" },
      milk: { id: "milk", label: "milk" },
      barn: { id: "barn", label: "barn" },
      cluck: { id: "cluck", label: "cluck" },
      egg: { id: "egg", label: "egg" },
      coop: { id: "coop", label: "coop" },
      buzz: { id: "buzz", label: "buzz" },
      honey: { id: "honey", label: "honey" },
      hive: { id: "hive", label: "hive" }
    },
    initialTiles: ["moo", "egg", "hive", "barn", "cluck", "honey", "coop", "buzz", "milk"]
  },
  {
    id: "double-cross-006",
    number: 6,
    author: "Copilot",
    categories: [
      { id: "italy", label: "Associated with Italy", members: ["pizza", "espresso", "gelato"] },
      { id: "japan", label: "Associated with Japan", members: ["sushi", "sake", "mochi"] },
      { id: "mexico", label: "Associated with Mexico", members: ["taco", "tequila", "tres leches"] },
      { id: "dishes", label: "Main dishes", members: ["pizza", "sushi", "taco"] },
      { id: "drinks", label: "Drinks", members: ["espresso", "sake", "tequila"] },
      { id: "desserts", label: "Desserts", members: ["gelato", "mochi", "tres leches"] }
    ],
    tiles: {
      pizza: { id: "pizza", label: "pizza" },
      espresso: { id: "espresso", label: "espresso" },
      gelato: { id: "gelato", label: "gelato" },
      sushi: { id: "sushi", label: "sushi" },
      sake: { id: "sake", label: "sake" },
      mochi: { id: "mochi", label: "mochi" },
      taco: { id: "taco", label: "taco" },
      tequila: { id: "tequila", label: "tequila" },
      "tres leches": { id: "tres leches", label: "tres leches" }
    },
    initialTiles: ["tequila", "mochi", "espresso", "sake", "taco", "gelato", "tres leches", "pizza", "sushi"]
  },
  {
    id: "double-cross-007",
    number: 7,
    author: "Copilot",
    categories: [
      { id: "roman", label: "Roman gods", members: ["sol", "jupiter", "pluto"] },
      { id: "greek", label: "Greek gods", members: ["helios", "zeus", "hades"] },
      { id: "egyptian", label: "Egyptian gods", members: ["ra", "horus", "osiris"] },
      { id: "sun", label: "Gods of the sun", members: ["sol", "helios", "ra"] },
      { id: "sky", label: "Gods of the sky", members: ["jupiter", "zeus", "horus"] },
      { id: "underworld", label: "Gods of the underworld", members: ["pluto", "hades", "osiris"] }
    ],
    tiles: {
      sol: { id: "sol", label: "Sol" },
      jupiter: { id: "jupiter", label: "Jupiter" },
      pluto: { id: "pluto", label: "Pluto" },
      helios: { id: "helios", label: "Helios" },
      zeus: { id: "zeus", label: "Zeus" },
      hades: { id: "hades", label: "Hades" },
      ra: { id: "ra", label: "Ra" },
      horus: { id: "horus", label: "Horus" },
      osiris: { id: "osiris", label: "Osiris" }
    },
    initialTiles: ["pluto", "zeus", "ra", "jupiter", "hades", "osiris", "helios", "horus", "sol"]
  },
  {
    id: "double-cross-008",
    number: 8,
    author: "Copilot",
    categories: [
      { id: "baseball", label: "Associated with baseball", members: ["bat", "pitcher", "diamond"] },
      { id: "golf", label: "Associated with golf", members: ["club", "golfer", "green"] },
      { id: "tennis", label: "Associated with tennis", members: ["racket", "server", "court"] },
      { id: "equipment", label: "Sports equipment", members: ["bat", "club", "racket"] },
      { id: "players", label: "Sports players", members: ["pitcher", "golfer", "server"] },
      { id: "places", label: "Places to play", members: ["diamond", "green", "court"] }
    ],
    tiles: {
      bat: { id: "bat", label: "bat" },
      pitcher: { id: "pitcher", label: "pitcher" },
      diamond: { id: "diamond", label: "diamond" },
      club: { id: "club", label: "club" },
      golfer: { id: "golfer", label: "golfer" },
      green: { id: "green", label: "green" },
      racket: { id: "racket", label: "racket" },
      server: { id: "server", label: "server" },
      court: { id: "court", label: "court" }
    },
    initialTiles: ["racket", "golfer", "diamond", "server", "bat", "green", "pitcher", "court", "club"]
  },
  {
    id: "double-cross-009",
    number: 9,
    author: "Copilot",
    categories: [
      { id: "japan", label: "Associated with Japan", members: ["tokyo", "yen", "fuji"] },
      { id: "france", label: "Associated with France", members: ["paris", "euro", "eiffel"] },
      { id: "mexico", label: "Associated with Mexico", members: ["mexico city", "peso", "chichen itza"] },
      { id: "capitals", label: "Capital cities", members: ["tokyo", "paris", "mexico city"] },
      { id: "currencies", label: "Currencies", members: ["yen", "euro", "peso"] },
      { id: "landmarks", label: "Famous landmarks", members: ["fuji", "eiffel", "chichen itza"] }
    ],
    tiles: {
      tokyo: { id: "tokyo", label: "Tokyo" },
      yen: { id: "yen", label: "yen" },
      fuji: { id: "fuji", label: "Mount Fuji" },
      paris: { id: "paris", label: "Paris" },
      euro: { id: "euro", label: "euro" },
      eiffel: { id: "eiffel", label: "Eiffel Tower" },
      "mexico city": { id: "mexico city", label: "Mexico City" },
      peso: { id: "peso", label: "peso" },
      "chichen itza": { id: "chichen itza", label: "Chichen Itza" }
    },
    initialTiles: ["eiffel", "mexico city", "yen", "tokyo", "peso", "paris", "fuji", "euro", "chichen itza"]
  },
  {
    id: "double-cross-010",
    number: 10,
    author: "Copilot",
    categories: [
      { id: "apple", label: "Associated with apples", members: ["apple tree", "apple", "cider"] },
      { id: "coffee", label: "Associated with coffee", members: ["coffee plant", "coffee bean", "coffee"] },
      { id: "grapes", label: "Associated with grapes", members: ["grapevine", "grape", "wine"] },
      { id: "plants", label: "Plants", members: ["apple tree", "coffee plant", "grapevine"] },
      { id: "produce", label: "Fruits or seeds", members: ["apple", "coffee bean", "grape"] },
      { id: "drinks", label: "Drinks", members: ["cider", "coffee", "wine"] }
    ],
    tiles: {
      "apple tree": { id: "apple tree", label: "apple tree" },
      apple: { id: "apple", label: "apple" },
      cider: { id: "cider", label: "cider" },
      "coffee plant": { id: "coffee plant", label: "coffee plant" },
      "coffee bean": { id: "coffee bean", label: "coffee bean" },
      coffee: { id: "coffee", label: "coffee" },
      grapevine: { id: "grapevine", label: "grapevine" },
      grape: { id: "grape", label: "grape" },
      wine: { id: "wine", label: "wine" }
    },
    initialTiles: ["coffee bean", "wine", "apple tree", "grape", "cider", "coffee plant", "grapevine", "apple", "coffee"]
  }
];

export function getPuzzleById(puzzleId: string): PuzzleDefinition {
  const puzzle = PUZZLES.find((candidate) => candidate.id === puzzleId);
  if (!puzzle) {
    throw new Error(`Unknown puzzle id: ${puzzleId}`);
  }
  return puzzle;
}
