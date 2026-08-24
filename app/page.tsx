"use client";

import { useMemo, useState } from "react";
import { Shell, TopBar, Foot, Code } from "@/components/Chrome";
import { checkAll } from "@/lib/normalize";
import { RECORDS } from "@/lib/data";
import type { Checked } from "@/lib/types";

const V_STYLE: Record<string, string> = {
  consistent: "text-good",
  "spurious conflict": "text-warn",
  "real conflict": "text-bad",
};

export default function Page() {
  const [resolvedTags, setResolvedTags] = useState<Set<string>>(new Set());
  // The fix for a real conflict is not averaging the two numbers. It is
  // adopting the P&ID as the authoritative document, since that is what a
  // plant actually treats as the master reference, and re-running the same
  // conversion check with every reading set to that value and unit.
  const rows = useMemo(
    () =>
      checkAll(
        RECORDS.map((rec) => {
          if (!resolvedTags.has(rec.tag)) return rec;
          const authoritative = rec.readings[0];
          return { ...rec, readings: rec.readings.map((r) => ({ ...r, value: authoritative.value, unit: authoritative.unit })) };
        })
      ),
    [resolvedTags]
  );
  const [openId, setOpenId] = useState(
    rows.find((r) => r.verdict === "real conflict" && r.naiveVerdict === "consistent")!.record.tag
  );
  const open = rows.find((r) => r.record.tag === openId)!;
  const spurious = rows.filter((r) => r.verdict === "spurious conflict");
  const hidden = rows.filter((r) => r.verdict === "real conflict" && r.naiveVerdict === "consistent");
  function resolveConflict(tag: string) {
    setResolvedTags((prev) => new Set(prev).add(tag));
  }

  return (
    <Shell>
      <TopBar />

      <section className="mt-10 grid gap-8 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2">
          <span className="inline-block rounded-full border border-accent/30 bg-accent/[0.08] px-3 py-1 text-[11px] font-medium text-accent">
            Concept · Document reconciliation
          </span>
          <h1 className="mt-4 text-[2.3rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.9rem]">
            Same number is not the same value.
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/75">
            A plant document set mixes psig and bar, degF and degC, gpm and cubic metres per hour
            freely. Comparing the raw numbers on the page gets it wrong in{" "}
            <span className="font-medium text-ink">both directions at once</span>: values that
            differ but mean the same thing, and values that match but do not.
          </p>
        </div>
        <div className="rounded-2xl border border-accent/20 bg-base-raised p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Where this fits at Operon</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink/75">
            Operon turns messy plant documents into a structured, queryable model of the facility.
            The extraction is the visible half. Deciding which of three cited values for one tag is
            authoritative is the half that decides whether an engineer can trust the query.
          </p>
        </div>
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {["Every reading kept with its source document, revision and unit", "All readings converted to one canonical unit before comparison", "Conflicts classified as real or spurious, not just flagged"].map((t, i) => (
          <div key={i} className="rule rounded-xl border bg-base-raised p-4">
            <div className="mb-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-base">{i + 1}</div>
            <p className="text-[13px] text-ink/85">{t}</p>
          </div>
        ))}
      </div>

      <div className="rule mt-8 rounded-xl border-2 border-bad/40 bg-bad/[0.07] p-5">
        <p className="text-[13.5px] leading-relaxed text-ink">
          <span className="font-semibold text-bad">TI-3310 reads 350 in both documents and they do not agree.</span>{" "}
          One is degF, one is degC, a 98% gap on a reactor bed design temperature that looks
          identical on the page. Meanwhile {spurious.length} of {rows.length} tags flagged as
          conflicts are not conflicts at all, just the same value in different units. Open TI-3310
          below and resolve it to see the fix.
        </p>
      </div>

      <section className="mt-10">
        <div className="rule overflow-hidden rounded-xl border">
          <div className="hair grid grid-cols-[7rem_1fr_8rem_9.5rem] gap-2 border-b bg-base-raised px-4 py-2 text-[10.5px] uppercase tracking-wider text-ink-dim">
            <span>Tag</span><span>Property</span><span className="text-right">Raw compare</span><span className="text-right">After conversion</span>
          </div>
          {rows.map((r) => (
            <button
              key={r.record.tag}
              onClick={() => setOpenId(r.record.tag)}
              className={`hair grid w-full grid-cols-[7rem_1fr_8rem_9.5rem] gap-2 border-b px-4 py-2.5 text-left text-[13.5px] transition last:border-b-0 hover:bg-base-raised ${openId === r.record.tag ? "bg-base-raised" : ""} ${r.verdict === "real conflict" && r.naiveVerdict === "consistent" ? "bg-bad/[0.06]" : ""}`}
            >
              <span className="font-mono text-[12px] text-ink/85">{r.record.tag}</span>
              <span className="truncate text-ink-mid">{r.record.property}</span>
              <span className={`text-right font-mono text-[11.5px] ${r.naiveVerdict === "consistent" ? "text-good" : "text-warn"}`}>{r.naiveVerdict}</span>
              <span className={`text-right font-mono text-[11.5px] ${V_STYLE[r.verdict]}`}>{r.verdict}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="rule rounded-xl border p-5">
          <Detail r={open} isResolved={resolvedTags.has(open.record.tag)} onResolve={() => resolveConflict(open.record.tag)} />
        </div>
      </section>

      <Foot note={<>Built for Operon by Om Thakur. Every tag, document and value here is invented. Unit normalisation and the resolve re-check both run in <Code>lib/normalize.ts</Code> with no model in the loop.</>} />
    </Shell>
  );
}

function Detail({ r, isResolved, onResolve }: { r: Checked; isResolved: boolean; onResolve: () => void }) {
  const isRealConflict = r.verdict === "real conflict";
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="font-mono text-[15px] font-semibold">{r.record.tag}</p>
          <p className="text-[12.5px] text-ink-mid">{r.record.equipment} · {r.record.property}</p>
        </div>
        <p className={`font-mono text-[12.5px] ${V_STYLE[r.verdict]}`}>{isResolved ? "resolved" : r.verdict}</p>
      </div>
      <div className="mt-4 space-y-2">
        {r.normalized.map((n, i) => (
          <div key={i} className="hair flex items-center justify-between gap-3 rounded-lg border p-3">
            <div>
              <p className="text-[13px] text-ink/85">{n.reading.doc} <span className="text-ink-dim">· {n.reading.revision}</span></p>
              <p className="mt-0.5 font-mono text-[12px] text-ink-mid">
                states {n.reading.value} {n.reading.unit}
              </p>
            </div>
            <span className="shrink-0 font-mono text-[12px] text-accent">
              = {n.canonical.toFixed(2)} {n.canonicalUnit}
            </span>
          </div>
        ))}
      </div>
      <p className="hair mt-3 rounded-lg border bg-base-raised p-3 text-[13px] leading-relaxed text-ink/80">{r.note}</p>
      {isRealConflict && !isResolved && (
        <div className="hair mt-3 rounded-lg border bg-bad/[0.05] p-3">
          <p className="text-[13px] leading-relaxed text-ink/85">
            <span className="font-semibold text-bad">Two documents genuinely disagree, and averaging them is not an answer.</span>{" "}
            Adopting the P&amp;ID as the authoritative source and correcting every other document
            to match it is the fix an engineer would actually make.
          </p>
          <button onClick={onResolve} className="mt-3 rounded-lg bg-accent px-3.5 py-2 text-[12.5px] font-medium text-base transition hover:opacity-85">
            Adopt the P&amp;ID as authoritative &rarr;
          </button>
        </div>
      )}
      {isResolved && (
        <p className="hair mt-3 rounded-lg border bg-good/[0.06] p-3 text-[13px] leading-relaxed text-ink/85">
          <span className="font-semibold text-good">Resolved.</span> Every document now cites the
          P&amp;ID value. A query against this tag returns one number, not three.
        </p>
      )}
    </div>
  );
}
