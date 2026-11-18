import assert from "node:assert/strict";
import { test } from "vitest";
import { GUIDES } from "../data/guides";
import { INITIAL_SANDBOXES } from "../data/sandboxes";
import { STATIC_PAGE_PATHS } from "./seo";
import { canonicalUrl, SITE_URL } from "./site";
import {
  generateSitemap,
  listingLastmod,
  renderSitemap,
  sitemapEntries,
  toSitemapDate,
} from "./sitemap";

function sitemapUrls(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

test("sitemap includes every static page, catalog listing and guide", () => {
  const urls = new Set(sitemapUrls(generateSitemap()));
  for (const path of STATIC_PAGE_PATHS) {
    assert.ok(urls.has(canonicalUrl(path)), `missing static page ${path}`);
  }
  for (const sandbox of INITIAL_SANDBOXES) {
    assert.ok(
      urls.has(canonicalUrl(`/sandbox/${sandbox.slug}`)),
      `missing sandbox ${sandbox.slug}`,
    );
  }
  for (const guide of GUIDES) {
    assert.ok(urls.has(canonicalUrl(`/guides/${guide.slug}`)), `missing guide ${guide.slug}`);
  }
});

test("sitemap URL count equals catalog plus static pages plus guides", () => {
  const entries = sitemapEntries();
  assert.equal(entries.length, INITIAL_SANDBOXES.length + STATIC_PAGE_PATHS.length + GUIDES.length);
  assert.equal(sitemapUrls(generateSitemap()).length, entries.length);
});

test("sitemap locations are absolute https URLs on the canonical host", () => {
  for (const entry of sitemapEntries()) {
    assert.ok(entry.loc.startsWith(`${SITE_URL}`), `${entry.loc} is not absolute`);
    assert.ok(entry.loc.startsWith("https://"), `${entry.loc} is not https`);
    assert.ok(!entry.loc.includes("?"), `${entry.loc} carries a query string`);
    assert.ok(!entry.loc.includes("#"), `${entry.loc} carries a fragment`);
  }
});

test("sitemap has no duplicate URLs", () => {
  const urls = sitemapUrls(generateSitemap());
  assert.equal(new Set(urls).size, urls.length);
});

test("sitemap is well-formed XML", () => {
  const xml = generateSitemap();
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
  assert.ok(xml.trimEnd().endsWith("</urlset>"));
  assert.equal((xml.match(/<url>/g) ?? []).length, (xml.match(/<\/url>/g) ?? []).length);
});

test("listing lastmod matches the latest valid date on the record", () => {
  const sample =
    INITIAL_SANDBOXES.find((sandbox) => sandbox.slug === "e2b") ?? INITIAL_SANDBOXES[0];
  const expected = listingLastmod(sample);
  const entry = sitemapEntries().find((item) => item.loc.endsWith(`/sandbox/${sample.slug}`));
  assert.ok(entry, "listing missing from sitemap");
  assert.equal(entry?.lastmod, expected);
  if (expected) {
    assert.ok(generateSitemap().includes(`<lastmod>${expected}</lastmod>`));
  }
});

test("toSitemapDate rejects malformed values instead of inventing dates", () => {
  assert.equal(toSitemapDate(undefined), undefined);
  assert.equal(toSitemapDate(""), undefined);
  assert.equal(toSitemapDate("not-a-date"), undefined);
  assert.equal(toSitemapDate("2026-13-40"), undefined);
  assert.equal(toSitemapDate("2026-11-18T12:00:00Z"), "2026-11-18");
  assert.equal(toSitemapDate("2026-11-18"), "2026-11-18");
});

test("XML special characters in a location are escaped", () => {
  const xml = renderSitemap([{ loc: "https://example.com/a&b<c" }]);
  assert.ok(xml.includes("<loc>https://example.com/a&amp;b&lt;c</loc>"));
});

test("guide pages can be excluded from the sitemap", () => {
  const withoutGuides = sitemapEntries({ guides: false });
  assert.equal(withoutGuides.length, INITIAL_SANDBOXES.length + STATIC_PAGE_PATHS.length);
  assert.ok(withoutGuides.every((entry) => !entry.loc.includes("/guides/")));
});

test("static pages omit lastmod", () => {
  for (const entry of sitemapEntries()) {
    if (!(entry.loc.includes("/sandbox/") || entry.loc.includes("/guides/"))) {
      assert.equal(entry.lastmod, undefined);
    }
  }
});
