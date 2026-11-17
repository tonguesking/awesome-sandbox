import assert from "node:assert/strict";
import { test } from "vitest";
import { daysSince, formatVerifiedOn, isStaleVerification, STALE_AFTER_DAYS } from "./freshness";

const now = new Date("2026-11-15T12:00:00Z");

test("daysSince counts whole days from the read date", () => {
  assert.equal(daysSince("2026-11-15", now), 0);
  assert.equal(daysSince("2026-11-14", now), 1);
  assert.equal(daysSince("2026-08-17", now), STALE_AFTER_DAYS);
});

test("only verifications older than the window are stale", () => {
  assert.equal(isStaleVerification("2026-08-17", now), false);
  assert.equal(isStaleVerification("2026-08-16", now), true);
  assert.equal(isStaleVerification("2024-10-01", now), true);
  assert.equal(isStaleVerification(undefined, now), false);
  assert.equal(isStaleVerification("not-a-date", now), false);
});

test("verified dates render in a stable format", () => {
  assert.equal(formatVerifiedOn("2026-01-05"), "5 Jan 2026");
});
