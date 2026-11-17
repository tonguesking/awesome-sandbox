import {
  ArrowRight,
  Bot,
  Code2,
  Cpu,
  Globe,
  Monitor,
  Search,
  Server,
  Sparkles,
  X,
} from "lucide-react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { FilterSidebar } from "../components/filters/FilterSidebar";
import { BottomFeatureCards } from "../components/sandbox/BottomFeatureCards";
import { CatalogControls } from "../components/sandbox/CatalogControls";
import { HeroIsometricArt } from "../components/sandbox/HeroIsometricArt";
import { SandboxCard } from "../components/sandbox/SandboxCard";
import { copyText } from "../lib/clipboard";
import { DEFAULT_FILTERS, filterAndSortSandboxes, hasActiveFilters } from "../lib/filter";
import { filtersFromSearchParams, filtersToSearchParams } from "../lib/filterUrl";
import { Link, useRouter } from "../lib/router";
import { useSandboxes } from "../lib/sandboxContext";
import type { FilterState, Sandbox } from "../types/sandbox";

const PAGE_SIZE = 12;
const LOAD_MORE_STEP = 9;

const QUICK_CATEGORIES = [
  { id: "AI Agent Sandbox", label: "AI Agent Sandbox", icon: Bot },
  { id: "Cloud Computer", label: "Cloud Desktop", icon: Monitor },
  { id: "MicroVM", label: "MicroVM", icon: Cpu },
  { id: "Browser Sandbox", label: "Browser Sandbox", icon: Globe },
  { id: "Code Sandbox", label: "Code Execution", icon: Code2 },
  { id: "Self-hosted", label: "Self-hosted", icon: Server },
];

