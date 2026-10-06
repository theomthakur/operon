"use client";

import { useMemo, useState } from "react";
import { Shell, TopBar, Foot, Code, Pill, Sect } from "@/components/Chrome";
import { AskBox } from "@/components/Pipeline";
import { run } from "@/lib/pipeline";
import { DOCUMENTS, DEFAULT_RULES } from "@/lib/data";
import type { DocType, SourceDoc } from "@/lib/types";

const EXPERIMENTS = [
  { label: "Make the PSV-1042 datasheet say bara", doc: "pds", from: "10.34 bar", to: "10.34 bara", what: "PSV-1042 turns into a real conflict: absolute and gauge differ by one atmosphere." },
  { label: "Delete the unit on TV-5501 in the vendor sheet", doc: "vd", from: "260 degC", to: "260", what: "TV-5501 goes to needs review. The checker refuses to guess a unit." },
  { label: "Fix the line list to 177 degC", doc: "ll", from: "350 degC", to: "177 degC", what: "TI-3310 becomes a spurious conflict: the line list now agrees with the P&ID." },
  { label: "Add a new tag to the P&ID", doc: "pid", from: "TV-5501 | Design temperature | 180 degC", to: "TV-5501 | Design temperature | 180 degC\nLT-6001 | Range max | 4.5 barg", what: "A new tag appears with one source, so there is nothing to compare yet." },
];

