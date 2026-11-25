import { summarizePlayerData } from "../player";
import { usePlayerProfile } from "../usePlayerProfile";

export default function StatsPage() {
  const { data, error } = usePlayerProfile();
  const summary = summarizePlayerData(data);
  const results = [...data.results].sort((a, b) => a.puzzleNumber - b.puzzleNumber);

  return (
    <section className="stats-page" aria-labelledby="stats-title">
      <header className="stats-heading">
        <p className="eyebrow">YOUR LOCAL SCORECARD</p>
        <h1 id="stats-title">Player <span>stats</span></h1>
        <p>Progress is stored in this browser and is not shared with anyone.</p>
      </header>

      {error && <p className="storage-warning" role="alert">{error}</p>}

      <div className="stats-summary" aria-label="Puzzle results summary">
        <div><strong>{summary.wins}</strong><span>Wins</span></div>
        <div><strong>{summary.losses}</strong><span>Losses</span></div>
        <div><strong>{data.results.length}</strong><span>Puzzles played</span></div>
      </div>

      <section className="stats-card" aria-labelledby="guess-count-title">
        <p className="eyebrow">SOLVED PUZZLES</p>
        <h2 id="guess-count-title">Wins by guesses</h2>
        <ul className="guess-count-list">
          {summary.winsByGuessCount.map(({ guesses, count }) => (
            <li key={guesses}>
              <span>{guesses} {guesses === 1 ? "guess" : "guesses"}</span>
              <strong>{count}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="stats-card played-card" aria-labelledby="played-title">
        <p className="eyebrow">HISTORY</p>
        <h2 id="played-title">Puzzles played</h2>
        {results.length === 0 ? (
          <p className="stats-empty">Your completed puzzles will show up here.</p>
        ) : (
          <div className="stats-table-wrap">
            <table className="stats-table">
              <thead>
                <tr>
                  <th scope="col">Puzzle</th>
                  <th scope="col">Result</th>
                  <th scope="col">Guesses</th>
                  <th scope="col">Completed</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.puzzleId}>
                    <th scope="row">#{result.puzzleNumber} by {result.author}</th>
                    <td className={result.outcome}>{result.outcome === "won" ? "Won" : "Lost"}</td>
                    <td>{result.guesses}</td>
                    <td>{new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(result.completedAt))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}
