import { useState } from "react";
import {
  CATEGORIES,
  createGame,
  isPositionLocked,
  MAX_WRONG_GUESSES,
  GRID_SIZE,
  submitGuess,
  swapTiles,
  TILES,
  type Category,
  type GameState
} from "../game";

export default function GamePage() {
  const [game, setGame] = useState<GameState>(createGame);
  const [selected, setSelected] = useState<number | null>(null);
  const [highlighted, setHighlighted] = useState<Category | null>(null);
  const [feedback, setFeedback] = useState("Find the hidden connections. Every row and column has one.");

  const startNewGame = () => {
    setGame(createGame());
    setSelected(null);
    setHighlighted(null);
    setFeedback("Find the hidden connections. Every row and column has one.");
  };

  const isLocked = (index: number) => isPositionLocked(game, index);
  const isHighlighted = (index: number) => {
    if (!highlighted) return false;
    const solvedLine =
      highlighted.kind === "row"
        ? game.solvedRows.find((line) => line.categoryId === highlighted.id)
        : game.solvedColumns.find((line) => line.categoryId === highlighted.id);
    if (!solvedLine) return false;
    return highlighted.kind === "row"
      ? Math.floor(index / GRID_SIZE) === solvedLine.index
      : index % GRID_SIZE === solvedLine.index;
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
    const next = submitGuess(game);
    setGame(next);
    setSelected(null);
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
  const discovered = CATEGORIES.filter((category) => solvedCategoryIds.has(category.id));

  return (
    <section className="game-page" aria-labelledby="game-title">
      <div className="game-intro">
        <p className="eyebrow">TODAY'S LITTLE BRAIN TEASER</p>
        <h1 id="game-title">Double Cross <span>Connect</span></h1>
        <p className="intro-copy">
          Every word belongs to two connections. Any correct row or column counts, even if the rest is still mixed up.
        </p>
      </div>

      <div className="puzzle-layout">
        <section className="board-card" aria-label="Puzzle board">
          <div className="board-heading">
            <div>
              <p className="eyebrow">ONE GRID. SIX CONNECTIONS.</p>
              <h2>Make it click.</h2>
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
              const tile = TILES[tileId];
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
              <button type="button" className="restart-button" onClick={startNewGame}>
                Play again
              </button>
            )}
          </div>
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
              {discovered.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setHighlighted(category)}
                    onMouseLeave={() => setHighlighted(null)}
                    onFocus={() => setHighlighted(category)}
                    onBlur={() => setHighlighted(null)}
                    aria-label={`${category.kind === "row" ? "Row" : "Column"} connection: ${category.label}: ${category.members
                      .map((tileId) => TILES[tileId].label)
                      .join(", ")}`}
                  >
                    <span className="connection-check" aria-hidden="true">✓</span>
                    <span className="connection-copy">
                      <strong>{category.label}</strong>
                      <small>{category.kind === "row" ? "ROW" : "COLUMN"}</small>
                      <span className="connection-members">
                        {category.members.map((tileId) => TILES[tileId].label).join(" · ")}
                      </span>
                    </span>
                    <span className="connection-arrow" aria-hidden="true">↗</span>
                  </button>
                </li>
              ))}
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
