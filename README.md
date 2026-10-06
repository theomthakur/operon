# Same Tag

> **Live demo:** [operon-pink.vercel.app](https://operon-pink.vercel.app/) · Try it: [/try](https://operon-pink.vercel.app/try) · Every file: [/files](https://operon-pink.vercel.app/files)

A unit-aware reconciliation check for plant document sets, built as a demo for Operon.

Operon reads the documents a plant runs on (P&IDs, line lists, datasheets) and turns them into one queryable
model. Same Tag checks the step between extraction and the answer: whether the documents citing one equipment
tag actually agree.

**The finding:** TI-3310 reads `350` in both documents that cite it. One is degF and one is degC, a 98% gap on
a reactor bed design temperature, invisible to any comparison that reads the numbers off the page. In the other
direction, 4 of the 5 raw "conflicts" are not conflicts at all, just the same value in different units.

## The flow, input to output

```
documents (text) -> extract readings -> group by tag -> convert units -> compare and classify -> pick source of truth -> answer with source
   lib/data.ts       lib/extract.ts     lib/extract.ts   lib/units.ts     lib/normalize.ts       lib/resolve.ts          lib/answer.ts
```

1. **Extract.** A line counts if it starts with a tag and ends with a number. The unit, document, revision and
   line number stay attached. A number with no unit is kept with `unit: null`, never guessed.
2. **Convert.** One unit per quantity: barg, degC, m3/h. Gauge versus absolute pressure is handled; plain "bar"
   is ambiguous, so the check also runs the other way round and reports if the verdict would flip.
3. **Classify.** consistent, spurious conflict (units only), real conflict, or needs review (missing unit or
   mixed quantities).
4. **Resolve.** Never an average. The most trusted document type wins, then the newest revision.
5. **Answer.** A question about a tag returns the value and its source, or the conflict.

The tolerance (2%) and the order of trust live in `lib/data.ts` as data, not code. The `/try` page lets you edit
the documents and the rules and watch every stage recompute.

## Stack

Next.js 14, TypeScript, Tailwind. No database, no API keys, no model calls. Every tag, document and value is invented.

## Run it

```
npm install
npm run dev
```
