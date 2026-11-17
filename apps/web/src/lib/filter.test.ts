import assert from "node:assert/strict";
import { test } from "vitest";
import type { FilterState, Sandbox } from "../types/sandbox";
import {
  DEFAULT_FILTERS,
  filterAndSortSandboxes,
  hasActiveFilters,
  hasDocumentedCore,
  matchesBillingShape,
  matchesBootSpeed,
  matchesCompliance,
  matchesOperatingSystem,
  matchesRuntime,
  matchesStatus,
  parseBootTimeMs,
  parseResumeTimeMs,
} from "./filter";

const mockSandboxes: Sandbox[] = [
  {
    id: "e2b",
    slug: "e2b",
    name: "E2B",
    description: "AI Agent code execution sandbox powered by Firecracker.",
    logo: "e2b",
    website: "https://e2b.dev",
    productType: "commercial_saas",
    categories: ["Code Sandbox", "MicroVM"],
    runtime: { firecracker: true, docker: false, gvisor: false },
    deployment: { cloud: true, selfHosted: false, byoc: true },
    capabilities: {
      persistent: false,
      snapshot: true,
      fork: true,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: true,
      mcp: true,
    },
    pricing: { model: ["Free Tier", "Pay as you go"], freeTier: true },
    techSpecs: {
      bootTime: "< 150ms",
      networkIsolation: "Strict TAP/TUN egress allowlist",
    },
    openSource: true,
    githubStars: 6800,
    featured: true,
    status: "active",
    createdAt: "2024-01-10",
    updatedAt: "2024-10-01",
  },
  {
    id: "kasm",
    slug: "kasm",
    name: "Kasm Workspaces",
    description: "Open-source desktop sandbox and browser isolation.",
    logo: "kasm",
    website: "https://kasmweb.com",
    productType: "open_source_tool",
    categories: ["Desktop Sandbox", "Self-hosted", "Browser Sandbox"],
    runtime: { docker: true, firecracker: false, gvisor: false },
    deployment: { cloud: false, selfHosted: true, byoc: true },
    capabilities: {
      persistent: true,
      desktop: true,
      browser: true,
      egressControl: true,
      autoSleep: false,
      api: true,
    },
    pricing: { model: ["Free Tier", "Subscription"], freeTier: true },
    techSpecs: {
      bootTime: "~2 - 4s",
    },
    openSource: true,
    githubStars: 2900,
    featured: false,
    status: "active",
    createdAt: "2023-05-15",
    updatedAt: "2024-09-20",
  },
  {
    id: "modal",
    slug: "modal",
    name: "Modal",
    description: "Serverless compute for any workload with GPU support.",
    logo: "modal",
    website: "https://modal.com",
    productType: "commercial_saas",
    categories: ["Code Sandbox", "Cloud Computer"],
    runtime: { gvisor: true, docker: true },
    deployment: { cloud: true, selfHosted: false },
    capabilities: {
      persistent: true,
      gpu: true,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: true,
    },
    pricing: { model: ["Free Tier", "Pay as you go"], freeTier: true },
    techSpecs: {
      bootTime: "< 1 second",
    },
    openSource: false,
    featured: true,
    status: "active",
    createdAt: "2023-01-01",
    updatedAt: "2024-11-01",
  },
  {
    id: "cloudflare",
    slug: "cloudflare-sandboxes",
    name: "Cloudflare Sandboxes",
    description: "Edge execution environment.",
    logo: "CF",
    website: "https://cloudflare.com",
    productType: "commercial_saas",
    categories: ["Code Sandbox", "Code Execution"],
    runtime: { other: ["V8 Isolates / Lightweight WebAssembly sandboxing"] },
    deployment: { cloud: true },
    capabilities: { egressControl: true, autoSleep: true, api: true },
    pricing: { model: ["Free Tier", "Pay as you go"], freeTier: true },
    techSpecs: {
      bootTime: "< 5ms (0 cold start)",
    },
    openSource: false,
    status: "active",
    createdAt: "2022-05-01",
    updatedAt: "2024-10-14",
  },
];

const defaultFilters: FilterState = { ...DEFAULT_FILTERS };

test("filters sandboxes by search term matching name or description", () => {
  const result = filterAndSortSandboxes(mockSandboxes, {
    ...defaultFilters,
    search: "desktop",
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].name, "Kasm Workspaces");
});

