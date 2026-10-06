import type { Checked, Resolution } from "./types";

export type Answer =
  | { kind: "none"; text: string }
  | { kind: "answer"; text: string; checked: Checked; resolution: Resolution | null };

/**
 * The last step: what an engineer gets back when they ask about a tag. The
 * answer carries its source and, when documents disagree, says so instead of
 * quietly picking a side. No model is involved; it only reads the checked
 * results.
 */
export function answer(question: string, checked: Checked[], resolutions: Map<string, Resolution | null>): Answer {
  const tagMatch = question.toUpperCase().match(/[A-Z]{1,4}-\d{3,5}[A-Z]?/);
  if (!tagMatch) return { kind: "none", text: "Ask about a tag, for example: What is the design temperature of TI-3310?" };
  const hits = checked.filter((c) => c.record.tag === tagMatch[0]);
  if (!hits.length) return { kind: "none", text: `${tagMatch[0]} does not appear in any of these documents.` };
  const q = question.toLowerCase();
  const c = hits.find((h) => q.includes(h.record.property.toLowerCase())) ?? hits[0];
  const res = resolutions.get(c.record.tag + "::" + c.record.property) ?? null;
  const fmt = (n: number) => (Math.abs(n) >= 100 ? n.toFixed(0) : n.toFixed(2));
  if (c.verdict === "real conflict" && res) {
    const others = c.normalized.filter((n) => n !== res.chosen).map((n) => `${n.reading.doc} says ${n.reading.value} ${n.reading.unit}`).join("; ");
    return {
      kind: "answer", checked: c, resolution: res,
      text: `The documents disagree on the ${c.record.property.toLowerCase()} of ${c.record.tag}. ${res.chosen.reading.doc} says ${res.chosen.reading.value} ${res.chosen.reading.unit} (${fmt(res.chosen.canonical!)} ${res.chosen.canonicalUnit}); ${others}. This needs an engineer's decision before anyone relies on it.`,
    };
  }
  if (c.verdict === "needs review") return { kind: "answer", checked: c, resolution: res, text: `I can't give one value for ${c.record.tag} yet. ${c.note}` };
  if (!res) return { kind: "none", text: "No usable reading." };
  const n = res.chosen;
  const agreeing = c.normalized.length > 1 ? ` All ${c.normalized.length} documents agree once units are converted.` : "";
  return {
    kind: "answer", checked: c, resolution: res,
    text: `The ${c.record.property.toLowerCase()} of ${c.record.tag} is ${n.reading.value} ${n.reading.unit} (${fmt(n.canonical!)} ${n.canonicalUnit}), from ${n.reading.doc}, Rev ${n.reading.revision}.${agreeing}${c.assumptionNote ? " One caveat: " + c.assumptionNote : ""}`,
  };
}
