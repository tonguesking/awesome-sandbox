import assert from "node:assert/strict";
import { test } from "vitest";
import { GUIDES } from "../data/guides";
import { INITIAL_SANDBOXES } from "../data/sandboxes";
import { headForPath, STATIC_PAGE_PATHS } from "./seo";
import { canonicalUrl, SITE_URL } from "./site";
import { generateSitemap, renderSitemap, sitemapEntries } from "./sitemap";

const LOC_PATTERN = /<loc>([^<]+)<\/loc>/g;

function sitemapUrls(xml: string): string[] {
  return [...xml.matchAll(LOC_PATTERN)].map((match) => match[1]);
}

test("every catalog entry appears in the sitemap and has a unique title", () => {
  const urls = new Set(sitemapUrls(generateSitemap()));
  const titles = new Set<string>();
  for (const sandbox of INITIAL_SANDBOXES) {
    assert.ok(
      urls.has(canonicalUrl(`/sandbox/${sandbox.slug}`)),
      `${sandbox.slug} is missing from the sitemap`,
    );
    const head = headForPath(`/sandbox/${sandbox.slug}`);
    const title = head.meta.find((tag) => tag.title !== undefined)?.title;
    assert.ok(title, `${sandbox.slug} has no title`);
    assert.ok(!titles.has(title), `duplicate title "${title}"`);
    titles.add(title);
  }
  assert.equal(titles.size, INITIAL_SANDBOXES.length);
});

test("every catalog entry appears in the sitemap exactly once", () => {
  const urls = sitemapUrls(generateSitemap());
  for (const sandbox of INITIAL_SANDBOXES) {
    const expected = `https://awesome-sandbox.dev/sandbox/${sandbox.slug}`;
    assert.equal(
      urls.filter((url) => url === expected).length,
      1,
      `expected exactly one sitemap entry for ${sandbox.slug}`,
    );
  }
});

test("sitemap contains the home page, static pages and guides", () => {
  const urls = new Set(sitemapUrls(generateSitemap()));
  assert.ok(urls.has("https://awesome-sandbox.dev/"));
  for (const path of STATIC_PAGE_PATHS) {
    assert.ok(urls.has(canonicalUrl(path)), `missing static page ${path}`);
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
    assert.ok(entry.loc.startsWith(`${SITE_URL}/`), `${entry.loc} is not absolute`);
    assert.ok(!entry.loc.includes("?"), `${entry.loc} carries a query string`);
    assert.ok(!entry.loc.includes("#"), `${entry.loc} carries a fragment`);
  }
});

test("sitemap has no duplicate URLs", () => {
  const urls = sitemapUrls(generateSitemap());
  assert.equal(new Set(urls).size, urls.length);
});

test("sitemap is well-formed XML without an invented lastmod", () => {
  const xml = generateSitemap();
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
  assert.ok(xml.trimEnd().endsWith("</urlset>"));
  assert.ok(!xml.includes("<lastmod>"));
  assert.equal((xml.match(/<url>/g) ?? []).length, (xml.match(/<\/url>/g) ?? []).length);
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
