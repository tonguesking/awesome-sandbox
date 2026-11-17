import assert from "node:assert/strict";
import { test } from "vitest";
import type { Sandbox } from "../types/sandbox";
import {
  answersToExploreHref,
  answersToFilters,
  type ChooserAnswers,
  rankSandboxes,
} from "./choose";

function makeSandbox(overrides: Partial<Sandbox>): Sandbox {
  return {
    id: "fixture",
    slug: "fixture",
    name: "Fixture",
    description: "fixture sandbox",
    logo: "FX",
    website: "https://example.com",
    productType: "open_source_tool",
    categories: ["Code Sandbox"],
    runtime: {},
    deployment: { cloud: true, selfHosted: false, byoc: false },
    capabilities: {},
    pricing: { model: ["Free Tier"] },
    openSource: true,
    status: "active",
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
    ...overrides,
  };
}

const answers: ChooserAnswers = {
  useCase: "code",
  idlePreference: "idle_free",
  pausePreference: "memory",
  deployment: "cloud",
  licensePreference: "any",
};

test("a listing that meets every preference outranks one that does not", () => {
  const matching = makeSandbox({
    id: "matching",
    lifecycle: { idleBilling: "idle_free", pauseRetains: "memory" },
    rating: 3,
  });
  const failing = makeSandbox({
    id: "failing",
    lifecycle: { idleBilling: "wall_clock", pauseRetains: "memory" },
    rating: 5,
  });

  const ranked = rankSandboxes([failing, matching], answers);

  assert.equal(ranked[0].sandbox.id, "matching");
  assert.ok(ranked.some((match) => match.sandbox.id === "failing"));
});

test("a failing listing explains the unmet preference as a trade-off", () => {
  const failing = makeSandbox({
    lifecycle: { idleBilling: "wall_clock", pauseRetains: "memory" },
  });

  const [match] = rankSandboxes([failing], answers);

  assert.deepEqual(match.gaps, ["bills wall-clock time while the agent waits"]);
});

test("missing lifecycle data is reported as unpublished, not as a mismatch", () => {
  const unknown = makeSandbox({});

  const [match] = rankSandboxes([unknown], answers);

  assert.deepEqual(match.gaps, [
    "idle billing is not published",
    "pause retention is not published",
  ]);
});

test("chooser answers map onto catalog filters and a shareable link", () => {
  const filters = answersToFilters(answers);

  assert.deepEqual(filters.idleBilling, ["idle_free"]);
  assert.deepEqual(filters.pauseStates, ["memory"]);
  assert.deepEqual(filters.deployment, ["Cloud"]);
  assert.equal(
    answersToExploreHref(answers),
    "/explore?idle=idle_free&pause=memory&deployment=Cloud",
  );
});

test("a permissive-only preference ranks Apache over copyleft and explains both", () => {
  const apache = makeSandbox({
    id: "apache",
    slug: "microsandbox",
    categories: ["Code Execution"],
    rating: 3,
  });
  const copyleft = makeSandbox({
    id: "copyleft",
    slug: "sandboxie-plus",
    categories: ["Code Execution"],
    rating: 5,
  });

  const ranked = rankSandboxes([copyleft, apache], {
    ...answers,
    licensePreference: "permissive",
  });

  assert.equal(ranked[0].sandbox.id, "apache");
  assert.ok(ranked[0].reasons.includes("permissive license"));
  const copyleftMatch = ranked.find((match) => match.sandbox.id === "copyleft");
  assert.ok(copyleftMatch?.gaps.includes("copyleft license, which you excluded"));
});

test("license preference carries into the refine-in-catalog link", () => {
  const filters = answersToFilters({
    ...answers,
    licensePreference: "permissive",
  });
  assert.deepEqual(filters.licenses, ["mit", "apache", "bsd", "other"]);
  assert.equal(
    answersToExploreHref({ ...answers, licensePreference: "permissive" }),
    "/explore?idle=idle_free&pause=memory&license=mit%2Capache%2Cbsd%2Cother&deployment=Cloud",
  );
});
