import assert from "node:assert/strict";
import { test } from "vitest";
import { GUIDES } from "../data/guides";
import { INITIAL_SANDBOXES } from "../data/sandboxes";
import {
  buildHead,
  buildJsonLd,
  buildNotFoundHead,
  documentTitle,
  headForPath,
  STATIC_PAGE_PATHS,
  serializeJsonLd,
  staticPageMeta,
} from "./seo";
import { canonicalUrl, SITE_NAME, SITE_URL } from "./site";

function metaContent(
  head: ReturnType<typeof buildHead>,
  key: string,
  kind: "name" | "property" = "name",
): string | undefined {
  return head.meta.find((tag) => (kind === "name" ? tag.name : tag.property) === key)?.content;
}

function jsonLdTypes(head: ReturnType<typeof buildHead>): string[] {
  return head.scripts.flatMap((script) => {
    const parsed = JSON.parse(script.children) as { "@type"?: string };
    return parsed["@type"] ? [parsed["@type"]] : [];
  });
}

test("home page head carries WebSite, Organization and ItemList", () => {
  const head = buildHead(staticPageMeta("/") ?? { path: "/", title: "", description: "" });
  assert.deepEqual(jsonLdTypes(head), ["WebSite", "Organization", "ItemList"]);

  const website = JSON.parse(head.scripts[0].children) as {
    url: string;
    name: string;
  };
  assert.equal(website.url, `${SITE_URL}/`);
  assert.ok(website.name.length > 0);

  const organization = JSON.parse(head.scripts[1].children) as {
    logo: string;
    name: string;
    url: string;
  };
  assert.equal(organization.url, `${SITE_URL}/`);
  assert.equal(organization.logo, `${SITE_URL}/favicon.svg`);
});

test("ItemList positions match catalog order and detail URLs", () => {
  const document = buildJsonLd("/explore").find(
    (entry) => (entry as { "@type": string })["@type"] === "ItemList",
  ) as {
    itemListElement: { position: number; url: string }[];
    numberOfItems: number;
  };
  assert.equal(document.numberOfItems, INITIAL_SANDBOXES.length);
  assert.equal(document.itemListElement.length, INITIAL_SANDBOXES.length);
  document.itemListElement.forEach((item, index) => {
    assert.equal(item.position, index + 1);
    assert.equal(item.url, canonicalUrl(`/sandbox/${INITIAL_SANDBOXES[index].slug}`));
  });
});

test("every leaf listing in the sitemap set has a usable sitemap entry", () => {
  const urls = new Set(
    INITIAL_SANDBOXES.map((sandbox) => canonicalUrl(`/sandbox/${sandbox.slug}`)),
  );
  assert.equal(urls.size, INITIAL_SANDBOXES.length);
});

test("every catalog entry has a unique detail title", () => {
  const titles = INITIAL_SANDBOXES.map((sandbox) =>
    documentTitle(headTitleFor(`/sandbox/${sandbox.slug}`)),
  );
  assert.equal(new Set(titles).size, titles.length);
});

function headTitleFor(path: string) {
  const head = headForPath(path);
  const title = head.meta.find((tag) => tag.title !== undefined)?.title ?? "";
  const pathMeta = path === "" ? "/" : path;
  return {
    path: pathMeta,
    title: title.replace(` | ${SITE_NAME}`, ""),
    description: "",
  };
}

test("static pages each have a distinct title and description", () => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const path of STATIC_PAGE_PATHS) {
    const head = headForPath(path);
    const title = head.meta.find((tag) => tag.title !== undefined)?.title;
    const description = metaContent(head, "description");
    assert.ok(title, `missing title for ${path}`);
    assert.ok(description, `missing description for ${path}`);
    titles.add(title as string);
    descriptions.add(description as string);
  }
  assert.equal(titles.size, STATIC_PAGE_PATHS.length);
  assert.equal(descriptions.size, STATIC_PAGE_PATHS.length);
});

test("every route has canonical, OG and Twitter tags in its head", () => {
  const paths = [
    ...STATIC_PAGE_PATHS,
    ...INITIAL_SANDBOXES.slice(0, 20).map((sandbox) => `/sandbox/${sandbox.slug}`),
    ...GUIDES.map((guide) => `/guides/${guide.slug}`),
  ];
  for (const path of paths) {
    const head = headForPath(path);
    const canonical = head.links.find((link) => link.rel === "canonical");
    assert.equal(canonical?.href, canonicalUrl(path), `canonical for ${path}`);
    assert.ok(metaContent(head, "og:title", "property"), `og:title for ${path}`);
    assert.ok(metaContent(head, "og:description", "property"), `og:description for ${path}`);
    assert.equal(metaContent(head, "og:url", "property"), canonicalUrl(path));
    assert.equal(metaContent(head, "og:type", "property"), "website");
    assert.equal(metaContent(head, "og:image", "property"), `${SITE_URL}/og.png`);
    assert.equal(metaContent(head, "og:site_name", "property"), SITE_NAME);
    assert.ok(metaContent(head, "twitter:card"));
    assert.ok(metaContent(head, "twitter:title"));
    assert.ok(metaContent(head, "twitter:description"));
    assert.equal(metaContent(head, "twitter:image"), `${SITE_URL}/og.png`);
  }
});

