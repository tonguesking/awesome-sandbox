import {
  AppWindow,
  Bot,
  Check,
  ChevronDown,
  Cloud,
  Code2,
  Cpu,
  Download,
  Globe,
  Layers,
  Link2,
  Monitor,
  Search,
  Server,
  Smartphone,
  Terminal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FilterSidebar } from "../components/filters/FilterSidebar";
import { CatalogControls } from "../components/sandbox/CatalogControls";
import { SandboxCard } from "../components/sandbox/SandboxCard";
import {
  BILLING_SHAPE_OPTIONS,
  BOOT_SPEED_OPTIONS,
  CAPABILITY_OPTIONS,
  COMPLIANCE_OPTIONS,
  IDLE_BILLING_OPTIONS,
  ISOLATION_BOUNDARY_OPTIONS,
  LICENSE_OPTIONS,
  OS_OPTIONS,
  PAUSE_STATE_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
  RESUME_SPEED_OPTIONS,
  RUNTIME_OPTIONS,
  SDK_LANGUAGE_OPTIONS,
  STATUS_OPTIONS,
} from "../data/categories";
import { copyText } from "../lib/clipboard";
import { DEFAULT_FILTERS, filterAndSortSandboxes, hasActiveFilters } from "../lib/filter";
import { filtersFromSearchParams, filtersToSearchParams } from "../lib/filterUrl";
import { ISOLATION_BOUNDARY_LABEL, isolationBoundary } from "../lib/isolation";
import { useRouter } from "../lib/router";
import { useSandboxes } from "../lib/sandboxContext";
import type { FilterState } from "../types/sandbox";

const SHARE_LABEL = {
  idle: "Copy link",
  copied: "Link copied",
  failed: "Copy failed",
} as const satisfies Record<"idle" | "copied" | "failed", string>;

const CATEGORY_TABS = [
  { id: "all", label: "All", icon: Layers },
  { id: "AI Agent Sandbox", label: "AI Agent", icon: Bot },
  { id: "MicroVM", label: "MicroVM", icon: Cpu },
  { id: "Cloud Computer", label: "Cloud Computer", icon: Monitor },
  { id: "Cloud Desktop", label: "Cloud Desktop", icon: Cloud },
  { id: "Desktop Sandbox", label: "Desktop Sandbox", icon: AppWindow },
  { id: "Browser Sandbox", label: "Browser", icon: Globe },
  { id: "Code Sandbox", label: "Code Sandbox", icon: Code2 },
  { id: "Code Execution", label: "Code Execution", icon: Terminal },
  { id: "Self-hosted", label: "Self-hosted", icon: Server },
  { id: "Mobile", label: "Mobile", icon: Smartphone },
];

type ChipKind =
  | "billingShape"
  | "category"
  | "runtime"
  | "isolation"
  | "license"
  | "bootSpeed"
  | "resumeSpeed"
  | "operatingSystem"
  | "pricing"
  | "productType"
  | "deployment"
  | "idleBilling"
  | "pauseState"
  | "sdkLanguage"
  | "status"
  | "compliance"
  | "capability";

const CHIP_FIELD: Record<ChipKind, keyof FilterState> = {
  billingShape: "billingShapes",
  category: "categories",
  runtime: "runtimes",
  isolation: "isolationBoundaries",
  license: "licenses",
  bootSpeed: "bootSpeeds",
  resumeSpeed: "resumeSpeeds",
  operatingSystem: "operatingSystems",
  pricing: "pricing",
  productType: "productTypes",
  deployment: "deployment",
  idleBilling: "idleBilling",
  pauseState: "pauseStates",
  sdkLanguage: "sdkLanguages",
  status: "statuses",
  compliance: "compliance",
  capability: "capabilities",
};

/** Same filters with one chip removed, so both the chip row and the empty
 * state's suggestions can talk about "what if this one were gone". */
function withoutChip(filters: FilterState, kind: ChipKind, value: string): FilterState {
  const field = CHIP_FIELD[kind];
  const list = filters[field] as string[];
  return { ...filters, [field]: list.filter((item) => item !== value) };
}

/** Cards per incremental page; the full catalog is far too large to mount at once. */
const PAGE_SIZE = 60;

