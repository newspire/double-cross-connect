// Copyright (c) 2026 Andy Yates. All rights reserved.
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <section className="about-page" aria-labelledby="about-title">
      <div className="about-copy">
        <p className="eyebrow">A GAME ABOUT THE SPACE BETWEEN</p>
        <h1 id="about-title">Two ways to see <span>everything.</span></h1>
        <p className="about-lead">
          Double Cross Connect is a tiny word puzzle with a little twist: every tile belongs to two groups at once.
        </p>
        <div className="about-rule" />
        <h2>How to play</h2>
        <ol className="how-to-steps">
          <li><span>01</span><p>Look for words you think have a connection. Arrange them in a row or column.</p></li>
          <li><span>02</span><p>Tap one tile, then another to swap their places.</p></li>
          <li><span>03</span><p>Press <strong>Connect</strong> when you think a full row or column contains a connection.</p></li>
          <li><span>04</span><p>Find all six connections. Your third guess with no connection ends the game.</p></li>
          <li><span>05</span><p>Track results on the Stats page. Replay a finished puzzle as practice without changing your stats.</p></li>
        </ol>
        <Link className="connect-button about-play-button" to="/">
          Let's play <span aria-hidden="true">↗</span>
        </Link>
        <section className="about-privacy" aria-labelledby="privacy-title">
          <h2 id="privacy-title">Privacy</h2>
          <p>
            This game collects and sends basic statistics, including the results and guess count for each puzzle.
            No names or email addresses are sent. PostHog receives your IP address, and a random ID is used
            for each game. The game respects your browser's Do Not Track setting. Events played offline may be
            stored on your device until they can be sent.
          </p>
        </section>
        <div className="about-credits">
          <dl>
            <div><dt>Created by</dt><dd>Andy Yates</dd></div>
            <div><dt>Contact</dt><dd><a href="mailto:newspire@gmail.com">newspire@gmail.com</a></dd></div>
          </dl>
          <p>&copy; 2026 Andy Yates. All rights reserved.</p>
          <p>Version 0.1.0</p>
        </div>
      </div>
    </section>
  );
}
