import type { Reading, SourceDoc, TagRecord } from "./types";
import { parseUnit } from "./units";
import { EQUIPMENT } from "./data";

const TAG = /^\s*([A-Z]{1,4}-\d{3,5}[A-Z]?)\b/;
const VALUE_AND_UNIT = /(-?\d+(?:\.\d+)?)\s*([A-Za-z°][A-Za-z0-9°³\/()]*(?:\s?[ga])?)?\s*$/;

export type Skipped = { docId: string; lineNo: number; line: string; why: string };

/**
 * Stage 1. Pull every reading off every line. A line counts only if it starts
 * with an equipment tag and ends with a number. The unit is parsed but never
 * guessed: a number with no recognisable unit is kept with unit null, so the
 * checker can refuse to compare it later instead of silently assuming one.
 */
export function extract(docs: SourceDoc[]): { readings: Reading[]; skipped: Skipped[] } {
  const readings: Reading[] = [];
  const skipped: Skipped[] = [];
  for (const doc of docs) {
    doc.text.split("\n").forEach((raw, i) => {
      const line = raw.trim();
      if (!line) return;
      const tagMatch = line.match(TAG);
      if (!tagMatch) {
        skipped.push({ docId: doc.id, lineNo: i + 1, line, why: "no equipment tag at the start of the line" });
        return;
      }
      const vu = line.match(VALUE_AND_UNIT);
      if (!vu) {
        skipped.push({ docId: doc.id, lineNo: i + 1, line, why: "no value at the end of the line" });
        return;
      }
      const tag = tagMatch[1];
      const property = line
        .slice(tagMatch[0].length, vu.index)
        .replace(/[|:=]/g, " ")
        .replace(/\s+/g, " ")
        .replace(/^[\s,.-]+|[\s,.-]+$/g, "")
        .trim();
      readings.push({
        tag,
        property: property || "value",
        value: Number(vu[1]),
        unit: vu[2] ? parseUnit(vu[2]) : null,
        docId: doc.id,
        doc: doc.title,
        docType: doc.type,
        revision: doc.revision,
        line,
        lineNo: i + 1,
      });
    });
  }
  return { readings, skipped };
}

/** Stage 2. Group readings that talk about the same property of the same tag. */
export function group(readings: Reading[]): TagRecord[] {
  const map = new Map<string, TagRecord>();
  for (const r of readings) {
    const key = `${r.tag}::${r.property.toLowerCase()}`;
    if (!map.has(key)) map.set(key, { tag: r.tag, equipment: EQUIPMENT[r.tag] ?? "Not in the equipment register", property: r.property, readings: [] });
    map.get(key)!.readings.push(r);
  }
  return [...map.values()];
}
