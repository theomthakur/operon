"use client";

import { useState } from "react";
import type { Checked, Resolution } from "@/lib/types";
import { answer } from "@/lib/answer";
import { check } from "@/lib/normalize";
import { applyResolution } from "@/lib/resolve";
import { Pill } from "./Chrome";

export type Stage = { n: string; title: string; detail: string; stat: string };

/** The input to output flow, one box per stage, with the live count from this run. */
export function FlowStrip({ stages }: { stages: Stage[] }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-7">
      {stages.map((s, i) => (
        <li key={s.n} className="relative">
          <div className={`h-full rounded-xl border p-3.5 ${i === 0 || i === stages.length - 1 ? "border-accent/40 bg-accent-soft" : "rule bg-base-raised"}`}>
            <p className="font-mono text-[10.5px] font-medium text-accent">{s.n}</p>
            <p className="mt-1 text-[13px] font-semibold leading-snug">{s.title}</p>
            <p className="mt-1 text-[11.5px] leading-snug text-ink-mid">{s.detail}</p>
            <p className="mt-2 font-mono text-[11.5px] text-ink">{s.stat}</p>
          </div>
          {i < stages.length - 1 && (
            <span aria-hidden className="absolute -right-[9px] top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[11px] text-accent shadow lg:flex">&rsaquo;</span>
          )}
        </li>
      ))}
    </ol>
  );
}

function fmt(n: number) {
  return Math.abs(n) >= 100 ? n.toFixed(1) : n.toFixed(2);
}

/** One tag, every document that cites it, the conversion, the verdict and the fix. */
export function TagDetail({ c, resolution }: { c: Checked; resolution: Resolution | null }) {
  const [resolved, setResolved] = useState(false);
  const after = resolved && resolution ? check(applyResolution(c, resolution)) : null;
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[16px] font-semibold">{c.record.tag}</p>
          <p className="text-[13px] text-ink-mid">{c.record.equipment} · {c.record.property}</p>
        </div>
        <div className="flex items-center gap-2 text-[11.5px] text-ink-dim">
          raw <Pill v={c.naiveVerdict} /> &rarr; after conversion <Pill v={after ? after.verdict : c.verdict} label={after ? "resolved" : undefined} />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {c.normalized.map((n, i) => (
          <div key={i} className="rule grid gap-2 rounded-lg border bg-white p-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-[13px] font-medium">
                {n.reading.doc} <span className="font-normal text-ink-dim">· {n.reading.docType} · Rev {n.reading.revision}</span>
                {resolution && resolution.chosen === n && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[10.5px] font-medium text-white">source of truth</span>}
              </p>
              <p className="mt-1 font-mono text-[11.5px] text-ink-mid">line {n.reading.lineNo}: &ldquo;{n.reading.line}&rdquo;</p>
              {n.assumption && <p className="mt-1 text-[11.5px] text-warn">Assumption: {n.assumption}</p>}
            </div>
            <div className="font-mono text-[12.5px] sm:text-right">
              <span className="text-ink-mid">{n.reading.value} {n.reading.unit ?? "(no unit)"}</span>
              <span className="mx-2 text-ink-dim">=</span>
              <span className="font-semibold text-accent">{n.canonical === null ? "refused" : `${fmt(n.canonical)} ${n.canonicalUnit}`}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="rule mt-3 rounded-lg border bg-base-raised p-3 text-[13px] leading-relaxed">{c.note}</p>
      {c.assumptionNote && <p className="mt-2 rounded-lg border border-warn/30 bg-warn/5 p-3 text-[13px] leading-relaxed text-ink">{c.assumptionNote}</p>}

      {c.verdict === "real conflict" && resolution && !resolved && (
        <div className="mt-3 rounded-lg border border-bad/30 bg-bad/5 p-3">
          <p className="text-[13px] leading-relaxed">
            <span className="font-semibold text-bad">Averaging two values is not an answer.</span>{" "}
            The rule picks one document to trust: {resolution.reason} Every other document gets corrected to it, and the check runs again.
          </p>
          <button onClick={() => setResolved(true)} className="mt-3 rounded-full bg-accent px-4 py-2 text-[12.5px] font-medium text-white transition hover:bg-accent-deep">
            Adopt {resolution.chosen.reading.docType} as the source of truth &rarr;
          </button>
        </div>
      )}
      {after && (
        <p className="mt-3 rounded-lg border border-good/30 bg-good/5 p-3 text-[13px] leading-relaxed">
          <span className="font-semibold text-good">Re-checked: {after.verdict}.</span> Every document now states {resolution!.chosen.reading.value} {resolution!.chosen.reading.unit}. A question about this tag now gets one answer, not {c.normalized.length}.
        </p>
      )}
    </div>
  );
}

const SUGGESTIONS = [
  "What is the design temperature of TI-3310?",
  "What is the set pressure of PSV-1042?",
  "What is the rated flow of P-2201A?",
];

/** The output end of the flow: a question about a tag, answered with its source. */
export function AskBox({ checked, resolutions }: { checked: Checked[]; resolutions: Map<string, Resolution | null> }) {
  const [q, setQ] = useState(SUGGESTIONS[0]);
  const a = answer(q, checked, resolutions);
  return (
    <div>
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rule w-full rounded-full border bg-white px-4 py-2.5 text-[14px] outline-none focus:border-accent"
          placeholder="Ask about a tag"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => setQ(s)} className="rounded-full bg-base-raised px-3 py-1 text-[12px] text-ink-mid transition hover:text-accent">{s}</button>
        ))}
      </div>
      <div className={`mt-3 rounded-xl border p-4 text-[13.5px] leading-relaxed ${a.kind === "answer" && a.checked.verdict === "real conflict" ? "border-bad/30 bg-bad/5" : "rule bg-base-raised"}`}>
        {a.kind === "answer" && <div className="mb-2"><Pill v={a.checked.verdict} /></div>}
        {a.text}
      </div>
    </div>
  );
}
