import { Search, Table2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { BrandLogo } from "../components/sandbox/BrandLogo";
import { BILLING_SHAPE_LABEL, billingShape, seatBillingUnit } from "../lib/billing";
import { toCsv } from "../lib/csv";
import { formatVerifiedOn, isStaleVerification, STALE_AFTER_DAYS } from "../lib/freshness";
import { Link, useRouter } from "../lib/router";
import { useSandboxes } from "../lib/sandboxContext";
import { REPO_LICENSES } from "../data/licenses";
import type { Sandbox } from "../types/sandbox";

const MATRIX_PAGE_SIZE = 60;

const IDLE_LABELS: Record<string, { label: string; className: string }> = {
  idle_free: {
    label: "Zero idle",
    className: "text-[#86EFAC] bg-[#123524] border-[#4ADE80]/25",
  },
  usage_metered: {
    label: "Usage-metered",
    className: "text-[#C4B5FD] bg-[#1E183E] border-[#6D4DFF]/45",
  },
  wall_clock: {
    label: "Wall-clock",
    className: "text-[#FBBF24] bg-[#2A2210] border-[#FBBF24]/30",
  },
};

const PAUSE_LABELS: Record<string, string> = {
  memory: "Memory + processes",
  disk: "Disk only",
  none: "Nothing survives",
};

function runtimeLabel(sandbox: Sandbox): string {
  if (sandbox.runtime.firecracker) {
    return "Firecracker";
  }
  if (sandbox.runtime.gvisor) {
    return "gVisor";
  }
  if (sandbox.runtime.docker) {
    return "Docker / VM";
  }
  return sandbox.runtime.other?.[0] ?? "—";
}

/**
 * "Zero idle" means different things per rate shape: a seat plan sells
 * concurrency, a self-hosted tool sells nothing at all, and a licence sells
 * software. The chip names the shape so the badge is not read as a per-hour
 * price it never quoted.
 */
const SHAPE_CHIP: Record<"seat" | "self_hosted" | "software", { label: string; title: string }> = {
  seat: { label: "seat", title: "Billed per seat, not per machine-hour" },
  self_hosted: {
    label: "byo",
    title: "No vendor meter: runs on machines you already pay for",
  },
  software: {
    label: "licence",
    title: "Software licence; there is no per-sandbox rate to compare",
  },
};

const SHAPE_FILTERS = [
  { id: "all", label: "Any rate" },
  { id: "metered", label: "Per hour" },
  { id: "seat", label: "Seat" },
  { id: "self_hosted", label: "BYO" },
  { id: "software", label: "Licence" },
] as const;

type ShapeFilterId = (typeof SHAPE_FILTERS)[number]["id"];

function idleBadge(sandbox: Sandbox) {
  const meta = IDLE_LABELS[sandbox.lifecycle?.idleBilling ?? ""];
  const shape = billingShape(sandbox);
  const chipMeta =
    shape === "seat" || shape === "self_hosted" || shape === "software" ? SHAPE_CHIP[shape] : null;
  const chipTitle =
    shape === "seat"
      ? `Billed per ${seatBillingUnit(sandbox) ?? "seat"}, not per machine-hour`
      : chipMeta?.title;
  const shapeChip = chipMeta ? (
    <span
      className="ml-1 rounded border border-[#3A4370] bg-[#151A35] px-1 py-0.5 text-[9px] text-[#9BA1BE] uppercase tracking-[0.04em]"
      title={chipTitle}
    >
      {chipMeta.label}
    </span>
  ) : null;

  if (!meta) {
    return (
      <span className="inline-flex items-center text-[#8289AA]">
        Not published
        {shapeChip}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center">
      <span className={`rounded border px-1.5 py-0.5 text-[10px] ${meta.className}`}>
        {meta.label}
      </span>
      {shapeChip}
    </span>
  );
}

function pricingBadge(sandbox: Sandbox) {
  if (sandbox.pricing.transparency === "quote_only") {
    return (
      <span
        className="text-[#8289AA]"
        title="Vendor prices this by quote, so there is no public rate to verify"
      >
        Quote only
      </span>
    );
  }
  if (sandbox.pricing.transparency !== "official_verified") {
    return (
      <span
        className="text-[#8289AA]"
        title="No public rate found, so this column stays empty rather than guessed"
      >
        Not published
      </span>
    );
  }
  const verifiedAt = sandbox.pricing.verifiedAt;
  if (isStaleVerification(verifiedAt) && verifiedAt) {
    return (
      <span
        className="text-[#FBBF24]"
        title={`Rate read ${formatVerifiedOn(verifiedAt)} — over ${STALE_AFTER_DAYS} days old, so treat the figure as unchecked`}
      >
        Verified {verifiedAt.slice(0, 4)}
      </span>
    );
  }
  return (
    <span
      className="text-[#86EFAC]"
      title={verifiedAt ? `Rate read ${formatVerifiedOn(verifiedAt)}` : undefined}
    >
      Verified
    </span>
  );
}

const COLUMNS = [
  "Sandbox",
  "Isolation",
  "Mobile",
  "Boot",
  "Idle billing",
  "Kept on pause",
  "Resume",
  "Free tier",
  "Pricing verified",
] as const;

const IDLE_FILTERS = [
  { id: "all", label: "All" },
  { id: "idle_free", label: "Zero idle" },
  { id: "usage_metered", label: "Usage-metered" },
  { id: "wall_clock", label: "Wall-clock" },
] as const;

type IdleFilterId = (typeof IDLE_FILTERS)[number]["id"];

const IDLE_EXPLAINERS = [
  {
    id: "idle_free",
    title: "Zero idle",
    line: "Paused agents cost nothing. The bill starts when work does.",
  },
  {
    id: "usage_metered",
    title: "Usage-metered",
    line: "You pay for active CPU or memory, not for wall-clock time.",
  },
  {
    id: "wall_clock",
    title: "Wall-clock",
    line: "Charged per hour alive, including every second spent waiting on a model.",
  },
] as const;

export function MatrixPage() {
  const { sandboxes } = useSandboxes();
  const [query, setQuery] = useState("");
  const { navigate } = useRouter();
  const initialParams =
    typeof window === "undefined"
      ? new URLSearchParams()
      : new URLSearchParams(window.location.search);
  const [idleFilter, setIdleFilter] = useState<IdleFilterId>(() => {
    const value = initialParams.get("idle") ?? "all";
    return IDLE_FILTERS.some((option) => option.id === value) ? (value as IdleFilterId) : "all";
  });
  const [shapeFilter, setShapeFilter] = useState<ShapeFilterId>(() => {
    const value = initialParams.get("shape") ?? "all";
    return SHAPE_FILTERS.some((option) => option.id === value) ? (value as ShapeFilterId) : "all";
  });

  const syncUrl = (idle: IdleFilterId, shape: ShapeFilterId) => {
    const params = new URLSearchParams();
    if (idle !== "all") {
      params.set("idle", idle);
    }
    if (shape !== "all") {
      params.set("shape", shape);
    }
    const search = params.toString();
    navigate(`/matrix${search ? `?${search}` : ""}`, { replace: true });
  };

  const chooseIdle = (next: IdleFilterId) => {
    setIdleFilter(next);
    syncUrl(next, shapeFilter);
  };

  const chooseShape = (next: ShapeFilterId) => {
    setShapeFilter(next);
    syncUrl(idleFilter, next);
  };

  // Group by the axis that matters most when agents idle: what pause costs.
  const ranked = useMemo(
    () =>
      [...sandboxes].sort((a, b) => {
        const rank = { idle_free: 0, usage_metered: 1, wall_clock: 2 };
        const aRank = rank[a.lifecycle?.idleBilling as keyof typeof rank] ?? 3;
        const bRank = rank[b.lifecycle?.idleBilling as keyof typeof rank] ?? 3;
        return aRank - bRank || a.name.localeCompare(b.name);
      }),
    [sandboxes],
  );

  const exportRows = () => {
    const header = [
      "Sandbox",
      "Isolation",
      "Mobile OS",
      "Boot",
      "Idle billing",
      "Kept on pause",
      "Resume",
      "Free tier",
      "Billing unit",
      "Rate shape",
      "License",
      "Pricing verified",
      "URL",
    ];
    const rows = visible.map((sandbox) => [
      sandbox.name,
      runtimeLabel(sandbox),
      sandbox.capabilities.mobile === true
        ? sandbox.techSpecs?.operatingSystems?.join(", ") || "Mobile, OS unpublished"
        : "—",
      sandbox.techSpecs?.bootTime ?? "Not published",
      IDLE_LABELS[sandbox.lifecycle?.idleBilling ?? ""]?.label ?? "Not published",
      PAUSE_LABELS[sandbox.lifecycle?.pauseRetains ?? ""] ?? "Not published",
      sandbox.lifecycle?.resumeTime ?? "Not published",
      sandbox.pricing.freeTier ? "Yes" : "No",
      sandbox.pricing.billingUnit?.trim() || "Not published",
      BILLING_SHAPE_LABEL[billingShape(sandbox)],
      REPO_LICENSES[sandbox.slug] ?? "No public repository",
      sandbox.pricing.transparency === "quote_only"
        ? "Quote only"
        : sandbox.pricing.transparency !== "official_verified"
          ? "Not published"
          : isStaleVerification(sandbox.pricing.verifiedAt)
            ? `Verified ${sandbox.pricing.verifiedAt?.slice(0, 4)} (over ${STALE_AFTER_DAYS} days old)`
            : "Verified",
      `${window.location.origin}/sandbox/${sandbox.slug}`,
    ]);

    const blob = new Blob([toCsv([header, ...rows])], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "awesome-sandbox-lifecycle-matrix.csv";
    link.href = url;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const visible = ranked.filter((sandbox) => {
    const matchesQuery =
      query.trim().length === 0 ||
      `${sandbox.name} ${sandbox.description}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesIdle =
      idleFilter === "all" || (sandbox.lifecycle?.idleBilling ?? "none") === idleFilter;
    const matchesShape = shapeFilter === "all" || billingShape(sandbox) === shapeFilter;
    return matchesQuery && matchesIdle && matchesShape;
  });

  // The matrix renders every surviving listing, which is over 870 rows and
  // roughly 33k nodes on first paint. Sixty rows fill a screen or two, so the
  // rest arrive on request; CSV export still covers the whole filtered set.
  const [rowLimit, setRowLimit] = useState(MATRIX_PAGE_SIZE);
  useEffect(() => {
    setRowLimit(MATRIX_PAGE_SIZE);
  }, [query, idleFilter, shapeFilter]);
  const shown = visible.slice(0, rowLimit);

  const lifecycleCoverage = sandboxes.filter((s) => s.lifecycle?.idleBilling).length;
  const staleVerified = sandboxes.filter(
    (s) =>
      s.pricing.transparency === "official_verified" && isStaleVerification(s.pricing.verifiedAt),
  ).length;

  return (
    <div className="space-y-6 pt-6 pb-8">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6D4DFF]/60 bg-[#1E183E] px-3 py-1.5 font-semibold text-[#A78BFA] text-[12px]">
          <Table2 aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Pricing &amp; lifecycle matrix</span>
        </div>
        <h1 className="font-extrabold text-2xl text-[#F2F3FA] tracking-tight md:text-3xl">
          What each sandbox costs while your agent waits
        </h1>
        <p className="max-w-3xl text-[#9BA1BE] text-sm">
          Most comparisons rank boot time. The bill is decided by what happens between tool calls:
          whether idle time is charged, and how much state survives a pause. {lifecycleCoverage} of{" "}
          {sandboxes.length} listings publish this data; the rest are marked Not published rather
          than guessed.
          {staleVerified > 0 &&
            ` ${staleVerified} verified prices were read more than ${STALE_AFTER_DAYS} days ago and are marked with the year they were checked.`}
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {IDLE_EXPLAINERS.map((item) => {
          const matching = sandboxes.filter((s) => s.lifecycle?.idleBilling === item.id);
          const metered = matching.filter((s) => billingShape(s) === "metered").length;
          const other = matching.length - metered;
          const active = idleFilter === item.id;
          return (
            <button
              aria-pressed={active}
              className={`cursor-pointer rounded-[14px] border p-3.5 text-left transition-colors ${
                active
                  ? "border-[#6D4DFF] bg-[#1A1E32]"
                  : "border-[#262C4A] bg-[#0F1324] hover:border-[#3A4370]"
              }`}
              key={item.id}
              onClick={() => chooseIdle(active ? "all" : item.id)}
              type="button"
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-semibold text-[#F2F3FA] text-[12px]">{item.title}</span>
                <span className="font-mono text-[#A78BFA] text-[11px] tabular-nums">
                  {matching.length}
                </span>
              </span>
              <span className="mt-1 block text-[#8289AA] text-[11px] leading-[15px]">
                {item.line}
              </span>
              <span className="mt-1.5 block border-[#262C4A] border-t pt-1.5 text-[#8289AA] text-[10px] leading-[14px]">
                {metered} metered · {other} self-hosted, seat or licence
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {IDLE_FILTERS.map((option) => {
            const count =
              option.id === "all"
                ? ranked.length
                : ranked.filter((s) => s.lifecycle?.idleBilling === option.id).length;
            const active = idleFilter === option.id;
            return (
              <button
                aria-pressed={active}
                className={`cursor-pointer rounded-full border px-2.5 py-1 font-medium text-[11px] transition-colors ${
                  active
                    ? "border-[#6D4DFF] bg-[#1E183E] text-[#C4B5FD]"
                    : "border-[#262C4A] bg-[#0F1324] text-[#9BA1BE] hover:border-[#3A4370] hover:text-[#F2F3FA]"
                }`}
                key={option.id}
                onClick={() => chooseIdle(option.id)}
                type="button"
              >
                {option.label}
                <span className="ml-1 font-mono text-[10px] tabular-nums opacity-70">{count}</span>
              </button>
            );
          })}
          <div className="mt-1 flex w-full flex-wrap items-center gap-1.5 border-[#262C4A] border-t pt-2">
            <span className="text-[#8289AA] text-[10px] uppercase tracking-[0.06em]">Rate</span>
            {SHAPE_FILTERS.map((option) => {
              const count =
                option.id === "all"
                  ? ranked.length
                  : ranked.filter((s) => billingShape(s) === option.id).length;
              const active = shapeFilter === option.id;
              return (
                <button
                  aria-pressed={active}
                  className={`cursor-pointer rounded border px-2 py-0.5 font-medium text-[10px] transition-colors ${
                    active
                      ? "border-[#6D4DFF] bg-[#1E183E] text-[#C4B5FD]"
                      : "border-[#262C4A] bg-[#0F1324] text-[#9BA1BE] hover:border-[#3A4370] hover:text-[#F2F3FA]"
                  }`}
                  key={option.id}
                  onClick={() => chooseShape(option.id)}
                  type="button"
                >
                  {option.label}
                  <span className="ml-1 font-mono tabular-nums opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search
            aria-hidden="true"
            className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#8289AA]"
          />
          <input
            aria-label="Filter matrix by name or description"
            className="w-full rounded-[10px] border border-[#262C4A] bg-[#0F1324] py-1.5 pr-8 pl-8 text-[#F2F3FA] text-xs placeholder:text-[#8289AA] hover:border-[#3A4370] focus:border-[#6D4DFF] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by name or description..."
            type="search"
            value={query}
          />
          {query && (
            <button
              aria-label="Clear filter"
              className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer p-0.5 text-[#8289AA] hover:text-[#F2F3FA]"
              onClick={() => setQuery("")}
              type="button"
            >
              <X aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <button
          className="shrink-0 cursor-pointer rounded-[10px] border border-[#262C4A] bg-[#0F1324] px-2.5 py-1.5 font-medium text-[11px] text-[#9BA1BE] transition-colors hover:border-[#3A4370] hover:text-[#F2F3FA]"
          onClick={exportRows}
          type="button"
        >
          Export CSV
        </button>
      </div>

      {visible.length === 0 && (
        <p className="rounded-[14px] border border-[#262C4A] bg-[#131625] p-6 text-center text-[#9BA1BE] text-xs">
          No listing matches that filter. Widen the idle billing choice or clear the name filter.
        </p>
      )}

      {visible.length > 0 && (
        <>
          {/* Phones get cards: the full column set does not fit, and horizontal
          scrolling hides the axis this page exists to compare. */}
          <div className="space-y-2 md:hidden">
            {shown.map((sandbox) => (
              <Link
                className="block rounded-[12px] border border-[#262C4A] bg-[#131625] p-3 transition-colors hover:border-[#3A4370]"
                key={sandbox.id}
                to={`/sandbox/${sandbox.slug}`}
              >
                <div className="flex items-center gap-2">
                  <BrandLogo
                    logoBg={sandbox.logoBg}
                    logoTextColor={sandbox.logoTextColor}
                    name={sandbox.name}
                    size="sm"
                    slug={sandbox.slug}
                  />
                  <span className="min-w-0 flex-1 truncate font-semibold text-[#F2F3FA] text-xs">
                    {sandbox.name}
                  </span>
                  {idleBadge(sandbox)}
                </div>
                <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-[11px]">
                  <dt className="text-[#8289AA]">Isolation</dt>
                  <dd className="text-right text-[#C7CCE2]">{runtimeLabel(sandbox)}</dd>
                  {sandbox.capabilities.mobile === true && (
                    <>
                      <dt className="text-[#8289AA]">Mobile OS</dt>
                      <dd className="text-right text-[#C7CCE2]">
                        {sandbox.techSpecs?.operatingSystems?.join(", ") ?? "Not published"}
                      </dd>
                    </>
                  )}
                  <dt className="text-[#8289AA]">Kept on pause</dt>
                  <dd className="text-right text-[#C7CCE2]">
                    {PAUSE_LABELS[sandbox.lifecycle?.pauseRetains ?? ""] ?? "—"}
                  </dd>
                  <dt className="text-[#8289AA]">Boot</dt>
                  <dd className="text-right font-mono text-[#C7CCE2]">
                    {sandbox.techSpecs?.bootTime ?? "—"}
                  </dd>
                  <dt className="text-[#8289AA]">Resume</dt>
                  <dd className="text-right text-[#C7CCE2]">
                    {sandbox.lifecycle?.resumeTime ?? "—"}
                  </dd>
                  {billingShape(sandbox) !== "metered" &&
                    billingShape(sandbox) !== "unpublished" && (
                      <>
                        <dt className="text-[#8289AA]">Rate shape</dt>
                        <dd
                          className="text-right text-[#C7CCE2]"
                          title="Not a per-hour postpaid rate"
                        >
                          {BILLING_SHAPE_LABEL[billingShape(sandbox)]}
                        </dd>
                      </>
                    )}
                </dl>
              </Link>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-[14px] border border-[#262C4A] bg-[#0F1324] md:block 2xl:overflow-visible">
            <table className="w-full min-w-[1080px] border-collapse text-left text-xs">
              <thead>
                <tr className="border-[#262C4A] border-b">
                  {COLUMNS.map((column) => (
                    <th
                      className="z-10 whitespace-nowrap border-[#262C4A] border-b bg-[#151A35] px-2.5 py-2.5 font-semibold text-[#9BA1BE] text-[11px] uppercase tracking-[0.06em] 2xl:sticky 2xl:top-[67px]"
                      key={column}
                      scope="col"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((sandbox) => (
                  <tr
                    className="border-[#262C4A]/60 border-b transition-colors last:border-b-0 hover:bg-[#151A35]/50"
                    key={sandbox.id}
                  >
                    <th className="px-2.5 py-2.5 text-left font-normal" scope="row">
                      <Link
                        className="flex items-center gap-2 font-semibold text-[#F2F3FA] hover:text-[#A78BFA]"
                        to={`/sandbox/${sandbox.slug}`}
                      >
                        <BrandLogo
                          logoBg={sandbox.logoBg}
                          logoTextColor={sandbox.logoTextColor}
                          name={sandbox.name}
                          size="sm"
                          slug={sandbox.slug}
                        />
                        <span className="whitespace-nowrap">{sandbox.name}</span>
                      </Link>
                    </th>
                    <td
                      className="max-w-[170px] truncate px-2.5 py-2.5 text-[#C7CCE2]"
                      title={runtimeLabel(sandbox)}
                    >
                      {runtimeLabel(sandbox)}
                    </td>
                    <td className="max-w-[150px] truncate px-2.5 py-2.5 text-[#C7CCE2]">
                      {sandbox.capabilities.mobile === true ? (
                        sandbox.techSpecs?.operatingSystems?.join(", ") || "Not published"
                      ) : (
                        <span className="text-[#8289AA]">—</span>
                      )}
                    </td>
                    <td className="max-w-[170px] truncate px-2.5 py-2.5 font-mono text-[#C7CCE2]">
                      {sandbox.techSpecs?.bootTime ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-2.5">{idleBadge(sandbox)}</td>
                    <td className="whitespace-nowrap px-2.5 py-2.5 text-[#C7CCE2]">
                      {PAUSE_LABELS[sandbox.lifecycle?.pauseRetains ?? ""] ?? (
                        <span className="text-[#8289AA]">Not published</span>
                      )}
                    </td>
                    <td className="max-w-[140px] truncate px-2.5 py-2.5 text-[#C7CCE2]">
                      {sandbox.lifecycle?.resumeTime ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-2.5">
                      {sandbox.pricing.freeTier ? (
                        <span className="text-[#86EFAC]">Yes</span>
                      ) : (
                        <span className="text-[#8289AA]">No</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-2.5">{pricingBadge(sandbox)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visible.length > rowLimit && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                className="cursor-pointer rounded-full border border-[#262C4A] bg-[#131625] px-5 py-2 font-medium text-[#9BA1BE] text-xs tabular-nums transition-colors hover:border-[#3A4370] hover:bg-[#1A1E32] hover:text-[#F2F3FA]"
                onClick={() =>
                  setRowLimit((limit) => Math.min(limit + MATRIX_PAGE_SIZE, visible.length))
                }
                type="button"
              >
                Load more rows ({visible.length - rowLimit} remaining)
              </button>
              <button
                className="cursor-pointer rounded-full px-3 py-2 font-medium text-[#A78BFA] text-xs tabular-nums transition-colors hover:text-[#C4B5FD]"
                onClick={() => setRowLimit(visible.length)}
                type="button"
              >
                Show all {visible.length}
              </button>
            </div>
          )}
        </>
      )}

      <p className="text-[#8289AA] text-[11px]">
        Sorted by idle billing: zero idle cost first, then usage-metered, then wall-clock. Rows
        without published lifecycle data come last. Chips name a rate that is not a per-hour bill:{" "}
        <span className="rounded border border-[#3A4370] bg-[#151A35] px-1 py-0.5 text-[9px] uppercase tracking-[0.04em]">
          seat
        </span>{" "}
        monthly concurrency,{" "}
        <span className="rounded border border-[#3A4370] bg-[#151A35] px-1 py-0.5 text-[9px] uppercase tracking-[0.04em]">
          byo
        </span>{" "}
        machines you already pay for,{" "}
        <span className="rounded border border-[#3A4370] bg-[#151A35] px-1 py-0.5 text-[9px] uppercase tracking-[0.04em]">
          licence
        </span>{" "}
        software with no per-sandbox rate.{" "}
        <Link className="text-[#A78BFA] hover:text-[#C4B5FD]" to="/benchmarks">
          Ranked cold-start times
        </Link>{" "}
        ·{" "}
        <Link className="text-[#A78BFA] hover:text-[#C4B5FD]" to="/about#data-policy">
          How we source this data
        </Link>
      </p>
    </div>
  );
}
