import { GUIDES } from "../data/guides";
import { REPO_LICENSES } from "../data/licenses";
import { INITIAL_SANDBOXES } from "../data/sandboxes";
import type { Sandbox } from "../types/sandbox";
import {
  canonicalUrl,
  GITHUB_REPOSITORY_URL,
  OG_IMAGE_URL,
  SITE_DESCRIPTION,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
} from "./site";

/**
 * Head metadata and JSON-LD builders shared by the server-rendered routes and
 * the client-side router. They read the same static catalog the UI reads, so a
 * new listing automatically gets a title, description, canonical and JSON-LD
 * without touching a route file.
 *
 * Nothing here may invent facts: no ratings, reviews, prices or offers are
 * emitted, and every optional field is omitted when the catalog has no value.
 */

export interface PageMeta {
  description: string;
  /** Canonical path (leading slash). The home page is "/". */
  path: string;
  title: string;
}

/** Static pages that exist as app routes, matching the client route table. */
const STATIC_PAGE_META: PageMeta[] = [
  {
    path: "/",
    title: `${SITE_TITLE} — Discover the Best Cloud Sandboxes for AI Agents`,
    description:
      "Explore and compare cloud sandboxes, AI agent execution environments, browser sandboxes, microVM infrastructure, and self-hosted solutions.",
  },
  {
    path: "/explore",
    title: "Explore Sandboxes & Infrastructure Directory",
    description:
      "Browse the complete catalog of cloud sandboxes, MicroVM runtimes, and developer environments with technical specs and pricing.",
  },
  {
    path: "/choose",
    title: "Find the Right Sandbox — Decision Guide",
    description:
      "Answer five questions about isolation, idle billing, pause state, deployment and license to get a ranked sandbox shortlist.",
  },
  {
    path: "/compare",
    title: "Compare Cloud Sandboxes Side-by-Side",
    description:
      "Evaluate architectural specs, microVM runtimes, desktop capabilities, and pricing models side by side.",
  },
  {
    path: "/calculator",
    title: "Sandbox Cost Estimator & Compute Calculator",
    description:
      "Simulate monthly infrastructure spend for sandbox fleets by concurrency, vCPU, memory, and idle sleep.",
  },
  {
    path: "/matrix",
    title: "Pricing & Lifecycle Matrix — Idle Cost and Pause State",
    description:
      "Every sandbox compared on idle billing, state kept on pause and resume latency — the axes that decide the bill.",
  },
  {
    path: "/benchmarks",
    title: "Cold Start Benchmarks — Sandbox Boot Times Ranked",
    description:
      "Every sandbox ranked by published cold start, from V8 isolates at a few milliseconds to full VMs in seconds, with resume latency for each.",
  },
  {
    path: "/guides",
    title: "Technical Architecture & Isolation Guides",
    description:
      "In-depth guides on Firecracker virtualization, gVisor isolation, agent execution architecture, and cost optimization.",
  },
  {
    path: "/submit",
    title: "Submit a Sandbox Infrastructure",
    description: "Propose a sandbox runtime, microVM system, or cloud computer for the directory.",
  },
  {
    path: "/about",
    title: "About the Sandbox Infrastructure Ecosystem",
    description: `How ${SITE_NAME} reviews, categorizes, and verifies sandbox infrastructure listings.`,
  },
];

const STATIC_PAGE_BY_PATH = new Map(STATIC_PAGE_META.map((page) => [page.path, page]));
const SANDBOX_BY_SLUG = new Map(INITIAL_SANDBOXES.map((sandbox) => [sandbox.slug, sandbox]));
const GUIDE_BY_SLUG = new Map(
  GUIDES.flatMap((guide) => [[guide.slug, guide] as const, [guide.id, guide] as const]),
);

/** Pages whose primary content is a filterable listing of catalog entries. */
const LISTING_PATHS = new Set(["/", "/explore", "/matrix", "/benchmarks", "/compare"]);

export const DEFAULT_PAGE_META: PageMeta = {
  path: "/",
  title: `${SITE_TITLE} — Discover the Best Cloud Sandboxes for AI Agents`,
  description: SITE_DESCRIPTION,
};

