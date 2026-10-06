import type { Quantity, Unit } from "./types";

/**
 * The unit table, as data. Every unit says what it measures, which unit it is
 * compared in, and how to get there. Pressure is compared as gauge (barg),
 * because that is what set pressures and design pressures are written in.
 */
export const ATM_BAR = 1.01325;

type UnitDef = {
  quantity: Quantity;
  canonical: string;
  toCanonical: (v: number) => number;
  /** set when the unit on the page does not say everything the conversion needs */
  ambiguous?: { assumption: string; otherReading: (v: number) => number; otherLabel: string };
};

export const UNITS: Record<Unit, UnitDef> = {
  psig: { quantity: "pressure", canonical: "barg", toCanonical: (v) => v * 0.0689476 },
  psia: { quantity: "pressure", canonical: "barg", toCanonical: (v) => v * 0.0689476 - ATM_BAR },
  barg: { quantity: "pressure", canonical: "barg", toCanonical: (v) => v },
  bara: { quantity: "pressure", canonical: "barg", toCanonical: (v) => v - ATM_BAR },
  bar: {
    quantity: "pressure", canonical: "barg", toCanonical: (v) => v,
    ambiguous: {
      assumption: "\"bar\" with no g or a read as gauge",
      otherReading: (v) => v - ATM_BAR,
      otherLabel: "if it means absolute",
    },
  },
  degF: { quantity: "temperature", canonical: "degC", toCanonical: (v) => (v - 32) * 5 / 9 },
  degC: { quantity: "temperature", canonical: "degC", toCanonical: (v) => v },
  K: { quantity: "temperature", canonical: "degC", toCanonical: (v) => v - 273.15 },
  gpm: { quantity: "flow", canonical: "m3/h", toCanonical: (v) => v * 0.227125 },
  m3h: { quantity: "flow", canonical: "m3/h", toCanonical: (v) => v },
};

/** How the same unit can be spelled on a page. Matched case-insensitively. */
export const UNIT_SPELLINGS: [RegExp, Unit][] = [
  [/^psig$/i, "psig"],
  [/^psia$/i, "psia"],
  [/^bar\s?g$|^barg$|^bar\(g\)$/i, "barg"],
  [/^bar\s?a$|^bara$|^bar\(a\)$/i, "bara"],
  [/^bar$/i, "bar"],
  [/^(deg\s?f|°f|f)$/i, "degF"],
  [/^(deg\s?c|°c|c)$/i, "degC"],
  [/^k$/i, "K"],
  [/^(gpm|usgpm)$/i, "gpm"],
  [/^(m3\/h|m3h|m³\/h|m3\/hr)$/i, "m3h"],
];

export function parseUnit(raw: string): Unit | null {
  const s = raw.trim();
  for (const [re, unit] of UNIT_SPELLINGS) if (re.test(s)) return unit;
  return null;
}
