// Copyright (c) 2026 Andy Yates. All rights reserved.
import { useEffect, useRef, useState } from "react";
import { isPositionLocked } from "./game";
import { DEMO_FRAMES, DEMO_PUZZLE } from "./demo";

interface DemoDialogProps {
  onClose: () => void;
  onPlay: () => void;
}

export default function DemoDialog({ onClose, onPlay }: DemoDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement;
    element?.showModal();
    return () => {
      element?.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const delay = frameIndex === DEMO_FRAMES.length - 1 ? 3500 : 1600;
    const timer = window.setTimeout(() => setFrameIndex((current) => (current + 1) % DEMO_FRAMES.length), delay);
    return () => window.clearTimeout(timer);
  }, [frameIndex, reducedMotion]);

  const frame = DEMO_FRAMES[reducedMotion ? DEMO_FRAMES.length - 1 : frameIndex];
  const solvedIds = new Set([...frame.game.solvedRows, ...frame.game.solvedColumns].map((line) => line.categoryId));

  return (
    <dialog
      ref={dialog}
      className="demo-dialog"
      aria-labelledby="demo-title"
      aria-describedby="demo-description"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
    >
      <button className="demo-close" type="button" onClick={onClose} aria-label="Close demo">×</button>
      <p className="eyebrow">A QUICK EXAMPLE · DEMO PUZZLE</p>
      <h2 id="demo-title">See how it works.</h2>
      <p id="demo-description" className="demo-intro">
        Swap tiles, then press Connect. Each tile belongs to a row and a column.
      </p>
      <div className="demo-grid" aria-label="Example puzzle board">
        {Object.values(DEMO_PUZZLE.tiles).map((tile) => {
          const index = frame.game.tiles.indexOf(tile.id);
          const locked = isPositionLocked(frame.game, index);
          return (
            <div
              key={tile.id}
              className={`demo-tile${frame.selected === index ? " selected" : ""}${locked ? " locked" : ""}`}
              style={{ left: `calc(${index % 3} * (100% + 6px) / 3)`, top: `calc(${Math.floor(index / 3)} * (100% + 6px) / 3)` }}
            >
              {tile.label}
              {locked && <span className="lock-mark" aria-label="Locked">✓</span>}
            </div>
          );
        })}
      </div>
      <div className="demo-feedback">
        <p>{reducedMotion ? "Swap two tiles and press Connect. Solved lines lock in place." : frame.message}</p>
        <span className={`demo-connect${frame.connect ? " active" : ""}`} aria-hidden="true">Connect ↗</span>
      </div>
      <div className="demo-connections">
        <strong>Connections</strong>
        {solvedIds.size === 0 ? (
          <span>Found connections appear here.</span>
        ) : (
          <span>{DEMO_PUZZLE.categories.filter((category) => solvedIds.has(category.id)).map((category) => category.label).join(" · ")}</span>
        )}
      </div>
      <button type="button" className="connect-button demo-play" onClick={onPlay}>
        Play <span aria-hidden="true">↗</span>
      </button>
    </dialog>
  );
}
