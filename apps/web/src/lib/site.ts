/**
 * Single source of truth for the site's identity.
 *
 * Every title, canonical URL, Open Graph tag, JSON-LD document, robots.txt
 * sitemap reference and the sitemap itself read from here, so changing the
 * domain (or fixing a typo in it) cannot leave one surface stale.
 */
export const SITE_URL = "https://awesome-sandbox.dev";

/** Host name used for `og:site_name` and as the brand suffix in titles. */
export const SITE_NAME = "awesome-sandbox.dev";

/** Human-readable product name, used for JSON-LD `name` fields. */
export const SITE_TITLE = "Awesome Sandbox";

export const SITE_DESCRIPTION =
  "Discover and compare cloud sandboxes, AI agent execution environments, browser sandboxes, microVM infrastructure, and self-hosted runtimes.";

export const OG_IMAGE_PATH = "/og.png";
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

/** The brand mark that ships in `public/`, referenced by Organization JSON-LD. */
export const SITE_LOGO_URL = `${SITE_URL}/favicon.svg`;

export const GITHUB_REPOSITORY_URL = "https://github.com/tonguesking/awesome-sandbox";

/** Everything after a query string or fragment is not part of the path. */
const QUERY_OR_HASH = /[?#]/;
const DUPLICATE_SLASHES = /\/{2,}/g;
const TRAILING_SLASHES = /\/+$/;

/** Strip query string, fragment and duplicate/trailing slashes from a path. */
function toPathname(pathname: string): string {
  const pathOnly = pathname.split(QUERY_OR_HASH, 1)[0] ?? "/";
  const withLeadingSlash = pathOnly.startsWith("/") ? pathOnly : `/${pathOnly}`;
  return withLeadingSlash.replace(DUPLICATE_SLASHES, "/").replace(TRAILING_SLASHES, "");
}

/**
 * Turn a pathname into the absolute, canonical URL for that page.
 *
 * Query strings and fragments never identify a distinct page in this app
 * (filters live in the query string), so they are dropped. The home page is
 * the one URL that keeps its trailing slash.
 */
export function canonicalUrl(pathname: string): string {
  const normalized = toPathname(pathname);
  return normalized === "" ? `${SITE_URL}/` : `${SITE_URL}${normalized}`;
}

/**
 * Normalize a pathname for matching against the route table: no query string,
 * no fragment, a leading slash and no trailing slash (except the home page).
 */
export function normalizePathname(pathname: string): string {
  return toPathname(pathname) || "/";
}
