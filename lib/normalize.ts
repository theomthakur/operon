import type { Checked, Reading, TagRecord, Unit } from "./types";

/** Anything wider than this, once normalized, is a genuine disagreement. */
export const TOLERANCE = 0.02;

const CANONICAL: Record<Unit, string> = {
  psig: "bar", bar: "bar", degF: "degC", degC: "degC", gpm: "m3h", m3h: "m3h",
};

function toCanonical(r: Reading): number {
  switch (r.unit) {
    case "psig": return r.value * 0.0689476;
    case "bar": return r.value;
    case "degF": return (r.value - 32) * 5 / 9;
    case "degC": return r.value;
    case "gpm": return r.value * 0.227125;
    case "m3h": return r.value;
  }
}

/**
 * Two documents citing the same equipment tag are only in conflict if they
 * disagree after both are converted to the same unit. A process industry
 * document set mixes psig and bar, degF and degC, gpm and m3/h freely, so
 * comparing the raw numbers produces two opposite errors at once: numbers
 * that differ but mean the same thing, and numbers that match but do not.
 */
export function check(record: TagRecord): Checked {
  const normalized = record.readings.map((reading) => ({
    reading,
    canonical: toCanonical(reading),
    canonicalUnit: CANONICAL[reading.unit],
  }));

  const values = normalized.map((n) => n.canonical);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const spread = min === 0 ? 0 : (max - min) / min;
  const trulyConsistent = spread <= TOLERANCE;

  const rawValues = record.readings.map((r) => r.value);
  const rawIdentical = new Set(rawValues.map((v) => v.toFixed(4))).size === 1;
  const naiveVerdict: Checked["naiveVerdict"] = rawIdentical ? "consistent" : "conflict";

  let verdict: Checked["verdict"];
  let note: string;
  if (trulyConsistent && naiveVerdict === "conflict") {
    verdict = "spurious conflict";
    note = "The numbers differ because the units differ. Once converted they agree, so this is not a discrepancy to chase.";
  } else if (!trulyConsistent && naiveVerdict === "consistent") {
    verdict = "real conflict";
    note = "The numbers match and the units do not. Two documents state genuinely different values that look identical on the page.";
  } else if (trulyConsistent) {
    verdict = "consistent";
    note = "Same value, same unit, no action needed.";
  } else {
    verdict = "real conflict";
    note = "Genuinely different values after conversion.";
  }

  return { record, normalized, verdict, naiveVerdict, spread, note };
}

export function checkAll(records: TagRecord[]): Checked[] {
  return records.map(check);
}