test("images and canonical URLs are never relative", () => {
  const head = headForPath("/sandbox/e2b");
  for (const key of ["og:image", "twitter:image"]) {
    const content =
      key === "og:image" ? metaContent(head, key, "property") : metaContent(head, key);
    assert.ok(content?.startsWith("https://"), `${key} must be absolute`);
  }
  assert.ok(head.links.find((link) => link.rel === "canonical")?.href.startsWith("https://"));
});

test("query strings and fragments never leak into canonical URLs", () => {
  const head = headForPath("/explore?category=MicroVM#top");
  assert.equal(head.links.find((link) => link.rel === "canonical")?.href, `${SITE_URL}/explore`);
});

test("sandbox detail metadata comes from catalog fields", () => {
  const sandbox = INITIAL_SANDBOXES.find((entry) => entry.slug === "e2b");
  assert.ok(sandbox);
  const head = headForPath("/sandbox/e2b");
  assert.ok(metaContent(head, "og:title", "property")?.includes(sandbox.name));
  assert.equal(metaContent(head, "description"), sandbox.description.slice(0, 300));
});

test("unknown paths get noindex and no canonical", () => {
  const head = headForPath("/this-page-does-not-exist");
  assert.ok(!head.links.some((link) => link.rel === "canonical"));
  assert.equal(metaContent(head, "robots"), "noindex, follow");
  assert.deepEqual(head.scripts, []);
  assert.deepEqual(buildNotFoundHead().links, []);
});

test("unknown sandbox ids get the not-found head, not a fake canonical", () => {
  const head = headForPath("/sandbox/not-a-real-sandbox");
  assert.ok(!head.links.some((link) => link.rel === "canonical"));
  assert.ok(head.meta.some((tag) => tag.name === "robots" && tag.content === "noindex, follow"));
});

test("SoftwareApplication JSON-LD uses only factual catalog fields", () => {
  const sandbox = INITIAL_SANDBOXES.find((entry) => entry.slug === "e2b");
  assert.ok(sandbox);
  const documents = buildJsonLd("/sandbox/e2b") as Record<string, unknown>[];
  assert.equal(documents.length, 1);
  const [app] = documents;
  assert.equal(app["@type"], "SoftwareApplication");
  assert.equal(app.name, sandbox.name);
  assert.equal(app.description, sandbox.description);
  assert.equal(app.url, sandbox.website);
  assert.equal(app.applicationCategory, "DeveloperApplication");

  // Facts the catalog does not provide must never be synthesized.
  for (const forbidden of ["aggregateRating", "review", "offers", "price", "ratingValue"]) {
    assert.ok(!(forbidden in app), `JSON-LD must not contain ${forbidden}`);
  }
});

test("license appears only when the catalog records a real SPDX value", () => {
  for (const sandbox of INITIAL_SANDBOXES) {
    const [app] = buildJsonLd(`/sandbox/${sandbox.slug}`) as Record<string, unknown>[];
    if (app && "license" in app) {
      assert.notEqual(app.license, "NOASSERTION", `${sandbox.slug} emitted an unasserted license`);
      assert.equal(typeof app.license, "string");
    }
  }
});

test("a listing without a repository omits sameAs", () => {
  const sandbox = INITIAL_SANDBOXES.find((entry) => !entry.github);
  assert.ok(sandbox, "expected at least one listing without a GitHub repository");
  const [app] = buildJsonLd(`/sandbox/${sandbox.slug}`) as Record<string, unknown>[];
  assert.ok(!("sameAs" in app));
});

test("guides get an Article document", () => {
  const [guide] = GUIDES;
  const [article] = buildJsonLd(`/guides/${guide.slug}`) as Record<string, unknown>[];
  assert.equal(article["@type"], "Article");
  assert.equal(article.headline, guide.title);
  assert.equal(article.datePublished, guide.publishedAt);
});

test("JSON-LD escapes every '<' so a description cannot close the script tag", () => {
  const serialized = serializeJsonLd({
    description: "close </script><script>alert(1)</script>",
  });
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), {
    description: "close </script><script>alert(1)</script>",
  });
});

test("every built script parses as JSON and is escaped", () => {
  for (const path of ["/", "/explore", "/sandbox/e2b"]) {
    for (const script of buildHead(staticPageMeta(path) ?? { path, title: "", description: "" })
      .scripts) {
      assert.ok(!script.children.includes("<"));
      JSON.parse(script.children);
    }
  }
});
