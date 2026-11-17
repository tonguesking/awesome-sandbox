import assert from "node:assert/strict";
import { test } from "vitest";
import { GUIDES } from "./guides";
import { INITIAL_SANDBOXES } from "./sandboxes";

test("catalog has no duplicate slugs or ids", () => {
  const slugs = new Set<string>();
  const ids = new Set<string>();
  const duplicates: string[] = [];

  for (const sandbox of INITIAL_SANDBOXES) {
    if (slugs.has(sandbox.slug)) {
      duplicates.push(`slug ${sandbox.slug}`);
    }
    if (ids.has(sandbox.id)) {
      duplicates.push(`id ${sandbox.id}`);
    }
    slugs.add(sandbox.slug);
    ids.add(sandbox.id);
  }

  assert.deepEqual(duplicates, []);
});

test("no two listings point at the same GitHub repository", () => {
  const seen = new Map<string, string>();
  const duplicates: string[] = [];

  for (const sandbox of INITIAL_SANDBOXES) {
    const repo = sandbox.github?.toLowerCase();
    if (!repo) {
      continue;
    }
    const existing = seen.get(repo);
    if (existing) {
      duplicates.push(`${existing} and ${sandbox.slug} share ${repo}`);
    }
    seen.set(repo, sandbox.slug);
  }

  assert.deepEqual(duplicates, []);
});

test("catalog dates and scores stay in a sane range", () => {
  const problems = INITIAL_SANDBOXES.flatMap((sandbox) => {
    const issues: string[] = [];
    const created = Date.parse(sandbox.createdAt);
    const updated = Date.parse(sandbox.updatedAt);
    if (Number.isNaN(created) || Number.isNaN(updated)) {
      issues.push(`${sandbox.slug}: unparseable date`);
    } else if (updated < created) {
      issues.push(
        `${sandbox.slug}: updatedAt ${sandbox.updatedAt} precedes createdAt ${sandbox.createdAt}`,
      );
    }
    if (sandbox.rating !== undefined && (sandbox.rating < 0 || sandbox.rating > 5)) {
      issues.push(`${sandbox.slug}: rating ${sandbox.rating} outside 0-5`);
    }
    if ((sandbox.githubStars ?? 0) < 0) {
      issues.push(`${sandbox.slug}: negative star count`);
    }
    if (sandbox.pricing.verifiedAt && Number.isNaN(Date.parse(sandbox.pricing.verifiedAt))) {
      issues.push(`${sandbox.slug}: unparseable pricing verifiedAt`);
    }
    return issues;
  });

  assert.deepEqual(problems, []);
});

test("outbound links are well-formed https URLs", () => {
  const fields = ["website", "documentation", "pricingUrl"] as const;
  const problems: string[] = [];

  for (const sandbox of INITIAL_SANDBOXES) {
    for (const field of fields) {
      const value = field === "pricingUrl" ? sandbox.pricing.pricingUrl : sandbox[field];
      if (!value) {
        continue;
      }
      try {
        const url = new URL(value);
        if (url.protocol !== "https:") {
          problems.push(`${sandbox.slug}.${field}: not https`);
        }
      } catch {
        problems.push(`${sandbox.slug}.${field}: ${value}`);
      }
    }
  }

  assert.deepEqual(problems, []);
});

test("verified pricing is backed by a written summary and not dated in the future", () => {
  const problems = INITIAL_SANDBOXES.flatMap((sandbox) => {
    const issues: string[] = [];
    const { costSummary, transparency, verifiedAt } = sandbox.pricing;
    if (transparency === "official_verified" && (costSummary ?? "").trim().length < 20) {
      issues.push(`${sandbox.slug}: verified pricing without a cost summary`);
    }
    if (verifiedAt) {
      const verified = Date.parse(verifiedAt);
      if (verified > Date.now() + 24 * 60 * 60 * 1000) {
        issues.push(`${sandbox.slug}: pricing verifiedAt is in the future`);
      }
    }
    return issues;
  });

  assert.deepEqual(problems, []);
});

test("compliance claims use one spelling per attestation", () => {
  const allowed = new Set([
    "GDPR",
    "HIPAA",
    "HIPAA eligible",
    "ISO 27001",
    "SOC 1",
    "SOC 2",
    "SOC 2 Type II",
    "Zero Data Retention",
  ]);
  const unexpected = INITIAL_SANDBOXES.flatMap((sandbox) =>
    (sandbox.compliance ?? [])
      .filter((claim) => !allowed.has(claim))
      .map((claim) => `${sandbox.slug}: ${claim}`),
  );

  assert.deepEqual(unexpected, []);
});

test("related guide ids resolve to real guides", () => {
  const guideIds = new Set(GUIDES.map((guide) => guide.id));
  const missing = INITIAL_SANDBOXES.flatMap((sandbox) =>
    (sandbox.relatedGuideIds ?? [])
      .filter((id) => !guideIds.has(id))
      .map((id) => `${sandbox.slug}: ${id}`),
  );

  assert.deepEqual(missing, []);
});

test("alternative slugs resolve to catalog listings", () => {
  const slugs = new Set(INITIAL_SANDBOXES.map((sandbox) => sandbox.slug));
  const missing = INITIAL_SANDBOXES.flatMap((sandbox) =>
    (sandbox.alternatives ?? [])
      .filter((slug) => !slugs.has(slug))
      .map((slug) => `${sandbox.slug}: ${slug}`),
  );

  assert.deepEqual(missing, []);
});
