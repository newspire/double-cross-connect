import { useState } from "react";
import {
  createGame,
  isPositionLocked,
  MAX_WRONG_GUESSES,
  GRID_SIZE,
  submitGuess,
  swapTiles,
  type Category,
  type GameState
} from "../game";
import { PUZZLES } from "../puzzles";
import {
  getOldestUnplayedPuzzle,
  hasPlayedPuzzle,
  recordPuzzleResult
} from "../player";
import { usePlayerProfile } from "../usePlayerProfile";

export default function GamePage() {
  const player = usePlayerProfile();
  const orderedPuzzles = [...PUZZLES].sort((a, b) => a.number - b.number);
  const [puzzle, setPuzzle] = useState(() => getOldestUnplayedPuzzle(orderedPuzzles, player.data));
  const [game, setGame] = useState<GameState>(() => createGame(puzzle));
  const [selected, setSelected] = useState<number | null>(null);
  const [highlighted, setHighlighted] = useState<Category | null>(null);
  const [isPractice, setIsPractice] = useState(() => hasPlayedPuzzle(player.data, puzzle.id));
  const [feedback, setFeedback] = useState("Find the hidden connections. Every row and column has one.");

  const startPuzzle = (nextPuzzle: typeof puzzle, practice = hasPlayedPuzzle(player.data, nextPuzzle.id)) => {
    setPuzzle(nextPuzzle);
    setGame(createGame(nextPuzzle));
    setSelected(null);
    setHighlighted(null);
    setIsPractice(practice);
    setFeedback("Find the hidden connections. Every row and column has one.");
  };

  const startPracticeGame = () => startPuzzle(puzzle, true);

  const isLocked = (index: number) => isPositionLocked(game, index);
  const isHighlighted = (index: number) => {
    if (!highlighted) return false;
    const solvedRow = game.solvedRows.find((line) => line.categoryId === highlighted.id);
    if (solvedRow) return Math.floor(index / GRID_SIZE) === solvedRow.index;

    const solvedColumn = game.solvedColumns.find((line) => line.categoryId === highlighted.id);
    return solvedColumn !== undefined && index % GRID_SIZE === solvedColumn.index;
  };

  const handleTileClick = (index: number) => {
    if (game.isComplete || isLocked(index)) return;
    if (selected === null) {
      setSelected(index);
      setFeedback("Now choose another open tile to swap.");
      return;
    }
    if (selected === index) {
      setSelected(null);
      setFeedback("Selection cleared. Choose a tile to move.");
      return;
    }
    setGame((current) => swapTiles(current, selected, index));
    setSelected(null);
    setFeedback("Tiles swapped. Connect when you think the grid is right.");
  };

  const handleConnect = () => {
    const next = submitGuess(game, puzzle);
    setGame(next);
    setSelected(null);
    if (next.isComplete && !isPractice) {
      const updatedData = recordPuzzleResult(
        player.data,
        puzzle,
        next.isWon ? "won" : "lost",
        next.guesses
      );
      if (updatedData !== player.data) player.persist(updatedData);
    }
    if (next.isWon) {
      setFeedback("Brilliant! You found every connection.");
    } else if (next.isComplete && next.wrongGuesses === game.wrongGuesses) {
      setFeedback("No valid swaps remain. Start a new game and try another path.");
    } else if (next.wrongGuesses > game.wrongGuesses) {
      setFeedback(
        next.isComplete
          ? "No new connections. That was your last guess."
          : "No new connections yet. Try another arrangement."
      );
    } else {
      const solvedCount =
        next.solvedRows.length + next.solvedColumns.length - game.solvedRows.length - game.solvedColumns.length;
      setFeedback(
        solvedCount === 1 ? "One connection found and locked in!" : `${solvedCount} connections found and locked in!`
      );
    }
  };

  const solvedCategoryIds = new Set(
    [...game.solvedRows, ...game.solvedColumns].map((line) => line.categoryId)
  );
  const discovered = puzzle.categories.filter((category) => solvedCategoryIds.has(category.id));
  const puzzleIndex = orderedPuzzles.findIndex((candidate) => candidate.id === puzzle.id);
  const previousPuzzle = orderedPuzzles[puzzleIndex - 1];
  const nextPuzzle = orderedPuzzles[puzzleIndex + 1];

  return (
    <section className="game-page" aria-labelledby="game-title">
      <div className="game-intro">
        <p className="eyebrow">TODAY'S LITTLE BRAIN TEASER</p>
        <h1 id="game-title">Double Cross <span>Connect</span></h1>
        <p className="intro-copy">
          Every word belongs to two connections. Any connection can appear in a row or column. A line counts
          only if all six connections can still be completed.
        </p>
      </div>

      <div className="puzzle-layout">
        <section className="board-card" aria-label="Puzzle board">
          <div className="board-heading">
            <div>
              <p className="eyebrow">ONE GRID. SIX CONNECTIONS.</p>
              <h2>Make it click.</h2>
              <p className="puzzle-attribution">#{puzzle.number} by {puzzle.author}</p>
              {isPractice && <p className="practice-note">Practice replay · not counted in your stats</p>}
            </div>
            <div className="guesses" aria-label={`${MAX_WRONG_GUESSES - game.wrongGuesses} guesses left`}>
              <span className="guesses-label">GUESSES LEFT</span>
              <span className="guess-dots" aria-hidden="true">
                {Array.from({ length: MAX_WRONG_GUESSES }, (_, index) => (
                  <i className={index < MAX_WRONG_GUESSES - game.wrongGuesses ? "active" : ""} key={index} />
                ))}
              </span>
            </div>
          </div>

          <div className="puzzle-grid" role="group" aria-label="Nine puzzle tiles">
            {game.tiles.map((tileId, index) => {
              const tile = puzzle.tiles[tileId];
              const locked = isLocked(index);
              return (
                <button
                  type="button"
                  className={[
                    "tile",
                    selected === index ? "selected" : "",
                    locked ? "locked" : "",
                    isHighlighted(index) ? "line-highlight" : ""
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={index}
                  onClick={() => handleTileClick(index)}
                  disabled={locked || game.isComplete}
                  aria-pressed={selected === index}
                  aria-label={`${tile.label}${locked ? ", connection solved and locked" : ""}${selected === index ? ", selected" : ""}`}
                >
                  <span>{tile.label}</span>
                  {locked && <span className="lock-mark" aria-label="Locked">✓</span>}
                </button>
              );
            })}
          </div>

          <div className="board-actions">
            <p className="game-feedback" aria-live="polite">{feedback}</p>
            <button
              type="button"
              className="connect-button"
              onClick={handleConnect}
              disabled={game.isComplete}
            >
              {game.isWon ? "Puzzle complete" : game.isComplete ? "Game over" : "Connect"}
              <span aria-hidden="true">↗</span>
            </button>
            {game.isComplete && (
              <button type="button" className="restart-button" onClick={startPracticeGame}>
                Play again
              </button>
            )}
            {(!game.hasStarted || game.isComplete) && (
              <nav className="puzzle-navigation" aria-label="Puzzle navigation">
                <button
                  type="button"
                  onClick={() => previousPuzzle && startPuzzle(previousPuzzle)}
                  disabled={!previousPuzzle}
                >
                  <span aria-hidden="true">←</span> Previous puzzle
                </button>
                <button
                  type="button"
                  onClick={() => nextPuzzle && startPuzzle(nextPuzzle)}
                  disabled={!nextPuzzle}
                >
                  Next puzzle <span aria-hidden="true">→</span>
                </button>
              </nav>
            )}
          </div>
          {player.error && <p className="storage-warning" role="alert">{player.error}</p>}
        </section>

        <aside className="connections-card" aria-labelledby="connections-title">
          <p className="eyebrow">THE BIG REVEAL</p>
          <h2 id="connections-title">Connections</h2>
          <p className="connections-hint">Solved lines show their connection here. Hover or focus to find them on the grid.</p>
          {discovered.length === 0 ? (
            <div className="empty-connections">
              <span className="empty-icon" aria-hidden="true">↗</span>
              <p>Your first connection is waiting to be found.</p>
            </div>
          ) : (
            <ul className="connection-list">
              {discovered.map((category) => {
                const lineKind = game.solvedRows.some((line) => line.categoryId === category.id)
                  ? "row"
                  : "column";
                return (
                  <li key={category.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setHighlighted(category)}
                      onMouseLeave={() => setHighlighted(null)}
                      onFocus={() => setHighlighted(category)}
                      onBlur={() => setHighlighted(null)}
                      aria-label={`${lineKind === "row" ? "Row" : "Column"} connection: ${category.label}: ${category.members
                        .map((tileId) => puzzle.tiles[tileId].label)
                        .join(", ")}`}
                    >
                      <span className="connection-check" aria-hidden="true">✓</span>
                      <span className="connection-copy">
                        <strong>{category.label}</strong>
                        <small>{lineKind.toUpperCase()}</small>
                        <span className="connection-members">
                          {category.members.map((tileId) => puzzle.tiles[tileId].label).join(" · ")}
                        </span>
                      </span>
                      <span className="connection-arrow" aria-hidden="true">↗</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {discovered.length > 0 && (
            <p className="locked-note">
              {discovered.length} of 6 connections found <span aria-hidden="true">·</span> solved tiles are locked
            </p>
          )}
        </aside>
      </div>

      <p className="how-to-play">
        <span aria-hidden="true">✳</span> Tap one tile, then another to swap them. Solved rows and columns are locked.
      </p>
    </section>
  );
}
