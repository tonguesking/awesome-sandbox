import type { FilterState, Sandbox } from "../types/sandbox";
import { matchesLicense, REPO_LICENSES } from "../data/licenses";
import { billingShape } from "./billing";
import { isUnpublishedBootTime } from "./bootTime";
import { isolationBoundary, matchesIsolationBoundary } from "./isolation";

export const DEFAULT_FILTERS: FilterState = {
  search: "",
  statuses: [],
  categories: [],
  productTypes: [],
  runtimes: [],
  sdkLanguages: [],
  bootSpeeds: [],
  billingShapes: [],
  compliance: [],
  operatingSystems: [],
  pricing: [],
  resumeSpeeds: [],
  deployment: [],
  idleBilling: [],
  isolationBoundaries: [],
  licenses: [],
  minRating: 0,
  minStars: 0,
  pauseStates: [],
  capabilities: [],
  openSourceOnly: false,
  favoritesOnly: false,
  documentedCoreOnly: false,
  verifiedPricingOnly: false,
  excludeQuoteOnly: false,
  excludeDeprecated: false,
  excludeCloudOnly: false,
  sortBy: "popularity",
  viewMode: "grid",
};

/**
 * Whether any control narrows the catalog. Sort and view mode do not count:
 * they reorder or reshape the same results. Every page that offers a "clear"
 * action reads this one definition so a newly added facet cannot leave an
 * invisible filter behind.
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.search.trim().length > 0 ||
    filters.categories.length > 0 ||
    filters.runtimes.length > 0 ||
    filters.isolationBoundaries.length > 0 ||
    filters.licenses.length > 0 ||
    filters.bootSpeeds.length > 0 ||
    filters.resumeSpeeds.length > 0 ||
    filters.operatingSystems.length > 0 ||
    filters.billingShapes.length > 0 ||
    filters.pricing.length > 0 ||
    filters.deployment.length > 0 ||
    filters.idleBilling.length > 0 ||
    filters.pauseStates.length > 0 ||
    filters.compliance.length > 0 ||
    filters.statuses.length > 0 ||
    filters.productTypes.length > 0 ||
    filters.sdkLanguages.length > 0 ||
    filters.capabilities.length > 0 ||
    filters.openSourceOnly ||
    filters.favoritesOnly ||
    filters.documentedCoreOnly ||
    filters.verifiedPricingOnly ||
    filters.excludeQuoteOnly ||
    filters.excludeDeprecated ||
    filters.excludeCloudOnly ||
    filters.minRating > 0 ||
    filters.minStars > 0
  );
}

const VENDOR_CAVEAT = /^(the )?(vendor|site|project|readme)\b/i;
const DASHES = /[–—]/g;
const RESUME_MS = /(\d+(?:\.\d+)?)\s*ms/;
const RESUME_SECONDS = /(\d+(?:\.\d+)?)\s*(?:-\s*\d+(?:\.\d+)?\s*)?(?:s\b|sec|seconds)/;
const BOOT_TOTAL_MS = /(\d+(?:\.\d+)?)\s*ms\s*total/;
const BOOT_MS = /(\d+(?:\.\d+)?)\s*ms/g;
const BOOT_SECONDS = /(\d+(?:\.\d+)?)\s*(?:-\s*\d+(?:\.\d+)?\s*)?(?:s|second|seconds)\b/;
const SEARCH_SEPARATOR = /\s+/;
const PUBLISHED_VALUE = /not published|not applicable/i;
const OS_LINUX = /linux|ubuntu|debian|fedora|centos|alpine/;
const OS_MACOS = /macos|os x|apple silicon/;
const OS_WINDOWS = /windows/;
const OS_ANDROID = /android/;
const OS_IOS = /\bios\b/;
const COMPLIANCE_SOC2 = /soc\s*2/;
const COMPLIANCE_ISO27001 = /iso\s*27001/;
const COMPLIANCE_HIPAA = /hipaa/;
const COMPLIANCE_GDPR = /gdpr/;
const COMPLIANCE_ZDR = /zero data retention|zdr/;

/**
 * Resume cells are prose, not numbers: some publish "90ms", others publish no
 * figure and explain why. Only the first numeric duration counts, and a cell
 * that leads with a caveat yields no figure at all.
 */