function downloadFile(filename: string, mime: string, content: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function csvValue(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export function ExplorePage() {
  const { sandboxes, favorites } = useSandboxes();
  const { route, navigate } = useRouter();

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    ...filtersFromSearchParams(route.searchParams),
  }));
  // The directory pass made the unfiltered catalog too large to mount at once,
  // so render in pages and reset the window whenever the filter definition changes.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [shareState, setShareState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    if (!exportOpen) {
      return;
    }
    const onPointerDown = (event: MouseEvent) => {
      if (!exportRef.current?.contains(event.target as Node)) {
        setExportOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExportOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [exportOpen]);

  // Filters already live in the address bar, so the shareable link is just the current URL.
  const copyShareLink = async () => {
    const copied = await copyText(window.location.href);
    setShareState(copied ? "copied" : "failed");
    window.setTimeout(() => setShareState("idle"), 2000);
  };

  // "/" jumps to search, unless the user is already typing somewhere.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT"
      ) {
        return;
      }
      event.preventDefault();
      searchInputRef.current?.focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Header dropdowns and /choose deep links navigate with query params; mirror
  // them into local filter state.
  const searchParamString = route.searchParams.toString();
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      ...filtersFromSearchParams(route.searchParams),
    }));
  }, [searchParamString, route.searchParams]);

  // Keep the address bar in sync so a filtered catalog can be copied as a link.
  // Only sync while we are actually on the explore route (see HomePage note).
  useEffect(() => {
    if (route.path !== "/explore" || window.location.pathname !== "/explore") {
      return;
    }
    const query = filtersToSearchParams(filters).toString();
    const target = query ? `/explore?${query}` : "/explore";
    const current = `${window.location.pathname}${window.location.search}`;
    if (current !== target) {
      navigate(target, { replace: true, scrollToTop: false });
    }
  }, [filters, navigate, route.path]);

  const filteredSandboxes = useMemo(() => {
    const base = filters.favoritesOnly
      ? sandboxes.filter((s) => favorites.includes(s.slug))
      : sandboxes;
    return filterAndSortSandboxes(base, filters);
  }, [sandboxes, filters, favorites]);

  // Counts are over the whole catalog, not the filtered slice: a category chip
  // that says 0 because a search is active would read as an empty category.
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const sandbox of sandboxes) {
      for (const category of sandbox.categories) {
        counts[category] = (counts[category] ?? 0) + 1;
      }
    }
    return counts;
  }, [sandboxes]);

  const filterSignature = filtersToSearchParams(filters).toString();
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filterSignature]);

  const visibleSandboxes = filteredSandboxes.slice(0, visibleCount);

  // The catalog is the product, so let people take the filtered slice with them
  // instead of scraping the page. JSON keeps the same field names the site uses.
  const exportJson = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      count: filteredSandboxes.length,
      filters: filtersToSearchParams(filters).toString() || null,
      sandboxes: filteredSandboxes,
    };
    downloadFile("awesome-sandbox.json", "application/json", JSON.stringify(payload, null, 2));
  };

  // CSV for spreadsheets, one row per listing, with the evidence columns buyers
  // check first rather than every nested field.
  const exportCsv = () => {
    const header = [
      "name",
      "slug",
      "categories",
      "website",
      "documentation",
      "pricing_model",
      "billing_unit",
      "price_evidence",
      "containment",
      "open_source",
      "status",
      "max_vcpu",
      "boot_time",
      "verified_at",
    ];
    const rows = filteredSandboxes.map((sandbox) =>
      [
        sandbox.name,
        sandbox.slug,
        sandbox.categories.join("; "),
        sandbox.website,
        sandbox.documentation ?? "",
        sandbox.pricing.model?.join("; ") ?? "",
        sandbox.pricing.billingUnit ?? "",
        sandbox.pricing.transparency ?? "",
        ISOLATION_BOUNDARY_LABEL[isolationBoundary(sandbox)],
        sandbox.openSource ? "yes" : "no",
        sandbox.status,
        sandbox.techSpecs?.maxVcpu ?? "",
        sandbox.techSpecs?.bootTime ?? "",
        sandbox.pricing.verifiedAt ?? "",
      ]
        .map(csvValue)
        .join(","),
    );
    downloadFile(
      "awesome-sandbox.csv",
      "text/csv",
      [header.map(csvValue).join(","), ...rows].join("\n"),
    );
  };

  // Markdown is the format an awesome list gets pasted into, so emit the same
  // line shape: name, link, description.
  const exportMarkdown = () => {
    const filtersLine = filtersToSearchParams(filters).toString();
    const lines = filteredSandboxes.map(
      (sandbox) => `- [${sandbox.name}](${sandbox.website}) — ${sandbox.description}`,
    );
    downloadFile(
      "awesome-sandbox.md",
      "text/markdown",
      [
        "# awesome-sandbox",
        "",
        `Generated ${new Date().toISOString().slice(0, 10)} · ${filteredSandboxes.length} listings${filtersLine ? ` · filters: \`${filtersLine}\`` : ""}`,
        "",
        ...lines,
        "",
      ].join("\n"),
    );
  };

  const handleTabClick = (catId: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: catId === "all" ? [] : [catId],
    }));
  };

  const removeFilterChip = (kind: ChipKind, value: string) => {
    setFilters((prev) => withoutChip(prev, kind, value));
  };

  const hasAnyFilterActive = hasActiveFilters(filters);

  const activeChips: {
    key: string;
    label: string;
    kind: ChipKind;
    value: string;
  }[] = [
    ...filters.categories.map((value) => ({
      key: `category-${value}`,
      label: value,
      kind: "category" as const,
      value,
    })),
    ...filters.runtimes.map((value) => ({
      key: `runtime-${value}`,
      label: RUNTIME_OPTIONS.find((opt) => opt.id === value)?.label || value,
      kind: "runtime" as const,
      value,
    })),
    ...filters.isolationBoundaries.map((value) => ({
      key: `isolation-${value}`,
      label: ISOLATION_BOUNDARY_OPTIONS.find((opt) => opt.id === value)?.label || value,
      kind: "isolation" as const,
      value,
    })),
    ...filters.licenses.map((value) => ({
      key: `license-${value}`,
      label: LICENSE_OPTIONS.find((opt) => opt.id === value)?.label || value,
      kind: "license" as const,
      value,
    })),
    ...filters.bootSpeeds.map((value) => ({
      key: `bootSpeed-${value}`,
      label: BOOT_SPEED_OPTIONS.find((opt) => opt.id === value)?.label || value,
      kind: "bootSpeed" as const,
      value,
    })),
    ...filters.resumeSpeeds.map((value) => ({
      key: `resumeSpeed-${value}`,
      label: RESUME_SPEED_OPTIONS.find((opt) => opt.id === value)?.label || value,
      kind: "resumeSpeed" as const,
      value,
    })),
    ...filters.operatingSystems.map((value) => ({
      key: `operatingSystem-${value}`,
      label: OS_OPTIONS.find((opt) => opt.id === value)?.label || value,
      kind: "operatingSystem" as const,
      value,
    })),
    ...filters.pricing.map((value) => ({
      key: `pricing-${value}`,
      label: value,
      kind: "pricing" as const,
      value,
    })),
    ...filters.productTypes.map((value) => ({
      key: `productType-${value}`,
      label: PRODUCT_TYPE_OPTIONS.find((opt) => opt.id === value)?.label || value,
      kind: "productType" as const,
      value,
    })),
    ...filters.deployment.map((value) => ({
      key: `deployment-${value}`,
      label: value,
      kind: "deployment" as const,
      value,
    })),
    ...filters.idleBilling.map((value) => ({
      key: `idleBilling-${value}`,
      label: IDLE_BILLING_OPTIONS.find((opt) => opt.id === value)?.label || value,
      kind: "idleBilling" as const,
      value,
    })),
    ...filters.pauseStates.map((value) => ({
      key: `pauseState-${value}`,
      label: PAUSE_STATE_OPTIONS.find((opt) => opt.id === value)?.label || value,
      kind: "pauseState" as const,
      value,
    })),
    ...filters.billingShapes.map((value) => ({
      key: `billingShape-${value}`,
      label: BILLING_SHAPE_OPTIONS.find((opt) => opt.id === value)?.label || value,
      kind: "billingShape" as const,
      value,
    })),
    ...filters.sdkLanguages.map((value) => ({
      key: `sdkLanguage-${value}`,
      label: SDK_LANGUAGE_OPTIONS.find((opt) => opt.id === value)?.label || value,
      kind: "sdkLanguage" as const,
      value,
    })),
    ...filters.compliance.map((value) => ({
      key: `compliance-${value}`,
      label: COMPLIANCE_OPTIONS.find((opt) => opt.id === value)?.label || value,
      kind: "compliance" as const,
      value,
    })),
    ...filters.statuses.map((value) => ({
      key: `status-${value}`,
      label: STATUS_OPTIONS.find((opt) => opt.id === value)?.label || value,
      kind: "status" as const,
      value,
    })),
    ...filters.capabilities.map((value) => ({
      key: `capability-${value}`,
      label: CAPABILITY_OPTIONS.find((opt) => opt.id === value)?.label || value,
      kind: "capability" as const,
      value,
    })),
  ];

  // A dead end is more useful as a question than as a wall. When nothing
  // matches, offer the one-filter-out moves that would bring listings back.
  const relaxSuggestions =
    filteredSandboxes.length === 0
      ? activeChips
          .map((chip) => ({
            ...chip,
            count: filterAndSortSandboxes(sandboxes, withoutChip(filters, chip.kind, chip.value))
              .length,
          }))
          .filter((chip) => chip.count > 0)
          .sort((a, b) => b.count - a.count)
          .slice(0, 3)
      : [];

  const clearAll = () =>
    setFilters({
      ...DEFAULT_FILTERS,
      sortBy: filters.sortBy,
      viewMode: filters.viewMode,
    });

  return (
    <div className="space-y-8 pt-6 pb-24">
      {/* Page header */}
      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-extrabold text-2xl text-[#F2F3FA] tracking-tight md:text-3xl">
              Explore Sandboxes
            </h1>
            <p className="mt-1 text-[#9BA1BE] text-sm">
              Browse the complete catalog of {sandboxes.length} cloud sandboxes, MicroVM runtimes,
              and developer environments.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              aria-hidden="true"
              className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#8289AA]"
            />
            <input
              aria-keyshortcuts="/"
              aria-label="Search sandboxes"
              className="w-full rounded-[12px] border border-[#262C4A] bg-[#131625] py-2 pr-10 pl-10 text-[#F2F3FA] text-xs transition-colors placeholder:text-[#8289AA] hover:border-[#3A4370] focus:border-[#6D4DFF] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              onChange={(event) => setFilters({ ...filters, search: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === "Escape" && filters.search) {
                  setFilters({ ...filters, search: "" });
                }
              }}
              placeholder="Search by keyword, tool..."
              ref={searchInputRef}
              type="search"
              value={filters.search}
            />
            {filters.search ? (
              <button
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-[#8289AA] transition-colors hover:bg-[#1A1E32] hover:text-[#F2F3FA]"
                onClick={() => setFilters({ ...filters, search: "" })}
                type="button"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border border-[#262C4A] bg-[#1A1E32] px-1.5 py-0.5 font-mono text-[#8289AA] text-[10px] sm:block"
              >
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Category tabs */}
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2 pb-1">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected =
                tab.id === "all"
                  ? filters.categories.length === 0
                  : filters.categories.includes(tab.id);

              return (
                <button
                  aria-pressed={isSelected}
                  className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 py-2 font-medium text-xs transition-colors sm:py-1.5 ${
                    isSelected
                      ? "border-[#6D4DFF] bg-[#6D4DFF] text-white shadow-[0_2px_14px_rgba(109,77,255,0.35)]"
                      : "border-[#262C4A] bg-[#131625] text-[#C7CCE2] hover:bg-[#1A1E32] hover:text-[#F2F3FA]"
                  }`}
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  type="button"
                >
                  <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={`hidden font-mono text-[10px] tabular-nums sm:inline ${
                      isSelected ? "text-white" : "text-[#8289AA]"
                    }`}
                  >
                    {tab.id === "all" ? sandboxes.length : (categoryCounts[tab.id] ?? 0)}
                  </span>
                </button>
              );
            })}
          </div>
          {/* The tab strip scrolls sideways on phones; fade the edge so the
              cut-off chip reads as "more to scroll" rather than clipped. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#080b1a] to-transparent sm:hidden"
          />
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-col justify-between gap-4 border-[#262C4A] border-b pb-3 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2 text-[#9BA1BE] text-xs">
          <span className="font-semibold text-[#F2F3FA] tabular-nums">
            {filteredSandboxes.length} {filteredSandboxes.length === 1 ? "sandbox" : "sandboxes"}{" "}
            {filteredSandboxes.length !== sandboxes.length && (
              <span className="font-normal text-[#8289AA]">of {sandboxes.length}</span>
            )}
          </span>

          {activeChips.map((chip) => (
            <span
              className="inline-flex items-center gap-1 rounded border border-[#6D4DFF]/45 bg-[#1E183E] px-2 py-0.5 text-[#A78BFA] text-[11px]"
              key={chip.key}
            >
              {chip.label}
              <button
                aria-label={`Remove ${chip.label} filter`}
                className="cursor-pointer hover:text-white"
                onClick={() => removeFilterChip(chip.kind, chip.value)}
                type="button"
              >
                <X aria-hidden="true" className="h-3 w-3" />
              </button>
            </span>
          ))}

          {!!filters.openSourceOnly && (
            <span className="inline-flex items-center gap-1 rounded border border-[#4ADE80]/25 bg-[#123524] px-2 py-0.5 text-[#86EFAC] text-[11px]">
              Open source only
              <button
                aria-label="Remove open source filter"
                className="cursor-pointer hover:text-white"
                onClick={() => setFilters({ ...filters, openSourceOnly: false })}
                type="button"
              >
                <X aria-hidden="true" className="h-3 w-3" />
              </button>
            </span>
          )}

          {!!filters.documentedCoreOnly && (
            <span className="inline-flex items-center gap-1 rounded border border-[#4ADE80]/25 bg-[#123524] px-2 py-0.5 text-[#86EFAC] text-[11px]">
              Core claims documented
              <button
                aria-label="Remove documented core filter"
                className="cursor-pointer hover:text-white"
                onClick={() => setFilters({ ...filters, documentedCoreOnly: false })}
                type="button"
              >
                <X aria-hidden="true" className="h-3 w-3" />
              </button>
            </span>
          )}

          {!!filters.verifiedPricingOnly && (
            <span className="inline-flex items-center gap-1 rounded border border-[#4ADE80]/25 bg-[#123524] px-2 py-0.5 text-[#86EFAC] text-[11px]">
              Verified pricing
              <button
                aria-label="Remove verified pricing filter"
                className="cursor-pointer hover:text-white"
                onClick={() => setFilters({ ...filters, verifiedPricingOnly: false })}
                type="button"
              >
                <X aria-hidden="true" className="h-3 w-3" />
              </button>
            </span>
          )}

          {!!filters.excludeQuoteOnly && (
            <span className="inline-flex items-center gap-1 rounded border border-[#4ADE80]/25 bg-[#123524] px-2 py-0.5 text-[#86EFAC] text-[11px]">
              Published price only
              <button
                aria-label="Remove published price only filter"
                className="cursor-pointer hover:text-white"
                onClick={() => setFilters({ ...filters, excludeQuoteOnly: false })}
                type="button"
              >
                <X aria-hidden="true" className="h-3 w-3" />
              </button>
            </span>
          )}

          {!!filters.excludeDeprecated && (
            <span className="inline-flex items-center gap-1 rounded border border-[#FBBF24]/30 bg-[#2A2210] px-2 py-0.5 text-[#FDE68A] text-[11px]">
              Hiding archived
              <button
                aria-label="Show archived products again"
                className="cursor-pointer hover:text-white"
                onClick={() => setFilters({ ...filters, excludeDeprecated: false })}
                type="button"
              >
                <X aria-hidden="true" className="h-3 w-3" />
              </button>
            </span>
          )}

          {!!filters.excludeCloudOnly && (
            <span className="inline-flex items-center gap-1 rounded border border-[#38BDF8]/30 bg-[#0B2230] px-2 py-0.5 text-[#7DD3FC] text-[11px]">
              Hiding cloud-only
              <button
                aria-label="Show cloud-only products again"
                className="cursor-pointer hover:text-white"
                onClick={() => setFilters({ ...filters, excludeCloudOnly: false })}
                type="button"
              >
                <X aria-hidden="true" className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.minRating > 0 && (
            <span className="inline-flex items-center gap-1 rounded border border-[#4ADE80]/25 bg-[#123524] px-2 py-0.5 text-[#86EFAC] text-[11px]">
              Rated {filters.minRating.toFixed(1)}+
              <button
                aria-label="Remove minimum rating filter"
                className="cursor-pointer hover:text-white"
                onClick={() => setFilters({ ...filters, minRating: 0 })}
                type="button"
              >
                <X aria-hidden="true" className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.minStars > 0 && (
            <span className="inline-flex items-center gap-1 rounded border border-[#4ADE80]/25 bg-[#123524] px-2 py-0.5 text-[#86EFAC] text-[11px]">
              {filters.minStars.toLocaleString()}+ GitHub stars
              <button
                aria-label="Remove GitHub stars floor"
                className="cursor-pointer hover:text-white"
                onClick={() => setFilters({ ...filters, minStars: 0 })}
                type="button"
              >
                <X aria-hidden="true" className="h-3 w-3" />
              </button>
            </span>
          )}

          {!!hasAnyFilterActive && (
            <button
              className="ml-1 text-[#8289AA] text-[11px] underline underline-offset-2 hover:text-[#A78BFA]"
              onClick={clearAll}
              type="button"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            aria-label="Copy link to this filtered view"
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-medium text-[12px] transition-colors ${
              shareState === "copied"
                ? "border-[#166534] bg-[#0F1A14] text-[#86EFAC]"
                : "border-[#262C4A] bg-[#131625] text-[#9BA1BE] hover:border-[#3A4370] hover:text-[#F2F3FA]"
            }`}
            onClick={copyShareLink}
            type="button"
          >
            {shareState === "copied" ? (
              <Check aria-hidden="true" className="h-3.5 w-3.5" />
            ) : (
              <Link2 aria-hidden="true" className="h-3.5 w-3.5" />
            )}
            <span className="hidden whitespace-nowrap sm:inline">{SHARE_LABEL[shareState]}</span>
          </button>
          <span aria-live="polite" className="sr-only">
            {shareState === "copied" ? "Link to the current filters copied to clipboard" : ""}
          </span>

          <div className="relative" ref={exportRef}>
            <button
              aria-expanded={exportOpen}
              aria-haspopup="menu"
              aria-label="Download the filtered listings"
              className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#262C4A] bg-[#131625] px-2.5 py-1.5 font-medium text-[#9BA1BE] text-[12px] transition-colors hover:border-[#3A4370] hover:text-[#F2F3FA]"
              onClick={() => setExportOpen((open) => !open)}
              title="Download the current filtered listings"
              type="button"
            >
              <Download aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="hidden whitespace-nowrap sm:inline">Export</span>
              <ChevronDown
                aria-hidden="true"
                className={`h-3 w-3 transition-transform ${exportOpen ? "rotate-180" : ""}`}
              />
            </button>
            {exportOpen && (
              <div
                aria-label="Export format"
                className="absolute right-0 z-30 mt-1 w-44 overflow-hidden rounded-lg border border-[#3A4370] bg-[#171B2E] p-1 shadow-xl"
                role="menu"
              >
                {[
                  {
                    format: "JSON",
                    hint: "full fields",
                    run: exportJson,
                  },
                  {
                    format: "CSV",
                    hint: "spreadsheet",
                    run: exportCsv,
                  },
                  {
                    format: "Markdown",
                    hint: "awesome list",
                    run: exportMarkdown,
                  },
                ].map((item) => (
                  <button
                    className="flex w-full cursor-pointer items-center justify-between gap-3 rounded px-2 py-1.5 text-left text-[#F2F3FA] text-[12px] transition-colors hover:bg-[#242A47]"
                    key={item.format}
                    onClick={() => {
                      item.run();
                      setExportOpen(false);
                    }}
                    role="menuitem"
                    type="button"
                  >
                    <span>{item.format}</span>
                    <span className="font-mono text-[#8289AA] text-[10px]">{item.hint}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <CatalogControls
            idPrefix="explore"
            onSortChange={(sortBy) => setFilters({ ...filters, sortBy })}
            onViewModeChange={(viewMode) => setFilters({ ...filters, viewMode })}
            sortBy={filters.sortBy}
            viewMode={filters.viewMode}
          />
        </div>
      </div>

      {/* Catalog */}
      <div className="flex flex-col items-start gap-4 lg:flex-row">
        <FilterSidebar allSandboxes={sandboxes} filters={filters} onFilterChange={setFilters} />

        <div className="w-full min-w-0 flex-1 space-y-6">
          {/* Card titles are h3, so screen readers need the results heading
              between the page h1 and the grid. */}
          <h2 className="sr-only">Sandbox results</h2>
          {filteredSandboxes.length === 0 ? (
            <div className="space-y-4 rounded-[14px] border border-[#262C4A] bg-[#131625] p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1E32] text-[#9BA1BE]">
                <Search aria-hidden="true" className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-[#F2F3FA] text-base">No matching sandboxes</h3>
                <p className="mx-auto max-w-sm text-[#9BA1BE] text-xs">
                  {filters.search.trim()
                    ? `Nothing matches “${filters.search.trim()}”. Try a shorter or more general term.`
                    : "No sandbox technologies match your current combination of filters."}
                </p>
              </div>
              <button
                className="cursor-pointer rounded-full bg-[#6D4DFF] px-4 py-2 font-semibold text-white text-xs transition-colors hover:bg-[#7B5EFF]"
                onClick={clearAll}
                type="button"
              >
                Reset filters
              </button>
              {filters.search.trim() && relaxSuggestions.length === 0 && (
                <div className="space-y-2 border-[#262C4A] border-t pt-4">
                  <p className="text-[#8289AA] text-[11px]">Or try a broader search</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {["E2B", "Firecracker", "browser", "GPU", "MCP"].map((term) => (
                      <button
                        className="cursor-pointer rounded-full border border-[#262C4A] bg-[#0F1324] px-3 py-1 font-medium text-[#C4B5FD] text-[11px] transition-colors hover:border-[#6D4DFF] hover:text-white"
                        key={term}
                        onClick={() => setFilters({ ...filters, search: term })}
                        type="button"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {relaxSuggestions.length > 0 && (
                <div className="space-y-2 border-[#262C4A] border-t pt-4">
                  <p className="text-[#8289AA] text-[11px]">
                    Or drop one filter to get listings back
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {relaxSuggestions.map((chip) => (
                      <button
                        aria-label={`Remove ${chip.label} filter, ${chip.count} listings`}
                        className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[#262C4A] bg-[#0F1324] px-3 py-1 font-medium text-[#C4B5FD] text-[11px] transition-colors hover:border-[#6D4DFF] hover:text-white"
                        key={chip.key}
                        onClick={() => removeFilterChip(chip.kind, chip.value)}
                        type="button"
                      >
                        <span>Drop {chip.label}</span>
                        <span className="font-mono text-[#8289AA] tabular-nums">{chip.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div
              className={
                filters.viewMode === "grid"
                  ? "grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3"
                  : "space-y-3"
              }
            >
              {visibleSandboxes.map((sandbox) => (
                <SandboxCard key={sandbox.id} sandbox={sandbox} viewMode={filters.viewMode} />
              ))}
            </div>
          )}

          {visibleSandboxes.length < filteredSandboxes.length && (
            <div className="flex flex-col items-center gap-1.5 pt-2">
              <button
                className="cursor-pointer rounded-lg border border-[#262C4A] bg-[#131625] px-4 py-2 font-medium text-[#F2F3FA] text-xs transition-colors hover:border-[#3A4370] hover:bg-[#171B2E]"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                type="button"
              >
                Load more sandboxes
              </button>
              <span className="font-mono text-[#8289AA] text-[11px] tabular-nums">
                Showing {visibleSandboxes.length} of {filteredSandboxes.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
