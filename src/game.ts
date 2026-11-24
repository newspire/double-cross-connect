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
  members: TileId[];
}

export interface SolvedLine {
  index: number;
  categoryId: string;
}

interface LineCandidate {
  kind: LineKind;
  line: SolvedLine;
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

export const CATEGORIES: Category[] = [
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
];

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

function canCompletePuzzle(
  tiles: TileId[],
  solvedRows: SolvedLine[],
  solvedColumns: SolvedLine[]
): boolean {
  const solvedLines = [...solvedRows, ...solvedColumns];
  if (
    new Set(solvedRows.map((line) => line.index)).size !== solvedRows.length ||
    new Set(solvedColumns.map((line) => line.index)).size !== solvedColumns.length ||
    new Set(solvedLines.map((line) => line.categoryId)).size !== solvedLines.length ||
    solvedLines.some(
      (line) =>
        line.index < 0 ||
        line.index >= GRID_SIZE ||
        !CATEGORIES.some((category) => category.id === line.categoryId)
    )
  ) {
    return false;
  }

  const rows: (Category | undefined)[] = new Array(GRID_SIZE);
  const columns: (Category | undefined)[] = new Array(GRID_SIZE);

  const assignmentsWork = (): boolean => {
    const expectedTiles = new Set<TileId>();

    for (let row = 0; row < GRID_SIZE; row += 1) {
      const rowCategory = rows[row];
      if (!rowCategory) return false;

      for (let column = 0; column < GRID_SIZE; column += 1) {
        const columnCategory = columns[column];
        if (!columnCategory) return false;

        const sharedTiles = rowCategory.members.filter((tile) => columnCategory.members.includes(tile));
        if (sharedTiles.length !== 1) return false;

        const tileIndex = row * GRID_SIZE + column;
        const tile = sharedTiles[0];
        if (expectedTiles.has(tile)) return false;
        expectedTiles.add(tile);

        const isLocked =
          solvedRows.some((line) => line.index === row) ||
          solvedColumns.some((line) => line.index === column);
        if (isLocked && tiles[tileIndex] !== tile) return false;
      }
    }

    return expectedTiles.size === GRID_SIZE * GRID_SIZE;
  };

  const assignLine = (lineIndex: number, remaining: Category[]): boolean => {
    if (lineIndex === GRID_SIZE * 2) return assignmentsWork();

    const kind: LineKind = lineIndex < GRID_SIZE ? "row" : "column";
    const index = kind === "row" ? lineIndex : lineIndex - GRID_SIZE;
    const existing = (kind === "row" ? solvedRows : solvedColumns).find((line) => line.index === index);
    const candidates = existing
      ? remaining.filter((category) => category.id === existing.categoryId)
      : remaining;

    for (const category of candidates) {
      if (kind === "row") rows[index] = category;
      else columns[index] = category;

      if (assignLine(lineIndex + 1, remaining.filter((item) => item.id !== category.id))) {
        return true;
      }
    }
    return false;
  };

  return assignLine(0, CATEGORIES);
}

function selectCompletableCandidates(
  tiles: TileId[],
  solvedRows: SolvedLine[],
  solvedColumns: SolvedLine[],
  candidates: LineCandidate[]
): LineCandidate[] {
  for (let count = candidates.length; count > 0; count -= 1) {
    const search = (start: number, selected: LineCandidate[]): LineCandidate[] | undefined => {
      if (selected.length === count) {
        const rows = [
          ...solvedRows,
          ...selected.filter((candidate) => candidate.kind === "row").map((candidate) => candidate.line)
        ];
        const columns = [
          ...solvedColumns,
          ...selected.filter((candidate) => candidate.kind === "column").map((candidate) => candidate.line)
        ];
        return canCompletePuzzle(tiles, rows, columns) ? selected : undefined;
      }

      const remaining = count - selected.length;
      for (let index = start; index <= candidates.length - remaining; index += 1) {
        const result = search(index + 1, [...selected, candidates[index]]);
        if (result) return result;
      }
      return undefined;
    };

    const selected = search(0, []);
    if (selected) return selected;
  }
  return [];
}

export function submitGuess(state: GameState): GameState {
  if (state.isComplete || state.wrongGuesses >= MAX_WRONG_GUESSES) {
    return state;
  }

  const candidateRows = Array.from({ length: GRID_SIZE }, (_, index) => {
    const category = matchingCategory(rowTiles(state.tiles, index), CATEGORIES, [
      ...state.solvedRows,
      ...state.solvedColumns
    ]);
    return category ? [{ index, categoryId: category.id }] : [];
  }).flat();
  const candidateColumns = Array.from({ length: GRID_SIZE }, (_, index) => {
    const category = matchingCategory(columnTiles(state.tiles, index), CATEGORIES, [
      ...state.solvedRows,
      ...state.solvedColumns
    ]);
    return category ? [{ index, categoryId: category.id }] : [];
  }).flat();
  const candidates: LineCandidate[] = [
    ...candidateRows.map((line) => ({ kind: "row" as const, line })),
    ...candidateColumns.map((line) => ({ kind: "column" as const, line }))
  ];
  const selected = selectCompletableCandidates(
    state.tiles,
    state.solvedRows,
    state.solvedColumns,
    candidates
  );
  const newRows = selected.filter((candidate) => candidate.kind === "row").map((candidate) => candidate.line);
  const newColumns = selected
    .filter((candidate) => candidate.kind === "column")
    .map((candidate) => candidate.line);

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