test("a GitHub star floor drops listings below it and those without a repo", () => {
  const result = filterAndSortSandboxes(mockSandboxes, {
    ...defaultFilters,
    minStars: 5000,
  });
  assert.deepEqual(
    result.map((sandbox) => sandbox.name),
    ["E2B"],
  );
});

test("a rating floor keeps only reviewed listings at or above it", () => {
  const rated: Sandbox[] = [
    { ...mockSandboxes[0], id: "a", slug: "a", name: "A", rating: 4.6 },
    { ...mockSandboxes[0], id: "b", slug: "b", name: "B", rating: 4.0 },
    { ...mockSandboxes[0], id: "c", slug: "c", name: "C", rating: 3.5 },
    { ...mockSandboxes[0], id: "d", slug: "d", name: "D" },
  ];
  const result = filterAndSortSandboxes(rated, {
    ...defaultFilters,
    minRating: 4,
  });
  assert.deepEqual(result.map((sandbox) => sandbox.name).sort(), ["A", "B"]);
});

test("hide archived drops deprecated listings only", () => {
  const archived: Sandbox = {
    ...mockSandboxes[0],
    id: "archived",
    slug: "archived",
    name: "Archived",
    status: "deprecated",
  };
  const result = filterAndSortSandboxes([...mockSandboxes, archived], {
    ...defaultFilters,
    excludeDeprecated: true,
  });
  assert.equal(result.length, mockSandboxes.length);
  assert.equal(
    result.some((sandbox) => sandbox.status === "deprecated"),
    false,
  );
});

test("supports tokenized multi-word search across runtime and capabilities", () => {
  const result = filterAndSortSandboxes(mockSandboxes, {
    ...defaultFilters,
    search: "firecracker mcp",
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].name, "E2B");
});

test("filters sandboxes by category", () => {
  const result = filterAndSortSandboxes(mockSandboxes, {
    ...defaultFilters,
    categories: ["MicroVM"],
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].name, "E2B");
});

test("filters sandboxes by isolation runtime (gVisor & V8/Wasm)", () => {
  const gvisorResult = filterAndSortSandboxes(mockSandboxes, {
    ...defaultFilters,
    runtimes: ["gvisor"],
  });
  assert.equal(gvisorResult.length, 1);
  assert.equal(gvisorResult[0].name, "Modal");

  const wasmResult = filterAndSortSandboxes(mockSandboxes, {
    ...defaultFilters,
    runtimes: ["v8_wasm"],
  });
  assert.equal(wasmResult.length, 1);
  assert.equal(wasmResult[0].name, "Cloudflare Sandboxes");
  assert.equal(matchesRuntime(mockSandboxes[3], "v8_wasm"), true);
});

test("filters sandboxes by cold-start boot speed tiers and sorts fastest first", () => {
  assert.equal(parseBootTimeMs("< 5ms (kernel boot) / < 125ms total"), 125);
  assert.equal(parseBootTimeMs("< 1 second"), 900);
  assert.equal(parseBootTimeMs("~2 - 4s"), 2000);

  const instant = filterAndSortSandboxes(mockSandboxes, {
    ...defaultFilters,
    bootSpeeds: ["instant"],
    sortBy: "boot_speed",
  });
  assert.deepEqual(
    instant.map((s) => s.name),
    ["Cloudflare Sandboxes", "E2B"],
  );

  const subsecond = filterAndSortSandboxes(mockSandboxes, {
    ...defaultFilters,
    bootSpeeds: ["subsecond"],
    sortBy: "boot_speed",
  });
  assert.deepEqual(
    subsecond.map((s) => s.name),
    ["Cloudflare Sandboxes", "E2B", "Modal"],
  );

  assert.equal(matchesBootSpeed(mockSandboxes[1], "standard"), true);
});

test("filters sandboxes by capability requiring GPU or Auto-Sleep", () => {
  const gpuResult = filterAndSortSandboxes(mockSandboxes, {
    ...defaultFilters,
    capabilities: ["GPU"],
  });
  assert.equal(gpuResult.length, 1);
  assert.equal(gpuResult[0].name, "Modal");

  const sleepResult = filterAndSortSandboxes(mockSandboxes, {
    ...defaultFilters,
    capabilities: ["Pause / Auto-Sleep"],
  });
  assert.equal(sleepResult.length, 3);
  assert.equal(
    sleepResult.some((s) => s.name === "Kasm Workspaces"),
    false,
  );
});

test("sorts by stars descending", () => {
  const result = filterAndSortSandboxes(mockSandboxes, {
    ...defaultFilters,
    sortBy: "stars",
  });
  assert.equal(result[0].name, "E2B"); // 6800 stars
  assert.equal(result[1].name, "Kasm Workspaces"); // 2900 stars
});

