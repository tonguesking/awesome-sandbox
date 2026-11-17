import assert from "node:assert/strict";
import { test } from "vitest";
import { calculateCost } from "./calculator";

test("calculateCost calculates baseline monthly compute and storage correctly", () => {
  const result = calculateCost({
    vCpu: 2,
    memoryGb: 4,
    sandboxesCount: 1,
    activeHoursPerDay: 8,
    activeDaysPerMonth: 20,
    storageGb: 10,
    enableIdleSuspend: false,
    idleSuspendPercentage: 0,
  });

  // Base hours = 8 * 20 = 160 hrs
  assert.equal(result.monthlyComputeHoursTotal, 160);
  assert.equal(result.monthlyEffectiveHours, 160);
  assert.equal(result.monthlyCpuHours, 320);
  assert.equal(result.monthlyRamGbHours, 640);
  assert.equal(result.monthlyStorageGbTotal, 10);
  assert.ok(result.estimatedCostUsd > 0);
  assert.equal(result.savingsFromSuspendUsd, 0);
});

test("calculateCost applies idle suspend savings", () => {
  const withoutSuspend = calculateCost({
    vCpu: 4,
    memoryGb: 8,
    sandboxesCount: 5,
    activeHoursPerDay: 10,
    activeDaysPerMonth: 22,
    storageGb: 20,
    enableIdleSuspend: false,
    idleSuspendPercentage: 0,
  });

  const withSuspend = calculateCost({
    vCpu: 4,
    memoryGb: 8,
    sandboxesCount: 5,
    activeHoursPerDay: 10,
    activeDaysPerMonth: 22,
    storageGb: 20,
    enableIdleSuspend: true,
    idleSuspendPercentage: 50,
  });

  assert.ok(withSuspend.estimatedCostUsd < withoutSuspend.estimatedCostUsd);
  assert.ok(withSuspend.savingsFromSuspendUsd > 0);
  assert.equal(withSuspend.monthlyEffectiveHours, withoutSuspend.monthlyEffectiveHours / 2);
});
