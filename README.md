# Double Cross Connect

A 3×3 word puzzle PWA. Swap tiles so every row and column matches a category; any category can appear horizontally or vertically, and every accepted line must keep a full six-connection solution possible. Solved lines lock into place. The About page includes a QR code for sharing the game.

Puzzles have stable IDs, sequence numbers, and author credits. The game starts with the oldest puzzle without a recorded result. Wins, losses, and guesses are stored in browser local storage and shown on the Stats page. Replays of completed puzzles are practice games and do not change stats.

## Run locally

```sh
npm install
npm run dev
```

## Checks

```sh
npm test
npm run build
```

## GitHub Pages

The site is deployed from GitHub Actions at https://newspire.github.io/double-cross-connect/. The workflow runs on pushes to `main` and `newspire-double-cross-connect`.
