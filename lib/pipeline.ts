import type { Checked, Rules, SourceDoc } from "./types";
import { extract, group } from "./extract";
import { checkAll } from "./normalize";
import { resolve } from "./resolve";
import { DEFAULT_RULES } from "./data";

/**
 * The whole flow in one call, returning every stage so the page can show its
 * work: documents in, readings out, readings grouped by tag, converted,
 * compared, classified, and a value chosen for each tag.
 */
export function run(docs: SourceDoc[], rules: Rules = DEFAULT_RULES) {
  const { readings, skipped } = extract(docs);
  const records = group(readings);
  const checked = checkAll(records, rules);
  const resolutions = new Map(checked.map((c) => [c.record.tag + "::" + c.record.property, resolve(c, rules)]));
  const counts = countVerdicts(checked);
  return { docs, readings, skipped, records, checked, resolutions, counts };
}

export function countVerdicts(checked: Checked[]) {
  return {
    total: checked.length,
    consistent: checked.filter((c) => c.verdict === "consistent").length,
    spurious: checked.filter((c) => c.verdict === "spurious conflict").length,
    real: checked.filter((c) => c.verdict === "real conflict").length,
    hidden: checked.filter((c) => c.verdict === "real conflict" && c.naiveVerdict === "consistent").length,
    review: checked.filter((c) => c.verdict === "needs review").length,
    naiveFlags: checked.filter((c) => c.naiveVerdict === "conflict").length,
  };
}
