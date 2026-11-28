# Double Cross Connect

A 3×3 word puzzle PWA. Swap tiles so every row and column matches a category; any category can appear horizontally or vertically, and every accepted line must keep a full six-connection solution possible. Solved lines lock into place. The About page includes a QR code for sharing the game.

Puzzles have stable IDs, sequence numbers, and author credits. The game starts with the oldest puzzle without a recorded result, or the latest puzzle if all have been played. Wins, losses, and guesses are stored in browser local storage and shown on the Stats page. Replays of completed puzzles are practice games and do not change stats.

On supported browsers, an **Install app** button appears when the browser offers installation. On iPhone or iPad, use Safari's Share menu and choose **Add to Home Screen**.

New players see a looping example puzzle on their first visit. Dismiss it with **Play** or the close button, or revisit it from the About page. The example is not a playable puzzle and runs separately from the player's game, statistics and analytics. Browsers requesting reduced motion see a static explanation instead.

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

## Usage analytics

Set `VITE_POSTHOG_PROJECT_TOKEN` in `.env.local` for local builds, and set the
GitHub Actions secret `POSTHOG_PROJECT_TOKEN` for Pages builds. The project token
is a public, write-only token and is included in the built client; never use a
PostHog personal API key here. Without a token, analytics are disabled.
PostHog may accept a capture request before validating its token, so verify the
configuration by checking that real game events appear in the intended project.

The app sends `game_started` on the first swap or Connect submission and
`game_finished` when an attempt ends. Both include `puzzle_id`, `puzzle_number`
and `is_practice`; finished events also include `outcome` and `guesses` (the
number of Connect submissions). Each attempt has a random ID, not a persistent
player ID. No pageviews, clicks, session recordings, names or emails are captured.
PostHog receives the connecting IP address; location enrichment and person
profiles are disabled on these events. Do Not Track disables sending.

Events awaiting delivery are saved in local storage and retried on startup,
reconnection and periodically while the app is open. If storage is unavailable or
cleared, those events can be lost. Retries reuse their event UUID and timestamp;
PostHog's deduplication is eventual, so transient duplicates can appear. Device
clock errors can affect event timestamps.

In PostHog, use `game_started` for games played and break down by `puzzle_id` or
`puzzle_number`. Use `game_finished` with the `guesses` property for average,
minimum and maximum guesses, and filter `outcome` and `is_practice` as desired.
Choose the date range on each insight. Starts without finishes represent
unfinished attempts, subject to delivery and browser storage limitations.