export function staticPageMeta(path: string): PageMeta | undefined {
  return STATIC_PAGE_BY_PATH.get(path);
}

export function sandboxDetailMeta(sandbox: Sandbox): PageMeta {
  return {
    path: `/sandbox/${sandbox.slug}`,
    title: `${sandbox.name} — Cloud Sandbox & Infrastructure Specs`,
    description: sandbox.description.slice(0, 300),
  };
}

export function guideMeta(guide: (typeof GUIDES)[number]): PageMeta {
  return {
    path: `/guides/${guide.slug}`,
    title: guide.title,
    description: guide.summary,
  };
}

/**
 * Full `<title>` for a page. The home page already names the site, so it keeps
 * its own title; every other page gets the brand suffix.
 */
export function documentTitle(meta: PageMeta): string {
  return meta.path === "/" ? meta.title : `${meta.title} | ${SITE_NAME}`;
}

export function notFoundMeta(): PageMeta {
  return {
    path: "/404",
    title: "Page not found",
    description: "The page you requested is not part of the Awesome Sandbox directory.",
  };
}

/** Meta description for any known path, falling back to the site default. */
export function descriptionForPath(path: string): string {
  const staticMeta = staticPageMeta(path);
  if (staticMeta) {
    return staticMeta.description;
  }
  return DEFAULT_PAGE_META.description;
}

/* -------------------------------------------------------------------------- */
/* Head tag builders                                                          */
/* -------------------------------------------------------------------------- */

/** TanStack Router meta descriptors, structurally compatible with `head()`. */
export interface MetaTag {
  charSet?: string;
  content?: string;
  name?: string;
  property?: string;
  title?: string;
}

export interface LinkTag {
  href: string;
  rel: string;
  type?: string;
}

export interface HeadLink {
  /** Serialized JSON-LD document; `<` is already escaped. */
  children: string;
  type: string;
}

export interface PageHead {
  links: LinkTag[];
  meta: MetaTag[];
  scripts: HeadLink[];
}

/**
 * Escape a JSON-LD document for embedding in a `<script>` element.
 *
 * `JSON.stringify` leaves `<` intact, so a catalog description containing
 * `</script>` could close the tag early. Replacing every `<` with a
 * unicode escape (`\u003c`) is valid JSON and cannot terminate the element.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function socialMeta(meta: PageMeta): MetaTag[] {
  const url = canonicalUrl(meta.path);
  return [
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: documentTitle(meta) },
    { property: "og:description", content: meta.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: OG_IMAGE_URL },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    {
      property: "og:image:alt",
      content: `${SITE_TITLE} — cloud sandbox directory`,
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: documentTitle(meta) },
    { name: "twitter:description", content: meta.description },
    { name: "twitter:image", content: OG_IMAGE_URL },
  ];
}

/** Build every `<title>`, meta, link and JSON-LD tag for a page. */
export function buildHead(meta: PageMeta, options: { noindex?: boolean } = {}): PageHead {
  const canonical = canonicalUrl(meta.path);
  const jsonLd = buildJsonLd(meta.path);

  const metaTags: MetaTag[] = [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "color-scheme", content: "dark" },
    { name: "theme-color", content: "#080B1A" },
    { title: documentTitle(meta) },
    { name: "description", content: meta.description },
    ...(options.noindex ? [{ name: "robots", content: "noindex, follow" }] : []),
    ...socialMeta(meta),
  ];

  return {
    meta: metaTags,
    links: [
      { rel: "canonical", href: canonical },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
    scripts: jsonLd.map((document) => ({
      type: "application/ld+json",
      children: serializeJsonLd(document),
    })),
  };
}

