"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Shell, TopBar, Foot, Code, Pill, Sect } from "@/components/Chrome";
import { FlowStrip, TagDetail, AskBox, type Stage } from "@/components/Pipeline";
import { run } from "@/lib/pipeline";
import { DOCUMENTS, DEFAULT_RULES } from "@/lib/data";

export default function Page() {
  const r = useMemo(() => run(DOCUMENTS, DEFAULT_RULES), []);
  const key = (c: { record: { tag: string; property: string } }) => c.record.tag + "::" + c.record.property;
  const hidden = r.checked.find((c) => c.verdict === "real conflict" && c.naiveVerdict === "consistent")!;
  const [openKey, setOpenKey] = useState(key(hidden));
  const open = r.checked.find((c) => key(c) === openKey)!;

  const stages: Stage[] = [
    { n: "IN", title: "Plant documents", detail: "P&IDs, datasheets, line lists, vendor sheets", stat: `${r.docs.length} documents` },
    { n: "01", title: "Extract readings", detail: "Tag, property, value and unit, with the line it came from", stat: `${r.readings.length} readings · ${r.skipped.length} lines skipped` },
    { n: "02", title: "Group by tag", detail: "Every document that cites the same tag and property", stat: `${r.records.length} tags` },
    { n: "03", title: "Convert units", detail: "psig, bar, degF, gpm into one unit per quantity", stat: "barg · degC · m3/h" },
    { n: "04", title: "Compare and classify", detail: `Within ${(DEFAULT_RULES.tolerance * 100).toFixed(0)}% counts as the same value`, stat: `${r.counts.consistent} ok · ${r.counts.spurious} spurious · ${r.counts.real} real` },
    { n: "05", title: "Pick the source of truth", detail: "Most trusted document type, then newest revision", stat: "rules, not code" },
    { n: "OUT", title: "Answer with sources", detail: "One value per tag, or the conflict, never a silent guess", stat: "ask below" },
  ];

  return (
    <Shell>
      <TopBar active="/" />

      <section className="mt-12 grid gap-8 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2">
          <span className="inline-block rounded-full bg-accent-soft px-3 py-1 text-[11.5px] font-medium text-accent">Concept · Reconciling what the documents say</span>
          <h1 className="mt-4 text-[2.3rem] font-semibold leading-[1.08] tracking-tight sm:text-[3rem]">Same number is not the same value.</h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-mid">
            A plant document set mixes psig and bar, degF and degC, gpm and cubic metres per hour freely. Comparing the raw
            numbers on the page gets it wrong in <span className="font-medium text-ink">both directions at once</span>: values
            that differ but mean the same thing, and values that match but do not.
          </p>
        </div>
        <div className="rule rounded-2xl border bg-base-raised p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Where this fits at Operon</p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-mid">
            P&amp;ID recognition gets the value off the page. Knowledge Chat answers questions about it. In between, someone has
            to decide which of three values for one tag is the one to answer with. That step decides whether an engineer can
            trust the answer, and it matters most in MOC and HAZOP work, where the number is a safety input.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <Sect n="FLOW" t="From documents to an answer you can trust" />
        <div className="mt-4"><FlowStrip stages={stages} /></div>
        <p className="mt-3 text-[12.5px] text-ink-dim">
          Every stage runs in the browser, in plain TypeScript, with no model in the decision path. <Link href="/try" className="text-accent hover:underline">Edit the documents and watch each stage change &rarr;</Link>
        </p>
      </section>

      <div className="mt-10 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border-2 border-bad/30 bg-bad/5 p-5 text-[13.5px] leading-relaxed">
          <span className="font-semibold text-bad">TI-3310 reads 350 in both documents and they do not agree.</span> One is degF, one is
          degC, a {(hidden.spread * 100).toFixed(0)}% gap on a reactor bed design temperature that looks identical on the page. A raw
          comparison calls it consistent.
        </div>
        <div className="rounded-xl border-2 border-warn/30 bg-warn/5 p-5 text-[13.5px] leading-relaxed">
          <span className="font-semibold text-warn">{r.counts.spurious} of {r.counts.naiveFlags} raw &ldquo;conflicts&rdquo; are not conflicts at all.</span> Same
          value, different unit. And one of them, PSV-1042, only agrees if the datasheet&apos;s plain &ldquo;bar&rdquo; means gauge. The
          check says so instead of hiding it.
        </div>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="rule overflow-hidden rounded-xl border">
            <div className="hair grid grid-cols-[6.2rem_1fr_auto] gap-2 border-b bg-base-raised px-4 py-2 text-[10.5px] uppercase tracking-wider text-ink-dim">
              <span>Tag</span><span>Raw compare</span><span>After conversion</span>
            </div>
            {r.checked.map((c) => (
              <button
                key={key(c)}
                onClick={() => setOpenKey(key(c))}
                className={`hair grid w-full grid-cols-[6.2rem_1fr_auto] items-center gap-2 border-b px-4 py-2.5 text-left transition last:border-b-0 hover:bg-base-raised ${openKey === key(c) ? "bg-accent-soft" : ""}`}
              >
                <span>
                  <span className="block font-mono text-[12.5px] font-medium">{c.record.tag}</span>
                  <span className="block truncate text-[11px] text-ink-dim">{c.record.property}</span>
                </span>
                <span><Pill v={c.naiveVerdict} /></span>
                <span className="flex items-center gap-1">{c.assumptionNote && <span title="rests on an assumption" className="text-warn">*</span>}<Pill v={c.verdict} /></span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11.5px] text-ink-dim">* the verdict rests on an assumption that the detail spells out.</p>
        </div>
        <div className="rule rounded-xl border p-5 lg:col-span-3">
          <TagDetail key={openKey} c={open} resolution={r.resolutions.get(openKey) ?? null} />
        </div>
      </section>

      <section className="mt-12">
        <Sect n="OUT" t="Ask the plant" />
        <p className="mt-2 max-w-2xl text-[13px] text-ink-mid">
          The output end of the flow. Every answer names the document it came from, and a tag with an unresolved conflict answers
          with the conflict rather than picking a side, because on a design temperature that choice is a safety decision.
        </p>
        <div className="mt-4 max-w-3xl"><AskBox checked={r.checked} resolutions={r.resolutions} /></div>
      </section>

      <Foot note={<>Built for Operon by Om Thakur. Every tag, document and value here is invented. Extraction, unit conversion, classification and the source-of-truth rule run in <Code>lib/</Code> with no model in the loop.</>} />
    </Shell>
  );
}
