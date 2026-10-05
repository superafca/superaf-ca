/** Soft shop-side sounds. Sine and triangle only. Unlock on first tap. Never autoplay.
 *  A real take at public/sfx/<name>.webm replaces the synth when the file exists.
 */

const SFX_KEY = "superaf-sfx";

let ctx: AudioContext | null = null;
let dry: GainNode | null = null;
let master: GainNode | null = null;
const clips = new Map<string, AudioBuffer | null>();
const loading = new Set<string>();
let listed: Set<string> | null = null;
let listing = false;

type Bed = { duck: (seconds: number) => void };
let bed: Bed | null = null;

export function attachBed(next: Bed | null) {
  bed = next;
}

export function sfxEnabled() {
  if (typeof window === "undefined") return false;
  try {
    const saved = localStorage.getItem(SFX_KEY);
    if (saved === "on") return true;
    if (saved === "off") return false;
  } catch {
    /* ignore */
  }
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function sfxSetEnabled(on: boolean) {
  try {
    localStorage.setItem(SFX_KEY, on ? "on" : "off");
  } catch {
    /* ignore */
  }
  if (on) audio();
}

function audio() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  if (!dry || !master) {
    master = ctx.createGain();
    master.gain.value = 0.5;
    const low = ctx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 2600;
    low.Q.value = 0.5;
    dry = ctx.createGain();
    const wet = ctx.createGain();
    wet.gain.value = 0.2;
    const verb = ctx.createConvolver();
    verb.buffer = impulse(ctx);
    dry.connect(low);
    dry.connect(verb);
    verb.connect(wet);
    wet.connect(low);
    low.connect(master);
    master.connect(ctx.destination);
  }
  return ctx;
}

function impulse(ac: AudioContext) {
  const len = Math.floor(ac.sampleRate * 0.32);
  const buffer = ac.createBuffer(2, len, ac.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < len; i++) {
      const fall = (1 - i / len) ** 3;
      data[i] = (Math.random() * 2 - 1) * fall * 0.55;
    }
  }
  return buffer;
}

export function sfxUnlock() {
  audio();
}

function audible() {
  return sfxEnabled() && audio();
}

function loadClip(name: string, ac: AudioContext) {
  if (!listed && !listing && typeof window !== "undefined") {
    listing = true;
    void fetch("/sfx/manifest.json")
      .then((res) => (res.ok ? res.json() : []))
      .then((names) => {
        listed = new Set(Array.isArray(names) ? names.filter((n) => typeof n === "string") : []);
      })
      .catch(() => {
        listed = new Set();
      })
      .finally(() => {
        listing = false;
      });
  }
  if (clips.has(name) || loading.has(name)) return;
  if (!listed) return;
  if (!listed.has(name)) {
    clips.set(name, null);
    return;
  }
  loading.add(name);
  void fetch(`/sfx/${name}.webm`)
    .then((res) => (res.ok ? res.arrayBuffer() : Promise.reject(new Error("missing"))))
    .then((buf) => ac.decodeAudioData(buf))
    .then((decoded) => {
      clips.set(name, decoded);
    })
    .catch(() => {
      clips.set(name, null);
    })
    .finally(() => {
      loading.delete(name);
    });
}

function playClip(name: string, ac: AudioContext) {
  const buffer = clips.get(name);
  if (!buffer || !dry) return false;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const g = ac.createGain();
  g.gain.value = 0.7;
  src.connect(g);
  g.connect(dry);
  src.start();
  bed?.duck(buffer.duration);
  return true;
}

function play(name: string, synth: (ac: AudioContext) => number) {
  const ac = audible();
  if (!ac || !dry) return;
  loadClip(name, ac);
  if (playClip(name, ac)) return;
  const seconds = synth(ac);
  bed?.duck(seconds);
}

