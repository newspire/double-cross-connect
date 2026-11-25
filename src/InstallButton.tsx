import { useEffect, useState } from "react";
import { observeInstallPrompt, type InstallPromptEvent } from "./install";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => observeInstallPrompt(window, (prompt) => {
    if (prompt && window.matchMedia("(display-mode: standalone)").matches) return;
    setInstallPrompt(prompt);
    setError(false);
  }), []);

  const install = async () => {
    if (!installPrompt) return;
    setInstallPrompt(null);
    try {
      await installPrompt.prompt();
    } catch (reason) {
      console.error("Could not open the installation prompt.", reason);
      setError(true);
    }
  };

  if (!installPrompt && !error) return null;
  return (
    <div className="install-area">
      {installPrompt && (
        <button type="button" className="install-button" onClick={() => void install()}>
          Install app
        </button>
      )}
      {error && <p role="alert">Could not open the install prompt. Try your browser's install menu.</p>}
    </div>
  );
}