export function parseResumeTimeMs(resumeTime?: string): number {
  if (!(resumeTime && !isUnpublishedBootTime(resumeTime))) {
    return Number.POSITIVE_INFINITY;
  }
  // "The vendor states a 124 ms boot time" describes a different measurement,
  // however many digits it carries.
  if (VENDOR_CAVEAT.test(resumeTime.trim())) {
    return Number.POSITIVE_INFINITY;
  }
  const normalized = resumeTime.toLowerCase().replace(DASHES, "-");
  const ms = normalized.match(RESUME_MS);
  if (ms) {
    return Number.parseFloat(ms[1]);
  }
  const seconds = normalized.match(RESUME_SECONDS);
  if (seconds) {
    return Number.parseFloat(seconds[1]) * 1000;
  }
  return Number.POSITIVE_INFINITY;
}

/**
 * Only a retained pause state makes a resume figure comparable. A sandbox that
 * keeps nothing boots fresh, whatever latency the vendor measured.
 */
export function resumeLatencyMs(sandbox: Sandbox): number {
  const kept = sandbox.lifecycle?.pauseRetains;
  if (!kept || kept === "none") {
    return Number.POSITIVE_INFINITY;
  }
  return parseResumeTimeMs(sandbox.lifecycle?.resumeTime);
}

export function parseBootTimeMs(bootTime?: string): number {
  // A cell that leads with "not published" carries a caveat, not a figure: any
  // digits after it are context ("worked examples show 56 ms"), so they must not
  // reach the boot filter, the ranking or the card badge.
  if (!bootTime || isUnpublishedBootTime(bootTime)) {
    return Number.POSITIVE_INFINITY;
  }
  // Vendors mix ASCII hyphen and en/em dashes in ranges: "1–3s".
  const normalized = bootTime.toLowerCase().replace(DASHES, "-");

  // Handle combined notes like "< 5ms (kernel boot) / < 125ms total" by prioritizing total/worst-case ms
  const totalMatch = normalized.match(BOOT_TOTAL_MS);
  if (totalMatch) {
    return Number.parseFloat(totalMatch[1]);
  }

  const msMatches = [...normalized.matchAll(BOOT_MS)];
  const lastMsMatch = msMatches.at(-1);
  if (lastMsMatch) {
    return Number.parseFloat(lastMsMatch[1]);
  }

  const secMatch = normalized.match(BOOT_SECONDS);
  if (secMatch) {
    const val = Number.parseFloat(secMatch[1]);
    // "< 1s" or "< 1 second" represents sub-second startup (~900ms) rather than >= 1000ms
    if (normalized.includes("< 1") && val === 1) {
      return 900;
    }
    return val * 1000;
  }

  return Number.POSITIVE_INFINITY;
}

export function matchesRuntime(item: Sandbox, runtimeId: string): boolean {
  const otherJoined = (item.runtime.other || []).join(" ").toLowerCase();
  switch (runtimeId) {
    case "firecracker":
      return item.runtime.firecracker === true;
    case "docker":
      return item.runtime.docker === true;
    case "gvisor":
      return item.runtime.gvisor === true;
    case "v8_wasm":
      return (
        otherJoined.includes("v8") ||
        otherJoined.includes("webassembly") ||
        otherJoined.includes("wasm")
      );
    case "kvm_kata":
      return (
        otherJoined.includes("kvm") ||
        otherJoined.includes("kata") ||
        otherJoined.includes("qemu") ||
        otherJoined.includes("hypervisor") ||
        otherJoined.includes("mshv")
      );
    case "interpreter":
      return (
        otherJoined.includes("interpreter") ||
        otherJoined.includes("monty") ||
        otherJoined.includes("python subset")
      );
    default:
      return false;
  }
}

export function matchesBootSpeed(item: Sandbox, speedId: string): boolean {
  const ms = parseBootTimeMs(item.techSpecs?.bootTime);
  if (!Number.isFinite(ms)) {
    return false;
  }
  switch (speedId) {
    case "instant":
      return ms <= 200;
    case "subsecond":
      return ms <= 1000;
    case "standard":
      return ms > 1000;
    default:
      return false;
  }
}

