// Copyright (c) 2026 Andy Yates. All rights reserved.
import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function SharePage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrError, setQrError] = useState(false);
  const gameUrl = new URL(import.meta.env.BASE_URL, window.location.origin).toString();

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(gameUrl, {
      width: 240,
      margin: 1,
      color: { dark: "#17394a", light: "#fffdf8" }
    }).then(
      (dataUrl) => {
        if (isMounted) setQrCode(dataUrl);
      },
      (error: Error) => {
        console.error("Could not create the game sharing QR code.", error);
        if (isMounted) setQrError(true);
      }
    );
    return () => {
      isMounted = false;
    };
  }, [gameUrl]);

  return (
    <section className="share-page">
      <aside className="share-card" aria-labelledby="share-title">
        <div className="share-card-top">
          <p className="eyebrow">PASS IT ON</p>
          <span className="share-sparkle" aria-hidden="true">✳</span>
        </div>
        <h2 id="share-title">A good puzzle is better shared.</h2>
        <p>Scan the code to open Double Cross Connect and play together.</p>
        <div className="qr-frame">
          {qrCode ? (
            <img src={qrCode} alt={`QR code linking to ${gameUrl}`} width="240" height="240" />
          ) : qrError ? (
            <p className="qr-error" role="status">The share code couldn't be created. You can still share this link:</p>
          ) : (
            <span className="qr-loading" role="status">Making your code…</span>
          )}
        </div>
        <a className="share-url" href={gameUrl}>{gameUrl}</a>
      </aside>
    </section>
  );
}
