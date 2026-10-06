import type { DocType, Rules, SourceDoc } from "./types";

/**
 * Six documents from an invented plant document set, written the way their
 * text comes off the page after extraction: titles, notes and table rows mixed
 * together. Every tag, document and value is invented. The set is built so a
 * comparison of the raw numbers gets two cases exactly backwards.
 */
export const DOCUMENTS: SourceDoc[] = [
  {
    id: "pid",
    title: "P&ID set D-2201 to D-2215",
    type: "P&ID",
    revision: 6,
    text: [
      "UNIT 22 CRUDE DISTILLATION. DRAWING SET D-2201 TO D-2215",
      "Note 3: all relief devices per API 520.",
      "PSV-1042 | Set pressure | 150 psig",
      "TI-3310 | Design temperature | 350 degF",
      "E-3102 | Design pressure, shell | 300 psig",
      "TV-5501 | Design temperature | 180 degC",
    ].join("\n"),
  },
  {
    id: "pds",
    title: "Process datasheets PDS-100",
    type: "Process datasheet",
    revision: 4,
    text: [
      "PROCESS DATASHEETS, ISSUED FOR CONSTRUCTION",
      "PSV-1042 | Set pressure | 10.34 bar",
      "P-2201A | Rated flow | 440 gpm",
      "E-3102 | Design pressure, shell | 20.68 barg",
      "FI-7720 | Normal flow | 242.2 gpm",
    ].join("\n"),
  },
  {
    id: "ll",
    title: "Line list LL-08",
    type: "Line list",
    revision: 3,
    text: [
      "LINE LIST LL-08. Design conditions per line.",
      "TI-3310 | Design temperature | 350 degC",
      "FI-7720 | Normal flow | 55 m3/h",
    ].join("\n"),
  },
  {
    id: "ii",
    title: "Instrument index II-01",
    type: "Instrument index",
    revision: 9,
    text: [
      "INSTRUMENT INDEX. Ranges in engineering units.",
      "PT-4408 | Range max | 25 barg",
    ].join("\n"),
  },
  {
    id: "vd",
    title: "Vendor documents VD-17",
    type: "Vendor document",
    revision: 1,
    text: [
      "VENDOR CUT SHEETS, RECEIVED 2024-11",
      "PSV-1042 | Set pressure | 150 psig",
      "TV-5501 | Design temperature | 260 degC",
      "PT-4408 | Range max | 25 barg",
    ].join("\n"),
  },
  {
    id: "hc",
    title: "Hydraulic calculation HC-12",
    type: "Calculation",
    revision: 1,
    text: [
      "HYDRAULIC CALCULATION, FEED SYSTEM",
      "P-2201A | Rated flow | 99.9 m3/h",
    ].join("\n"),
  },
];

/** What each tag is, as the plant's equipment register would say. */
export const EQUIPMENT: Record<string, string> = {
  "PSV-1042": "Relief valve, crude column overhead",
  "TI-3310": "Reactor bed thermocouple",
  "P-2201A": "Feed pump, centrifugal",
  "PT-4408": "Pressure transmitter, suction header",
  "E-3102": "Shell and tube exchanger",
  "TV-5501": "Temperature control valve",
  "FI-7720": "Flow indicator, recycle line",
};

export const DOC_TYPES: DocType[] = ["P&ID", "Process datasheet", "Line list", "Instrument index", "Calculation", "Vendor document"];

/**
 * The rules are data, not code. A plant that trusts its datasheets over its
 * P&IDs changes this list, not the checker.
 */
export const DEFAULT_RULES: Rules = {
  tolerance: 0.02,
  authority: ["P&ID", "Process datasheet", "Line list", "Instrument index", "Calculation", "Vendor document"],
};
