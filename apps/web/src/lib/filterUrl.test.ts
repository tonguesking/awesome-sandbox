import assert from "node:assert/strict";
import { test } from "vitest";
import { DEFAULT_FILTERS } from "./filter";
import { filtersFromSearchParams, filtersToSearchParams } from "./filterUrl";

test("known query values reach their filter fields", () => {
  const parsed = filtersFromSearchParams(
    new URLSearchParams(
      "search=agent&category=MicroVM&runtime=firecracker&pricing=Free+Tier&idle=idle_free",
    ),
  );
  assert.equal(parsed.search, "agent");
  assert.deepEqual(parsed.categories, ["MicroVM"]);
  assert.deepEqual(parsed.runtimes, ["firecracker"]);
  assert.deepEqual(parsed.pricing, ["Free Tier"]);
  assert.deepEqual(parsed.idleBilling, ["idle_free"]);
});

test("unknown values are dropped so a stale link shows the catalog", () => {
  const parsed = filtersFromSearchParams(
    new URLSearchParams("pricing=free&category=Nope&runtime=vms"),
  );
  assert.deepEqual(parsed.pricing, []);
  assert.deepEqual(parsed.categories, []);
  assert.deepEqual(parsed.runtimes, []);
});

test("a list keeps its known values and drops the rest", () => {
  const parsed = filtersFromSearchParams(
    new URLSearchParams("idle=idle_free,bogus&sdk=Python,Cobol"),
  );
  assert.deepEqual(parsed.idleBilling, ["idle_free"]);
  assert.deepEqual(parsed.sdkLanguages, ["Python"]);
});

test("boolean flags read only the documented spelling", () => {
  const parsed = filtersFromSearchParams(
    new URLSearchParams("openSource=1&favorites=true&verified=1&published=1&live=1"),
  );
  assert.equal(parsed.openSourceOnly, true);
  assert.equal(parsed.favoritesOnly, false);
  assert.equal(parsed.verifiedPricingOnly, true);
  assert.equal(parsed.documentedCoreOnly, false);
  assert.equal(parsed.excludeQuoteOnly, true);
  assert.equal(parsed.excludeDeprecated, true);
});

test("only published star floors survive a hand-edited link", () => {
  assert.equal(filtersFromSearchParams(new URLSearchParams("stars=1000")).minStars, 1000);
  assert.equal(filtersFromSearchParams(new URLSearchParams("stars=2500")).minStars, 0);
  assert.equal(filtersFromSearchParams(new URLSearchParams("")).minStars, 0);
  const params = filtersToSearchParams({
    ...DEFAULT_FILTERS,
    minStars: 10_000,
  });
  assert.equal(params.get("stars"), "10000");
  assert.equal(filtersToSearchParams(DEFAULT_FILTERS).has("stars"), false);
});

test("only published rating floors survive a hand-edited link", () => {
  assert.equal(filtersFromSearchParams(new URLSearchParams("rating=4")).minRating, 4);
  assert.equal(filtersFromSearchParams(new URLSearchParams("rating=4.5")).minRating, 4.5);
  assert.equal(filtersFromSearchParams(new URLSearchParams("rating=3")).minRating, 0);
  assert.equal(filtersFromSearchParams(new URLSearchParams("")).minRating, 0);
  const params = filtersToSearchParams({
    ...DEFAULT_FILTERS,
    minRating: 4.5,
  });
  assert.equal(params.get("rating"), "4.5");
  assert.equal(filtersToSearchParams(DEFAULT_FILTERS).has("rating"), false);
});

test("a shared link keeps a non-default sort and drops unknown ones", () => {
  assert.equal(filtersFromSearchParams(new URLSearchParams("sort=rating")).sortBy, "rating");
  assert.equal(filtersFromSearchParams(new URLSearchParams("sort=nonsense")).sortBy, undefined);
  const params = filtersToSearchParams({
    ...DEFAULT_FILTERS,
    sortBy: "rating",
  });
  assert.equal(params.get("sort"), "rating");
  assert.equal(filtersToSearchParams(DEFAULT_FILTERS).has("sort"), false);
});

test("serialized filters survive the round trip", () => {
  const filters = {
    ...DEFAULT_FILTERS,
    search: "browser",
    categories: ["Browser Sandbox"],
    pricing: ["Free Tier"],
    deployment: ["Self-hosted"],
    idleBilling: ["idle_free"],
    capabilities: ["snapshot"],
    statuses: ["beta"],
    openSourceOnly: true,
  };
  const parsed = filtersFromSearchParams(filtersToSearchParams(filters));
  for (const key of [
    "search",
    "categories",
    "pricing",
    "deployment",
    "idleBilling",
    "capabilities",
    "statuses",
    "openSourceOnly",
  ] as const) {
    assert.deepEqual(parsed[key], filters[key], `round trip lost ${key}`);
  }
});

test("multi-select axes keep every value in the URL", () => {
  const filters = {
    ...DEFAULT_FILTERS,
    categories: ["MicroVM", "Self-hosted"],
    runtimes: ["firecracker", "docker"],
    deployment: ["Self-hosted", "Cloud"],
  };
  const params = filtersToSearchParams(filters);
  assert.equal(params.get("category"), "MicroVM,Self-hosted");
  const parsed = filtersFromSearchParams(params);
  assert.deepEqual(parsed.categories, filters.categories);
  assert.deepEqual(parsed.runtimes, filters.runtimes);
  assert.deepEqual(parsed.deployment, filters.deployment);
});

test("resume speed survives a share link and unknown tiers drop", () => {
  const params = filtersToSearchParams({
    ...DEFAULT_FILTERS,
    resumeSpeeds: ["subsecond"],
  });
  assert.equal(params.get("resume"), "subsecond");
  const parsed = filtersFromSearchParams(new URLSearchParams("resume=subsecond,bogus"));
  assert.deepEqual(parsed.resumeSpeeds, ["subsecond"]);
});

test("cloud-only exclusion is shareable and off by default", () => {
  const params = filtersToSearchParams({
    ...DEFAULT_FILTERS,
    excludeCloudOnly: true,
  });
  assert.equal(params.get("cloudonly"), "0");
  assert.equal(filtersFromSearchParams(new URLSearchParams("cloudonly=0")).excludeCloudOnly, true);
  assert.equal(filtersFromSearchParams(new URLSearchParams("cloudonly=1")).excludeCloudOnly, false);
  assert.equal(filtersToSearchParams(DEFAULT_FILTERS).has("cloudonly"), false);
});

test("the documented-core toggle round-trips as documented=1", () => {
  assert.equal(
    filtersFromSearchParams(new URLSearchParams("documented=1")).documentedCoreOnly,
    true,
  );
  assert.equal(
    filtersFromSearchParams(new URLSearchParams("documented=true")).documentedCoreOnly,
    false,
  );
  const params = filtersToSearchParams({
    ...DEFAULT_FILTERS,
    documentedCoreOnly: true,
  });
  assert.equal(params.get("documented"), "1");
});

test("license families round-trip through the license param", () => {
  const parsed = filtersFromSearchParams(new URLSearchParams("license=mit,copyleft,nonsense"));
  assert.deepEqual(parsed.licenses, ["mit", "copyleft"]);

  const params = filtersToSearchParams({
    ...DEFAULT_FILTERS,
    licenses: ["apache"],
  });
  assert.equal(params.get("license"), "apache");
});
