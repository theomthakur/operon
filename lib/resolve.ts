import type { Checked, Resolution, Rules } from "./types";
import { DEFAULT_RULES } from "./data";

/**
 * Stage 6. Pick the value to answer with. Never an average: the reading from
 * the most trusted document type wins, and between two documents of the same
 * type the newer revision wins. The order of trust lives in the rules, so a
 * plant that trusts its datasheets over its P&IDs changes data, not code.
 */
export function resolve(c: Checked, rules: Rules = DEFAULT_RULES): Resolution | null {
  const usable = c.normalized.filter((n) => n.canonical !== null);
  if (!usable.length) return null;
  const rank = (t: string) => {
    const i = rules.authority.indexOf(t as never);
    return i === -1 ? rules.authority.length : i;
  };
  const sorted = [...usable].sort((a, b) => rank(a.reading.docType) - rank(b.reading.docType) || b.reading.revision - a.reading.revision);
  const chosen = sorted[0];
  const runnerUp = sorted[1];
  const reason = runnerUp && rank(runnerUp.reading.docType) === rank(chosen.reading.docType)
    ? `${chosen.reading.docType} is the most trusted type here, and Rev ${chosen.reading.revision} is newer than Rev ${runnerUp.reading.revision}.`
    : `${chosen.reading.docType} ranks highest in this plant's order of trust.`;
  return { chosen, reason };
}

/** Apply a resolution: every document is corrected to the authoritative value and unit, then re-checked. */
export function applyResolution(c: Checked, res: Resolution) {
  return {
    ...c.record,
    readings: c.record.readings.map((r) => ({ ...r, value: res.chosen.reading.value, unit: res.chosen.reading.unit })),
  };
}
