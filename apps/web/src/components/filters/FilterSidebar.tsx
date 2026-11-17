import { Bookmark, Check, ChevronDown, Link2, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
} from "../../data/categories";
import { REPO_LICENSES } from "../../data/licenses";
import {
  filterAndSortSandboxes,
  hasDocumentedCore,
  parseBootTimeMs,
  resumeLatencyMs,
} from "../../lib/filter";
import { isolationBoundary, matchesIsolationBoundary } from "../../lib/isolation";
import { Link } from "../../lib/router";
import {
  loadSavedViews,
  makeSavedView,
  persistSavedViews,
  type SavedView,
} from "../../lib/savedViews";
import {
  DEFAULT_SECTION_STATE,
  loadSectionState,
  persistSectionState,
} from "../../lib/sidebarPrefs";
import type { FilterState, Sandbox } from "../../types/sandbox";

interface FilterSidebarProps {
  allSandboxes: Sandbox[];
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onShare?: () => void;
  shareState?: "idle" | "copied" | "failed";
}

type ChipKey =
  | "billingShapes"
  | "bootSpeeds"
  | "capabilities"
  | "categories"
  | "compliance"
  | "deployment"
  | "idleBilling"
  | "isolationBoundaries"
  | "licenses"
  | "operatingSystems"
  | "pauseStates"
  | "resumeSpeeds"
  | "pricing"
  | "productTypes"
  | "runtimes"
  | "sdkLanguages"
  | "statuses";

const CHIP_GROUPS: {
  key: ChipKey;
  options: { id: string; label: string }[];
}[] = [
  {
    key: "categories",
    options: EXPLORE_CATEGORIES.map((value) => ({ id: value, label: value })),
  },
  { key: "runtimes", options: RUNTIME_OPTIONS },
  { key: "isolationBoundaries", options: ISOLATION_BOUNDARY_OPTIONS },
  { key: "licenses", options: LICENSE_OPTIONS },
  { key: "bootSpeeds", options: BOOT_SPEED_OPTIONS },
  { key: "resumeSpeeds", options: RESUME_SPEED_OPTIONS },
  { key: "operatingSystems", options: OS_OPTIONS },
  { key: "billingShapes", options: BILLING_SHAPE_OPTIONS },
  {
    key: "pricing",
    options: PRICING_OPTIONS.map((value) => ({ id: value, label: value })),
  },
  {
    key: "deployment",
    options: DEPLOYMENT_OPTIONS.map((value) => ({ id: value, label: value })),
  },
  { key: "idleBilling", options: IDLE_BILLING_OPTIONS },
  { key: "pauseStates", options: PAUSE_STATE_OPTIONS },
  { key: "compliance", options: COMPLIANCE_OPTIONS },
  { key: "statuses", options: STATUS_OPTIONS },
  { key: "productTypes", options: PRODUCT_TYPE_OPTIONS },
  { key: "sdkLanguages", options: SDK_LANGUAGE_OPTIONS },
  { key: "capabilities", options: CAPABILITY_OPTIONS },
];

/** One-click combinations of the axes buyers reach for first. */
const FILTER_PRESETS: {
  apply: Partial<FilterState>;
  id: string;
  label: string;
}[] = [
  {
    id: "documented-containment",
    label: "Documented containment",
    apply: {
      isolationBoundaries: ["hardware", "kernel", "userspace"],
    },
  },
  {
    id: "hardware-isolated",
    label: "Hardware isolated",
    apply: { isolationBoundaries: ["hardware"] },
  },
  {
    id: "userspace-isolated",
    label: "Userspace sandbox",
    apply: { isolationBoundaries: ["userspace"] },
  },
  {
    id: "kernel-isolated",
    label: "Kernel sandbox, no VM",
    apply: { isolationBoundaries: ["kernel"] },
  },
  {
    id: "idle-free",
    label: "Idle-free",
    apply: { idleBilling: ["idle_free"] },
  },
  {
    id: "agent-ready",
    label: "Agent-ready: API + egress",
    apply: {
      categories: ["AI Agent Sandbox"],
      capabilities: ["api", "egressControl"],
    },
  },
  {
    id: "mcp",
    label: "MCP server",
    apply: { capabilities: ["mcp"] },
  },
  { id: "instant", label: "Boot <200ms", apply: { bootSpeeds: ["instant"] } },
  {
    id: "resume-subsecond",
    label: "Resume <1s",
    apply: { resumeSpeeds: ["subsecond"] },
  },
  {
    id: "cloud-hosted",
    label: "Cloud-hosted",
    apply: { deployment: ["Cloud"] },
  },
  {
    id: "self-hosted",
    label: "Self-hosted",
    apply: { deployment: ["Self-hosted"] },
  },
  { id: "python", label: "Python SDK", apply: { sdkLanguages: ["Python"] } },
  {
    id: "metered",
    label: "Per-hour rates only",
    apply: { billingShapes: ["metered"] },
  },
  {
    id: "paused-agent",
    label: "Pause keeps memory, no idle bill",
    apply: { idleBilling: ["idle_free"], pauseStates: ["memory"] },
  },
  {
    id: "stateful-egress",
    label: "Stateful + egress-controlled",
    apply: { pauseStates: ["memory"], capabilities: ["egressControl"] },
  },
  {
    id: "persistent-idle-free",
    label: "Disk survives, no idle bill",
    apply: { capabilities: ["persistent"], idleBilling: ["idle_free"] },
  },
  {
    id: "scale-to-zero",
    label: "Scale-to-zero, no idle bill",
    apply: { idleBilling: ["idle_free"], capabilities: ["autoSleep"] },
  },
  {
    id: "soc2",
    label: "SOC 2 attested",
    apply: { compliance: ["soc2"] },
  },
  {
    id: "egress",
    label: "Egress policy",
    apply: { capabilities: ["egressControl"] },
  },
  { id: "gpu", label: "GPU", apply: { capabilities: ["gpu"] } },
  {
    id: "desktop",
    label: "Desktop / computer use",
    apply: { capabilities: ["desktop"] },
  },
  {
    id: "snapshot",
    label: "Snapshot / checkpoint",
    apply: { capabilities: ["snapshot"] },
  },
  {
    id: "checkpoint-idle-free",
    label: "Checkpoint, no idle bill",
    apply: { capabilities: ["snapshot"], idleBilling: ["idle_free"] },
  },
  {
    id: "fork",
    label: "Fork / clone",
    apply: { capabilities: ["fork"] },
  },
  {
    id: "fork-memory",
    label: "Fork keeps memory",
    apply: { capabilities: ["fork"], pauseStates: ["memory"] },
  },
  {
    id: "persistent",
    label: "Persistent volume",
    apply: { capabilities: ["persistent"] },
  },
  { id: "ga", label: "GA only", apply: { statuses: ["active"] } },
  {
    id: "verified-idle-free",
    label: "Verified price + idle-free",
    apply: { verifiedPricingOnly: true, idleBilling: ["idle_free"] },
  },
  {
    id: "open-microvm",
    label: "Open-source microVM",
    apply: { openSourceOnly: true, isolationBoundaries: ["hardware"] },
  },
  {
    id: "free-tier",
    label: "Free tier available",
    apply: { pricing: ["Free Tier"] },
  },
  {
    id: "verified-price",
    label: "Verified price",
    apply: { verifiedPricingOnly: true },
  },
  {
    id: "fully-documented",
    label: "Price, containment and egress documented",
    apply: { documentedCoreOnly: true },
  },
  {
    id: "permissive-license",
    label: "Permissive license only",
    apply: { licenses: ["mit", "apache", "bsd"] },
  },
  {
    id: "copyleft",
    label: "Copyleft is acceptable",
    apply: { licenses: ["copyleft"] },
  },
  {
    id: "any-oss-license",
    label: "Any listed OSS license",
    apply: { licenses: ["mit", "apache", "bsd", "copyleft", "other"] },
  },
  { id: "rated-4", label: "Rated 4.0+", apply: { minRating: 4 } },
  { id: "rated-45", label: "Rated 4.5+", apply: { minRating: 4.5 } },
  { id: "stars-100", label: "100+ GitHub stars", apply: { minStars: 100 } },
  { id: "stars-1k", label: "1k+ GitHub stars", apply: { minStars: 1000 } },
  { id: "stars-10k", label: "10k+ GitHub stars", apply: { minStars: 10_000 } },
  {
    id: "oss-verified-price",
    label: "Open source + verified price",
    apply: { openSourceOnly: true, verifiedPricingOnly: true },
  },
  {
    id: "open-self-hosted",
    label: "Open source, run it yourself",
    apply: { openSourceOnly: true, deployment: ["Self-hosted"] },
  },
  {
    id: "no-cloud-only",
    label: "No cloud-only vendors",
    apply: { excludeCloudOnly: true },
  },
  {
    id: "maintained",
    label: "Reviewed & active",
    apply: { statuses: ["active", "beta"] },
  },
  {
    id: "mobile",
    label: "Mobile sandboxes",
    apply: { categories: ["Mobile"] },
  },
  {
    id: "windows",
    label: "Windows guest",
    apply: { operatingSystems: ["windows"] },
  },
  {
    id: "apple",
    label: "macOS or iOS guest",
    apply: { operatingSystems: ["macos", "ios"] },
  },
];

