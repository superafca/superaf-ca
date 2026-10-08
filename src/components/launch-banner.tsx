import { useEffect, useState } from "react";
import { launchBanner, launchVisible } from "@/lib/launch";

function Leaf() {
  return (
    <svg className="launch-leaf" viewBox="0 0 16 16" aria-hidden>
      <path d="M8 1.2 9.1 5.2 13.2 4.4 10.2 7.2 14 9.1 9.4 9.2 10.3 14 8 10.4 5.7 14 6.6 9.2 2 9.1 5.8 7.2 2.8 4.4 6.9 5.2Z" />
    </svg>
  );
}

export function LaunchBanner() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem("superaf-launch-dismissed") === "1";
    const on = launchVisible(new Date(), dismissed);
    setShow(on);
    document.documentElement.setAttribute("data-launch", on ? "on" : "off");
  }, []);

  if (!show) return null;

  return (
    <div className="launch-banner">
      <p>
        <Leaf />
        <span>
          <strong>NEW WEBSITE // NOW LIVE</strong> — Our new website just launched. Celebrate with us!
        </span>
      </p>
      <p className="launch-sub">Same shop since 2016.</p>
      {launchBanner.offer ? (
        <a href={launchBanner.offer.href}>{launchBanner.offer.text}</a>
      ) : null}
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => {
          localStorage.setItem("superaf-launch-dismissed", "1");
          document.documentElement.setAttribute("data-launch", "off");
          setShow(false);
        }}
      >
        ×
      </button>
    </div>
  );
}
