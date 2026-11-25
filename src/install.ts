// Copyright (c) 2026 Andy Yates. All rights reserved.
export interface InstallPromptEvent extends Event {
  prompt(): Promise<void>;
}

function isInstallPromptEvent(event: Event): event is InstallPromptEvent {
  return "prompt" in event && typeof event.prompt === "function";
}

export function observeInstallPrompt(
  target: EventTarget,
  onChange: (prompt: InstallPromptEvent | null) => void
): () => void {
  const onPrompt = (event: Event) => {
    if (!isInstallPromptEvent(event)) return;
    event.preventDefault();
    onChange(event);
  };
  const onInstalled = () => onChange(null);

  target.addEventListener("beforeinstallprompt", onPrompt);
  target.addEventListener("appinstalled", onInstalled);
  return () => {
    target.removeEventListener("beforeinstallprompt", onPrompt);
    target.removeEventListener("appinstalled", onInstalled);
  };
}
