// Warning Label for Humans: One Line, Big Laugh
// make.fun entry — writes the single-line safety warning label to
// $MAKEFUN_OUTPUT_DIR/entry.txt (the gate checks /output/entry.txt).
//
// The gate: UTF-8 text, 1–160 characters, a single line, not only
// whitespace. This program validates the line against the gate before
// writing it, and refuses to write anything invalid.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry. One line, real label wording, the laugh lands in the
// last few words: telling a human to "calm down" voids the warranty.
const ENTRY =
  "WARNING: Contains one (1) human. Runs on caffeine, spite, and " +
  "three hours of sleep. Do not shake. Saying 'calm down' voids " +
  "the warranty.";

function validate(line) {
  // Must be a non-empty string.
  if (typeof line !== "string" || line.length === 0) {
    throw new Error("entry must be a non-empty string");
  }
  // Must not be only whitespace.
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  // No leading or trailing whitespace: a printed label has clean edges.
  if (line !== line.trim()) {
    throw new Error("entry must not have leading or trailing whitespace");
  }
  // Single line: no newline, carriage return, or other line breaks.
  if (/[\r\n\u2028\u2029]/.test(line)) {
    throw new Error("entry must be a single line");
  }
  // No invisible control characters: a printed label shows every glyph.
  // (Tab is the only control character a label might plausibly carry;
  // this entry has none, so reject them all outright.)
  if (/[\u0000-\u001f\u007f]/.test(line)) {
    throw new Error("entry must not contain control characters");
  }
  // Gate length: 1–160 characters (code points, so emoji count once).
  const length = [...line].length;
  if (length < 1 || length > 160) {
    throw new Error(`entry is ${length} characters, gate allows 1-160`);
  }
  return length;
}

function main() {
  const length = validate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  // Write UTF-8, exactly the line, no trailing newline: the gate
  // counts characters, and a stray newline would be a second line.
  writeFileSync(outPath, ENTRY, "utf8");
  console.log(`wrote ${outPath} (${length} chars)`);
  console.log(ENTRY);
}

main();