function voice(ac: AudioContext, freq: number, dur: number, type: OscillatorType, peak: number, at = 0) {
  if (!dry) return;
  const t = ac.currentTime + at;
  const osc = ac.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  const g = ac.createGain();
  const attack = Math.min(0.014, Math.max(0.005, dur * 0.18));
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(Math.max(0.0002, peak), t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(dur, attack + 0.03));
  osc.connect(g);
  g.connect(dry);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

function mist(ac: AudioContext, dur: number, freq: number, peak: number, at = 0) {
  if (!dry) return;
  const len = Math.max(1, Math.floor(ac.sampleRate * dur));
  const buffer = ac.createBuffer(1, len, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const bp = ac.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = 0.7;
  const g = ac.createGain();
  const t = ac.currentTime + at;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp);
  bp.connect(g);
  g.connect(dry);
  src.start(t);
  src.stop(t + dur + 0.02);
}

function bloom(ac: AudioContext, freqs: number[], dur: number, peak: number) {
  freqs.forEach((freq, i) => voice(ac, freq, dur, i % 2 ? "triangle" : "sine", peak, 0.01));
  voice(ac, freqs[freqs.length - 1] * 2, 0.28, "sine", peak * 0.28, dur * 0.55);
}

/** Soft wooden tick. */
export function sfxClick() {
  play("click", (ac) => {
    voice(ac, 620, 0.045, "sine", 0.09);
    mist(ac, 0.03, 1400, 0.03);
    return 0.08;
  });
}

/** Glassy confirm. */
export function sfxSelect() {
  play("select", (ac) => {
    voice(ac, 520, 0.05, "sine", 0.07);
    voice(ac, 880, 0.08, "triangle", 0.06, 0.04);
    return 0.14;
  });
}

/** Gentle chime. */
export function sfxCoin() {
  play("coin", (ac) => {
    voice(ac, 988, 0.12, "sine", 0.06);
    voice(ac, 1318, 0.18, "triangle", 0.045, 0.05);
    return 0.24;
  });
}

/** Soft thump and a short shimmer. */
export function sfxCash() {
  play("cash", (ac) => {
    voice(ac, 72, 0.18, "sine", 0.1);
    voice(ac, 1568, 0.12, "sine", 0.03, 0.04);
    return 0.22;
  });
}

/** Warm rising pad. No crowd. */
export function sfxCheer() {
  play("cheer", (ac) => {
    voice(ac, 196, 0.7, "sine", 0.04);
    voice(ac, 247, 0.65, "triangle", 0.035, 0.08);
    voice(ac, 330, 0.55, "sine", 0.03, 0.16);
    return 0.75;
  });
}

export function sfxExcellent() {
  play("excellent", (ac) => {
    voice(ac, 262, 0.6, "sine", 0.04);
    voice(ac, 330, 0.6, "triangle", 0.035, 0.06);
    voice(ac, 392, 0.7, "sine", 0.04, 0.12);
    return 0.85;
  });
}

/** Major-7th bloom with a sparkle, under 1.2s. */
export function sfxMax() {
  play("max", (ac) => {
    bloom(ac, [262, 330, 392, 494], 0.9, 0.045);
    return 1.05;
  });
}

export function sfxWow() {
  play("wow", (ac) => {
    voice(ac, 240, 0.45, "sine", 0.04);
    voice(ac, 480, 0.4, "triangle", 0.03, 0.06);
    return 0.5;
  });
}

export function sfxLove() {
  play("love", (ac) => {
    voice(ac, 392, 0.16, "sine", 0.04);
    voice(ac, 494, 0.22, "triangle", 0.035, 0.08);
    return 0.32;
  });
}

export function sfxStart() {
  play("start", (ac) => {
    [196, 247, 294, 392].forEach((freq, i) => voice(ac, freq, 0.12, "sine", 0.04, i * 0.07));
    return 0.45;
  });
}

export function sfxLevel() {
  play("level", (ac) => {
    bloom(ac, [220, 277, 330, 415], 0.95, 0.05);
    return 1.1;
  });
}
