import { GUIDES } from "../data/guides";
import { INITIAL_SANDBOXES } from "../data/sandboxes";
import type { Sandbox } from "../types/sandbox";
import { STATIC_PAGE_PATHS } from "./seo";
import { canonicalUrl, SITE_URL } from "./site";

/**
 * Sitemap generation.
 *
 * One source of truth: the same catalog and static route table the app
 * renders. Adding a listing or a guide changes the sitemap without anyone
 * editing a URL list, and URLs are always absolute `https://` canonicals.
 *
 * `<lastmod>` is emitted only when a real, valid calendar date exists on the
 * record (YYYY-MM-DD). For listings that is the latest of `updatedAt` and
 * `pricing.verifiedAt`, falling back to `createdAt`. Guides use
 * `publishedAt`. Static pages have no date and omit lastmod. Missing or
 * malformed dates are omitted rather than invented.
 */

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';
const URLSET_OPEN = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const URLSET_CLOSE = "</urlset>";

/** Characters that are not legal in XML text, including the tag delimiters. */
const XML_UNSAFE = /[&<>"']/g;

const DAY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const XML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string): string {
  return value.replace(XML_UNSAFE, (character) => XML_ENTITIES[character] ?? character);
}

/** Accept only a real calendar day (YYYY-MM-DD), rejecting timestamps and junk. */
export function toSitemapDate(value: string | undefined | null): string | undefined {
  if (!value) {
    return undefined;
  }
  const day = value.slice(0, 10);
  if (!DAY_PATTERN.test(day)) {
    return undefined;
  }
  const parsed = new Date(`${day}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }
  if (parsed.toISOString().slice(0, 10) !== day) {
    return undefined;
  }
  return day;
}

/** Latest honest date on a listing, or undefined when none are valid. */
export function listingLastmod(sandbox: Sandbox): string | undefined {
  const candidates = [sandbox.updatedAt, sandbox.pricing.verifiedAt, sandbox.createdAt]
    .map(toSitemapDate)
    .filter((value): value is string => Boolean(value));
  if (candidates.length === 0) {
    return undefined;
  }
  return candidates.reduce((latest, day) => (day > latest ? day : latest));
}

export interface SitemapEntry {
  /** Optional W3C date (YYYY-MM-DD) when a real source date exists. */
  lastmod?: string;
  /** Absolute URL. */
  loc: string;
}

export interface SitemapSource {
  guides?: boolean;
}

/**
 * Every indexable URL on the site: the home page, the static page routes, one
 * page per catalog listing and one per guide article.
 *
 * Order is stable (static pages first, then catalog order, then guides) so the
 * generated file only changes when the content does.
 */
export function sitemapEntries(options: SitemapSource = {}): SitemapEntry[] {
  const entries: SitemapEntry[] = STATIC_PAGE_PATHS.map((path) => ({
    loc: canonicalUrl(path),
  }));

  for (const sandbox of INITIAL_SANDBOXES) {
    const lastmod = listingLastmod(sandbox);
    entries.push({
      loc: canonicalUrl(`/sandbox/${sandbox.slug}`),
      ...(lastmod ? { lastmod } : {}),
    });
  }

  if (options.guides !== false) {
    for (const guide of GUIDES) {
      const lastmod = toSitemapDate(guide.publishedAt);
      entries.push({
        loc: canonicalUrl(`/guides/${guide.slug}`),
        ...(lastmod ? { lastmod } : {}),
      });
    }
  }

  return entries;
}

/** Serialize entries as a sitemaps.org 0.9 urlset document. */
export function renderSitemap(entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) => {
      const lastmod = entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "";
      return `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>${lastmod}\n  </url>`;
    })
    .join("\n");
  return `${XML_DECLARATION}\n${URLSET_OPEN}\n${urls}\n${URLSET_CLOSE}\n`;
}

/** The complete sitemap document for the deployed site. */
export function generateSitemap(): string {
  return renderSitemap(sitemapEntries());
}

/** Reference used by robots.txt. */
export const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
