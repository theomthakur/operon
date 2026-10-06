export type Unit =
  | "psig" | "psia" | "bar" | "barg" | "bara"
  | "degF" | "degC" | "K"
  | "gpm" | "m3h";

export type Quantity = "pressure" | "temperature" | "flow";

/** The kinds of document a plant runs on, in the order the default rules trust them. */
export type DocType = "P&ID" | "Process datasheet" | "Line list" | "Instrument index" | "Vendor document" | "Calculation";

/** A document as it arrives: text that came off a page, plus what the register says about it. */
export type SourceDoc = {
  id: string;
  title: string;
  type: DocType;
  revision: number;
  text: string;
};

/** One value pulled off one line of one document. The unit stays attached from here on. */
export type Reading = {
  tag: string;
  property: string;
  value: number;
  /** null when the line had a number and no unit. Never guessed. */
  unit: Unit | null;
  docId: string;
  doc: string;
  docType: DocType;
  revision: number;
  line: string;
  lineNo: number;
};

export type TagRecord = {
  tag: string;
  equipment: string;
  property: string;
  readings: Reading[];
};

export type Verdict = "consistent" | "spurious conflict" | "real conflict" | "needs review";

export type Normalized = {
  reading: Reading;
  canonical: number | null;
  canonicalUnit: string | null;
  /** set when the conversion rested on an assumption, for example bare "bar" read as gauge */
  assumption?: string;
};

export type Checked = {
  record: TagRecord;
  normalized: Normalized[];
  verdict: Verdict;
  /** what a comparison of the raw numbers on the page would have concluded */
  naiveVerdict: "consistent" | "conflict";
  spread: number;
  note: string;
  /** what would change if the assumption were the other way round */
  assumptionNote?: string;
};

export type Rules = {
  /** relative gap allowed after conversion before two readings count as different */
  tolerance: number;
  /** most trusted document type first */
  authority: DocType[];
};

export type Resolution = {
  chosen: Normalized;
  reason: string;
};