test("filters sandboxes by capability requiring Mobile", () => {
  const sandboxesWithMobile: Sandbox[] = [
    ...mockSandboxes,
    {
      id: "mobilebox",
      slug: "mobilebox",
      name: "Mobilebox",
      description: "Cloud Android sandbox",
      logo: "MB",
      website: "https://mobilebox.dev",
      productType: "commercial_saas",
      categories: ["AI Agent Sandbox"],
      runtime: { other: ["Android AOSP"] },
      deployment: { cloud: true },
      capabilities: { mobile: true, api: true },
      pricing: { freeTier: true },
      openSource: false,
      status: "active",
      createdAt: "2024-07-01",
      updatedAt: "2024-07-01",
    },
  ];

  const result = filterAndSortSandboxes(sandboxesWithMobile, {
    ...defaultFilters,
    capabilities: ["Mobile"],
  });
  assert.equal(result.length, 1);
  assert.equal(result[0].name, "Mobilebox");
});

test("a boot cell that only leads with a caveat is not parsed as a figure", () => {
  assert.equal(
    parseBootTimeMs(
      "Not published as a percentile; worked examples in the docs show 56 ms time-to-interactive",
    ),
    Number.POSITIVE_INFINITY,
  );
  assert.equal(parseBootTimeMs("Not published"), Number.POSITIVE_INFINITY);
  assert.equal(parseBootTimeMs("< 200ms"), 200);
  assert.equal(parseBootTimeMs("1.5s"), 1500);
});

test("sorts by published resume latency and puts unknown values last", () => {
  const base = mockSandboxes[0];
  const catalog = [
    {
      ...base,
      id: "slow",
      slug: "slow",
      name: "Slow",
      lifecycle: { pauseRetains: "memory" as const, resumeTime: "900ms" },
      githubStars: 1,
    },
    {
      ...base,
      id: "fast",
      slug: "fast",
      name: "Fast",
      lifecycle: { pauseRetains: "memory" as const, resumeTime: "< 90ms" },
      githubStars: 2,
    },
    {
      ...base,
      id: "unknown",
      slug: "unknown",
      name: "Unknown",
      lifecycle: {},
      githubStars: 99,
    },
  ];
  const sorted = filterAndSortSandboxes(catalog, {
    ...defaultFilters,
    sortBy: "resume_speed",
  });
  assert.deepEqual(
    sorted.map((s) => s.name),
    ["Fast", "Slow", "Unknown"],
  );
});

test("resume speed filters skip sandboxes that retain nothing", () => {
  const base = mockSandboxes[0];
  const catalog = [
    {
      ...base,
      id: "fast",
      slug: "fast",
      name: "Fast",
      lifecycle: { pauseRetains: "memory" as const, resumeTime: "< 90ms" },
    },
    {
      ...base,
      id: "slow",
      slug: "slow",
      name: "Slow",
      lifecycle: { pauseRetains: "disk" as const, resumeTime: "2s" },
    },
    {
      ...base,
      id: "cold",
      slug: "cold",
      name: "Cold",
      lifecycle: { pauseRetains: "none" as const, resumeTime: "10ms" },
    },
  ];
  const result = filterAndSortSandboxes(catalog, {
    ...defaultFilters,
    resumeSpeeds: ["instant"],
  });
  assert.deepEqual(
    result.map((s) => s.name),
    ["Fast"],
  );
});

test("resume cells yield a figure only when one is published", () => {
  assert.equal(parseResumeTimeMs("< 90ms"), 90);
  assert.equal(parseResumeTimeMs("About 1.2 s from a memory snapshot"), 1200);
  assert.equal(parseResumeTimeMs("25ms from memory, 900ms from a cold snapshot"), 25);
  assert.equal(parseResumeTimeMs("Not published"), Number.POSITIVE_INFINITY);
  assert.equal(
    parseResumeTimeMs("No separate resume step; creation returns a client"),
    Number.POSITIVE_INFINITY,
  );
  assert.equal(
    parseResumeTimeMs("The vendor states a 124 ms boot time and does not time wakeups"),
    Number.POSITIVE_INFINITY,
  );
});