export function HomePage() {
  const { sandboxes } = useSandboxes();
  const { route, navigate } = useRouter();

  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    ...filtersFromSearchParams(new URLSearchParams(window.location.search)),
  }));
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  // Deep links from the header and /choose land here with query params, so
  // mirror them into local filter state, including on back/forward.
  const searchParamString = route.searchParams.toString();
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      ...filtersFromSearchParams(route.searchParams),
    }));
  }, [searchParamString, route.searchParams]);

  // Keep the address bar in sync so refresh, bookmark and share keep the view.
  // Only sync while we are actually on the home route: this page can briefly
  // mount during client-side transitions to other routes, and syncing there
  // would clobber the destination URL and bounce the user back to "/".
  useEffect(() => {
    if (route.path !== "/" || window.location.pathname !== "/") {
      return;
    }
    const query = filtersToSearchParams(filters).toString();
    const target = query ? `/?${query}` : "/";
    const current = `${window.location.pathname}${window.location.search}`;
    if (current !== target) {
      navigate(target, { replace: true, scrollToTop: false });
    }
  }, [filters, navigate, route.path]);

  const updateFilters = (next: FilterState | ((prev: FilterState) => FilterState)) => {
    setFilters(next);
    setVisibleCount(PAGE_SIZE);
  };

  const [shareState, setShareState] = useState<"idle" | "copied" | "failed">("idle");

  const copyShareLink = async () => {
    const copied = await copyText(window.location.href);
    setShareState(copied ? "copied" : "failed");
    window.setTimeout(() => setShareState("idle"), 2000);
  };

  // "/" focuses the catalog search, the shortcut people expect from docs sites.
  const searchRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
        return;
      }
      event.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.scrollIntoView({ block: "center" });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const scrollToExplorer = () => {
    document.getElementById("sandbox-explorer")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuickCategory = (catId: string) => {
    const isAlreadyActive = filters.categories.length === 1 && filters.categories[0] === catId;

    updateFilters((prev) => ({
      ...prev,
      categories: isAlreadyActive ? [] : [catId],
    }));

    scrollToExplorer();
  };

  const filteredSandboxes = useMemo(
    () => filterAndSortSandboxes(sandboxes, filters),
    [sandboxes, filters],
  );

  const catalogStats = useMemo(
    () => ({
      total: sandboxes.length,
      idleFree: sandboxes.filter((sandbox) => sandbox.lifecycle?.idleBilling === "idle_free")
        .length,
      openSource: sandboxes.filter((sandbox) => sandbox.openSource).length,
      verifiedPricing: sandboxes.filter(
        (sandbox) => sandbox.pricing.transparency === "official_verified",
      ).length,
    }),
    [sandboxes],
  );

  const featuredSandboxes = useMemo(() => {
    const featuredSlugs = ["omarchy", "e2b", "daytona", "modal"];
    const found = featuredSlugs
      .map((slug) => sandboxes.find((s) => s.slug === slug))
      .filter((s): s is Sandbox => Boolean(s));

    if (found.length === 4) {
      return found;
    }
    return sandboxes.filter((s) => s.featured).slice(0, 4);
  }, [sandboxes]);

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    scrollToExplorer();
  };

  const hasAnyFilter = hasActiveFilters(filters);

  const clearAllFilters = () => {
    updateFilters((prev) => ({
      ...DEFAULT_FILTERS,
      sortBy: prev.sortBy,
      viewMode: prev.viewMode,
    }));
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Hero */}
      <section className="relative pt-7 pb-2">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6D4DFF]/60 bg-[#1E183E] px-3 py-1.5 font-semibold text-[#A78BFA] text-[12px]">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-[#A78BFA]" />
              <span>The Ultimate Directory</span>
            </div>

            <h1 className="text-balance font-extrabold text-3xl text-[#F2F3FA] leading-[1.08] tracking-[-0.03em] sm:text-[40px] lg:text-[46px]">
              Discover the Sandbox Infrastructure for{" "}
              <span className="text-[#A78BFA]">AI Agents</span>
            </h1>

            <p className="max-w-2xl text-[#9BA1BE] text-[15px] leading-[23px]">
              Explore and compare cloud sandboxes, AI agent execution environments, browser
              sandboxes, microVM infrastructure, and self-hosted solutions.
            </p>

            {/* Search */}
            <form className="relative max-w-2xl pt-1" onSubmit={handleSearchSubmit} role="search">
              <div className="flex items-center gap-2 rounded-[28px] border border-[#262C4A] bg-[#1A1E32] p-1.5 pl-4 transition-colors focus-within:border-[#6D4DFF]">
                <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-[#8289AA]" />
                <input
                  aria-label="Search sandboxes"
                  className="w-full min-w-0 bg-transparent px-1 py-2 text-[#F2F3FA] text-[13px] placeholder:text-[#8289AA] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
                  onChange={(event) => updateFilters({ ...filters, search: event.target.value })}
                  placeholder="Search sandboxes or tools (e.g. E2B)"
                  ref={searchRef}
                  type="search"
                  value={filters.search}
                />
                {filters.search ? (
                  <button
                    aria-label="Clear search"
                    className="shrink-0 cursor-pointer rounded-full p-1.5 text-[#8289AA] transition-colors hover:bg-[#262C4A] hover:text-[#F2F3FA]"
                    onClick={() => updateFilters({ ...filters, search: "" })}
                    type="button"
                  >
                    <X aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  // Discoverability for the "/" shortcut, which otherwise only
                  // existing keyboard users would ever find.
                  <span
                    aria-hidden="true"
                    className="hidden shrink-0 rounded border border-[#262C4A] bg-[#0F1324] px-1.5 py-0.5 font-mono text-[#8289AA] text-[10px] sm:inline-block"
                  >
                    /
                  </span>
                )}
                <button
                  className="flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-[20px] bg-[#6D4DFF] px-5 py-2.5 font-semibold text-[14px] text-white transition-colors hover:bg-[#7B5EFF] active:bg-[#5D3DF0]"
                  type="submit"
                >
                  <span>Search</span>
                  <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>

            {/* Counts are computed from the catalog, so they cannot drift.
                Phones get a 2x2 block rather than three-then-one wrapping. */}
            <div className="grid grid-cols-2 gap-x-5 gap-y-2 pt-1 text-[12px] sm:flex sm:flex-wrap sm:items-baseline">
              {[
                { label: "listings", value: catalogStats.total },
                { label: "idle-free", value: catalogStats.idleFree },
                { label: "open source", value: catalogStats.openSource },
                {
                  label: "verified pricing",
                  value: catalogStats.verifiedPricing,
                },
              ].map((stat) => (
                <span className="flex items-baseline gap-1.5" key={stat.label}>
                  <span className="font-mono font-semibold text-[#F2F3FA] tabular-nums">
                    {stat.value}
                  </span>
                  <span className="text-[#8289AA]">{stat.label}</span>
                </span>
              ))}
            </div>

            {/* The three views buyers need beyond the catalog itself. */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-0.5 text-[12px]">
              <Link className="text-[#9BA1BE] transition-colors hover:text-[#A78BFA]" to="/choose">
                Find your sandbox
              </Link>
              <span aria-hidden="true" className="text-[#3A4370]">
                ·
              </span>
              <Link className="text-[#9BA1BE] transition-colors hover:text-[#A78BFA]" to="/matrix">
                Pricing &amp; lifecycle matrix
              </Link>
              <span aria-hidden="true" className="text-[#3A4370]">
                ·
              </span>
              <Link
                className="text-[#9BA1BE] transition-colors hover:text-[#A78BFA]"
                to="/benchmarks"
              >
                Cold-start benchmarks
              </Link>
            </div>
          </div>

          {/* Decorative only: on phones the catalog is the point, so skip it
              there and let the categories reach the first screen. */}
          <div className="-mt-2 hidden items-center justify-center sm:mt-0 sm:flex lg:col-span-5 lg:justify-end">
            <HeroIsometricArt />
          </div>
        </div>
      </section>

      {/* Quick categories */}
      <section
        aria-label="Quick categories"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
      >
        {QUICK_CATEGORIES.map((item) => {
          const Icon = item.icon;
          const isActive = filters.categories.length === 1 && filters.categories[0] === item.id;

          return (
            <button
              aria-pressed={isActive}
              className={`flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[20px] px-4 py-2.5 text-[13px] transition-colors ${
                isActive
                  ? "border border-[#6D4DFF] bg-[#6D4DFF] font-semibold text-white"
                  : "border border-[#262C4A] bg-[#131625] font-normal text-[#9BA1BE] hover:bg-[#1A1E32] hover:text-[#F2F3FA]"
              }`}
              key={item.id}
              onClick={() => handleQuickCategory(item.id)}
              type="button"
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </section>

      {/* Featured is the editorial shelf, not part of the result set: once a
          query or facet is active it would sit between the search box and the
          matches showing unrelated products, so it gives way to the results. */}
      {!hasAnyFilter && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles aria-hidden="true" className="h-4 w-4 text-[#FBBF24]" />
              <h2 className="font-bold text-[#F2F3FA] text-[18px] tracking-tight">
                Featured Sandboxes
              </h2>
            </div>
            <Link
              className="flex items-center gap-1 whitespace-nowrap font-normal text-[#9BA1BE] text-[13px] transition-colors hover:text-[#F2F3FA]"
              to="/explore"
            >
              <span>View all</span>
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredSandboxes.map((sandbox) => (
              <SandboxCard
                featuredStyle={true}
                key={sandbox.id}
                sandbox={sandbox}
                viewMode="grid"
              />
            ))}
          </div>
        </section>
      )}

      {/* Explorer */}
      <section className="scroll-mt-24 pt-2" id="sandbox-explorer">
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <FilterSidebar
            allSandboxes={sandboxes}
            filters={filters}
            onFilterChange={updateFilters}
            onShare={copyShareLink}
            shareState={shareState}
          />

          <div className="w-full min-w-0 flex-1 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2
                  aria-live="polite"
                  className="font-semibold text-[#F2F3FA] text-[14px] tabular-nums"
                >
                  {filteredSandboxes.length}{" "}
                  {filteredSandboxes.length === 1 ? "sandbox" : "sandboxes"}{" "}
                  {filteredSandboxes.length !== sandboxes.length && (
                    <span className="font-normal text-[#8289AA] text-[12px]">
                      of {sandboxes.length}
                    </span>
                  )}
                </h2>
                {hasAnyFilter && (
                  <button
                    className="cursor-pointer text-[#A78BFA] text-[12px] transition-colors hover:text-[#C4B5FD]"
                    onClick={clearAllFilters}
                    type="button"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              <CatalogControls
                idPrefix="home"
                onSortChange={(sortBy) => setFilters({ ...filters, sortBy })}
                onViewModeChange={(viewMode) => setFilters({ ...filters, viewMode })}
                sortBy={filters.sortBy}
                viewMode={filters.viewMode}
              />
            </div>

            {filteredSandboxes.length === 0 ? (
              <div className="space-y-4 rounded-[14px] border border-[#262C4A] bg-[#131625] p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1A1E32] text-[#9BA1BE]">
                  <Search aria-hidden="true" className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-[#F2F3FA] text-base">No sandboxes found</h3>
                  <p className="mx-auto max-w-sm text-[#9BA1BE] text-xs">
                    Try relaxing your filters or search query to discover other sandbox
                    technologies.
                  </p>
                </div>
                <button
                  className="cursor-pointer rounded-full bg-[#6D4DFF] px-4 py-2 font-semibold text-white text-xs transition-colors hover:bg-[#7B5EFF]"
                  onClick={clearAllFilters}
                  type="button"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    filters.viewMode === "grid"
                      ? "grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3"
                      : "space-y-3"
                  }
                >
                  {filteredSandboxes.slice(0, visibleCount).map((sandbox, index) => (
                    <div
                      className="animate-fade-up"
                      key={sandbox.id}
                      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
                    >
                      <SandboxCard sandbox={sandbox} viewMode={filters.viewMode} />
                    </div>
                  ))}
                </div>

                {visibleCount < filteredSandboxes.length && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    <button
                      className="cursor-pointer rounded-full border border-[#262C4A] bg-[#131625] px-5 py-2 font-medium text-[#9BA1BE] text-xs tabular-nums transition-colors hover:border-[#3A4370] hover:bg-[#1A1E32] hover:text-[#F2F3FA]"
                      onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_STEP)}
                      type="button"
                    >
                      Load more sandboxes ({filteredSandboxes.length - visibleCount} remaining)
                    </button>
                    <button
                      className="cursor-pointer rounded-full px-3 py-2 font-medium text-[#A78BFA] text-xs tabular-nums transition-colors hover:text-[#C4B5FD]"
                      onClick={() => setVisibleCount(filteredSandboxes.length)}
                      type="button"
                    >
                      Show all {filteredSandboxes.length}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <BottomFeatureCards />
    </div>
  );
}
