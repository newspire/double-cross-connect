// Copyright (c) 2026 Andy Yates. All rights reserved.
import type { GameState } from "./game";

const QUEUE_PREFIX = "double-cross-connect:analytics:";
const CAPTURE_URL = "https://us.i.posthog.com/i/v0/e/";

type EventName = "game_started" | "game_finished";

interface GameProperties {
  puzzle_id: string;
  puzzle_number: number;
  is_practice: boolean;
  guesses?: number;
  outcome?: "won" | "lost";
  $process_person_profile: false;
  $geoip_disable: true;
}

interface GameEvent {
  uuid: string;
  event: EventName;
  distinct_id: string;
  timestamp: string;
  properties: GameProperties;
}

interface AnalyticsOptions {
  token: string;
  storage: Storage;
  send: typeof fetch;
  newId: () => string;
  now: () => Date;
}

export function createAnalytics(options: AnalyticsOptions) {
  const inFlight = new Set<string>();

  async function deliver(key: string, event: GameEvent) {
    if (inFlight.has(key)) return;
    inFlight.add(key);
    try {
      const response = await options.send(CAPTURE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: options.token, ...event }),
        keepalive: true
      });
      if (!response.ok) throw new Error(`PostHog returned HTTP ${response.status}`);
      options.storage.removeItem(key);
    } catch (error) {
      console.warn("Could not send game analytics; will retry later.", error);
    } finally {
      inFlight.delete(key);
    }
  }

  function flush() {
    if (!options.token) return;
    try {
      for (let index = 0; index < options.storage.length; index += 1) {
        const key = options.storage.key(index);
        if (!key?.startsWith(QUEUE_PREFIX)) continue;
        const value = options.storage.getItem(key);
        if (!value) continue;
        try {
          const event: GameEvent = JSON.parse(value);
          void deliver(key, event);
        } catch (error) {
          console.warn("Could not read a queued game analytics event.", error);
        }
      }
    } catch (error) {
      console.warn("Could not access queued game analytics.", error);
    }
  }

  function capture(event: EventName, distinctId: string, properties: GameProperties) {
    if (!options.token) return;
    try {
      const entry: GameEvent = {
        uuid: options.newId(),
        event,
        distinct_id: distinctId,
        timestamp: options.now().toISOString(),
        properties
      };
      const key = QUEUE_PREFIX + entry.uuid;
      options.storage.setItem(key, JSON.stringify(entry));
      void deliver(key, entry);
    } catch (error) {
      console.warn("Could not queue game analytics.", error);
    }
  }

  return { capture, flush };
}

export function createGameTracker(
  puzzleId: string,
  puzzleNumber: number,
  isPractice: boolean,
  capture: ReturnType<typeof createAnalytics>["capture"],
  newId: () => string
) {
  let attemptId: string | undefined;
  let finished = false;
  const properties: GameProperties = {
    puzzle_id: puzzleId,
    puzzle_number: puzzleNumber,
    is_practice: isPractice,
    $process_person_profile: false,
    $geoip_disable: true
  };
  return (previous: GameState, next: GameState) => {
    try {
      if (!attemptId && !previous.hasStarted && next.hasStarted) {
        attemptId = newId();
        capture("game_started", attemptId, properties);
      }
      if (attemptId && !finished && !previous.isComplete && next.isComplete) {
        finished = true;
        capture("game_finished", attemptId, {
          ...properties,
          guesses: next.guesses,
          outcome: next.isWon ? "won" : "lost"
        });
      }
    } catch (error) {
      console.warn("Could not record game analytics.", error);
    }
  };
}

let analytics: ReturnType<typeof createAnalytics> | undefined;

export function initializeAnalytics() {
  const token = import.meta.env.VITE_POSTHOG_PROJECT_TOKEN;
  if (!token || navigator.doNotTrack === "1") return;
  try {
    analytics = createAnalytics({
      token,
      storage: window.localStorage,
      send: window.fetch.bind(window),
      newId: () => crypto.randomUUID(),
      now: () => new Date()
    });
    analytics.flush();
    window.addEventListener("online", analytics.flush);
    window.setInterval(analytics.flush, 30_000);
  } catch (error) {
    console.warn("Could not initialize game analytics.", error);
  }
}

export function trackGame(puzzleId: string, puzzleNumber: number, isPractice: boolean) {
  if (!analytics) return () => {};
  return createGameTracker(puzzleId, puzzleNumber, isPractice, analytics.capture, () => crypto.randomUUID());
}
