import { useEffect, useRef, useState } from "react";

export type LiveStatItem = {
  value: string;
  label: string;
  text: string;
};

function digitsOf(value: string) {
  return value.replace(/\D/g, "").length;
}

function targetOf(value: string) {
  return Number(value.replace(/\D/g, "")) || 0;
}

function roll(n: number, digits: number) {
  return String(n).padStart(digits, "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function LiveStat({ item, delay }: { item: LiveStatItem; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const digits = digitsOf(item.value);
  const target = targetOf(item.value);
  const [num, setNum] = useState(item.value);
  const [typed, setTyped] = useState(item.label);
  const [caret, setCaret] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const node = ref.current;
    if (!node) return;
    let dead = false;
    const timers: number[] = [];
    const later = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(() => {
        if (!dead) fn();
      }, ms));
    };
    const typeLabel = () => {
      let i = 0;
      const step = () => {
        if (dead) return;
        i += 1;
        setTyped(item.label.slice(0, i));
        if (i < item.label.length) later(26, step);
        else later(3000, () => setCaret(false));
      };
      step();
    };
    const start = () => {
      const t0 = performance.now();
      setTyped("");
      setCaret(true);
      const tick = (now: number) => {
        if (dead) return;
        const t = Math.min(1, (now - t0) / 1200);
        const eased = 1 - (1 - t) ** 3;
        setNum(t >= 1 ? item.value : roll(Math.round(eased * target), digits));
        if (t < 1) requestAnimationFrame(tick);
        else typeLabel();
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        later(delay, start);
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    return () => {
      dead = true;
      io.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [delay, digits, item.label, item.value, target]);

  return (
    <div className="live-stat" ref={ref}>
      <p className="live-stat-truth">{item.text}</p>
      <div aria-hidden="true">
        <span className="live-stat-num">{num}</span>
        <span className="live-stat-label">
          {typed}
          {caret ? <span className="scan-caret">▌</span> : null}
        </span>
      </div>
    </div>
  );
}

export function LiveStats({ items }: { items: readonly LiveStatItem[] }) {
  return (
    <div className="live-stats">
      {items.map((item, i) => (
        <LiveStat key={item.text} item={item} delay={i * 200} />
      ))}
    </div>
  );
}
