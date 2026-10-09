import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "day" | "night";

function paintThemeColor(next: Theme) {
  const color = next === "night" ? "#07122B" : "#0B1F4B";
  const metas = document.querySelectorAll('meta[name="theme-color"]');
  if (!metas.length) {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    meta.setAttribute("content", color);
    document.head.appendChild(meta);
    return;
  }
  metas.forEach((meta) => {
    meta.setAttribute("content", color);
    meta.removeAttribute("media");
  });
}

function applyTheme(next: Theme, persist: boolean) {
  const root = document.documentElement;
  root.setAttribute("data-theme", next);
  root.style.colorScheme = next === "night" ? "dark" : "light";
  paintThemeColor(next);
  if (persist) localStorage.setItem("superaf-theme", next);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme") === "night" ? "night" : "day";
    setTheme(current);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      const stored = localStorage.getItem("superaf-theme");
      if (stored === "day" || stored === "night") return;
      const next = media.matches ? "night" : "day";
      applyTheme(next, false);
      setTheme(next);
    };
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  }, []);

  const night = theme === "night";
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={night ? "Switch to day mode" : "Switch to night mode"}
      aria-pressed={night}
      onClick={() => {
        const next = night ? "day" : "night";
        applyTheme(next, true);
        setTheme(next);
      }}
    >
      {night ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
    </button>
  );
}
