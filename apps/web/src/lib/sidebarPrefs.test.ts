import assert from "node:assert/strict";
import { test } from "vitest";
import { DEFAULT_SECTION_STATE, loadSectionState, persistSectionState } from "./sidebarPrefs";

test("defaults open the axes buyers scan first", () => {
  assert.equal(DEFAULT_SECTION_STATE.category, true);
  assert.equal(DEFAULT_SECTION_STATE.runtime, true);
  assert.equal(DEFAULT_SECTION_STATE.compliance, false);
});

test("storage failures degrade to defaults instead of throwing", () => {
  // Node has no window.localStorage, which is the same failure mode as a
  // browser that blocks site data.
  assert.deepEqual(loadSectionState(), {});
  assert.doesNotThrow(() => persistSectionState({ category: false }));
});
