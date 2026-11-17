import { GUIDES } from "../data/guides";
import { INITIAL_SANDBOXES } from "../data/sandboxes";
import { STATIC_PAGE_PATHS } from "./seo";
import { canonicalUrl, SITE_URL } from "./site";

/**
 * Sitemap generation.
 *
 * One source of truth: the same catalog and static route table the app
 * renders. Adding a listing or a guide changes the sitemap without anyone
 * editing a URL list, and URLs are always absolute `https://` canonicals.
 *
 * No `lastmod` is emitted. The catalog's `createdAt`/`updatedAt` describe when
 * a record was curated, not when the page changed, and the static routes have
 * no date at all; inventing one would give crawlers a false signal.
 */

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';
const URLSET_OPEN = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const URLSET_CLOSE = "</urlset>";

/** Characters that are not legal in XML text, including the tag delimiters. */
const XML_UNSAFE = /[&<>"']/g;

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

export interface SitemapEntry {
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
  const paths: string[] = [...STATIC_PAGE_PATHS];

  for (const sandbox of INITIAL_SANDBOXES) {
    paths.push(`/sandbox/${sandbox.slug}`);
  }

  if (options.guides !== false) {
    for (const guide of GUIDES) {
      paths.push(`/guides/${guide.slug}`);
    }
  }

  return paths.map((path) => ({ loc: canonicalUrl(path) }));
}

/** Serialize entries as a sitemaps.org 0.9 urlset document. */
export function renderSitemap(entries: SitemapEntry[]): string {
  const urls = entries.map((entry) => `  <url><loc>${escapeXml(entry.loc)}</loc></url>`).join("\n");
  return `${XML_DECLARATION}\n${URLSET_OPEN}\n${urls}\n${URLSET_CLOSE}\n`;
}

/** The complete sitemap document for the deployed site. */
export function generateSitemap(): string {
  return renderSitemap(sitemapEntries());
}

/** Reference used by robots.txt. */
export const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