function isPresetActive(filters: FilterState, preset: Partial<FilterState>) {
  return Object.entries(preset).every(([key, value]) => {
    const current = filters[key as keyof FilterState];
    if (Array.isArray(value)) {
      return Array.isArray(current) && current.join("|") === value.join("|");
    }
    return current === value;
  });
}

function DarkCheckbox({
  checked,
  disabled = false,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <span className="relative inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center">
      <input
        checked={checked}
        className={`peer h-3.5 w-3.5 appearance-none rounded-[4px] border border-[#3A4370] bg-[#0B0E1D] transition-colors checked:border-[#6D4DFF] checked:bg-[#6D4DFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#131625] ${
          disabled ? "cursor-not-allowed" : "cursor-pointer hover:border-[#6D4DFF]/70"
        }`}
        disabled={disabled}
        onChange={onChange}
        type="checkbox"
      />
      <Check
        aria-hidden="true"
        className="pointer-events-none absolute h-2.5 w-2.5 stroke-[3] text-white opacity-0 peer-checked:opacity-100"
      />
    </span>
  );
}

interface SectionProps {
  activeCount: number;
  children: React.ReactNode;
  id: string;
  /** Clears only this axis, so one bad guess does not cost the others. */
  onClear: () => void;
  onToggle: () => void;
  open: boolean;
  title: string;
}

