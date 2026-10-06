import Link from "next/link";
import { Shell, TopBar, Foot, Sect, Code } from "@/components/Chrome";

const BOXES = [
  { x: 10, label: "Documents", sub: "P&ID, datasheet, line list", file: "lib/data.ts", tone: "accent" },
  { x: 160, label: "Extract", sub: "tag, property, value, unit", file: "lib/extract.ts" },
  { x: 310, label: "Group", sub: "same tag + property", file: "lib/extract.ts" },
  { x: 460, label: "Convert", sub: "one unit per quantity", file: "lib/units.ts" },
  { x: 610, label: "Classify", sub: "within tolerance?", file: "lib/normalize.ts" },
  { x: 760, label: "Resolve", sub: "source-of-truth rule", file: "lib/resolve.ts" },
  { x: 910, label: "Answer", sub: "value + its source", file: "lib/answer.ts", tone: "accent" },
];

function Diagram() {
  return (
    <div className="rule overflow-x-auto rounded-xl border bg-base-raised p-4">
      <svg viewBox="0 0 1050 190" className="min-w-[760px]" role="img" aria-label="Pipeline from documents to answer">
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#1F3ACB" /></marker>
        </defs>
        {BOXES.map((b, i) => (
          <g key={b.label}>
            <rect x={b.x} y={30} width={130} height={78} rx={12} fill={b.tone ? "#EEF1FD" : "#FFFFFF"} stroke={b.tone ? "#1F3ACB" : "#D9DAE0"} />
            <text x={b.x + 65} y={58} textAnchor="middle" fontSize="14" fontWeight="600" fill="#1A1A1A">{b.label}</text>
            <text x={b.x + 65} y={78} textAnchor="middle" fontSize="10.5" fill="#55585F">{b.sub}</text>
            <text x={b.x + 65} y={97} textAnchor="middle" fontSize="9.5" fill="#1F3ACB" fontFamily="IBM Plex Mono, monospace">{b.file}</text>
            {i < BOXES.length - 1 && <line x1={b.x + 132} y1={69} x2={b.x + 158} y2={69} stroke="#1F3ACB" strokeWidth="1.6" markerEnd="url(#arr)" />}
          </g>
        ))}
        <rect x={460} y={135} width={430} height={40} rx={10} fill="#FFFFFF" stroke="#D9DAE0" strokeDasharray="4 3" />
        <text x={675} y={159} textAnchor="middle" fontSize="11" fill="#55585F">Rules as data: tolerance + order of trust (lib/data.ts)</text>
        <line x1={675} y1={135} x2={675} y2={110} stroke="#8A8D94" strokeDasharray="3 3" />
        <line x1={825} y1={135} x2={825} y2={110} stroke="#8A8D94" strokeDasharray="3 3" />
        <text x={10} y={18} fontSize="10.5" fill="#8A8D94">INPUT</text>
        <text x={1040} y={18} textAnchor="end" fontSize="10.5" fill="#8A8D94">OUTPUT</text>
      </svg>
    </div>
  );
}

export default function Architecture() {
  return (
    <Shell>
      <TopBar active="/architecture" />
      <section className="mt-12 max-w-3xl">
        <h1 className="text-[2.2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.6rem]">How this works</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-ink-mid">
          Operon reads the documents a plant runs on and turns them into one queryable model. Extraction gets a value off a page.
          Reconciliation decides which of three values for the same tag is the one to answer with, and that decision cannot be
          made on the numbers alone.
        </p>
      </section>

      <section className="mt-8"><Diagram /></section>

      <section className="mt-12 grid gap-10 lg:grid-cols-2">
        <div>
          <Sect n="01" t="The unit travels with the value" />
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-mid">
            <Code>extract()</Code> keeps the unit as its own field on every reading, plus the document, revision and the exact line
            it came from. Dropping the unit at extraction time makes every later check impossible. A number with no unit is kept
            with the unit set to null, never guessed.
          </p>
        </div>
        <div>
          <Sect n="02" t="Gauge and absolute are different numbers" />
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-mid">
            Pressure is compared in barg. psia and bara subtract one atmosphere first. Plain &ldquo;bar&rdquo; is ambiguous, so it is read
            as gauge and the check runs a second time the other way round. If the verdict would change, the page says so. On a
            relief valve set pressure that one atmosphere is about 10%.
          </p>
        </div>
        <div>
          <Sect n="03" t="Three verdicts and a refusal" />
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-mid">
            A queue that flags every numeric difference fills up with noise and engineers stop reading it. So a difference is
            classified as spurious (units only) or real, and a reading the checker cannot compare safely, such as a missing unit
            or a pressure mixed with a temperature, goes to <span className="font-medium text-ink">needs review</span> instead of a guess.
          </p>
        </div>
        <div>
          <Sect n="04" t="The fix is a rule, not an average" />
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-mid">
            <Code>resolve()</Code> picks the reading from the most trusted document type, and the newer revision between two of
            the same type. The order of trust and the tolerance live in <Code>lib/data.ts</Code> as data, because every plant
            and every EPC ranks its documents differently. Changing them is a config change, and the Try it page lets you do it live.
          </p>
        </div>
        <div>
          <Sect n="05" t="Where it sits in Operon" />
          <p className="mt-3 text-[13.5px] leading-relaxed text-ink-mid">
            Between P&amp;ID recognition and Knowledge Chat. An answer about a tag carries its source and whether other documents
            agree. For MOC packets and HAZOP revalidation, an unresolved real conflict should block the record, because the
            number is a safety input, not a data-quality detail.
          </p>
        </div>
        <div>
          <Sect n="06" t="What I would build next" />
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[13.5px] leading-relaxed text-ink-mid">
            <li>Use Operon&apos;s per-tag confidence: a low-confidence unit should go to review rather than be converted.</li>
            <li>A revision register, so a superseded Rev 2 never conflicts with a current Rev 6.</li>
            <li>More units and forms: kPa, MPa, kg/h, ranges like 0 to 25 barg, and design versus operating values.</li>
            <li>Property matching that knows &ldquo;Design temp&rdquo; and &ldquo;Design temperature&rdquo; are the same field.</li>
            <li>An audit log of every resolution: who adopted which document, and when.</li>
          </ul>
        </div>
      </section>

      <div className="mt-14 flex gap-4 text-[13px]">
        <Link href="/" className="text-accent hover:underline">&larr; Overview</Link>
        <Link href="/try" className="text-accent hover:underline">Try it</Link>
        <Link href="/files" className="text-accent hover:underline">Every file explained</Link>
      </div>
      <Foot note={<>Built for Operon by Om Thakur.</>} />
    </Shell>
  );
}
