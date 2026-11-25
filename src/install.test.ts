import { describe, expect, it, vi } from "vitest";
import { observeInstallPrompt } from "./install";

describe("install prompt", () => {
  it("captures the browser prompt and clears it after installation", () => {
    const target = new EventTarget();
    const onChange = vi.fn();
    const cleanup = observeInstallPrompt(target, onChange);
    const prompt = Object.assign(new Event("beforeinstallprompt", { cancelable: true }), {
      prompt: vi.fn()
    });

    target.dispatchEvent(prompt);
    expect(prompt.defaultPrevented).toBe(true);
    expect(onChange).toHaveBeenLastCalledWith(prompt);
    target.dispatchEvent(new Event("appinstalled"));
    expect(onChange).toHaveBeenLastCalledWith(null);

    cleanup();
    onChange.mockClear();
    target.dispatchEvent(prompt);
    target.dispatchEvent(new Event("appinstalled"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("ignores events that cannot prompt for installation", () => {
    const target = new EventTarget();
    const onChange = vi.fn();
    const cleanup = observeInstallPrompt(target, onChange);
    const event = new Event("beforeinstallprompt", { cancelable: true });

    target.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
    cleanup();
  });
});