/** Head for an unknown path: a title and description, but no canonical claim. */
export function buildNotFoundHead(): PageHead {
  const meta = notFoundMeta();
  return {
    meta: [
      { title: documentTitle(meta) },
      { name: "description", content: meta.description },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [],
    scripts: [],
  };
}

/* -------------------------------------------------------------------------- */
/* JSON-LD                                                                    */
/* -------------------------------------------------------------------------- */

const QUERY_OR_HASH = /[?#]/;
const SANDBOX_PATH = /^\/sandbox\/([^/]+)$/;
const SANDBOX_PATH_TRAILING = /^\/sandbox\/([^/]+)\/?$/;
const GUIDE_PATH = /^\/guides\/([^/]+)$/;
const GUIDE_PATH_TRAILING = /^\/guides\/([^/]+)\/?$/;

const WEBSITE_ID = `${SITE_URL}/#website`;
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

function absoluteDetailUrl(slug: string): string {
  return canonicalUrl(`/sandbox/${slug}`);
}

function organizationNode() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_TITLE,
    url: `${SITE_URL}/`,
    logo: SITE_LOGO_URL,
    sameAs: [GITHUB_REPOSITORY_URL],
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_TITLE,
    alternateName: SITE_NAME,
    url: `${SITE_URL}/`,
  };
}

function itemListNode(sandboxes: Sandbox[]) {
  return {
    "@type": "ItemList",
    "@id": `${SITE_URL}/#catalog`,
    name: `${SITE_TITLE} catalog`,
    numberOfItems: sandboxes.length,
    itemListElement: sandboxes.map((sandbox, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: sandbox.name,
      url: absoluteDetailUrl(sandbox.slug),
    })),
  };
}

function softwareApplicationNode(sandbox: Sandbox) {
  const operatingSystems = sandbox.techSpecs?.operatingSystems ?? [];
  const license = REPO_LICENSES[sandbox.slug];
  return {
    "@type": "SoftwareApplication",
    "@id": `${absoluteDetailUrl(sandbox.slug)}#software`,
    name: sandbox.name,
    description: sandbox.description,
    applicationCategory: "DeveloperApplication",
    url: sandbox.website,
    ...(sandbox.categories.length > 0 ? { keywords: sandbox.categories.join(", ") } : {}),
    ...(operatingSystems.length > 0 ? { operatingSystem: operatingSystems.join(", ") } : {}),
    ...(license && license !== "NOASSERTION" ? { license } : {}),
    ...(sandbox.github ? { sameAs: [sandbox.github] } : {}),
  };
}

/**
 * JSON-LD documents for a path. Listing pages carry the WebSite/Organization
 * pair plus an ItemList; detail pages carry the SoftwareApplication; guide
 * pages carry an Article; unknown paths get nothing.
 */
export function buildJsonLd(path: string): unknown[] {
  const normalized = path === "" ? "/" : path;

  if (normalized === "/") {
    return [
      { "@context": "https://schema.org", ...websiteNode() },
      { "@context": "https://schema.org", ...organizationNode() },
      { "@context": "https://schema.org", ...itemListNode(INITIAL_SANDBOXES) },
    ];
  }

  if (LISTING_PATHS.has(normalized)) {
    return [
      { "@context": "https://schema.org", ...websiteNode() },
      { "@context": "https://schema.org", ...itemListNode(INITIAL_SANDBOXES) },
    ];
  }

  const sandboxMatch = normalized.match(SANDBOX_PATH);
  if (sandboxMatch) {
    const sandbox = SANDBOX_BY_SLUG.get(decodeURIComponent(sandboxMatch[1]));
    return sandbox
      ? [
          {
            "@context": "https://schema.org",
            ...softwareApplicationNode(sandbox),
          },
        ]
      : [];
  }

  const guideMatch = normalized.match(GUIDE_PATH);
  if (guideMatch) {
    const guide = GUIDE_BY_SLUG.get(decodeURIComponent(guideMatch[1]));
    if (!guide) {
      return [];
    }
    return [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: guide.title,
        description: guide.summary,
        datePublished: guide.publishedAt,
        url: canonicalUrl(`/guides/${guide.slug}`),
        author: { "@type": "Person", name: guide.author.name },
        isPartOf: { "@id": WEBSITE_ID },
      },
    ];
  }

  return [];
}