export function matchesResumeSpeed(item: Sandbox, speedId: string): boolean {
  const ms = resumeLatencyMs(item);
  if (!Number.isFinite(ms)) {
    return false;
  }
  switch (speedId) {
    case "instant":
      return ms <= 200;
    case "subsecond":
      return ms <= 1000;
    case "standard":
      return ms > 1000;
    default:
      return false;
  }
}

export function matchesPricing(item: Sandbox, price: string): boolean {
  if (price === "Free Tier") {
    return item.pricing.freeTier === true;
  }
  return item.pricing.model?.includes(price) ?? false;
}

export function matchesBillingShape(item: Sandbox, shape: string): boolean {
  return billingShape(item) === shape;
}

/**
 * `operatingSystems` mixes exact names and notes ("Linux (KVM)", "Ubuntu"),
 * so match the family and include common distro spellings under Linux.
 */
export function matchesOperatingSystem(item: Sandbox, optionId: string): boolean {
  const systems = (item.techSpecs?.operatingSystems ?? []).join(" ").toLowerCase();
  switch (optionId) {
    case "linux":
      return OS_LINUX.test(systems);
    case "macos":
      return OS_MACOS.test(systems);
    case "windows":
      return OS_WINDOWS.test(systems);
    case "android":
      return OS_ANDROID.test(systems);
    case "ios":
      return OS_IOS.test(systems);
    default:
      return false;
  }
}

/**
 * Vendors spell the same attestation several ways ("SOC 2 Type II", "SOC 2
 * Type 2", "SOC 2"), so match by family instead of by exact label.
 */
export function matchesCompliance(item: Sandbox, optionId: string): boolean {
  const claims = (item.compliance ?? []).map((claim) => claim.toLowerCase());
  switch (optionId) {
    case "soc2":
      return claims.some((claim) => COMPLIANCE_SOC2.test(claim));
    case "iso27001":
      return claims.some((claim) => COMPLIANCE_ISO27001.test(claim));
    case "hipaa":
      return claims.some((claim) => COMPLIANCE_HIPAA.test(claim));
    case "gdpr":
      return claims.some((claim) => COMPLIANCE_GDPR.test(claim));
    case "zdr":
      return claims.some((claim) => COMPLIANCE_ZDR.test(claim));
    default:
      return false;
  }
}

export function matchesDeployment(item: Sandbox, dep: string): boolean {
  if (dep === "Cloud") {
    return item.deployment.cloud === true;
  }
  if (dep === "Self-hosted") {
    return item.deployment.selfHosted === true;
  }
  if (dep === "BYOC") {
    return item.deployment.byoc === true;
  }
  return false;
}

export function matchesIdleBilling(item: Sandbox, optionId: string): boolean {
  return item.lifecycle?.idleBilling === optionId;
}

export function matchesPauseState(item: Sandbox, optionId: string): boolean {
  return item.lifecycle?.pauseRetains === optionId;
}

export function matchesSdkLanguage(item: Sandbox, language: string): boolean {
  const target = language.toLowerCase();
  return (item.sdkLanguages ?? []).some((value) => value.toLowerCase() === target);
}

/** Lifecycle status is exact: "beta" should not match "active". */
export function matchesStatus(item: Sandbox, status: string): boolean {
  return item.status === status;
}

export function matchesCapability(item: Sandbox, cap: string): boolean {
  const c = cap.toLowerCase().trim();
  if (c === "persistent") {
    return item.capabilities.persistent === true;
  }
  if (c === "snapshot") {
    return item.capabilities.snapshot === true;
  }
  if (c === "fork") {
    return item.capabilities.fork === true;
  }
  if (c === "gpu") {
    return item.capabilities.gpu === true;
  }
  if (c === "desktop") {
    return item.capabilities.desktop === true;
  }
  if (c === "mobile" || c === "phone" || c === "手机") {
    return item.capabilities.mobile === true;
  }
  if (c === "browser") {
    return item.capabilities.browser === true;
  }
  if (c === "egresscontrol" || c === "egress control" || c === "egress") {
    return item.capabilities.egressControl === true;
  }
  if (c === "autosleep" || c === "pause / auto-sleep" || c === "auto-sleep" || c === "hibernate") {
    return item.capabilities.autoSleep === true;
  }
  if (c === "api") {
    return item.capabilities.api === true;
  }
  if (c === "sdk") {
    return item.capabilities.sdk === true;
  }
  if (c === "cli") {
    return item.capabilities.cli === true;
  }
  if (c === "mcp") {
    return item.capabilities.mcp === true;
  }
  if (c === "webhook") {
    return item.capabilities.webhook === true;
  }
  if (c === "open source") {
    return item.openSource === true;
  }
  return false;
}