test("compliance matches attestation families regardless of spelling", () => {
  const e2b: Sandbox = {
    ...mockSandboxes[0],
    compliance: ["SOC 2 Type II", "GDPR"],
  };
  const modal: Sandbox = {
    ...mockSandboxes[2],
    compliance: ["SOC 2 Type 2", "HIPAA"],
  };
  assert.equal(matchesCompliance(e2b, "soc2"), true);
  assert.equal(matchesCompliance(modal, "soc2"), true);
  assert.equal(matchesCompliance(modal, "hipaa"), true);
  assert.equal(matchesCompliance(e2b, "hipaa"), false);
  assert.equal(matchesCompliance(e2b, "iso27001"), false);
});

test("operating system matching accepts distro spellings under Linux", () => {
  const ubuntu: Sandbox = {
    ...mockSandboxes[0],
    techSpecs: { operatingSystems: ["Ubuntu 24.04"] },
  };
  const windows: Sandbox = {
    ...mockSandboxes[2],
    techSpecs: { operatingSystems: ["Windows Server"] },
  };
  assert.equal(matchesOperatingSystem(ubuntu, "linux"), true);
  assert.equal(matchesOperatingSystem(ubuntu, "windows"), false);
  assert.equal(matchesOperatingSystem(windows, "windows"), true);
});

test("status filter separates active listings from beta ones", () => {
  const beta: Sandbox = { ...mockSandboxes[1], status: "beta" };
  const pool = [mockSandboxes[0], beta, mockSandboxes[2]];
  assert.deepEqual(
    filterAndSortSandboxes(pool, {
      ...defaultFilters,
      statuses: ["beta"],
    }).map((s) => s.name),
    ["Kasm Workspaces"],
  );
  assert.equal(matchesStatus(beta, "beta"), true);
  assert.equal(matchesStatus(beta, "active"), false);
});

test("product type filter separates hosted products from runtimes", () => {
  const runtime: Sandbox = {
    ...mockSandboxes[1],
    id: "runtime-engine",
    slug: "runtime-engine",
    name: "Runtime Engine",
    productType: "runtime_engine",
  };
  const hosted = filterAndSortSandboxes([mockSandboxes[0], runtime], {
    ...defaultFilters,
    productTypes: ["commercial_saas"],
  });
  assert.deepEqual(
    hosted.map((s) => s.name),
    ["E2B"],
  );
});

test("recently updated sorts by catalog freshness, newest first", () => {
  const result = filterAndSortSandboxes(mockSandboxes, {
    ...defaultFilters,
    sortBy: "recently_updated",
  });
  const dates = result.map((s) => new Date(s.updatedAt).getTime());
  const sorted = [...dates].sort((a, b) => b - a);
  assert.deepEqual(dates, sorted);
});

test("billing shape reads the meter behind the price", () => {
  const metered: Sandbox = {
    ...mockSandboxes[0],
    pricing: {
      model: ["Pay as you go"],
      freeTier: true,
      billingUnit: "per vCPU-hour",
    },
  };
  const seat: Sandbox = {
    ...mockSandboxes[0],
    pricing: { model: ["Subscription"], billingUnit: "per seat / month" },
  };
  assert.equal(matchesBillingShape(metered, "metered"), true);
  assert.equal(matchesBillingShape(seat, "seat"), true);
  assert.equal(matchesBillingShape(seat, "metered"), false);
});

test("documented sort puts the better-evidenced listing first", () => {
  const base = mockSandboxes[0];
  const thin: Sandbox = {
    ...base,
    id: "thin",
    slug: "thin",
    name: "Thin",
    pricing: { ...base.pricing, transparency: "unverified" },
    techSpecs: {
      ...base.techSpecs,
      bootTime: "Not published",
      maxVcpu: undefined,
    },
  };
  const rich: Sandbox = {
    ...base,
    id: "rich",
    slug: "rich",
    name: "Rich",
    pricing: { ...base.pricing, transparency: "official_verified" },
    techSpecs: { ...base.techSpecs, bootTime: "< 100ms", maxVcpu: "4 vCPU" },
  };
  const result = filterAndSortSandboxes([thin, rich], {
    ...defaultFilters,
    sortBy: "documented",
  });
  assert.equal(result[0].id, "rich");
});

test("highest rated breaks rating ties by GitHub stars", () => {
  const base = mockSandboxes[0];
  const rated: Sandbox[] = [
    { ...base, id: "a", slug: "a", name: "A", rating: 4.6, githubStars: 10 },
    { ...base, id: "b", slug: "b", name: "B", rating: 4.6, githubStars: 500 },
    { ...base, id: "c", slug: "c", name: "C", rating: 3.9, githubStars: 9000 },
    { ...base, id: "d", slug: "d", name: "D" },
  ];
  const result = filterAndSortSandboxes(rated, {
    ...defaultFilters,
    sortBy: "rating",
  });
  assert.deepEqual(
    result.map((sandbox) => sandbox.name),
    ["B", "A", "C", "D"],
  );
});