function FilterSection({
  id,
  title,
  activeCount,
  open,
  onToggle,
  onClear,
  children,
}: SectionProps) {
  return (
    <div className="space-y-2 border-[#262C4A]/70 border-t pt-3">
      <div className="flex items-center justify-between gap-2">
        <button
          aria-controls={`filter-${id}`}
          aria-expanded={open}
          className="group flex min-w-0 flex-1 cursor-pointer items-center justify-between text-left"
          onClick={onToggle}
          type="button"
        >
          <span className="flex items-center gap-1.5 font-semibold text-[#F2F3FA] text-[13px] group-hover:text-white">
            {title}
            {activeCount > 0 && (
              <span className="rounded bg-[#6D4DFF]/20 px-1.5 py-0.5 font-mono text-[#A78BFA] text-[10px] tabular-nums">
                {activeCount}
              </span>
            )}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`h-3.5 w-3.5 text-[#8289AA] transition-transform group-hover:text-[#9BA1BE] ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
        {activeCount > 0 && (
          <button
            aria-label={`Clear ${title} filters`}
            className="shrink-0 cursor-pointer font-medium text-[#8289AA] text-[11px] transition-colors hover:text-[#A78BFA]"
            onClick={onClear}
            type="button"
          >
            Clear
          </button>
        )}
      </div>

      {open && (
        <div className="space-y-0.5" id={`filter-${id}`}>
          {children}
        </div>
      )}
    </div>
  );
}

function CheckRow({
  checked,
  label,
  count,
  onToggle,
}: {
  checked: boolean;
  label: string;
  count: number;
  onToggle: () => void;
}) {
  // A zero count means this choice would empty the result list, so it is
  // offered but not clickable; checked rows always stay interactive.
  const disabled = count === 0 && !checked;

  return (
    <label
      aria-disabled={disabled}
      className={`flex select-none items-center justify-between py-1 text-[#9BA1BE] text-[12px] ${
        disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer hover:text-[#F2F3FA]"
      }`}
      title={disabled ? "No results with the current filters" : undefined}
    >
      <span className="flex min-w-0 items-center gap-2">
        <DarkCheckbox checked={checked} disabled={disabled} onChange={onToggle} />
        <span className={`truncate ${checked ? "font-medium text-[#F2F3FA]" : ""}`}>{label}</span>
      </span>
      <span className="shrink-0 pl-2 font-mono text-[#8289AA] text-[11px] tabular-nums">
        ({count})
      </span>
    </label>
  );
}

export function FilterSidebar({
  filters,
  onFilterChange,
  allSandboxes,
  onShare,
  shareState = "idle",
}: FilterSidebarProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [showAllPresets, setShowAllPresets] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [savedViews, setSavedViews] = useState<SavedView[]>(loadSavedViews);
  const [savingView, setSavingView] = useState(false);
  const [viewName, setViewName] = useState("");

  // Sections the visitor opened last time stay open on the next visit.
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => ({
    ...DEFAULT_SECTION_STATE,
    ...loadSectionState(),
  }));

  const toggleSection = (key: string) => {
    setOpenSections((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      persistSectionState(next);
      return next;
    });
  };

  // Which filter fields each sidebar section owns, so one section can be
  // cleared without touching the rest of the mix.
  const SECTION_FIELDS: Record<string, (keyof FilterState)[]> = {
    category: ["categories"],
    runtime: ["runtimes"],
    isolation: ["isolationBoundaries"],
    bootSpeed: ["bootSpeeds"],
    resumeSpeed: ["resumeSpeeds"],
    operatingSystem: ["operatingSystems"],
    pricing: ["pricing"],
    billingShape: ["billingShapes"],
    lifecycle: ["idleBilling", "pauseStates"],
    compliance: ["compliance"],
    status: ["statuses"],
    productType: ["productTypes"],
    license: ["licenses"],
    sdk: ["sdkLanguages"],
    deployment: ["deployment"],
    features: ["capabilities"],
  };

  const clearSection = (sectionId: string) => {
    const next: FilterState = { ...filters };
    for (const field of SECTION_FIELDS[sectionId] ?? []) {
      (next[field] as string[]) = [];
    }
    onFilterChange(next);
  };

  // On phones the filter body opens as a sheet, so Escape closes it and hands
  // focus back to the button that opened it. The page behind the sheet must
  // also stop scrolling, or a swipe on the sheet's edge moves the catalog.
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!mobileOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      setMobileOpen(false);
      mobileToggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const toggleItem = (list: string[], val: string) =>
    list.includes(val) ? list.filter((item) => item !== val) : [...list, val];

  const hasActiveFilters =
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
    filters.minStars > 0;

  const activeFilterCount =
    filters.categories.length +
    filters.runtimes.length +
    filters.isolationBoundaries.length +
    filters.licenses.length +
    filters.bootSpeeds.length +
    filters.resumeSpeeds.length +
    filters.operatingSystems.length +
    filters.billingShapes.length +
    filters.pricing.length +
    filters.deployment.length +
    filters.idleBilling.length +
    filters.pauseStates.length +
    filters.compliance.length +
    filters.statuses.length +
    filters.productTypes.length +
    filters.sdkLanguages.length +
    filters.capabilities.length +
    (filters.openSourceOnly ? 1 : 0) +
    (filters.favoritesOnly ? 1 : 0) +
    (filters.documentedCoreOnly ? 1 : 0) +
    (filters.verifiedPricingOnly ? 1 : 0) +
    (filters.excludeQuoteOnly ? 1 : 0) +
    (filters.excludeDeprecated ? 1 : 0) +
    (filters.excludeCloudOnly ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.minStars > 0 ? 1 : 0);

  // Counts explain why a filter can look thin: the rest of the catalog simply
  // never published the number being filtered on.
  const bootCoverage = allSandboxes.filter((sandbox) =>
    Number.isFinite(parseBootTimeMs(sandbox.techSpecs?.bootTime)),
  ).length;
  const resumeCoverage = allSandboxes.filter((sandbox) =>
    Number.isFinite(resumeLatencyMs(sandbox)),
  ).length;
  const lifecycleCoverage = allSandboxes.filter((sandbox) => sandbox.lifecycle?.idleBilling).length;

  const resetFilters = () => {
    onFilterChange({
      ...filters,
      categories: [],
      runtimes: [],
      isolationBoundaries: [],
      bootSpeeds: [],
      resumeSpeeds: [],
      operatingSystems: [],
      billingShapes: [],
      pricing: [],
      deployment: [],
      idleBilling: [],
      pauseStates: [],
      compliance: [],
      statuses: [],
      productTypes: [],
      licenses: [],
      sdkLanguages: [],
      capabilities: [],
      openSourceOnly: false,
      favoritesOnly: false,
      documentedCoreOnly: false,
      verifiedPricingOnly: false,
      excludeQuoteOnly: false,
      excludeDeprecated: false,
      excludeCloudOnly: false,
      minRating: 0,
      minStars: 0,
    });
  };

  const hasHiddenCategorySelected = EXPLORE_CATEGORIES.slice(6).some((cat) =>
    filters.categories.includes(cat),
  );
  const displayedCategories =
    showAllCategories || hasHiddenCategorySelected
      ? EXPLORE_CATEGORIES
      : EXPLORE_CATEGORIES.slice(0, 6);

  const hasHiddenFeatureSelected = CAPABILITY_OPTIONS.slice(6).some((cap) =>
    filters.capabilities.includes(cap.label),
  );
  const displayedFeatures =
    showAllFeatures || hasHiddenFeatureSelected
      ? CAPABILITY_OPTIONS
      : CAPABILITY_OPTIONS.slice(0, 6);

  const hiddenPresets = FILTER_PRESETS.slice(8);
  const hasHiddenPresetSelected = hiddenPresets.some((preset) =>
    isPresetActive(filters, preset.apply),
  );
  const displayedPresets =
    showAllPresets || hasHiddenPresetSelected ? FILTER_PRESETS : FILTER_PRESETS.slice(0, 8);

  const activeChips = CHIP_GROUPS.flatMap(({ key, options }) =>
    (filters[key] as string[]).map((value) => ({
      key,
      value,
      label: options.find((option) => option.id === value)?.label ?? value,
    })),
  );

  // Faceted counts: each option is counted against every other active
  // filter, so a row never promises results the combination cannot produce.
  const facetedCounts = useMemo(() => {
    const counts = {} as Record<ChipKey, Record<string, number>>;
    for (const { key, options } of CHIP_GROUPS) {
      const perOption: Record<string, number> = {};
      for (const option of options) {
        perOption[option.id] = filterAndSortSandboxes(allSandboxes, {
          ...filters,
          [key]: [option.id],
        } as FilterState).length;
      }
      counts[key] = perOption;
    }
    return counts;
  }, [allSandboxes, filters]);

  const matchCount = useMemo(
    () => filterAndSortSandboxes(allSandboxes, filters).length,
    [allSandboxes, filters],
  );

  // How much of the current result set actually answers the questions buyers
  // ask first. Blank is a data gap, not a zero, so show the share.
  const evidenceCoverage = useMemo(() => {
    const results = filterAndSortSandboxes(allSandboxes, filters);
    const total = results.length;
    const price = results.filter(
      (sandbox) => sandbox.pricing?.transparency === "official_verified",
    ).length;
    const boot = results.filter((sandbox) =>
      Number.isFinite(parseBootTimeMs(sandbox.techSpecs?.bootTime)),
    ).length;
    const isolation = results.filter((sandbox) => isolationBoundary(sandbox) !== "unknown").length;
    const mcp = results.filter((sandbox) => sandbox.capabilities?.mcp === true).length;
    const egress = results.filter((sandbox) => sandbox.capabilities?.egressControl === true).length;
    const pauseMemory = results.filter(
      (sandbox) => sandbox.lifecycle?.pauseRetains === "memory",
    ).length;
    const resumePublished = results.filter((sandbox) =>
      Number.isFinite(resumeLatencyMs(sandbox)),
    ).length;
    const share = (count: number) => (total === 0 ? 0 : Math.round((count / total) * 100));
    return [
      {
        id: "price",
        label: "Price verified",
        count: price,
        pct: share(price),
        apply: { verifiedPricingOnly: true },
      },
      {
        id: "boot",
        label: "Boot time published",
        count: boot,
        pct: share(boot),
        apply: { bootSpeeds: ["instant", "subsecond", "standard"] },
      },
      {
        id: "isolation",
        label: "Isolation named",
        count: isolation,
        pct: share(isolation),
        apply: {
          isolationBoundaries: ["hardware", "kernel", "userspace"],
        },
      },
      {
        id: "mcp",
        label: "MCP endpoint",
        count: mcp,
        pct: share(mcp),
        apply: { capabilities: ["mcp"] },
      },
      {
        id: "egress",
        label: "Egress policy",
        count: egress,
        pct: share(egress),
        apply: { capabilities: ["egressControl"] },
      },
      {
        id: "pause-memory",
        label: "Pause keeps memory",
        count: pauseMemory,
        pct: share(pauseMemory),
        apply: { pauseStates: ["memory"] },
      },
      {
        id: "resume-time",
        label: "Resume latency published",
        count: resumePublished,
        pct: share(resumePublished),
        // Match the published tiers; resume matching already skips listings
        // that retain nothing, which is exactly this row's population.
        apply: { resumeSpeeds: ["instant", "subsecond", "standard"] },
      },
    ];
  }, [allSandboxes, filters]);

  // Presets replace the axes they name and keep the rest, so the count shown
  // is what you land on after clicking, not a global total.
  const presetCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const preset of FILTER_PRESETS) {
      const cleared = Object.fromEntries(
        Object.entries(preset.apply).map(([key, value]) => [
          key,
          Array.isArray(value) ? [] : false,
        ]),
      ) as Partial<FilterState>;
      counts[preset.id] = filterAndSortSandboxes(allSandboxes, {
        ...filters,
        ...cleared,
        ...preset.apply,
      } as FilterState).length;
    }
    return counts;
  }, [allSandboxes, filters]);

  const saveCurrentView = () => {
    if (!viewName.trim()) {
      return;
    }
    const next = [makeSavedView(viewName, filters), ...savedViews].slice(0, 8);
    setSavedViews(next);
    persistSavedViews(next);
    setViewName("");
    setSavingView(false);
  };

  const applySavedView = (view: SavedView) => {
    onFilterChange({
      ...view.filters,
      sortBy: filters.sortBy,
      viewMode: filters.viewMode,
    });
  };

  const deleteSavedView = (id: string) => {
    const next = savedViews.filter((view) => view.id !== id);
    setSavedViews(next);
    persistSavedViews(next);
  };

  const removeChip = (key: ChipKey, value: string) => {
    onFilterChange({
      ...filters,
      [key]: (filters[key] as string[]).filter((item) => item !== value),
    } as FilterState);
  };

  const isCategoryOpen = openSections.category || filters.categories.length > 0;
  const isRuntimeOpen = openSections.runtime || filters.runtimes.length > 0;
  const isIsolationOpen = openSections.isolation || filters.isolationBoundaries.length > 0;
  const documentedBoundaries = allSandboxes.filter(
    (sandbox) => !matchesIsolationBoundary(sandbox, "unknown"),
  ).length;
  const isBootSpeedOpen = openSections.bootSpeed || filters.bootSpeeds.length > 0;
  const isResumeSpeedOpen = openSections.resumeSpeed || filters.resumeSpeeds.length > 0;
  const isOperatingSystemOpen = openSections.operatingSystem || filters.operatingSystems.length > 0;
  const isPricingOpen = openSections.pricing || filters.pricing.length > 0;
  const isBillingShapeOpen = openSections.billingShape || filters.billingShapes.length > 0;
  const isLifecycleOpen =
    openSections.lifecycle || filters.idleBilling.length > 0 || filters.pauseStates.length > 0;
  const isProductTypeOpen = openSections.productType || filters.productTypes.length > 0;
  const isSdkOpen = openSections.sdk || filters.sdkLanguages.length > 0;
  const isComplianceOpen = openSections.compliance || filters.compliance.length > 0;
  const isStatusOpen = openSections.status || filters.statuses.length > 0;
  const isLicenseOpen = openSections.license || filters.licenses.length > 0;
  const isDeploymentOpen = openSections.deployment || filters.deployment.length > 0;
  const isFeaturesOpen = openSections.features || filters.capabilities.length > 0;

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close filters"
          className="fixed inset-0 z-40 cursor-default bg-[#030510]/70 lg:hidden"
          onClick={() => setMobileOpen(false)}
          type="button"
        />
      )}
      <aside
        className={`w-full shrink-0 rounded-[14px] border border-[#262C4A] bg-[#131625] lg:sticky lg:top-[84px] lg:max-h-[calc(100vh-104px)] lg:w-[238px] lg:overflow-y-auto ${
          mobileOpen
            ? "fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-b-none shadow-[0_-18px_40px_-12px_rgba(3,5,16,0.9)]"
            : ""
        } lg:inset-x-auto lg:bottom-auto lg:z-auto lg:shadow-none`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-[14px] border-[#262C4A]/70 border-b bg-[#131625] px-4 pt-4 pb-3 lg:static lg:rounded-none lg:border-b-0 lg:pb-0">
          <button
            aria-controls="filter-body"
            aria-expanded={mobileOpen}
            className="flex items-center gap-1.5 lg:pointer-events-none"
            onClick={() => setMobileOpen((open) => !open)}
            ref={mobileToggleRef}
            type="button"
          >
            <SlidersHorizontal
              aria-hidden="true"
              className="h-3.5 w-3.5 text-[#9BA1BE] lg:hidden"
            />
            <span className="font-bold text-[#F2F3FA] text-[15px]">Filter by</span>
            {activeFilterCount > 0 && (
              <span className="rounded bg-[#6D4DFF]/20 px-1.5 py-0.5 font-mono text-[#A78BFA] text-[10px] tabular-nums lg:hidden">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              aria-hidden="true"
              className={`h-3.5 w-3.5 text-[#8289AA] transition-transform lg:hidden ${
                mobileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div className="flex items-center gap-3">
            {onShare && hasActiveFilters && (
              <button
                aria-label={
                  shareState === "copied"
                    ? "Link copied"
                    : shareState === "failed"
                      ? "Copy failed"
                      : "Copy link to this filtered view"
                }
                className={`cursor-pointer transition-colors ${
                  shareState === "copied"
                    ? "text-[#86EFAC]"
                    : shareState === "failed"
                      ? "text-[#F87171]"
                      : "text-[#9BA1BE] hover:text-[#A78BFA]"
                }`}
                onClick={onShare}
                title="Copy link to this filtered view"
                type="button"
              >
                {shareState === "copied" ? (
                  <Check aria-hidden="true" className="h-3 w-3" />
                ) : shareState === "failed" ? (
                  <X aria-hidden="true" className="h-3 w-3" />
                ) : (
                  <Link2 aria-hidden="true" className="h-3 w-3" />
                )}
              </button>
            )}
            {hasActiveFilters && (
              <button
                className="flex cursor-pointer items-center gap-1 text-[#9BA1BE] text-[11px] transition-colors hover:text-[#A78BFA]"
                onClick={resetFilters}
                type="button"
              >
                <RotateCcw aria-hidden="true" className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
            {mobileOpen && (
              <button
                className="cursor-pointer rounded-full bg-[#6D4DFF] px-3 py-1 font-semibold text-[11px] text-white transition-colors hover:bg-[#7B5EFF] lg:hidden"
                onClick={() => setMobileOpen(false)}
                type="button"
              >
                Done
              </button>
            )}
          </div>
        </div>

        <div
          className={`space-y-3.5 px-4 pt-3 pb-4 ${mobileOpen ? "block" : "hidden lg:block"}`}
          id="filter-body"
        >
          {activeChips.length > 0 && (
            <div className="space-y-1.5 border-[#262C4A]/70 border-b pb-3">
              <span className="block font-medium text-[#8289AA] text-[10px] uppercase tracking-[0.08em]">
                Active filters ({activeChips.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeChips.map((chip) => (
                  <button
                    aria-label={`Remove ${chip.label} filter`}
                    className="group flex cursor-pointer items-center gap-1 rounded-full border border-[#6D4DFF]/60 bg-[#1E183E] px-2 py-0.5 font-medium text-[#C4B5FD] text-[11px] transition-colors hover:border-[#8B77FF] hover:text-white"
                    key={`${chip.key}:${chip.value}`}
                    onClick={() => removeChip(chip.key, chip.value)}
                    type="button"
                  >
                    <span className="max-w-[150px] truncate">{chip.label}</span>
                    <X
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 opacity-70 group-hover:opacity-100"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5 border-[#262C4A]/70 border-b pb-3">
            <div className="flex items-center justify-between gap-2">
              <span className="block font-medium text-[#8289AA] text-[10px] uppercase tracking-[0.08em]">
                Saved views
              </span>
              {!savingView && savedViews.length < 8 && (
                <button
                  className="cursor-pointer text-[#A78BFA] text-[10px] transition-colors hover:text-[#C4B5FD]"
                  onClick={() => setSavingView(true)}
                  type="button"
                >
                  Save view
                </button>
              )}
            </div>

            {savingView && (
              <form
                className="flex items-center gap-1.5"
                onSubmit={(event) => {
                  event.preventDefault();
                  saveCurrentView();
                }}
              >
                <input
                  aria-label="Name for this saved view"
                  autoFocus={true}
                  className="min-w-0 flex-1 rounded-md border border-[#3A4370] bg-[#0F1324] px-2 py-1 text-[#F2F3FA] text-[11px] placeholder:text-[#8289AA] focus:border-[#6D4DFF] focus:outline-none"
                  maxLength={40}
                  onChange={(event) => setViewName(event.target.value)}
                  placeholder="Name this view"
                  value={viewName}
                />
                <button
                  className="cursor-pointer rounded-md bg-[#6D4DFF] px-2 py-1 font-semibold text-[11px] text-white transition-colors hover:bg-[#7B5EFF] disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!viewName.trim()}
                  type="submit"
                >
                  Save
                </button>
                <button
                  aria-label="Cancel saving view"
                  className="cursor-pointer p-1 text-[#8289AA] hover:text-[#F2F3FA]"
                  onClick={() => {
                    setSavingView(false);
                    setViewName("");
                  }}
                  type="button"
                >
                  <X aria-hidden="true" className="h-3 w-3" />
                </button>
              </form>
            )}

            {savedViews.length === 0 && !savingView && (
              <p className="text-[#8289AA] text-[11px] leading-[15px]">
                Save the current filter mix and reopen it in one click.
              </p>
            )}

            {savedViews.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {savedViews.map((view) => (
                  <span
                    className="flex items-center gap-1 rounded-full border border-[#262C4A] bg-[#0F1324] pr-1 pl-2"
                    key={view.id}
                  >
                    <button
                      className="flex cursor-pointer items-center gap-1 py-0.5 font-medium text-[#9BA1BE] text-[11px] transition-colors hover:text-[#F2F3FA]"
                      onClick={() => applySavedView(view)}
                      title="Apply this saved view"
                      type="button"
                    >
                      <Bookmark
                        aria-hidden="true"
                        className="h-2.5 w-2.5 shrink-0 text-[#A78BFA]"
                      />
                      <span className="max-w-[120px] truncate">{view.name}</span>
                    </button>
                    <button
                      aria-label={`Delete saved view ${view.name}`}
                      className="cursor-pointer p-0.5 text-[#8289AA] transition-colors hover:text-[#F87171]"
                      onClick={() => deleteSavedView(view.id)}
                      type="button"
                    >
                      <X aria-hidden="true" className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="border-[#262C4A]/70 border-b pb-3">
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="font-medium text-[#8289AA] text-[10px] uppercase tracking-[0.08em]">
                Evidence in view
              </span>
              <span className="font-mono text-[#8289AA] text-[10px] tabular-nums">
                {matchCount}
              </span>
            </div>
            <ul className="space-y-2">
              {evidenceCoverage.map((row) => (
                <li key={row.id}>
                  <div className="flex items-baseline justify-between gap-2 text-[11px]">
                    {row.apply ? (
                      <button
                        aria-pressed={isPresetActive(filters, row.apply)}
                        className={`cursor-pointer text-left underline decoration-[#3A4370] decoration-dotted underline-offset-2 transition-colors ${
                          isPresetActive(filters, row.apply)
                            ? "text-[#C4B5FD]"
                            : "text-[#9BA1BE] hover:text-[#F2F3FA]"
                        }`}
                        onClick={() => {
                          const cleared = Object.fromEntries(
                            Object.entries(row.apply).map(([key, value]) => [
                              key,
                              Array.isArray(value) ? [] : false,
                            ]),
                          ) as Partial<FilterState>;
                          onFilterChange({
                            ...filters,
                            ...(isPresetActive(filters, row.apply) ? cleared : row.apply),
                          });
                        }}
                        title={`Filter to the ${row.count} listings that publish this`}
                        type="button"
                      >
                        {row.label}
                      </button>
                    ) : (
                      <span className="text-[#9BA1BE]">{row.label}</span>
                    )}
                    <span className="font-mono text-[#8289AA] text-[10px] tabular-nums">
                      {row.pct}%
                    </span>
                  </div>
                  <div
                    aria-label={`${row.label}: ${row.count} of ${matchCount} listings`}
                    aria-valuemax={100}
                    aria-valuemin={0}
                    aria-valuenow={row.pct}
                    className="mt-1 h-1 overflow-hidden rounded-full bg-[#1A1E32]"
                    role="progressbar"
                  >
                    <div
                      className={`h-full rounded-full ${
                        row.pct > 0 && row.pct < 40 ? "bg-[#F59E0B]" : "bg-[#6D4DFF]"
                      }`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-1.5 text-[#8289AA] text-[10px] leading-[14px]">
              Blank means unpublished, not zero.
            </p>
          </div>

          <div className="space-y-1.5 border-[#262C4A]/70 border-b pb-3">
            <span className="block font-medium text-[#8289AA] text-[10px] uppercase tracking-[0.08em]">
              Quick filters
            </span>
            <div className="flex flex-wrap gap-1.5">
              {displayedPresets.map((preset) => {
                const active = isPresetActive(filters, preset.apply);
                const count = presetCounts[preset.id] ?? 0;
                return (
                  <button
                    aria-label={`${preset.label}, ${count} ${count === 1 ? "result" : "results"}`}
                    aria-pressed={active}
                    className={`flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 font-medium text-[11px] transition-colors ${
                      active
                        ? "border-[#6D4DFF] bg-[#1E183E] text-[#C4B5FD]"
                        : count === 0
                          ? "border-[#262C4A]/60 bg-[#0F1324]/60 text-[#8289AA] hover:border-[#3A4370] hover:text-[#9BA1BE]"
                          : "border-[#262C4A] bg-[#0F1324] text-[#9BA1BE] hover:border-[#3A4370] hover:text-[#F2F3FA]"
                    }`}
                    key={preset.id}
                    onClick={() => {
                      const cleared = Object.fromEntries(
                        Object.entries(preset.apply).map(([key, value]) => [
                          key,
                          Array.isArray(value) ? [] : typeof value === "number" ? 0 : false,
                        ]),
                      ) as Partial<FilterState>;
                      onFilterChange({
                        ...filters,
                        ...(active ? cleared : preset.apply),
                      });
                    }}
                    title={`${preset.label}: ${count} of ${allSandboxes.length} listings under the current filters`}
                    type="button"
                  >
                    <span>{preset.label}</span>
                    <span
                      className={`font-mono text-[10px] tabular-nums ${
                        active ? "text-[#A78BFA]" : "text-[#8289AA]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {FILTER_PRESETS.length > 8 && !hasHiddenPresetSelected && (
              <button
                className="flex cursor-pointer items-center gap-1 pt-0.5 text-[#A78BFA] text-[11px] transition-colors hover:text-[#C4B5FD]"
                onClick={() => setShowAllPresets(!showAllPresets)}
                type="button"
              >
                <span>
                  {showAllPresets
                    ? "Fewer quick filters"
                    : `More quick filters (${FILTER_PRESETS.length - 8})`}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`h-3 w-3 transition-transform ${showAllPresets ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>

          {/* Open source is the most-used single filter, so it leads. */}
          <label className="flex cursor-pointer select-none items-center justify-between border-[#262C4A]/70 border-b py-1 pb-3 text-[#9BA1BE] text-[12px] hover:text-[#F2F3FA]">
            <span className="flex items-center gap-2">
              <DarkCheckbox
                checked={filters.openSourceOnly}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    openSourceOnly: !filters.openSourceOnly,
                  })
                }
              />
              <span className={filters.openSourceOnly ? "font-medium text-[#F2F3FA]" : ""}>
                Open source only
              </span>
            </span>
            <span className="font-mono text-[#8289AA] text-[11px] tabular-nums">
              ({allSandboxes.filter((s) => s.openSource).length})
            </span>
          </label>
          <p className="border-[#262C4A]/70 border-b pt-1.5 pb-3 text-[#8289AA] text-[11px] leading-[15px]">
            Recognized open-source licenses only. Business Source, no-license and proprietary
            listings stay out of this count, even when their source is public.
          </p>
          <label className="flex cursor-pointer select-none items-center justify-between border-[#262C4A]/70 border-b py-1 pb-3 text-[#9BA1BE] text-[12px] hover:text-[#F2F3FA]">
            <span className="flex items-center gap-2">
              <DarkCheckbox
                checked={filters.favoritesOnly}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    favoritesOnly: !filters.favoritesOnly,
                  })
                }
              />
              <span className={filters.favoritesOnly ? "font-medium text-[#F2F3FA]" : ""}>
                Favorites only
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer select-none items-center justify-between border-[#262C4A]/70 border-b py-1 pb-3 text-[#9BA1BE] text-[12px] hover:text-[#F2F3FA]">
            <span className="flex items-center gap-2">
              <DarkCheckbox
                checked={filters.documentedCoreOnly}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    documentedCoreOnly: !filters.documentedCoreOnly,
                  })
                }
              />
              <span
                className={filters.documentedCoreOnly ? "font-medium text-[#F2F3FA]" : ""}
                title="Keep only listings that publish a verified price, a named containment boundary and an egress posture"
              >
                Fully documented
              </span>
            </span>{" "}
            <span className="font-mono text-[#8289AA] text-[11px] tabular-nums">
              ({allSandboxes.filter(hasDocumentedCore).length})
            </span>
          </label>

          <label className="flex cursor-pointer select-none items-center justify-between border-[#262C4A]/70 border-b py-1 pb-3 text-[#9BA1BE] text-[12px] hover:text-[#F2F3FA]">
            <span className="flex items-center gap-2">
              <DarkCheckbox
                checked={filters.verifiedPricingOnly}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    verifiedPricingOnly: !filters.verifiedPricingOnly,
                  })
                }
              />
              <span
                className={filters.verifiedPricingOnly ? "font-medium text-[#F2F3FA]" : ""}
                title="Only listings whose pricing was checked against an official source"
              >
                Verified pricing
              </span>
            </span>
            <span className="font-mono text-[#8289AA] text-[11px] tabular-nums">
              ({allSandboxes.filter((s) => s.pricing.transparency === "official_verified").length})
            </span>
          </label>
          <label className="flex cursor-pointer select-none items-center justify-between border-[#262C4A]/70 border-b py-1 pb-3 text-[#9BA1BE] text-[12px] hover:text-[#F2F3FA]">
            <span className="flex items-center gap-2">
              <DarkCheckbox
                checked={filters.excludeQuoteOnly}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    excludeQuoteOnly: !filters.excludeQuoteOnly,
                  })
                }
              />
              <span
                className={filters.excludeQuoteOnly ? "font-medium text-[#F2F3FA]" : ""}
                title="Drop listings that only quote a price, so what is left can be compared as published numbers"
              >
                Published price only
              </span>
            </span>
            <span className="font-mono text-[#8289AA] text-[11px] tabular-nums">
              ({allSandboxes.filter((s) => s.pricing.transparency !== "quote_only").length})
            </span>
          </label>
          <label className="flex cursor-pointer select-none items-center justify-between border-[#262C4A]/70 border-b py-1 pb-3 text-[#9BA1BE] text-[12px] hover:text-[#F2F3FA]">
            <span className="flex items-center gap-2">
              <DarkCheckbox
                checked={filters.excludeDeprecated}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    excludeDeprecated: !filters.excludeDeprecated,
                  })
                }
              />
              <span
                className={filters.excludeDeprecated ? "font-medium text-[#F2F3FA]" : ""}
                title="Hide products that are shut down or no longer maintained, leaving options you can run today"
              >
                Hide archived
              </span>
            </span>
            <span className="font-mono text-[#8289AA] text-[11px] tabular-nums">
              ({allSandboxes.filter((s) => s.status !== "deprecated").length})
            </span>
          </label>
          <label className="flex cursor-pointer select-none items-center justify-between border-[#262C4A]/70 border-b py-1 pb-3 text-[#9BA1BE] text-[12px] hover:text-[#F2F3FA]">
            <span className="flex items-center gap-2">
              <DarkCheckbox
                checked={filters.excludeCloudOnly}
                onChange={() =>
                  onFilterChange({
                    ...filters,
                    excludeCloudOnly: !filters.excludeCloudOnly,
                  })
                }
              />
              <span
                className={filters.excludeCloudOnly ? "font-medium text-[#F2F3FA]" : ""}
                title="Hide vendors that sell only a hosted service; keep products you can self-host or run in your own cloud"
              >
                No cloud-only
              </span>
            </span>
            <span className="font-mono text-[#8289AA] text-[11px] tabular-nums">
              (
              {
                allSandboxes.filter(
                  (s) => !(s.deployment.cloud && !s.deployment.selfHosted && !s.deployment.byoc),
                ).length
              }
              )
            </span>
          </label>
          <div className="flex items-center justify-between border-[#262C4A]/70 border-b py-1 pb-3">
            <span
              className="text-[#9BA1BE] text-[12px]"
              title="Our editorial rating out of five. Only reviewed listings carry one."
            >
              Rating
            </span>
            <div aria-label="Minimum editorial rating" className="flex gap-1" role="group">
              {[
                { label: "Any", value: 0 },
                { label: "4.0+", value: 4 },
                { label: "4.5+", value: 4.5 },
              ].map((choice) => {
                const active = filters.minRating === choice.value;
                const count =
                  choice.value === 0
                    ? allSandboxes.length
                    : allSandboxes.filter((sandbox) => (sandbox.rating ?? 0) >= choice.value)
                        .length;
                return (
                  <button
                    aria-label={`Minimum rating ${choice.label}, ${count} results`}
                    aria-pressed={active}
                    className={`cursor-pointer rounded-md border px-1.5 py-0.5 font-medium text-[10px] tabular-nums transition-colors ${
                      active
                        ? "border-[#6D4DFF] bg-[#1E183E] text-[#C4B5FD]"
                        : "border-[#262C4A] bg-[#0F1324] text-[#9BA1BE] hover:border-[#3A4370] hover:text-[#F2F3FA]"
                    }`}
                    key={choice.value}
                    onClick={() => onFilterChange({ ...filters, minRating: choice.value })}
                    title={`${count} listings at ${choice.label}`}
                    type="button"
                  >
                    {choice.label}
                  </button>
                );
              })}
            </div>
          </div>

          <FilterSection
            activeCount={filters.categories.length}
            id="category"
            onClear={() => clearSection("category")}
            onToggle={() => toggleSection("category")}
            open={isCategoryOpen}
            title="Category"
          >
            {displayedCategories.map((cat) => (
              <CheckRow
                checked={filters.categories.includes(cat)}
                count={facetedCounts.categories[cat]}
                key={cat}
                label={cat}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    categories: toggleItem(filters.categories, cat),
                  })
                }
              />
            ))}

            {EXPLORE_CATEGORIES.length > 6 && !hasHiddenCategorySelected && (
              <button
                className="flex cursor-pointer items-center gap-1 pt-1 text-[#A78BFA] text-[12px] transition-colors hover:text-[#C4B5FD]"
                onClick={() => setShowAllCategories(!showAllCategories)}
                type="button"
              >
                <span>
                  {showAllCategories ? "Show less" : `Show more (${EXPLORE_CATEGORIES.length - 6})`}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`h-3 w-3 transition-transform ${showAllCategories ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </FilterSection>

          <FilterSection
            activeCount={filters.runtimes.length}
            id="runtime"
            onClear={() => clearSection("runtime")}
            onToggle={() => toggleSection("runtime")}
            open={isRuntimeOpen}
            title="Isolation Runtime"
          >
            {RUNTIME_OPTIONS.map((rt) => (
              <CheckRow
                checked={filters.runtimes.includes(rt.id)}
                count={facetedCounts.runtimes[rt.id]}
                key={rt.id}
                label={rt.label}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    runtimes: toggleItem(filters.runtimes, rt.id),
                  })
                }
              />
            ))}
          </FilterSection>

          <FilterSection
            activeCount={filters.isolationBoundaries.length}
            id="isolation"
            onClear={() => clearSection("isolation")}
            onToggle={() => toggleSection("isolation")}
            open={isIsolationOpen}
            title="Isolation Boundary"
          >
            <p className="pt-0.5 pb-1 text-[#8289AA] text-[11px] leading-[15px]">
              {documentedBoundaries} of {allSandboxes.length} listings document a containment tier.
            </p>
            {ISOLATION_BOUNDARY_OPTIONS.map((option) => (
              <CheckRow
                checked={filters.isolationBoundaries.includes(option.id)}
                count={facetedCounts.isolationBoundaries[option.id]}
                key={option.id}
                label={option.label}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    isolationBoundaries: toggleItem(filters.isolationBoundaries, option.id),
                  })
                }
              />
            ))}
            <p className="pt-1 text-[#8289AA] text-[10px] leading-[14px]">
              {ISOLATION_BOUNDARY_OPTIONS.map((option) => option.hint).join(" · ")}
            </p>
          </FilterSection>

          <FilterSection
            activeCount={filters.bootSpeeds.length}
            id="bootSpeed"
            onClear={() => clearSection("bootSpeed")}
            onToggle={() => toggleSection("bootSpeed")}
            open={isBootSpeedOpen}
            title="Cold Start Speed"
          >
            <p className="pt-0.5 pb-1 text-[#8289AA] text-[11px] leading-[15px]">
              {bootCoverage} of {allSandboxes.length} listings publish a boot figure.
            </p>
            {BOOT_SPEED_OPTIONS.map((speed) => (
              <CheckRow
                checked={filters.bootSpeeds.includes(speed.id)}
                count={facetedCounts.bootSpeeds[speed.id]}
                key={speed.id}
                label={speed.label}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    bootSpeeds: toggleItem(filters.bootSpeeds, speed.id),
                  })
                }
              />
            ))}
          </FilterSection>

          <FilterSection
            activeCount={filters.resumeSpeeds.length}
            id="resumeSpeed"
            onClear={() => clearSection("resumeSpeed")}
            onToggle={() => toggleSection("resumeSpeed")}
            open={isResumeSpeedOpen}
            title="Resume Speed"
          >
            <p className="pt-0.5 pb-1 text-[#8289AA] text-[11px] leading-[15px]">
              {resumeCoverage} of {allSandboxes.length} listings publish a usable resume figure. A
              pause that keeps nothing is not a resume.
            </p>
            {RESUME_SPEED_OPTIONS.map((speed) => (
              <CheckRow
                checked={filters.resumeSpeeds.includes(speed.id)}
                count={facetedCounts.resumeSpeeds[speed.id]}
                key={speed.id}
                label={speed.label}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    resumeSpeeds: toggleItem(filters.resumeSpeeds, speed.id),
                  })
                }
              />
            ))}
          </FilterSection>

          <FilterSection
            activeCount={filters.operatingSystems.length}
            id="operatingSystem"
            onClear={() => clearSection("operatingSystem")}
            onToggle={() => toggleSection("operatingSystem")}
            open={isOperatingSystemOpen}
            title="Platform"
          >
            <p className="pt-0.5 pb-1 text-[#8289AA] text-[11px] leading-[15px]">
              Guest OS for hosted sandboxes; host platforms for local runtimes. Need real macOS or a
              phone OS?{" "}
              {allSandboxes.filter((s) => (s.techSpecs?.operatingSystems ?? []).length > 0).length}{" "}
              of {allSandboxes.length} listings name one.
            </p>
            {OS_OPTIONS.map((option) => (
              <CheckRow
                checked={filters.operatingSystems.includes(option.id)}
                count={facetedCounts.operatingSystems[option.id]}
                key={option.id}
                label={option.label}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    operatingSystems: toggleItem(filters.operatingSystems, option.id),
                  })
                }
              />
            ))}
          </FilterSection>

          <FilterSection
            activeCount={filters.pricing.length}
            id="pricing"
            onClear={() => clearSection("pricing")}
            onToggle={() => toggleSection("pricing")}
            open={isPricingOpen}
            title="Pricing"
          >
            {PRICING_OPTIONS.map((price) => (
              <CheckRow
                checked={filters.pricing.includes(price)}
                count={facetedCounts.pricing[price]}
                key={price}
                label={price}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    pricing: toggleItem(filters.pricing, price),
                  })
                }
              />
            ))}
          </FilterSection>

          <FilterSection
            activeCount={filters.billingShapes.length}
            id="billingShape"
            onClear={() => clearSection("billingShape")}
            onToggle={() => toggleSection("billingShape")}
            open={isBillingShapeOpen}
            title="Rate shape"
          >
            <p className="pt-0.5 pb-1 text-[#8289AA] text-[11px] leading-[15px]">
              A seat or licence plan is not a per-hour rate. Filter to the shape you can actually
              compare.{" "}
              <Link
                className="text-[#A78BFA] underline decoration-[#6D4DFF]/40 underline-offset-2 hover:text-white"
                to="/matrix"
              >
                See the matrix
              </Link>
            </p>
            {BILLING_SHAPE_OPTIONS.map((shape) => (
              <CheckRow
                checked={filters.billingShapes.includes(shape.id)}
                count={facetedCounts.billingShapes[shape.id]}
                key={shape.id}
                label={shape.label}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    billingShapes: toggleItem(filters.billingShapes, shape.id),
                  })
                }
              />
            ))}
          </FilterSection>

          <FilterSection
            activeCount={filters.idleBilling.length + filters.pauseStates.length}
            id="lifecycle"
            onClear={() => clearSection("lifecycle")}
            onToggle={() => toggleSection("lifecycle")}
            open={isLifecycleOpen}
            title="Billing & Pause"
          >
            <p className="pt-0.5 pb-1 text-[#8289AA] text-[11px] leading-[15px]">
              The hidden cost axis: what happens while an agent is waiting. {lifecycleCoverage} of{" "}
              {allSandboxes.length} listings publish their idle rule.
            </p>
            {IDLE_BILLING_OPTIONS.map((option) => (
              <CheckRow
                checked={filters.idleBilling.includes(option.id)}
                count={facetedCounts.idleBilling[option.id]}
                key={option.id}
                label={option.label}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    idleBilling: toggleItem(filters.idleBilling, option.id),
                  })
                }
              />
            ))}
            <div className="pt-1.5">
              <span className="font-medium text-[#8289AA] text-[10px] uppercase tracking-[0.08em]">
                State kept on pause
              </span>
            </div>
            {PAUSE_STATE_OPTIONS.map((option) => (
              <CheckRow
                checked={filters.pauseStates.includes(option.id)}
                count={facetedCounts.pauseStates[option.id]}
                key={option.id}
                label={option.label}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    pauseStates: toggleItem(filters.pauseStates, option.id),
                  })
                }
              />
            ))}
          </FilterSection>

          <FilterSection
            activeCount={filters.compliance.length}
            id="compliance"
            onClear={() => clearSection("compliance")}
            onToggle={() => toggleSection("compliance")}
            open={isComplianceOpen}
            title="Compliance"
          >
            <p className="pt-0.5 pb-1 text-[#8289AA] text-[11px] leading-[15px]">
              Vendor claims, matched by family: "SOC 2 Type II" and "SOC 2 Type 2" count the same.{" "}
              {allSandboxes.filter((s) => (s.compliance ?? []).length > 0).length} of{" "}
              {allSandboxes.length} listings name an attestation.
            </p>
            {COMPLIANCE_OPTIONS.map((option) => (
              <CheckRow
                checked={filters.compliance.includes(option.id)}
                count={facetedCounts.compliance[option.id]}
                key={option.id}
                label={option.label}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    compliance: toggleItem(filters.compliance, option.id),
                  })
                }
              />
            ))}
          </FilterSection>

          <FilterSection
            activeCount={filters.statuses.length}
            id="status"
            onClear={() => clearSection("status")}
            onToggle={() => toggleSection("status")}
            open={isStatusOpen}
            title="Lifecycle status"
          >
            <p className="pt-0.5 pb-1 text-[#8289AA] text-[11px] leading-[15px]">
              Whether the product is generally available, still in preview, or unconfirmed. Beta is
              a scheduling risk, not a security verdict.
            </p>
            {STATUS_OPTIONS.map((option) => (
              <CheckRow
                checked={filters.statuses.includes(option.id)}
                count={facetedCounts.statuses[option.id]}
                key={option.id}
                label={option.label}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    statuses: toggleItem(filters.statuses, option.id),
                  })
                }
              />
            ))}
          </FilterSection>

          <FilterSection
            activeCount={filters.productTypes.length}
            id="productType"
            onClear={() => clearSection("productType")}
            onToggle={() => toggleSection("productType")}
            open={isProductTypeOpen}
            title="Product type"
          >
            <p className="pt-0.5 pb-1 text-[#8289AA] text-[11px] leading-[15px]">
              What the project ships. A hosted product, a tool you run yourself, a hypervisor, or an
              embeddable runtime are different adoption decisions. Open source cuts across all four.
            </p>
            {PRODUCT_TYPE_OPTIONS.map((option) => (
              <CheckRow
                checked={filters.productTypes.includes(option.id)}
                count={facetedCounts.productTypes[option.id]}
                key={option.id}
                label={option.label}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    productTypes: toggleItem(filters.productTypes, option.id),
                  })
                }
              />
            ))}
          </FilterSection>

          <FilterSection
            activeCount={filters.licenses.length}
            id="license"
            onClear={() => clearSection("license")}
            onToggle={() => toggleSection("license")}
            open={isLicenseOpen}
            title="License"
          >
            <p className="pt-0.5 pb-1 text-[#8289AA] text-[11px] leading-[15px]">
              The repository's SPDX id from GitHub, grouped by redistribution terms.{" "}
              {Object.keys(REPO_LICENSES).length} of {allSandboxes.length} listings carry a known
              id; repo-less vendors are hidden while this is on.
            </p>
            {LICENSE_OPTIONS.map((option) => (
              <CheckRow
                checked={filters.licenses.includes(option.id)}
                count={facetedCounts.licenses[option.id]}
                key={option.id}
                label={option.label}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    licenses: toggleItem(filters.licenses, option.id),
                  })
                }
              />
            ))}
          </FilterSection>

          <FilterSection
            activeCount={filters.sdkLanguages.length}
            id="sdk"
            onClear={() => clearSection("sdk")}
            onToggle={() => toggleSection("sdk")}
            open={isSdkOpen}
            title="SDK Language"
          >
            <p className="pt-0.5 pb-1 text-[#8289AA] text-[11px] leading-[15px]">
              First-party SDK only. A community wrapper is a maintenance risk.
            </p>
            {SDK_LANGUAGE_OPTIONS.map((option) => (
              <CheckRow
                checked={filters.sdkLanguages.includes(option.id)}
                count={facetedCounts.sdkLanguages[option.id]}
                key={option.id}
                label={option.label}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    sdkLanguages: toggleItem(filters.sdkLanguages, option.id),
                  })
                }
              />
            ))}
          </FilterSection>

          <FilterSection
            activeCount={filters.deployment.length}
            id="deployment"
            onClear={() => clearSection("deployment")}
            onToggle={() => toggleSection("deployment")}
            open={isDeploymentOpen}
            title="Deployment"
          >
            {DEPLOYMENT_OPTIONS.map((dep) => (
              <CheckRow
                checked={filters.deployment.includes(dep)}
                count={facetedCounts.deployment[dep]}
                key={dep}
                label={dep}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    deployment: toggleItem(filters.deployment, dep),
                  })
                }
              />
            ))}
          </FilterSection>

          <FilterSection
            activeCount={filters.capabilities.length}
            id="features"
            onClear={() => clearSection("features")}
            onToggle={() => toggleSection("features")}
            open={isFeaturesOpen}
            title="Features"
          >
            {displayedFeatures.map((cap) => (
              <CheckRow
                checked={filters.capabilities.includes(cap.label)}
                count={facetedCounts.capabilities[cap.id]}
                key={cap.id}
                label={cap.label}
                onToggle={() =>
                  onFilterChange({
                    ...filters,
                    capabilities: toggleItem(filters.capabilities, cap.label),
                  })
                }
              />
            ))}

            {CAPABILITY_OPTIONS.length > 6 && !hasHiddenFeatureSelected && (
              <button
                className="flex cursor-pointer items-center gap-1 pt-1 text-[#A78BFA] text-[12px] transition-colors hover:text-[#C4B5FD]"
                onClick={() => setShowAllFeatures(!showAllFeatures)}
                type="button"
              >
                <span>
                  {showAllFeatures ? "Show less" : `Show more (${CAPABILITY_OPTIONS.length - 6})`}
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`h-3 w-3 transition-transform ${showAllFeatures ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </FilterSection>

          {/* The sheet scrolls past the Done button, so a sticky footer keeps the
            way out and the result count in reach at the bottom. */}
          {mobileOpen && (
            <div className="sticky bottom-0 -mx-4 border-[#262C4A]/70 border-t bg-[#131625] px-4 pt-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden">
              <button
                className="w-full cursor-pointer rounded-full bg-[#6D4DFF] px-4 py-2.5 font-semibold text-[13px] text-white transition-colors hover:bg-[#7B5EFF]"
                onClick={() => setMobileOpen(false)}
                type="button"
              >
                {matchCount === 0
                  ? "No matches — show results"
                  : `Show ${matchCount} sandbox${matchCount === 1 ? "" : "es"}`}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
