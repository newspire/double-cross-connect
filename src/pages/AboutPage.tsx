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
          <li><span>01</span><p>Look for any connection in a row or column; connections can run either way.</p></li>
          <li><span>02</span><p>Tap one tile, then another to swap their places.</p></li>
          <li><span>03</span><p>Press <strong>Connect</strong> when a full line fits a connection and keeps all six connections possible.</p></li>
          <li><span>04</span><p>Find all six connections. You get three guesses that solve nothing.</p></li>
          <li><span>05</span><p>Track results on the Stats page. Replay a finished puzzle as practice without changing your stats.</p></li>
        </ol>
        <Link className="connect-button about-play-button" to="/">
          Let's play <span aria-hidden="true">↗</span>
        </Link>
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
