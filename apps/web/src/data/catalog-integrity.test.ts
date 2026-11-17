import assert from "node:assert/strict";
import { describe, expect, test } from "vitest";
import type { Sandbox } from "../types/sandbox";
import { EXPLORE_CATEGORIES } from "./categories";
import { GUIDES } from "./guides";
import { INITIAL_SANDBOXES } from "./sandboxes";

/**
 * The catalog is edited by append-only passes, so nothing else stops a typo
 * from shipping a category nobody can filter on, an alternative that points at
 * a slug that no longer exists, or a guide id that renders as dead text.
 * These checks run over the real data, not a fixture.
 */
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const NON_ALPHANUMERIC = /[^a-z0-9]/g;
const LEADING_WWW = /^www\./;
const TRAILING_SLASHES = /\/+$/;
const catalogs = INITIAL_SANDBOXES;
const slugs = new Set(catalogs.map((sandbox) => sandbox.slug));
const guideIds = new Set(GUIDES.map((guide) => guide.id));

function duplicates(values: string[]): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      dupes.add(value);
    }
    seen.add(value);
  }
  return [...dupes];
}

describe("catalog integrity", () => {
  test("ids and slugs are unique", () => {
    assert.deepEqual(duplicates(catalogs.map((s) => s.slug)), []);
    assert.deepEqual(duplicates(catalogs.map((s) => s.id)), []);
  });

  test("one product is not listed twice under two names", () => {
    const normalizeName = (name: string) => name.toLowerCase().replace(NON_ALPHANUMERIC, "");
    const host = (sandbox: Sandbox) => {
      try {
        const url = new URL(sandbox.website);
        // Every GitHub-hosted project shares github.com, so compare the
        // owner/repo path instead of the host alone.
        if (url.host.replace(LEADING_WWW, "") === "github.com") {
          return `${url.host}${url.pathname.replace(TRAILING_SLASHES, "")}`.toLowerCase();
        }
        return url.host.replace(LEADING_WWW, "");
      } catch {
        return sandbox.website;
      }
    };
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const sandbox of catalogs) {
      const key = `${normalizeName(sandbox.name)}|${host(sandbox)}`;
      const first = seen.get(key);
      if (first) {
        dupes.push(`${first} / ${sandbox.slug}`);
      } else {
        seen.set(key, sandbox.slug);
      }
    }
    assert.deepEqual(dupes, []);
  });

  test("one repository is not listed twice under two names", () => {
    const repoPath = (github: string) => {
      const match = github.match(/github\.com\/([^/]+)\/([^/?#]+)/i);
      if (!match) {
        return null;
      }
      return `${match[1]}/${match[2]}`
        .toLowerCase()
        .replace(/\.git$/, "")
        .replace(TRAILING_SLASHES, "");
    };
    const seen = new Map<string, string>();
    const dupes: string[] = [];
    for (const sandbox of catalogs) {
      if (!sandbox.github) {
        continue;
      }
      const key = repoPath(sandbox.github);
      if (!key) {
        continue;
      }
      const first = seen.get(key);
      if (first) {
        dupes.push(`${first} / ${sandbox.slug}`);
      } else {
        seen.set(key, sandbox.slug);
      }
    }
    assert.deepEqual(dupes, []);
  });

  test("actively sold listings do not recommend an archived alternative", () => {
    const archived = new Set(
      catalogs.filter((sandbox) => sandbox.status === "deprecated").map((sandbox) => sandbox.slug),
    );
    const stale = catalogs
      .filter((sandbox) => sandbox.status !== "deprecated")
      .flatMap((sandbox) =>
        (sandbox.alternatives ?? [])
          .filter((slug) => archived.has(slug))
          .map((slug) => `${sandbox.slug} -> ${slug}`),
      );
    assert.deepEqual(stale, []);
  });

  test("every category is filterable from the sidebar", () => {
    const known = new Set(EXPLORE_CATEGORIES);
    const unknown = [
      ...new Set(
        catalogs.flatMap((sandbox) =>
          (sandbox.categories ?? []).filter((category) => !known.has(category)),
        ),
      ),
    ];
    assert.deepEqual(
      unknown,
      [],
      `categories with no EXPLORE_CATEGORIES entry: ${unknown.join(", ")}`,
    );
  });

  test("alternatives point at listings that exist", () => {
    const broken = catalogs.flatMap((sandbox) =>
      (sandbox.alternatives ?? [])
        .filter((slug) => !slugs.has(slug))
        .map((slug) => `${sandbox.slug} -> ${slug}`),
    );
    assert.deepEqual(broken, []);
  });

  // builtOn mixes catalog slugs with plain technology names (Wasmer is built
  // on Wasmtime, Tart on Apple Virtualization.framework). The detail page
  // renders the second kind as text, so only emptiness is a defect here.
  test("builtOn never carries an empty entry", () => {
    const empty = catalogs.flatMap((sandbox) =>
      (sandbox.builtOn ?? [])
        .filter((name) => name.trim().length === 0)
        .map((name) => `${sandbox.slug} -> "${name}"`),
    );
    assert.deepEqual(empty, []);
  });

  test("related guide ids resolve", () => {
    const broken = catalogs.flatMap((sandbox) =>
      (sandbox.relatedGuideIds ?? [])
        .filter((id) => !guideIds.has(id))
        .map((id) => `${sandbox.slug} -> guide ${id}`),
    );
    assert.deepEqual(broken, []);
  });

  test("dates are ISO day strings and verification is not in the future", () => {
    const today = new Date().toISOString().slice(0, 10);
    const bad: string[] = [];
    for (const sandbox of catalogs) {
      for (const field of ["createdAt", "updatedAt"] as const) {
        if (!ISO_DAY.test(sandbox[field])) {
          bad.push(`${sandbox.slug}.${field}=${sandbox[field]}`);
        }
      }
      const { verifiedAt } = sandbox.pricing;
      if (verifiedAt && verifiedAt > today) {
        bad.push(`${sandbox.slug}.verifiedAt is in the future (${verifiedAt})`);
      }
    }
    assert.deepEqual(bad, []);
  });

  test("every listing can be filtered on isolation, deployment and runtime", () => {
    const offenders = catalogs.filter((sandbox) => {
      const runtime = sandbox.runtime ?? {};
      const hasRuntime =
        runtime.firecracker === true ||
        runtime.docker === true ||
        runtime.gvisor === true ||
        (runtime.other?.length ?? 0) > 0;
      const { cloud, selfHosted, byoc } = sandbox.deployment ?? {};
      return !(hasRuntime && (cloud || selfHosted || byoc));
    });
    assert.deepEqual(
      offenders.map((s) => s.slug),
      [],
    );
  });

  // A listing needs somewhere for a reader to check the price: its own pricing
  // page, or the repository when the product is self-hosted and free. A
  // quote-only product has no rate card to link, which is the one exception.
  test("pricing entries name a model and a source to verify it", () => {
    const offenders: Sandbox[] = catalogs.filter((sandbox) => {
      if ((sandbox.pricing?.model?.length ?? 0) === 0) {
        return true;
      }
      if (sandbox.pricing?.transparency === "quote_only") {
        return false;
      }
      return !(sandbox.pricing?.pricingUrl || sandbox.github);
    });
    expect(offenders.map((s) => s.slug)).toEqual([]);
  });
});
