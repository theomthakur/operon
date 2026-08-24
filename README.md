# Same Tag

> **Live demo:** [operon-pink.vercel.app](https://operon-pink.vercel.app/)


A unit-aware reconciliation check for plant document sets, built as a demo for Operon.

Operon ingests SOPs, P&IDs, datasheets and vendor documents and turns them into a structured,
queryable model of a facility. Same Tag checks the thing extraction alone cannot: whether three
documents citing one equipment tag actually agree.

**The finding:** TI-3310 reads `350` in both documents that cite it. One is degF and one is degC,
a 98% gap on a reactor bed design temperature, invisible to any comparison that reads the numbers
off the page. In the other direction, 4 of 7 tags flagged as conflicts are not conflicts at all,
just the same value expressed in different units.

## What it checks

1. Every reading kept with its source document, revision and unit.
2. All readings converted to one canonical unit before any comparison.
3. Conflicts classified as real or spurious, so the queue stays worth reading.

## Stack

Next.js 14, TypeScript, Tailwind. `lib/normalize.ts` is the deterministic conversion and
comparison; `lib/data.ts` is seven invented tags engineered to produce the finding above.

## Run it

```
npm install
npm run dev
```
