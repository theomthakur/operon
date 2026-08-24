import Link from "next/link";
import { Shell, TopBar, Foot, Sect, Code } from "@/components/Chrome";

export default function Architecture() {
  return (
    <Shell>
      <TopBar />
      <section className="mt-14 max-w-3xl">
        <h1 className="text-[2.2rem] font-semibold leading-[1.1] tracking-tight sm:text-[2.6rem]">How this works</h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ink/75">
          Operon ingests messy plant documents and turns them into a structured model an engineer
          can query in natural language. Extraction gets a value off a page. Reconciliation decides
          which of three values for the same tag is the one to answer with, and that decision
          cannot be made on the numbers alone.
        </p>
      </section>

      <section className="mt-12 max-w-2xl">
        <Sect n="01" t="Why the unit travels with the value" />
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink/75">
          <Code>check()</Code> in <Code>lib/normalize.ts</Code> never compares raw numbers. Every
          reading is converted to a canonical unit first, then compared with a tolerance. Dropping
          the unit at extraction time makes this check impossible later, which is why the unit has
          to be a first-class field on the reading rather than something parsed back out of a
          string when someone asks.
        </p>
      </section>

      <section className="mt-12 max-w-2xl">
        <Sect n="02" t="Why spurious conflicts are worth naming" />
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink/75">
          A system that flags every numeric difference produces a queue of discrepancies, most of
          which resolve to nothing. Engineers stop reading the queue. Separating a spurious
          conflict from a real one is what keeps the real one visible, and it is the reason this
          returns three verdicts rather than a boolean.
        </p>
      </section>

      <section className="mt-12 max-w-2xl">
        <Sect n="03" t="What I would not ship yet" />
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink/75">
          Revision is carried but not used. In a real document set the newest revision usually
          wins, and a conflict between Rev 2 and Rev 6 is a different problem than a conflict
          between two current documents. This also assumes the unit was extracted correctly, which
          for a scanned P&amp;ID is the least safe assumption in the pipeline. A production version
          needs an extraction confidence on the unit itself, and should refuse rather than convert
          when that confidence is low.
        </p>
      </section>

      <section className="mt-12 max-w-2xl">
        <Sect n="04" t="Where this sits in the product" />
        <p className="mt-3 text-[13.5px] leading-relaxed text-ink/75">
          This runs between extraction and the queryable model, so a natural language answer about
          a tag can carry which document it came from and whether the other documents agree. A tag
          with an unresolved real conflict should answer with the conflict rather than picking a
          side silently, because on a design temperature that choice is a safety decision, not a
          data quality one.
        </p>
      </section>

      <div className="mt-14">
        <Link href="/" className="text-[13px] text-accent transition hover:opacity-80">&larr; Back to the tags</Link>
      </div>
      <Foot note={<>Built for Operon by Om Thakur.</>} />
    </Shell>
  );
}
