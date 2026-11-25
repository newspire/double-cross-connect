// Copyright (c) 2026 Andy Yates. All rights reserved.
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAnalytics, createGameTracker } from "./analytics";
import { createGame, submitGuess, swapTiles } from "./game";
import { PUZZLES } from "./puzzles";

function memoryStorage(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => { values.delete(key); },
    setItem: (key, value) => { values.set(key, value); }
  };
}

afterEach(() => vi.restoreAllMocks());

describe("game analytics", () => {
  it("tracks the first swap and a completed practice loss once per attempt", () => {
    const capture = vi.fn();
    const tracker = createGameTracker(PUZZLES[0].id, PUZZLES[0].number, true, capture, () => "attempt");
    const initial = createGame(PUZZLES[0]);
    const started = swapTiles(initial, 0, 1);
    tracker(initial, started);
    tracker(initial, started);
    const finished = { ...started, guesses: 4, isComplete: true, isWon: false };
    tracker(started, finished);
    tracker(started, finished);

    expect(capture).toHaveBeenCalledTimes(2);
    expect(capture).toHaveBeenNthCalledWith(1, "game_started", "attempt", expect.objectContaining({
      puzzle_id: PUZZLES[0].id, puzzle_number: PUZZLES[0].number, is_practice: true
    }));
    expect(capture).toHaveBeenNthCalledWith(2, "game_finished", "attempt", expect.objectContaining({
      is_practice: true, guesses: 4, outcome: "lost"
    }));
  });

  it("tracks a first Connect submission and a win with its total submissions", () => {
    const capture = vi.fn();
    const tracker = createGameTracker(PUZZLES[0].id, 1, false, capture, () => "attempt");
    const initial = createGame(PUZZLES[0]);
    const first = submitGuess(initial, PUZZLES[0]);
    tracker(initial, first);
    tracker(first, { ...first, guesses: 3, isComplete: true, isWon: true });

    expect(capture).toHaveBeenCalledTimes(2);
    expect(capture).toHaveBeenLastCalledWith("game_finished", "attempt", expect.objectContaining({
      is_practice: false, guesses: 3, outcome: "won"
    }));
  });

  it("queues failed events and retries the same UUID and original timestamp", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    const storage = memoryStorage();
    const send = vi.fn<typeof fetch>()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce(new Response("", { status: 200 }));
    const options = {
      token: "test-token", storage, send, newId: () => "event-id",
      now: () => new Date("2026-01-02T03:04:05.000Z")
    };
    const analytics = createAnalytics(options);
    const tracker = createGameTracker("puzzle", 1, false, analytics.capture, () => "attempt");
    const initial = createGame(PUZZLES[0]);
    tracker(initial, swapTiles(initial, 0, 1));
    await vi.waitFor(() => expect(warning).toHaveBeenCalled());
    expect(storage.length).toBe(1);

    createAnalytics(options).flush();
    await vi.waitFor(() => expect(storage.length).toBe(0));
    const first = JSON.parse(String(send.mock.calls[0][1]?.body));
    const retry = JSON.parse(String(send.mock.calls[1][1]?.body));
    expect(retry).toEqual(first);
    expect(retry).toMatchObject({
      uuid: "event-id", distinct_id: "attempt", timestamp: "2026-01-02T03:04:05.000Z",
      properties: { $process_person_profile: false, $geoip_disable: true }
    });
  });

  it("does not resend an event already being delivered in the same tab", async () => {
    const storage = memoryStorage();
    let resolveSend!: (response: Response) => void;
    const send = vi.fn<typeof fetch>().mockImplementation(() => new Promise((resolve) => { resolveSend = resolve; }));
    const analytics = createAnalytics({
      token: "test-token", storage, send, newId: () => "event-id", now: () => new Date()
    });
    const tracker = createGameTracker("puzzle", 1, false, analytics.capture, () => "attempt");
    const initial = createGame(PUZZLES[0]);
    tracker(initial, swapTiles(initial, 0, 1));
    analytics.flush();
    expect(send).toHaveBeenCalledTimes(1);
    resolveSend(new Response("", { status: 200 }));
    await vi.waitFor(() => expect(storage.length).toBe(0));
  });

  it("does not capture without configuration or break gameplay when storage fails", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    const storage = memoryStorage();
    const send = vi.fn<typeof fetch>();
    const options = { storage, send, newId: () => "event", now: () => new Date() };
    const noToken = createAnalytics({ ...options, token: "" });
    const tracker = createGameTracker("puzzle", 1, false, noToken.capture, () => "attempt");
    const initial = createGame(PUZZLES[0]);
    tracker(initial, swapTiles(initial, 0, 1));
    expect(storage.length).toBe(0);
    expect(send).not.toHaveBeenCalled();

    vi.spyOn(storage, "setItem").mockImplementation(() => { throw new Error("storage unavailable"); });
    const enabled = createAnalytics({ ...options, token: "test-token" });
    const enabledTracker = createGameTracker("puzzle", 1, false, enabled.capture, () => "attempt");
    expect(() => enabledTracker(initial, swapTiles(initial, 0, 1))).not.toThrow();
    expect(warning).toHaveBeenCalled();
  });
});