test("cloud-only toggle keeps self-hostable and BYOC listings", () => {
  const cloudOnly: Sandbox = {
    ...mockSandboxes[0],
    id: "cloud-only",
    slug: "cloud-only",
    name: "Cloud Only",
    deployment: { cloud: true, selfHosted: false, byoc: false },
  };
  const result = filterAndSortSandboxes([...mockSandboxes, cloudOnly], {
    ...defaultFilters,
    excludeCloudOnly: true,
  });
  assert.deepEqual(result.map((sandbox) => sandbox.name).sort(), ["E2B", "Kasm Workspaces"]);
});

test("every narrowing control counts as an active filter", () => {
  assert.equal(hasActiveFilters(DEFAULT_FILTERS), false);

  const changed: Partial<FilterState>[] = [
    { search: "firecracker" },
    { categories: ["MicroVM"] },
    { runtimes: ["gvisor"] },
    { isolationBoundaries: ["hardware"] },
    { bootSpeeds: ["instant"] },
    { resumeSpeeds: ["instant"] },
    { operatingSystems: ["linux"] },
    { billingShapes: ["seat"] },
    { pricing: ["Free Tier"] },
    { deployment: ["Self-hosted"] },
    { idleBilling: ["idle_free"] },
    { pauseStates: ["memory"] },
    { compliance: ["soc2"] },
    { statuses: ["beta"] },
    { productTypes: ["runtime_engine"] },
    { sdkLanguages: ["Python"] },
    { capabilities: ["GPU"] },
    { openSourceOnly: true },
    { favoritesOnly: true },
    { verifiedPricingOnly: true },
    { excludeQuoteOnly: true },
    { excludeDeprecated: true },
    { excludeCloudOnly: true },
    { minRating: 4 },
    { minStars: 500 },
  ];
  for (const patch of changed) {
    assert.equal(
      hasActiveFilters({ ...DEFAULT_FILTERS, ...patch }),
      true,
      `expected ${JSON.stringify(patch)} to count as active`,
    );
  }

  // Reordering and reshaping do not narrow the set, so no clear action is due.
  assert.equal(hasActiveFilters({ ...DEFAULT_FILTERS, sortBy: "stars", viewMode: "list" }), false);
});

test("license facet matches the verified SPDX map and hides repo-less vendors", () => {
  const apache = { ...mockSandboxes[0], id: "msb", slug: "microsandbox" };
  const noRepo = { ...mockSandboxes[2], id: "closed", slug: "closed-vendor" };
  const result = filterAndSortSandboxes([apache, noRepo], {
    ...defaultFilters,
    licenses: ["apache"],
  });
  assert.deepEqual(
    result.map((sandbox) => sandbox.slug),
    ["microsandbox"],
  );
});

test("default popularity sort prefers a name match over a popular spec mention", () => {
  const popular = {
    ...mockSandboxes[2],
    id: "popular",
    slug: "popular",
    name: "Popular Runner",
    featured: true,
    description: "Browser automation at scale.",
  };
  const named = {
    ...mockSandboxes[0],
    id: "browserbase",
    slug: "browserbase",
    name: "Browserbase",
    featured: false,
    description: "Headless browser infrastructure.",
  };
  const result = filterAndSortSandboxes([popular, named], {
    ...defaultFilters,
    search: "browser",
  });
  assert.deepEqual(
    result.map((sandbox) => sandbox.slug),
    ["browserbase", "popular"],
  );
});

test("documented core needs a verified price, a boundary and a stated egress posture", () => {
  const base = mockSandboxes[0];
  const documented: Sandbox = {
    ...base,
    pricing: { ...base.pricing, transparency: "official_verified" },
    capabilities: { ...base.capabilities, egressControl: false },
  };
  assert.equal(hasDocumentedCore(documented), true);

  // "No egress control" is a documented stance; null is an unanswered question.
  assert.equal(
    hasDocumentedCore({
      ...documented,
      capabilities: { ...documented.capabilities, egressControl: null },
    }),
    false,
  );
  assert.equal(
    hasDocumentedCore({
      ...documented,
      pricing: { ...documented.pricing, transparency: "unverified" },
    }),
    false,
  );
});
