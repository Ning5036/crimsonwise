// Run: node --experimental-strip-types worker/selftest.mjs  (node ≥ 22.6)
import assert from "node:assert/strict";
import { csvEscape, passwordMatches } from "./index.ts";
// formula injection: leading = + - @ \t \r get a quote prefix; others untouched
for (const [i, o] of [["=1+1", "\"'=1+1\""], ["+5", "\"'+5\""], ["-x", "\"'-x\""], ["@a", "\"'@a\""], ["\tz", "\"'\tz\""], ["\rz", "\"'\rz\""], ["ok", "\"ok\""], ["a\"b", "\"a\"\"b\""], [null, ""], [{ a: 1 }, "\"{\"\"a\"\":1}\""]])
  assert.equal(csvEscape(i), o, `csvEscape(${JSON.stringify(i)})`);
// password: match, mismatch, and different lengths all go through the same digest compare
assert.equal(await passwordMatches("hunter2", "hunter2"), true);
assert.equal(await passwordMatches("hunter2", "hunter3"), false);
assert.equal(await passwordMatches("", "hunter2"), false);
assert.equal(await passwordMatches("hunter2xxxxxxxxxxxxxxxxxxxxxxxx", "hunter2"), false);
console.log("worker selftest ok");
