import type { TagRecord } from "./types";

/**
 * Seven equipment tags pulled from an invented plant document set: P&IDs,
 * datasheets, line lists and vendor cut sheets. Every tag, document and
 * value is invented. The set is built so a naive numeric comparison gets
 * two cases exactly backwards.
 */
export const RECORDS: TagRecord[] = [
  {
    tag: "PSV-1042", equipment: "Relief valve, crude column overhead", property: "Set pressure",
    readings: [
      { doc: "P&ID D-2201", revision: "Rev 4", value: 150, unit: "psig" },
      { doc: "Datasheet PSV-1042", revision: "Rev 2", value: 10.34, unit: "bar" },
      { doc: "Vendor cut sheet", revision: "2024-11", value: 150, unit: "psig" },
    ],
  },
  {
    tag: "TI-3310", equipment: "Reactor bed thermocouple", property: "Design temperature",
    readings: [
      { doc: "P&ID D-2204", revision: "Rev 6", value: 350, unit: "degF" },
      { doc: "Line list LL-08", revision: "Rev 3", value: 350, unit: "degC" },
    ],
  },
  {
    tag: "P-2201A", equipment: "Feed pump, centrifugal", property: "Rated flow",
    readings: [
      { doc: "Datasheet P-2201A", revision: "Rev 5", value: 440, unit: "gpm" },
      { doc: "Hydraulic calc HC-12", revision: "Rev 1", value: 99.9, unit: "m3h" },
    ],
  },
  {
    tag: "PT-4408", equipment: "Pressure transmitter, suction header", property: "Range max",
    readings: [
      { doc: "Instrument index", revision: "Rev 9", value: 25, unit: "bar" },
      { doc: "Loop sheet LS-4408", revision: "Rev 2", value: 25, unit: "bar" },
    ],
  },
  {
    tag: "E-3102", equipment: "Shell and tube exchanger", property: "Design pressure, shell",
    readings: [
      { doc: "P&ID D-2210", revision: "Rev 3", value: 300, unit: "psig" },
      { doc: "Mechanical datasheet", revision: "Rev 4", value: 20.68, unit: "bar" },
    ],
  },
  {
    tag: "TV-5501", equipment: "Temperature control valve", property: "Design temperature",
    readings: [
      { doc: "P&ID D-2215", revision: "Rev 2", value: 180, unit: "degC" },
      { doc: "Valve datasheet", revision: "Rev 1", value: 260, unit: "degC" },
    ],
  },
  {
    tag: "FI-7720", equipment: "Flow indicator, recycle line", property: "Normal flow",
    readings: [
      { doc: "Line list LL-11", revision: "Rev 4", value: 55, unit: "m3h" },
      { doc: "Process datasheet", revision: "Rev 2", value: 242.2, unit: "gpm" },
    ],
  },
];
