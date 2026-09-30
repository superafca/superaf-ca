export const DIY_PANELS = [
  { id: "cups", name: "Door cups", price: 29 },
  { id: "edges", name: "Door edges", price: 39 },
  { id: "lights", name: "Headlights", price: 49 },
  { id: "pillars", name: "A-pillars", price: 59 },
  { id: "ledge", name: "Trunk ledge", price: 59 },
  { id: "rockers", name: "Rocker panels (pair)", price: 149 },
  { id: "rear", name: "Rear bumper", price: 179 },
] as const;

export type DiyPanelId = (typeof DIY_PANELS)[number]["id"];
export type DiyKitId = "front" | "custom" | "max";
export type DiyFilmId = "pp5" | "pp10";

const KIT = {
  front: { pp5: 399, pp10: 549 },
  custom: { pp5: 399, pp10: 549 },
  max: { pp5: 1299, pp10: 1799 },
} as const;

export const DIY_CUT = 150;
export const DIY_ROLL = 25;
export const DIY_BULK = { pp5: 14, pp10: 22 } as const;
export const DIY_TOOLS = 39;
export const DIY_SHIP = 40;
export const DIY_FREE_SHIP = 600;

export function diyPrice(opts: {
  kit: DiyKitId | null;
  film: DiyFilmId;
  panels: readonly DiyPanelId[];
  feet5: number;
  feet10: number;
  tools: boolean;
  pickup: boolean;
}) {
  const kitAmount = opts.kit ? KIT[opts.kit][opts.film] : 0;
  const panelAmount =
    opts.kit === "custom" ? opts.panels.reduce((sum, id) => sum + (DIY_PANELS.find((p) => p.id === id)?.price ?? 0), 0) : 0;
  const cut = opts.kit ? DIY_CUT : 0;
  const feet5 = Math.max(0, Math.floor(opts.feet5));
  const feet10 = Math.max(0, Math.floor(opts.feet10));
  const bulk = feet5 * DIY_BULK.pp5 + feet10 * DIY_BULK.pp10;
  const roll = feet5 + feet10 > 0 ? DIY_ROLL : 0;
  const tools = opts.tools ? DIY_TOOLS : 0;
  const merchandise = kitAmount + panelAmount + cut + bulk + roll + tools;
  const shipping = merchandise === 0 || opts.pickup || merchandise >= DIY_FREE_SHIP ? 0 : DIY_SHIP;
  return { kitAmount, panelAmount, cut, bulk, roll, tools, feet5, feet10, merchandise, shipping, total: merchandise + shipping };
}
