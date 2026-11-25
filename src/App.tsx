import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import InstallButton from "./InstallButton";
import AboutPage from "./pages/AboutPage";
import GamePage from "./pages/GamePage";
import SharePage from "./pages/SharePage";
import StatsPage from "./pages/StatsPage";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="app-shell">
        <header className="site-header">
          <Link className="wordmark" to="/" aria-label="Double Cross Connect home">
            <span className="wordmark-mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            <span>Double Cross <em>Connect</em></span>
          </Link>
          <nav aria-label="Main navigation">
            <Link to="/">Play</Link>
            <Link to="/stats">Stats</Link>
            <Link to="/share">Share</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        <InstallButton />
        <main>
          <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/share" element={<SharePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<GamePage />} />
          </Routes>
        </main>
        <footer className="site-footer">
          <span>A little word puzzle for curious minds.</span>
          <Link to="/about">How to play</Link>
        </footer>
      </div>
    </BrowserRouter>
  );
}
