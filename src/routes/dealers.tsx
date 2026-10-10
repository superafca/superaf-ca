import { pageHead } from "@/lib/seo";
import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CyberFrame } from "@/components/cyber";
import { WarrantyForm } from "@/components/warranty-form";

const GATE_KEY = "superaf-dealers";
const DEALER_NAME_KEY = "superaf-dealer-name";
const PASSWORD = "ilovehardpp10!";

export const Route = createFileRoute("/dealers")({
  component: Dealers,
  head: () => pageHead("/dealers",
    "Dealers — HARD PP warranty | SUPERAF.CA",
    "Authorized dealer warranty registration for HARD PP.",
  ),
});

function Dealers() {
  const [unlocked, setUnlocked] = useState(false);
  const [dealerName, setDealerName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem(GATE_KEY) === "1") {
      setDealerName(sessionStorage.getItem(DEALER_NAME_KEY) ?? "");
      setUnlocked(true);
    }
  }, []);

  function unlock(e: FormEvent) {
    e.preventDefault();
    const name = dealerName.trim();
    if (!name) {
      setError("Dealership name is required.");
      return;
    }
    if (password !== PASSWORD) {
      setError("Wrong password.");
      return;
    }
    sessionStorage.setItem(DEALER_NAME_KEY, name);
    sessionStorage.setItem(GATE_KEY, "1");
    setDealerName(name);
    setUnlocked(true);
  }

  return (
    <CyberFrame kicker="Authorized registry" title="Dealers">
      {unlocked ? (
        <WarrantyForm dealershipName={dealerName} />
      ) : (
        <form className="cyber-gate" onSubmit={unlock}>
          <p>Dealer warranty registration. Password required.</p>
          <label>
            Dealership name
            <input
              type="text"
              value={dealerName}
              required
              autoComplete="organization"
              onChange={(e) => {
                setDealerName(e.target.value);
                setError("");
              }}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              required
              autoComplete="current-password"
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
          </label>
          {error ? <p className="cyber-error">{error}</p> : null}
          <button type="submit">Enter</button>
        </form>
      )}
    </CyberFrame>
  );
}
