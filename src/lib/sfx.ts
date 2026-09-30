/** 8-bit Melee-ish board. Pulse + triangle + noise. Unlock on first tap. Never autoplay. */

let ctx: AudioContext | null = null;
let p12: PeriodicWave | null = null;
let p25: PeriodicWave | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function pulseWaves(ac: AudioContext) {
  if (p12 && p25) return { p12, p25 };
  const n = 64;
  const make = (duty: number) => {
    const real = new Float32Array(n);
    const imag = new Float32Array(n);
    for (let i = 1; i < n; i++) real[i] = (2 * Math.sin(Math.PI * i * duty)) / (i * Math.PI);
    return ac.createPeriodicWave(real, imag);
  };
  p12 = make(0.125);
  p25 = make(0.25);
  return { p12, p25 };
}

type Wave = OscillatorType | "pulse12" | "pulse25";

function jitter(n: number) {
  return n * (0.985 + Math.random() * 0.03);
}

function tone(freq: number, dur: number, type: Wave = "pulse25", gain = 0.05, at = 0) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + at;
  const o = ac.createOscillator();
  const g = ac.createGain();
  if (type === "pulse12") o.setPeriodicWave(pulseWaves(ac).p12);
  else if (type === "pulse25") o.setPeriodicWave(pulseWaves(ac).p25);
  else o.type = type;
  o.frequency.value = jitter(freq);
  g.gain.setValueAtTime(Math.max(0.0008, gain), t);
  g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  o.connect(g);
  g.connect(ac.destination);
  o.start(t);
  o.stop(t + dur + 0.03);
}

function chord(freqs: number[], dur: number, type: Wave = "pulse25", gain = 0.028, at = 0) {
  freqs.forEach((f) => tone(f, dur, type, gain, at));
}

function noise(dur: number, gain = 0.05, freq = 1600, at = 0, q = 0.7) {
  const ac = audio();
  if (!ac) return;
  const len = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buffer = ac.createBuffer(1, len, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = q;
  const g = ac.createGain();
  const t = ac.currentTime + at;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + Math.min(0.03, dur * 0.2));
  g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  src.connect(bp);
  bp.connect(g);
  g.connect(ac.destination);
  src.start(t);
  src.stop(t + dur + 0.02);
}

function sweep(from: number, to: number, dur: number, type: Wave = "pulse25", gain = 0.04, at = 0) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + at;
  const o = ac.createOscillator();
  const g = ac.createGain();
  if (type === "pulse12") o.setPeriodicWave(pulseWaves(ac).p12);
  else if (type === "pulse25") o.setPeriodicWave(pulseWaves(ac).p25);
  else o.type = type;
  o.frequency.setValueAtTime(from, t);
  o.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + dur);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  o.connect(g);
  g.connect(ac.destination);
  o.start(t);
  o.stop(t + dur + 0.03);
}

export function sfxUnlock() {
  audio();
}

/** Menu hop — Melee CSS cursor. */
export function sfxClick() {
  tone(1047, 0.035, "pulse12", 0.03);
}

/** Character-select confirm. */
export function sfxSelect() {
  tone(392, 0.04, "pulse25", 0.04);
  tone(784, 0.08, "pulse12", 0.045, 0.045);
}

/** Coin sparkle. Price tick. */
export function sfxCoin() {
  tone(1319, 0.045, "pulse12", 0.038);
  tone(1760, 0.09, "pulse12", 0.032, 0.045);
}

/** Money bags. Thud, then coins spilling. */
export function sfxCash() {
  tone(73, 0.16, "triangle", 0.09);
  tone(110, 0.1, "pulse25", 0.04, 0.02);
  noise(0.12, 0.04, 500, 0.01, 0.5);
  const coins = [1175, 1480, 1568, 1760, 2093, 2349];
  coins.forEach((n, i) => tone(n, 0.06, "pulse12", 0.034, 0.09 + i * 0.042));
}

/** Stadium crowd pop. */
export function sfxCheer() {
  noise(0.42, 0.055, 900, 0, 0.45);
  noise(0.32, 0.04, 1800, 0.04, 0.6);
  noise(0.22, 0.03, 2800, 0.08, 0.8);
  tone(196, 0.2, "triangle", 0.03, 0.02);
  tone(330, 0.18, "triangle", 0.02, 0.06);
}

/** Announcer sting: excellent choice. Ready… GO energy. */
export function sfxExcellent() {
  noise(0.12, 0.03, 2200, 0, 0.9);
  chord([330, 392], 0.07, "pulse25", 0.036, 0);
  chord([392, 494], 0.07, "pulse25", 0.038, 0.08);
  chord([494, 587], 0.08, "pulse25", 0.04, 0.16);
  chord([659, 784, 988], 0.28, "pulse12", 0.045, 0.26);
  tone(1319, 0.16, "pulse12", 0.03, 0.38);
  noise(0.22, 0.035, 1400, 0.26, 0.6);
}

/** Announcer: MAX. Two-hit GAME! then a fanfare. */
export function sfxMax() {
  noise(0.5, 0.07, 650, 0, 0.4);
  tone(98, 0.16, "triangle", 0.08);
  tone(196, 0.14, "pulse25", 0.07);
  tone(147, 0.12, "pulse25", 0.06, 0.12);
  tone(294, 0.14, "pulse25", 0.07, 0.14);
  chord([392, 494], 0.1, "pulse25", 0.045, 0.28);
  chord([523, 659], 0.12, "pulse25", 0.05, 0.38);
  chord([784, 988, 1175], 0.34, "pulse12", 0.05, 0.5);
  tone(1568, 0.18, "pulse12", 0.032, 0.62);
}

/** Crowd wow. Rising whoop + sparkle. */
export function sfxWow() {
  sweep(280, 1180, 0.26, "pulse25", 0.045);
  sweep(420, 1568, 0.22, "triangle", 0.03, 0.04);
  noise(0.18, 0.03, 2400, 0.14, 0.9);
  tone(1568, 0.12, "pulse12", 0.035, 0.22);
  tone(2093, 0.14, "pulse12", 0.028, 0.3);
}

export function sfxLove() {
  tone(392, 0.07, "pulse25", 0.032);
  tone(523, 0.08, "pulse25", 0.036, 0.07);
  tone(659, 0.14, "triangle", 0.04, 0.14);
  sfxWow();
}

export function sfxStart() {
  tone(196, 0.08, "pulse25", 0.045);
  tone(262, 0.08, "pulse25", 0.045, 0.07);
  tone(330, 0.08, "pulse25", 0.045, 0.14);
  tone(392, 0.08, "pulse25", 0.045, 0.21);
  chord([523, 659, 784], 0.3, "pulse12", 0.048, 0.3);
}

export function sfxLevel() {
  sfxCheer();
  tone(523, 0.09, "pulse25", 0.05);
  tone(659, 0.09, "pulse25", 0.05, 0.08);
  tone(784, 0.09, "pulse25", 0.05, 0.16);
  chord([1046, 1319, 1568], 0.36, "pulse12", 0.05, 0.26);
}
