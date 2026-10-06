import type { Checked, Normalized, Reading, Rules, TagRecord } from "./types";
import { UNITS } from "./units";
import { DEFAULT_RULES } from "./data";

/** Stage 3. Convert one reading to the unit it will be compared in. */
export function normalize(reading: Reading): Normalized {
  if (!reading.unit) return { reading, canonical: null, canonicalUnit: null };
  const def = UNITS[reading.unit];
  return {
    reading,
    canonical: def.toCanonical(reading.value),
    canonicalUnit: def.canonical,
    assumption: def.ambiguous?.assumption,
  };
}

function spreadOf(values: number[]): number {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const base = Math.abs(min) || 1;
  return (max - min) / base;
}

function verdictFor(values: number[], rawIdentical: boolean, tolerance: number) {
  const spread = spreadOf(values);
  const agree = spread <= tolerance;
  if (agree && !rawIdentical) return { verdict: "spurious conflict" as const, spread };
  if (!agree && rawIdentical) return { verdict: "real conflict" as const, spread };
  if (agree) return { verdict: "consistent" as const, spread };
  return { verdict: "real conflict" as const, spread };
}

/**
 * Stage 4 and 5. Compare after conversion and classify.
 *
 * Two documents citing the same tag only conflict if they disagree after both
 * are converted to the same unit. Comparing raw numbers makes two opposite
 * errors at once: numbers that differ but mean the same thing, and numbers
 * that match but do not. A reading with no unit, or readings of different
 * physical quantities, are never compared; they go to a person.
 */
export function check(record: TagRecord, rules: Rules = DEFAULT_RULES): Checked {
  const normalized = record.readings.map(normalize);
  const rawIdentical = new Set(record.readings.map((r) => r.value.toFixed(4))).size === 1;
  const naiveVerdict: Checked["naiveVerdict"] = rawIdentical ? "consistent" : "conflict";

  const missing = normalized.filter((n) => n.canonical === null);
  if (missing.length) {
    return {
      record, normalized, naiveVerdict, spread: 0, verdict: "needs review",
      note: `${missing.map((m) => m.reading.doc).join(", ")} states a number with no unit. The checker refuses to guess one, because a wrong guess here produces a confident wrong answer.`,
    };
  }
  const quantities = new Set(record.readings.map((r) => UNITS[r.unit!].quantity));
  if (quantities.size > 1) {
    return {
      record, normalized, naiveVerdict, spread: 0, verdict: "needs review",
      note: `These readings measure different things (${[...quantities].join(" and ")}), so the property was probably extracted wrongly.`,
    };
  }
  if (record.readings.length < 2) {
    return { record, normalized, naiveVerdict: "consistent", spread: 0, verdict: "consistent", note: "Only one document states this value, so there is nothing to compare yet." };
  }

  const values = normalized.map((n) => n.canonical!);
  const { verdict, spread } = verdictFor(values, rawIdentical, rules.tolerance);

  const notes: Record<string, string> = {
    "spurious conflict": "The numbers differ because the units differ. Once converted they agree, so this is not a discrepancy to chase.",
    consistent: "Same value in every document, no action needed.",
  };
  let note = notes[verdict] ?? "";
  if (verdict === "real conflict") {
    note = rawIdentical
      ? "The numbers match and the units do not. Two documents state genuinely different values that look identical on the page."
      : `Genuinely different values after conversion, ${(spread * 100).toFixed(0)}% apart.`;
  }

  // If any reading rested on an assumption, run the check the other way round
  // and say what would change. The verdict shown is the assumed one; the
  // alternative is surfaced, not hidden.
  let assumptionNote: string | undefined;
  const ambiguous = normalized.filter((n) => n.assumption);
  if (ambiguous.length) {
    const alt = normalized.map((n) => {
      const amb = UNITS[n.reading.unit!].ambiguous;
      return amb ? amb.otherReading(n.reading.value) : n.canonical!;
    });
    const other = verdictFor(alt, rawIdentical, rules.tolerance);
    if (other.verdict !== verdict) {
      const agrees = (v: string) => v === "consistent" || v === "spurious conflict";
      assumptionNote = `${ambiguous.map((a) => a.reading.doc).join(", ")} writes plain "bar". Read as gauge, the documents ${agrees(verdict) ? "agree" : "disagree"}. If it means absolute, they ${agrees(other.verdict) ? "agree" : `disagree by ${(other.spread * 100).toFixed(1)}%`}. Worth one question to whoever issued it before anyone relies on this value.`;
    }
  }

  return { record, normalized, verdict, naiveVerdict, spread, note, assumptionNote };
}

export function checkAll(records: TagRecord[], rules: Rules = DEFAULT_RULES): Checked[] {
  return records.map((r) => check(r, rules));
}
