/** In-browser lo-fi bed. No audio file, so no licence. ii–V–I–vi at 75 BPM. */

import { attachBed, sfxUnlock } from "@/lib/sfx";

const KEY = "superaf-lofi";
const BPM = 75;
const BEAT = 60 / BPM;
const BAR = BEAT * 4;

const CHORDS = [
  [146.83, 174.61, 220, 261.63],
  [196, 246.94, 293.66, 349.23],
  [130.81, 164.81, 196, 246.94],
  [110, 130.81, 164.81, 196],
];

let ctx: AudioContext | null = null;
let bed: GainNode | null = null;
let crackle: AudioBufferSourceNode | null = null;
let timer = 0;
let next = 0;
let step = 0;
let want = false;
let playing = false;
let fadeTimer = 0;

function context() {
  sfxUnlock();
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  if (!bed) {
    bed = ctx.createGain();
    bed.gain.value = 0.15;
    const low = ctx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 2200;
    bed.connect(low);
    low.connect(ctx.destination);
    attachBed({ duck });
  }
  return ctx;
}

function duck(seconds: number) {
  if (!ctx || !bed || !want) return;
  const t = ctx.currentTime;
  bed.gain.cancelScheduledValues(t);
  bed.gain.setValueAtTime(bed.gain.value, t);
  bed.gain.linearRampToValueAtTime(0.05, t + 0.03);
  bed.gain.linearRampToValueAtTime(0.15, t + Math.min(1.2, Math.max(0.35, seconds)));
}

export function lofiEnabled() {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

export function lofiSetEnabled(on: boolean) {
  want = on;
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* ignore */
  }
  if (on) start();
  else stop();
}

function rhodes(ac: AudioContext, freq: number, when: number) {
  if (!bed) return;
  const osc = ac.createOscillator();
  const twin = ac.createOscillator();
  osc.type = "sine";
  twin.type = "triangle";
  osc.frequency.value = freq;
  twin.frequency.value = freq * 2.003;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.linearRampToValueAtTime(0.08, when + 0.02);
  g.gain.exponentialRampToValueAtTime(0.02, when + BAR * 0.7);
  g.gain.exponentialRampToValueAtTime(0.0001, when + BAR);
  const twinGain = ac.createGain();
  twinGain.gain.value = 0.25;
  osc.connect(g);
  twin.connect(twinGain);
  twinGain.connect(g);
  g.connect(bed);
  osc.start(when);
  twin.start(when);
  osc.stop(when + BAR + 0.05);
  twin.stop(when + BAR + 0.05);
}

function kick(ac: AudioContext, when: number) {
  if (!bed) return;
  const osc = ac.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(92, when);
  osc.frequency.exponentialRampToValueAtTime(42, when + 0.12);
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.linearRampToValueAtTime(0.35, when + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, when + 0.16);
  const low = ac.createBiquadFilter();
  low.type = "lowpass";
  low.frequency.value = 280;
  osc.connect(low);
  low.connect(g);
  g.connect(bed);
  osc.start(when);
  osc.stop(when + 0.18);
}

function snare(ac: AudioContext, when: number) {
  if (!bed) return;
  const len = Math.floor(ac.sampleRate * 0.08);
  const buffer = ac.createBuffer(1, len, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const low = ac.createBiquadFilter();
  low.type = "lowpass";
  low.frequency.value = 900;
  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, when);
  g.gain.linearRampToValueAtTime(0.08, when + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, when + 0.08);
  src.connect(low);
  low.connect(g);
  g.connect(bed);
  src.start(when);
  src.stop(when + 0.09);
}

function startCrackle(ac: AudioContext) {
  if (!bed || crackle) return;
  const len = ac.sampleRate * 2;
  const buffer = ac.createBuffer(1, len, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  const src = ac.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const high = ac.createBiquadFilter();
  high.type = "highpass";
  high.frequency.value = 1800;
  const g = ac.createGain();
  g.gain.value = 0.015;
  src.connect(high);
  high.connect(g);
  g.connect(bed);
  src.start();
  crackle = src;
}

function pump() {
  const ac = context();
  if (!ac || !want) return;
  while (next < ac.currentTime + 0.35) {
    CHORDS[step % CHORDS.length].forEach((freq) => rhodes(ac, freq, next));
    for (let beat = 0; beat < 4; beat++) {
      const when = next + beat * BEAT;
      if (beat % 2 === 0) kick(ac, when);
      else snare(ac, when);
    }
    next += BAR;
    step += 1;
  }
  timer = window.setTimeout(pump, 120);
}

function start() {
  window.clearTimeout(fadeTimer);
  if (playing) return;
  const ac = context();
  if (!ac || !want) return;
  if (document.hidden) return;
  playing = true;
  if (bed) bed.gain.setValueAtTime(0.15, ac.currentTime);
  window.clearTimeout(timer);
  next = ac.currentTime + 0.08;
  startCrackle(ac);
  pump();
}

export function lofiHold() {
  want = false;
  stop();
}

function stop() {
  playing = false;
  window.clearTimeout(timer);
  if (ctx && bed) {
    const t = ctx.currentTime;
    bed.gain.cancelScheduledValues(t);
    bed.gain.setValueAtTime(Math.max(0.0001, bed.gain.value), t);
    bed.gain.linearRampToValueAtTime(0.0001, t + 0.15);
  }
  window.clearTimeout(fadeTimer);
  fadeTimer = window.setTimeout(() => {
    try {
      crackle?.stop();
    } catch {
      /* already stopped */
    }
    crackle = null;
  }, 170);
}

function onHide() {
  if (document.hidden) stop();
  else if (want) start();
}

if (typeof window !== "undefined") {
  document.addEventListener("visibilitychange", onHide);
}
