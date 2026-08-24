export type Unit = "psig" | "bar" | "degF" | "degC" | "gpm" | "m3h";

export type Reading = {
  doc: string;
  revision: string;
  value: number;
  unit: Unit;
};

export type TagRecord = {
  tag: string;
  equipment: string;
  property: string;
  readings: Reading[];
};

export type Verdict = "consistent" | "real conflict" | "spurious conflict";

export type Checked = {
  record: TagRecord;
  /** every reading converted to one canonical unit */
  normalized: { reading: Reading; canonical: number; canonicalUnit: string }[];
  verdict: Verdict;
  /** what a naive string or number comparison would have concluded */
  naiveVerdict: "consistent" | "conflict";
  spread: number;
  note: string;
};