/** Resolve head data for a pathname, used by both SSR routes and the client router. */
export function headForPath(pathname: string): PageHead {
  const normalized = pathname.split(QUERY_OR_HASH, 1)[0] || "/";
  const staticMeta = staticPageMeta(normalized);
  if (staticMeta) {
    return buildHead(staticMeta);
  }

  const sandboxMatch = normalized.match(SANDBOX_PATH_TRAILING);
  if (sandboxMatch) {
    const sandbox = SANDBOX_BY_SLUG.get(decodeURIComponent(sandboxMatch[1]));
    return sandbox ? buildHead(sandboxDetailMeta(sandbox)) : buildNotFoundHead();
  }

  const guideMatch = normalized.match(GUIDE_PATH_TRAILING);
  if (guideMatch) {
    const guide = GUIDE_BY_SLUG.get(decodeURIComponent(guideMatch[1]));
    return guide ? buildHead(guideMeta(guide)) : buildNotFoundHead();
  }

  return buildNotFoundHead();
}

/** Look up a catalog entry by slug, shared with the sitemap generator. */
export function sandboxBySlug(slug: string): Sandbox | undefined {
  return SANDBOX_BY_SLUG.get(slug);
}

/** Static page paths, in navigation order. */
export const STATIC_PAGE_PATHS: string[] = STATIC_PAGE_META.map((page) => page.path);

/* -------------------------------------------------------------------------- */
/* Client-side document sync                                                  */
/* -------------------------------------------------------------------------- */

const MANAGED_ATTRIBUTE = "data-seo-managed";

function metaSelector(tag: MetaTag): string | null {
  if (tag.name) {
    return `meta[name="${tag.name}"]`;
  }
  if (tag.property) {
    return `meta[property="${tag.property}"]`;
  }
  return null;
}

function upsertMeta(tag: MetaTag): void {
  const selector = metaSelector(tag);
  if (!selector) {
    return;
  }
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    if (tag.name) {
      element.setAttribute("name", tag.name);
    }
    if (tag.property) {
      element.setAttribute("property", tag.property);
    }
    element.setAttribute(MANAGED_ATTRIBUTE, "");
    document.head.appendChild(element);
  }
  element.setAttribute("content", tag.content ?? "");
}

function upsertLink(rel: string, href: string): void {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    element.setAttribute(MANAGED_ATTRIBUTE, "");
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

/**
 * Keep the live document in sync with a page's head during client-side
 * navigation.
 *
 * The server-rendered tags stay in place: this only rewrites their attributes
 * and text, or appends tags the page adds. Nothing is removed, because the
 * tags rendered by `HeadContent` belong to React and deleting them breaks
 * reconciliation. Extra JSON-LD blocks from the previous page are neutralized
 * by changing their type instead.
 */
export function applyHeadToDocument(head: PageHead): void {
  const title = head.meta.find((tag) => tag.title !== undefined)?.title;
  if (title !== undefined) {
    document.title = title;
  }

  for (const tag of head.meta) {
    upsertMeta(tag);
  }

  for (const link of head.links) {
    upsertLink(link.rel, link.href);
  }

  // A 404 must not keep a canonical or an indexing directive from the page the
  // visitor came from. Removing React's nodes is unsafe, so the tags are
  // neutralized in place: an empty href claims nothing, and the rest of the
  // attributes are overwritten by the next real page.
  if (head.links.every((link) => link.rel !== "canonical")) {
    document.head.querySelector('link[rel="canonical"]')?.setAttribute("href", "");
  }
  if (head.meta.every((tag) => tag.name !== "robots")) {
    document.head.querySelector('meta[name="robots"]')?.setAttribute("content", "");
  }

  // Structured data is the one tag set that changes shape per page (the home
  // page has three documents, a detail page one). Reuse the nodes already in
  // the head — including ones a previous page neutralized — and retype any
  // surplus so nothing stale is read as structured data.
  const existing = [
    ...document.head.querySelectorAll(
      'script[type="application/ld+json"], script[data-seo-managed]',
    ),
  ] as HTMLScriptElement[];
  head.scripts.forEach((script, index) => {
    let element = existing[index];
    if (!element) {
      element = document.createElement("script");
      element.setAttribute(MANAGED_ATTRIBUTE, "");
      document.head.appendChild(element);
    }
    element.setAttribute("type", script.type);
    element.textContent = script.children;
  });
  for (let index = head.scripts.length; index < existing.length; index += 1) {
    existing[index].setAttribute("type", "text/plain");
    existing[index].textContent = "";
  }
}