export default function Try() {
  const [docs, setDocs] = useState<SourceDoc[]>(DOCUMENTS);
  const [active, setActive] = useState(DOCUMENTS[0].id);
  const [tolerance, setTolerance] = useState(DEFAULT_RULES.tolerance);
  const [authority, setAuthority] = useState<DocType[]>(DEFAULT_RULES.authority);
  const [showSkipped, setShowSkipped] = useState(false);

  const rules = { tolerance, authority };
  const r = useMemo(() => run(docs, { tolerance, authority }), [docs, tolerance, authority]);
  const doc = docs.find((d) => d.id === active)!;

  const edit = (id: string, text: string) => setDocs((ds) => ds.map((d) => (d.id === id ? { ...d, text } : d)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= authority.length) return;
    const next = [...authority];
    [next[i], next[j]] = [next[j], next[i]];
    setAuthority(next);
  };
  const tryIt = (e: (typeof EXPERIMENTS)[number]) => {
    setDocs((ds) => ds.map((d) => (d.id === e.doc ? { ...d, text: d.text.replace(e.from, e.to) } : d)));
    setActive(e.doc);
  };
  const reset = () => { setDocs(DOCUMENTS); setTolerance(DEFAULT_RULES.tolerance); setAuthority(DEFAULT_RULES.authority); };

  return (
    <Shell>
      <TopBar active="/try" />
      <section className="mt-12 max-w-3xl">
        <h1 className="text-[2.1rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.6rem]">Change the input, watch the output</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-mid">
          On the left, the text of six plant documents and the two rules the checker follows. On the right, what every stage
          produces from them, recomputed on each keystroke.
        </p>
      </section>

      <section className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-[12px] text-ink-dim">Try:</span>
        {EXPERIMENTS.map((e) => (
          <button key={e.label} onClick={() => tryIt(e)} title={e.what} className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-[12px] text-accent transition hover:bg-accent hover:text-white">{e.label}</button>
        ))}
        <button onClick={reset} className="rounded-full bg-base-raised px-3 py-1 text-[12px] text-ink-mid hover:text-ink">Reset</button>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* INPUT */}
        <div className="space-y-5">
          <div className="rule rounded-xl border p-4">
            <Sect n="IN" t="Documents" />
            <div className="mt-3 flex flex-wrap gap-1">
              {docs.map((d) => (
                <button key={d.id} onClick={() => setActive(d.id)} className={`rounded-full px-3 py-1 text-[12px] ${active === d.id ? "bg-accent text-white" : "bg-base-raised text-ink-mid hover:text-ink"}`}>{d.type}</button>
              ))}
            </div>
            <p className="mt-3 text-[12.5px] text-ink-mid">{doc.title} · Rev {doc.revision}</p>
            <textarea
              value={doc.text}
              onChange={(e) => edit(doc.id, e.target.value)}
              spellCheck={false}
              rows={8}
              className="rule mt-2 w-full rounded-lg border bg-base-raised p-3 font-mono text-[12.5px] leading-relaxed outline-none focus:border-accent"
            />
            <p className="mt-1 text-[11.5px] text-ink-dim">A line counts when it starts with a tag and ends with a number. Anything else is skipped, and listed.</p>
          </div>

          <div className="rule rounded-xl border p-4">
            <Sect n="RULES" t="What the checker trusts" />
            <label className="mt-3 block text-[13px]">
              Tolerance after conversion: <span className="font-mono font-semibold text-accent">{(tolerance * 100).toFixed(1)}%</span>
              <input type="range" min={0} max={0.1} step={0.005} value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))} className="mt-2 w-full accent-[#1F3ACB]" />
            </label>
            <p className="mt-4 text-[13px]">Order of trust, most trusted first</p>
            <ol className="mt-2 space-y-1">
              {authority.map((a, i) => (
                <li key={a} className="hair flex items-center justify-between rounded-lg border px-3 py-1.5 text-[12.5px]">
                  <span><span className="mr-2 font-mono text-ink-dim">{i + 1}</span>{a}</span>
                  <span className="flex gap-1">
                    <button onClick={() => move(i, -1)} className="rounded px-1.5 text-ink-dim hover:bg-base-raised hover:text-accent" aria-label="Move up">&uarr;</button>
                    <button onClick={() => move(i, 1)} className="rounded px-1.5 text-ink-dim hover:bg-base-raised hover:text-accent" aria-label="Move down">&darr;</button>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-2 text-[11.5px] text-ink-dim">These live in <Code>lib/data.ts</Code> as data. A plant that trusts its datasheets over its P&amp;IDs changes the list, not the code.</p>
          </div>
        </div>

        {/* OUTPUT */}
        <div className="space-y-5">
          <div className="rule rounded-xl border p-4">
            <Sect n="01" t={`Readings extracted: ${r.readings.length}`} />
            <div className="mt-3 max-h-56 overflow-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="text-[10.5px] uppercase tracking-wider text-ink-dim"><tr><th className="py-1">Tag</th><th>Property</th><th>Value</th><th>Document</th></tr></thead>
                <tbody>
                  {r.readings.map((x, i) => (
                    <tr key={i} className="hair border-t">
                      <td className="py-1 font-mono">{x.tag}</td><td>{x.property}</td>
                      <td className="font-mono">{x.value} {x.unit ?? <span className="text-bad">no unit</span>}</td>
                      <td className="text-ink-mid">{x.docType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setShowSkipped(!showSkipped)} className="mt-2 text-[12px] text-accent">{showSkipped ? "Hide" : "Show"} {r.skipped.length} skipped lines</button>
            {showSkipped && (
              <ul className="mt-2 space-y-1 text-[11.5px] text-ink-mid">
                {r.skipped.map((s, i) => <li key={i}><span className="font-mono">&ldquo;{s.line}&rdquo;</span> &middot; {s.why}</li>)}
              </ul>
            )}
          </div>

          <div className="rule rounded-xl border p-4">
            <Sect n="02-05" t={`Grouped, converted, classified: ${r.records.length} tags`} />
            <div className="mt-3 space-y-1.5">
              {r.checked.map((c) => {
                const res = r.resolutions.get(c.record.tag + "::" + c.record.property);
                return (
                  <div key={c.record.tag + c.record.property} className="hair grid grid-cols-[6rem_1fr_auto] items-center gap-2 rounded-lg border px-3 py-2 text-[12px]">
                    <span className="font-mono font-medium">{c.record.tag}</span>
                    <span className="text-ink-mid">
                      {c.normalized.map((n) => (n.canonical === null ? "?" : `${n.canonical.toFixed(2)}`)).join(" / ")} {c.normalized[0]?.canonicalUnit ?? ""}
                      {res && <span className="block text-[11px] text-ink-dim">truth: {res.chosen.reading.docType}</span>}
                    </span>
                    <span className="flex items-center gap-1">{c.assumptionNote && <span className="text-warn" title={c.assumptionNote}>*</span>}<Pill v={c.verdict} /></span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 font-mono text-[11.5px] text-ink-mid">
              raw flags {r.counts.naiveFlags} &rarr; real {r.counts.real} · spurious {r.counts.spurious} · hidden {r.counts.hidden} · review {r.counts.review}
            </p>
          </div>

          <div className="rule rounded-xl border p-4">
            <Sect n="OUT" t="Answer" />
            <div className="mt-3"><AskBox checked={r.checked} resolutions={r.resolutions} /></div>
          </div>
        </div>
      </section>

      <Foot note={<>Built for Operon by Om Thakur. The documents are invented. Rules in effect: tolerance {(rules.tolerance * 100).toFixed(1)}%, {rules.authority[0]} trusted first.</>} />
    </Shell>
  );
}
