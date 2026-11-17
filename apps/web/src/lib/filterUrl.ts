import {
  BILLING_SHAPE_OPTIONS,
  BOOT_SPEED_OPTIONS,
  CAPABILITY_OPTIONS,
  COMPLIANCE_OPTIONS,
  DEPLOYMENT_OPTIONS,
  EXPLORE_CATEGORIES,
  IDLE_BILLING_OPTIONS,
  ISOLATION_BOUNDARY_OPTIONS,
  LICENSE_OPTIONS,
  OS_OPTIONS,
  PAUSE_STATE_OPTIONS,
  PRICING_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
  RESUME_SPEED_OPTIONS,
  RUNTIME_OPTIONS,
  SDK_LANGUAGE_OPTIONS,
  STATUS_OPTIONS,
} from "../data/categories";
import type { FilterState } from "../types/sandbox";

export function listParam(params: URLSearchParams, key: string): string[] {
  return (params.get(key) ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

const ids = (options: { id: string }[]): string[] => options.map((o) => o.id);

const STAR_FLOORS = [100, 1000, 10_000];
const RATING_FLOORS = [4, 4.5];
const SORT_VALUES = [
  "popularity",
  "stars",
  "name",
  "recently_added",
  "recently_updated",
  "open_source",
  "rating",
  "boot_speed",
  "resume_speed",
  "documented",
] as const satisfies readonly FilterState["sortBy"][];

type SortValue = (typeof SORT_VALUES)[number];

// A hand-edited or stale link can carry any number; only the published floors
// are accepted so a typo does not silently narrow the catalog.
function knownStars(value: string | null): number {
  const parsed = Number(value);
  return STAR_FLOORS.includes(parsed) ? parsed : 0;
}

function knownRating(value: string | null): number {
  const parsed = Number(value);
  return RATING_FLOORS.includes(parsed) ? parsed : 0;
}

function knownSort(value: string | null): SortValue | undefined {
  return SORT_VALUES.includes(value as SortValue) ? (value as SortValue) : undefined;
}

// Old or hand-edited links can carry a value the filter no longer knows. An
// unknown value filters everything out, so drop it and show the catalog instead.
function knownList(params: URLSearchParams, key: string, allowed: readonly string[]): string[] {
  return listParam(params, key).filter((value) => allowed.includes(value));
}

/**
 * Header dropdowns and the /choose decision guide both deep-link into the
 * catalog, so every filter they can set is readable from the query string.
 */
export function filtersFromSearchParams(params: URLSearchParams): Partial<FilterState> {
  const sortBy = knownSort(params.get("sort"));
  return {
    categories: knownList(params, "category", EXPLORE_CATEGORIES),
    productTypes: knownList(params, "productType", ids(PRODUCT_TYPE_OPTIONS)),
    search: params.get("search") ?? "",
    runtimes: knownList(params, "runtime", ids(RUNTIME_OPTIONS)),
    isolationBoundaries: knownList(params, "isolation", ids(ISOLATION_BOUNDARY_OPTIONS)),
    licenses: knownList(params, "license", ids(LICENSE_OPTIONS)),
    capabilities: knownList(params, "capabilities", ids(CAPABILITY_OPTIONS)),
    idleBilling: knownList(params, "idle", ids(IDLE_BILLING_OPTIONS)),
    pauseStates: knownList(params, "pause", ids(PAUSE_STATE_OPTIONS)),
    billingShapes: knownList(params, "shape", ids(BILLING_SHAPE_OPTIONS)),
    compliance: knownList(params, "compliance", ids(COMPLIANCE_OPTIONS)),
    statuses: knownList(params, "status", ids(STATUS_OPTIONS)),
    operatingSystems: knownList(params, "os", ids(OS_OPTIONS)),
    pricing: knownList(params, "pricing", PRICING_OPTIONS),
    sdkLanguages: knownList(params, "sdk", ids(SDK_LANGUAGE_OPTIONS)),
    bootSpeeds: knownList(params, "boot", ids(BOOT_SPEED_OPTIONS)),
    resumeSpeeds: knownList(params, "resume", ids(RESUME_SPEED_OPTIONS)),
    deployment: knownList(params, "deployment", DEPLOYMENT_OPTIONS),
    openSourceOnly: params.get("openSource") === "1",
    documentedCoreOnly: params.get("documented") === "1",
    favoritesOnly: params.get("favorites") === "1",
    verifiedPricingOnly: params.get("verified") === "1",
    excludeQuoteOnly: params.get("published") === "1",
    excludeDeprecated: params.get("live") === "1",
    excludeCloudOnly: params.get("cloudonly") === "0",
    ...(sortBy ? { sortBy } : {}),
    minRating: knownRating(params.get("rating")),
    minStars: knownStars(params.get("stars")),
  };
}

/** Serialize the shareable half of the filter state, in a stable order. */
export function filtersToSearchParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  const setList = (key: string, values: string[]) => {
    if (values.length > 0) {
      params.set(key, values.join(","));
    }
  };
  if (filters.search.trim()) {
    params.set("search", filters.search.trim());
  }
  setList("category", filters.categories);
  setList("productType", filters.productTypes);
  setList("runtime", filters.runtimes);
  setList("isolation", filters.isolationBoundaries);
  setList("license", filters.licenses);
  setList("sdk", filters.sdkLanguages);
  setList("boot", filters.bootSpeeds);
  setList("resume", filters.resumeSpeeds);
  setList("shape", filters.billingShapes);
  setList("compliance", filters.compliance);
  setList("os", filters.operatingSystems);
  setList("pricing", filters.pricing);
  setList("deployment", filters.deployment);
  setList("idle", filters.idleBilling);
  setList("pause", filters.pauseStates);
  setList("capabilities", filters.capabilities);
  setList("status", filters.statuses);
  if (filters.openSourceOnly) {
    params.set("openSource", "1");
  }
  if (filters.favoritesOnly) {
    params.set("favorites", "1");
  }
  if (filters.documentedCoreOnly) {
    params.set("documented", "1");
  }
  if (filters.verifiedPricingOnly) {
    params.set("verified", "1");
  }
  if (filters.excludeQuoteOnly) {
    params.set("published", "1");
  }
  if (filters.sortBy !== "popularity") {
    params.set("sort", filters.sortBy);
  }
  if (filters.minRating > 0) {
    params.set("rating", String(filters.minRating));
  }
  if (filters.minStars > 0) {
    params.set("stars", String(filters.minStars));
  }
  if (filters.excludeDeprecated) {
    params.set("live", "1");
  }
  if (filters.excludeCloudOnly) {
    params.set("cloudonly", "0");
  }
  return params;
}
