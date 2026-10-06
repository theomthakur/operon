import { Shell, TopBar, Foot, Code } from "@/components/Chrome";

const GROUPS: { title: string; files: { path: string; stage?: string; what: string }[] }[] = [
  {
    title: "The logic (lib/), in the order data flows through it",
    files: [
      { path: "lib/types.ts", what: "The shapes everything shares: a source document, a reading (value, unit, document, revision, line), a tag record, the four verdicts and the rules." },
      { path: "lib/data.ts", stage: "Input + rules", what: "Six invented plant documents as raw text, the equipment register, and the rules as data: a 2% tolerance and the order in which document types are trusted." },
      { path: "lib/extract.ts", stage: "01 Extract, 02 Group", what: "Reads each line. Keeps it only if it starts with a tag and ends with a number, records which line it came from, and lists what it skipped and why. Then groups readings by tag and property." },
      { path: "lib/units.ts", stage: "03 Convert", what: "The unit table, as data. Every unit knows what it measures and how to reach its comparison unit (barg, degC, m3/h). Gauge versus absolute pressure is handled here, and plain \"bar\" is marked ambiguous." },
      { path: "lib/normalize.ts", stage: "04 Classify", what: "Converts, compares within the tolerance and returns consistent, spurious conflict, real conflict or needs review. Refuses to compare a missing unit or mixed quantities. Re-runs ambiguous cases the other way round and says if the verdict would flip." },
      { path: "lib/resolve.ts", stage: "05 Resolve", what: "Picks the source of truth: most trusted document type first, newest revision on a tie. Never averages. applyResolution() corrects the other documents and the page re-checks." },
      { path: "lib/answer.ts", stage: "Output", what: "Answers a plain question about a tag with the value and its source, or with the conflict when documents disagree. No model; it only reads the checked results." },
      { path: "lib/pipeline.ts", stage: "All stages", what: "run() chains every stage and returns each one's output, so the pages can show their work, plus the counts in the summary." },
    ],
  },
  {
    title: "The pages (app/) and shared pieces (components/)",
    files: [
      { path: "app/page.tsx", what: "Overview: the input-to-output flow with live counts, the two findings, every tag with its verdict, the detail panel with the fix, and Ask the plant." },
      { path: "app/try/page.tsx", what: "The interactive version: edit document text, move the tolerance, reorder the trust list, and watch every stage recompute." },
      { path: "app/architecture/page.tsx", what: "How it works: the pipeline diagram, the design decisions, where it fits in Operon and what I would build next." },
      { path: "app/files/page.tsx", what: "This page." },
      { path: "components/Pipeline.tsx", what: "The flow strip, the tag detail panel (with the resolve and re-check) and the question box." },
      { path: "components/Chrome.tsx", what: "Header, navigation, footer, verdict pills and icons." },
      { path: "app/layout.tsx · app/globals.css · tailwind.config.ts", what: "Page shell, fonts, and the light theme sampled from operonsolutions.com." },
    ],
  },
  {
    title: "Project config",
    files: [
      { path: "package.json · tsconfig.json · next.config.mjs · postcss.config.mjs · vercel.json", what: "Next.js 14, React 18, TypeScript and Tailwind. No other dependencies, no database, no API keys, no model calls." },
    ],
  },
];

export default function Files() {
  return (
    <Shell>
      <TopBar active="/files" />
      <section className="mt-12 max-w-3xl">
        <h1 className="text-[2.2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.6rem]">Every file, explained</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-mid">
          About 600 lines of TypeScript in total. The logic in <Code>lib/</Code> has no UI code in it, so the same functions could run
          on a server against Operon&apos;s extracted data.
        </p>
      </section>
      {GROUPS.map((g) => (
        <section key={g.title} className="mt-10">
          <h2 className="text-[15px] font-semibold">{g.title}</h2>
          <div className="rule mt-3 overflow-hidden rounded-xl border">
            {g.files.map((f) => (
              <div key={f.path} className="hair grid gap-1 border-b px-4 py-3 last:border-b-0 sm:grid-cols-[17rem_1fr] sm:gap-4">
                <div>
                  <p className="font-mono text-[12.5px] font-medium">{f.path}</p>
                  {f.stage && <p className="mt-0.5 text-[11px] font-medium text-accent">{f.stage}</p>}
                </div>
                <p className="text-[13px] leading-relaxed text-ink-mid">{f.what}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
      <Foot note={<>Source: github.com/theomthakur/operon</>} />
    </Shell>
  );
}
