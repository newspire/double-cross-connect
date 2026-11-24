export const GRID_SIZE = 3;
export const MAX_WRONG_GUESSES = 3;

export type TileId =
  | "hair"
  | "river"
  | "wine"
  | "sun"
  | "lava"
  | "coffee"
  | "stars"
  | "water"
  | "champagne";

export type LineKind = "row" | "column";

export interface Category {
  id: string;
  label: string;
  kind: LineKind;
  members: TileId[];
}

export interface SolvedLine {
  index: number;
  categoryId: string;
}

export interface PuzzleTile {
  id: TileId;
  label: string;
}

export interface GameState {
  tiles: TileId[];
  solvedRows: SolvedLine[];
  solvedColumns: SolvedLine[];
  wrongGuesses: number;
  isComplete: boolean;
  isWon: boolean;
}

export const ROW_CATEGORIES: Category[] = [
  { id: "red", label: "red", kind: "row", members: ["hair", "river", "wine"] },
  { id: "hot", label: "hot", kind: "row", members: ["sun", "lava", "coffee"] },
  {
    id: "sparkles",
    label: "Things that sparkle",
    kind: "row",
    members: ["stars", "water", "champagne"]
  }
];

export const COLUMN_CATEGORIES: Category[] = [
  { id: "eyes", label: "In your eyes", kind: "column", members: ["hair", "sun", "stars"] },
  { id: "flows", label: "flows", kind: "column", members: ["river", "lava", "water"] },
  { id: "drink", label: "drink", kind: "column", members: ["wine", "coffee", "champagne"] }
];

export const CATEGORIES = [...ROW_CATEGORIES, ...COLUMN_CATEGORIES];

export const TILES: Record<TileId, PuzzleTile> = {
  hair: { id: "hair", label: "hair" },
  river: { id: "river", label: "river" },
  wine: { id: "wine", label: "wine" },
  sun: { id: "sun", label: "sun" },
  lava: { id: "lava", label: "lava" },
  coffee: { id: "coffee", label: "coffee" },
  stars: { id: "stars", label: "stars" },
  water: { id: "water", label: "water" },
  champagne: { id: "champagne", label: "Champagne" }
};

export const INITIAL_TILES: TileId[] = [
  "wine",
  "lava",
  "hair",
  "river",
  "stars",
  "coffee",
  "water",
  "sun",
  "champagne"
];

export function createGame(): GameState {
  return {
    tiles: [...INITIAL_TILES],
    solvedRows: [],
    solvedColumns: [],
    wrongGuesses: 0,
    isComplete: false,
    isWon: false
  };
}

export function isPositionLocked(state: GameState, index: number): boolean {
  const row = Math.floor(index / GRID_SIZE);
  const column = index % GRID_SIZE;
  return (
    state.solvedRows.some((line) => line.index === row) ||
    state.solvedColumns.some((line) => line.index === column)
  );
}

export function swapTiles(state: GameState, first: number, second: number): GameState {
  if (
    state.isComplete ||
    first === second ||
    first < 0 ||
    second < 0 ||
    first >= state.tiles.length ||
    second >= state.tiles.length ||
    isPositionLocked(state, first) ||
    isPositionLocked(state, second)
  ) {
    return state;
  }

  const tiles = [...state.tiles];
  [tiles[first], tiles[second]] = [tiles[second], tiles[first]];
  return { ...state, tiles };
}

function matchingCategory(
  line: TileId[],
  categories: Category[],
  solvedLines: SolvedLine[]
): Category | undefined {
  return categories.find(
    (category) =>
      !solvedLines.some((solvedLine) => solvedLine.categoryId === category.id) &&
      category.members.every((tileId) => line.includes(tileId))
  );
}

function rowTiles(tiles: TileId[], row: number): TileId[] {
  return tiles.slice(row * GRID_SIZE, (row + 1) * GRID_SIZE);
}

function columnTiles(tiles: TileId[], column: number): TileId[] {
  return Array.from({ length: GRID_SIZE }, (_, row) => tiles[row * GRID_SIZE + column]);
}

function compatibleAtIntersection(tiles: TileId[], row: SolvedLine, column: SolvedLine): boolean {
  const tile = tiles[row.index * GRID_SIZE + column.index];
  const rowCategory = ROW_CATEGORIES.find((category) => category.id === row.categoryId);
  const columnCategory = COLUMN_CATEGORIES.find((category) => category.id === column.categoryId);
  return Boolean(
    rowCategory?.members.includes(tile) &&
      columnCategory?.members.includes(tile)
  );
}

export function submitGuess(state: GameState): GameState {
  if (state.isComplete || state.wrongGuesses >= MAX_WRONG_GUESSES) {
    return state;
  }

  const candidateRows = Array.from({ length: GRID_SIZE }, (_, index) => {
    const category = matchingCategory(rowTiles(state.tiles, index), ROW_CATEGORIES, state.solvedRows);
    return category ? [{ index, categoryId: category.id }] : [];
  }).flat();
  const candidateColumns = Array.from({ length: GRID_SIZE }, (_, index) => {
    const category = matchingCategory(columnTiles(state.tiles, index), COLUMN_CATEGORIES, state.solvedColumns);
    return category ? [{ index, categoryId: category.id }] : [];
  }).flat();
  const newRows = candidateRows.filter((row) =>
    state.solvedColumns.every((column) => compatibleAtIntersection(state.tiles, row, column))
  );
  const newColumns = candidateColumns.filter((column) =>
    state.solvedRows.every((row) => compatibleAtIntersection(state.tiles, row, column))
  );

  if (newRows.length === 0 && newColumns.length === 0) {
    const wrongGuesses = state.wrongGuesses + 1;
    return {
      ...state,
      wrongGuesses,
      isComplete: wrongGuesses >= MAX_WRONG_GUESSES,
      isWon: false
    };
  }

  const solvedRows = [...state.solvedRows, ...newRows];
  const solvedColumns = [...state.solvedColumns, ...newColumns];
  const isWon = solvedRows.length === GRID_SIZE && solvedColumns.length === GRID_SIZE;
  const next = { ...state, solvedRows, solvedColumns };
  const unlockedPositions = state.tiles.filter((_, index) => !isPositionLocked(next, index)).length;
  return {
    ...next,
    isComplete: isWon || unlockedPositions < 2,
    isWon
  };
}