/** Search-only synonyms, emitted when the structured field is true. */
function optionalTerm(on: boolean | null | undefined, term: string): string {
  return on ? term : "";
}

function buildSearchCorpus(item: Sandbox): string {
  const parts: string[] = [
    item.name,
    item.description,
    ...item.categories,
    item.overview || "",
    ...(item.keyFeatures || []),
    ...(item.runtime.other || []),
    item.techSpecs?.networkIsolation || "",
    item.techSpecs?.storageLimit || "",
    ...(item.techSpecs?.operatingSystems || []),
    ...(item.pricing.model || []),
    REPO_LICENSES[item.slug] || "",
    optionalTerm(item.runtime.firecracker, "firecracker microvm"),
    optionalTerm(item.runtime.docker, "docker container oci"),
    optionalTerm(item.runtime.gvisor, "gvisor runsc"),
    optionalTerm(item.deployment.cloud, "cloud"),
    optionalTerm(item.deployment.selfHosted, "self-hosted selfhosted"),
    optionalTerm(item.deployment.byoc, "byoc"),
    optionalTerm(item.openSource, "open source opensource"),
    optionalTerm(item.capabilities.persistent, "persistent volume storage"),
    optionalTerm(item.capabilities.snapshot, "snapshot checkpoint"),
    optionalTerm(item.capabilities.fork, "fork clone"),
    optionalTerm(item.capabilities.gpu, "gpu cuda nvidia"),
    optionalTerm(item.capabilities.desktop, "desktop gui vnc webrtc"),
    optionalTerm(item.capabilities.mobile, "mobile android ios phone"),
    optionalTerm(item.capabilities.browser, "browser chromium playwright puppeteer"),
    optionalTerm(item.capabilities.egressControl, "egress firewall allowlist proxy"),
    optionalTerm(item.capabilities.autoSleep, "pause resume hibernate sleep"),
    optionalTerm(item.capabilities.mcp, "mcp model context protocol"),
    optionalTerm(item.capabilities.webhook, "webhook"),
    ...(item.lifecycle?.idleBilling ? [item.lifecycle.idleBilling.replace(/_/g, " ")] : []),
    ...(item.lifecycle?.pauseRetains ? [item.lifecycle.pauseRetains] : []),
    item.lifecycle?.resumeTime || "",
    item.lifecycle?.sessionLimit || "",
    ...(item.compliance || []),
    ...(item.sdkLanguages || []),
  ];
  return parts.join(" ").toLowerCase();
}

/**
 * How many of the comparison axes a listing actually answers. Used only for
 * ranking: a low score means the entry is thin, not that the product is bad.
 */
function documentationScore(sandbox: Sandbox): number {
  let score = 0;
  if (sandbox.pricing.transparency === "official_verified") {
    score += 2;
  }
  if (Number.isFinite(parseBootTimeMs(sandbox.techSpecs?.bootTime))) {
    score += 2;
  }
  if (isolationBoundary(sandbox) !== "unknown") {
    score += 2;
  }
  const cpu = sandbox.techSpecs?.maxVcpu;
  if (cpu && !PUBLISHED_VALUE.test(cpu)) {
    score += 1;
  }
  if (sandbox.website && sandbox.documentation) {
    score += 1;
  }
  return score;
}

/** Popularity fallback: featured first, then traction with rating as a proxy. */
function popularityScore(sandbox: Sandbox): number {
  return sandbox.githubStars || (sandbox.rating ? sandbox.rating * 1000 : 0);
}

const byStarsDesc = (a: Sandbox, b: Sandbox) => (b.githubStars || 0) - (a.githubStars || 0);

/**
 * One comparator per sort mode. A lookup keeps the filter pipeline a flat
 * list of passes instead of a nested switch.
 */
const SORT_COMPARATORS: Record<FilterState["sortBy"], (a: Sandbox, b: Sandbox) => number> = {
  stars: byStarsDesc,
  name: (a, b) => a.name.localeCompare(b.name),
  recently_added: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  recently_updated: (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  boot_speed: (a, b) =>
    parseBootTimeMs(a.techSpecs?.bootTime) - parseBootTimeMs(b.techSpecs?.bootTime),
  resume_speed: (a, b) => {
    const resumeA = resumeLatencyMs(a);
    const resumeB = resumeLatencyMs(b);
    return resumeA === resumeB ? byStarsDesc(a, b) : resumeA - resumeB;
  },
  documented: (a, b) => {
    const delta = documentationScore(b) - documentationScore(a);
    return delta === 0 ? popularityScore(b) - popularityScore(a) : delta;
  },
  rating: (a, b) => {
    const ratingDelta = (b.rating ?? 0) - (a.rating ?? 0);
    return ratingDelta === 0 ? byStarsDesc(a, b) : ratingDelta;
  },
  open_source: (a, b) => {
    if (a.openSource === b.openSource) {
      return byStarsDesc(a, b);
    }
    return a.openSource ? -1 : 1;
  },
  popularity: (a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return popularityScore(b) - popularityScore(a);
  },
};

/** Tie-break for a text search on the default sort: a listing whose own name
 *  matches the query should beat a more popular one that only mentions it in a
 *  spec table. Explicit sorts still win; this only refines "Popularity". */
function searchRank(item: Sandbox, query: string): number {
  const q = query.toLowerCase();
  const name = item.name.toLowerCase();
  if (name === q) {
    return 0;
  }
  if (name.startsWith(q)) {
    return 1;
  }
  if (name.includes(q)) {
    return 2;
  }
  if (item.slug.includes(q)) {
    return 3;
  }
  if (item.categories.some((category) => category.toLowerCase().includes(q))) {
    return 4;
  }
  return 5;
}

/** Every token must appear somewhere in the listing's searchable fields. */
function filterBySearch(list: Sandbox[], search: string): Sandbox[] {
  if (search.trim().length === 0) {
    return list;
  }
  const tokens = search.toLowerCase().trim().split(SEARCH_SEPARATOR).filter(Boolean);
  return list.filter((item) => {
    const corpus = buildSearchCorpus(item);
    return tokens.every((token) => corpus.includes(token));
  });
}

/**
 * Apply one selected facet. Empty selection is a no-op; most facets are OR
 * within themselves, while attestations and capabilities must all hold.
 */
function facetFilter<T>(
  values: T[],
  matches: (item: Sandbox, value: T) => boolean,
  requireAll = false,
): (list: Sandbox[]) => Sandbox[] {
  if (values.length === 0) {
    return (list) => list;
  }
  return (list) =>
    list.filter((item) =>
      requireAll
        ? values.every((value) => matches(item, value))
        : values.some((value) => matches(item, value)),
    );
}

/**
 * A listing passes only when the three claims buyers cannot infer from a
 * feature grid are documented: a price checked against an official source, a
 * named containment boundary, and a stated egress posture (true or false both
 * count — "not documented" is null). Boot time is deliberately excluded, since
 * many sound runtimes never publish one.
 */
export function hasDocumentedCore(sandbox: Sandbox): boolean {
  const egress = sandbox.capabilities?.egressControl;
  return (
    sandbox.pricing?.transparency === "official_verified" &&
    isolationBoundary(sandbox) !== "unknown" &&
    (egress === true || egress === false)
  );
}

export function filterAndSortSandboxes(sandboxes: Sandbox[], filters: FilterState): Sandbox[] {
  let list = [...sandboxes];

  // 1. Tokenized full-text search across specs, runtimes, OS, capabilities, deployment, pricing
  list = filterBySearch(list, filters.search);

  // 2. Category Filter (OR within category selection)
  list = facetFilter(filters.categories, (item, cat) => item.categories.includes(cat))(list);

  // 3. Isolation Runtime Filter (OR within runtime selection)
  list = facetFilter(filters.runtimes, matchesRuntime)(list);

  // 4. Cold-Start Boot Speed Filter (OR within selected speeds)
  list = facetFilter(filters.bootSpeeds, matchesBootSpeed)(list);

  // 4b. Resume Speed Filter — only sandboxes that retain state on pause count.
  list = facetFilter(filters.resumeSpeeds, matchesResumeSpeed)(list);

  // 5. Pricing Filter (OR within selected pricing models)
  list = facetFilter(filters.pricing, matchesPricing)(list);

  // 5b. Rate shape: keep per-hour math away from seat and licence plans.
  list = facetFilter(filters.billingShapes, matchesBillingShape)(list);

  // 6. Deployment Filter (OR within selected deployment targets)
  list = facetFilter(filters.deployment, matchesDeployment)(list);

  // 7. Idle billing behavior (OR within selection)
  list = facetFilter(filters.idleBilling, matchesIdleBilling)(list);

  // 8. State retained across pause (OR within selection)
  list = facetFilter(filters.pauseStates, matchesPauseState)(list);

  // 9. Official SDK language (OR within selection)
  list = facetFilter(filters.sdkLanguages, matchesSdkLanguage)(list);

  // 9b. Compliance claims (AND: a buyer naming two attestations needs both).
  list = facetFilter(filters.compliance, matchesCompliance, true)(list);

  // 9c. Guest/host OS family (OR within selection).
  list = facetFilter(filters.operatingSystems, matchesOperatingSystem)(list);

  // 9d. Lifecycle status (OR within selection).
  list = facetFilter(filters.statuses, matchesStatus)(list);

  // 9e. Containment tier (OR within selection).
  list = facetFilter(filters.isolationBoundaries, matchesIsolationBoundary)(list);

  // 9f. Product type (OR within selection).
  list = facetFilter(filters.productTypes, (item, type) => item.productType === type)(list);

  // 9g. License family (OR within selection). Reads the verified SPDX map, so
  // listings with no repository — closed vendors — fall out while it is on.
  list = facetFilter(filters.licenses, matchesLicense)(list);

  // 10. Capabilities Filter (AND: must satisfy all selected capabilities)
  list = facetFilter(filters.capabilities, matchesCapability, true)(list);

  // 11. Open Source Only toggle
  if (filters.openSourceOnly) {
    list = list.filter((item) => item.openSource);
  }

  // 12. Evidence toggles. First the composite: pricing, containment and egress.
  if (filters.documentedCoreOnly) {
    list = list.filter(hasDocumentedCore);
  }

  // 12a. Pricing evidence — hide listings we could not verify.
  if (filters.verifiedPricingOnly) {
    list = list.filter((item) => item.pricing.transparency === "official_verified");
  }

  // 12b. Published prices only — quote-only listings cannot be compared.
  if (filters.excludeQuoteOnly) {
    list = list.filter((item) => item.pricing.transparency !== "quote_only");
  }

  // 12b1. Editorial rating. Only reviewed listings carry one, so a floor is a
  // deliberate trade of breadth for confidence.
  if (filters.minRating > 0) {
    list = list.filter((item) => (item.rating ?? 0) >= filters.minRating);
  }

  // 12b2. Community traction. A floor intentionally hides vendor products
  // with no public repository, so it is opt-in rather than a default.
  if (filters.minStars > 0) {
    list = list.filter((item) => (item.githubStars ?? 0) >= filters.minStars);
  }

  // 12c. Archived products — kept in the catalog as a migration marker, but
  // out of the way for anyone shopping for something to run today.
  if (filters.excludeDeprecated) {
    list = list.filter((item) => item.status !== "deprecated");
  }

  // 12c2. Cloud-only vendors — a product that is neither self-hostable nor
  // BYOC cannot run on infrastructure the buyer controls.
  if (filters.excludeCloudOnly) {
    list = list.filter(
      (item) => !(item.deployment.cloud && !item.deployment.selfHosted && !item.deployment.byoc),
    );
  }

  // 13. Sorting. Default popularity gets a relevance tie-break when a search
  // is active, so "browser" leads with Browserbase rather than the most
  // popular listing that happens to mention browsers in its spec table.
  const search = filters.search.trim();
  if (filters.sortBy === "popularity" && search) {
    list.sort(
      (a, b) => searchRank(a, search) - searchRank(b, search) || SORT_COMPARATORS.popularity(a, b),
    );
  } else {
    list.sort((a, b) => SORT_COMPARATORS[filters.sortBy](a, b));
  }

  return list;
}
