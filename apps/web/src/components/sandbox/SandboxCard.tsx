import { ArrowRight, Check, Gauge, Plus, Star } from "lucide-react";
import { parseBootTimeMs, resumeLatencyMs } from "../../lib/filter";
import { ISOLATION_BOUNDARY_LABEL, isolationBoundary } from "../../lib/isolation";
import { Link } from "../../lib/router";
import { useSandboxes } from "../../lib/sandboxContext";
import type { Sandbox } from "../../types/sandbox";
import { BrandLogo } from "./BrandLogo";

interface SandboxCardProps {
  featuredStyle?: boolean;
  sandbox: Sandbox;
  viewMode?: "grid" | "list";
}

/** Lifecycle badge: archived listings must not look merely "inactive". */
const STATUS_BADGE: Record<Sandbox["status"], { label: string; className: string }> = {
  active: { label: "Active", className: "bg-[#123524] text-[#4ADE80]" },
  beta: { label: "Beta", className: "bg-[#2A2110] text-[#FBBF24]" },
  deprecated: {
    label: "Deprecated",
    className: "bg-[#2A1114] text-[#FB7185]",
  },
  unknown: { label: "Unconfirmed", className: "bg-[#1A1E32] text-[#8289AA]" },
};

const PRICING_NOTE = {
  quote_only: {
    label: "Quote only",
    className: "border-[#FBBF24]/30 bg-[#2A2110] text-[#FBBF24]",
    title: "No published rate card: the vendor prices this by quote",
  },
  unverified: {
    label: "Price unverified",
    className: "border-[#F87171]/25 bg-[#2A1114] text-[#FCA5A5]",
    title: "Price has not been confirmed against a vendor source",
  },
} as const;

const PAUSE_SHORT: Record<string, string> = {
  memory: "memory + processes",
  disk: "disk only",
  none: "nothing",
};

function formatBoot(ms: number) {
  return ms < 1000 ? `${Math.round(ms)}ms` : `${(ms / 1000).toFixed(ms < 10_000 ? 1 : 0)}s`;
}

/**
 * Resume strings often combine a warm and a cold figure ("25ms from memory,
 * 900ms cold"), so take the first published number rather than the last, and
 * skip prose with no number in it.
 */
function formatStars(stars?: number) {
  if (!stars) {
    return null;
  }
  return stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars.toString();
}

function getSubtitle(sandbox: Sandbox) {
  if (sandbox.slug === "firecracker") {
    return "MicroVM runtime from AWS";
  }
  if (sandbox.slug === "cloud-hypervisor") {
    return "Rust-based hypervisor";
  }
  if (sandbox.slug === "browserbase") {
    return "Run browsers at scale";
  }
  if (sandbox.slug === "kasm") {
    return "Open-source desktop sandbox";
  }
  if (sandbox.slug === "cua") {
    return "Computer Use for agents";
  }
  if (sandbox.slug === "daytona") {
    return "Full computer for agents";
  }
  if (sandbox.slug === "omarchy") {
    return "Arch Linux OS & digital twins";
  }
  if (sandbox.slug === "mobilebox") {
    return "Disposable cloud Android & iOS";
  }
  if (sandbox.runtime.firecracker) {
    return "Firecracker MicroVM";
  }
  if (sandbox.runtime.docker) {
    return "Docker / Container";
  }
  return sandbox.categories[0] || "Cloud Sandbox";
}

/**
 * The card already prints one category as the subtitle when no runtime is
 * known; repeating it as a chip wastes the space a second label could use.
 */
function cardCategories(sandbox: Sandbox) {
  const subtitle = getSubtitle(sandbox);
  return sandbox.categories.filter((category) => category !== subtitle);
}

function CompareButton({
  inCompare,
  name,
  onToggle,
  compact = false,
}: {
  inCompare: boolean;
  name: string;
  onToggle: () => void;
  compact?: boolean;
}) {
  const label = inCompare ? `Remove ${name} from compare` : `Add ${name} to compare`;

  if (compact) {
    return (
      <button
        aria-label={label}
        aria-pressed={inCompare}
        className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border transition-colors active:scale-[0.96] ${
          inCompare
            ? "border-[#6D4DFF]/60 bg-[#6D4DFF]/25 text-[#A78BFA]"
            : "border-[#262C4A] bg-[#1A1E32] text-[#8289AA] hover:border-[#3A4370] hover:text-[#F2F3FA]"
        }`}
        onClick={onToggle}
        title={label}
        type="button"
      >
        <span className="relative inline-flex h-3.5 w-3.5">
          <Plus
            aria-hidden="true"
            className={`absolute inset-0 h-3.5 w-3.5 transition-[opacity,transform] duration-200 ${
              inCompare ? "scale-75 opacity-0" : "scale-100 opacity-100"
            }`}
          />
          <Check
            aria-hidden="true"
            className={`absolute inset-0 h-3.5 w-3.5 transition-[opacity,transform] duration-200 ${
              inCompare ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          />
        </span>
      </button>
    );
  }

  return (
    <button
      aria-label={label}
      aria-pressed={inCompare}
      className={`flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-xs transition-colors active:scale-[0.96] ${
        inCompare
          ? "border-[#6D4DFF]/60 bg-[#6D4DFF]/25 text-[#A78BFA]"
          : "border-[#262C4A] bg-[#1A1E32] text-[#9BA1BE] hover:border-[#3A4370] hover:text-[#F2F3FA]"
      }`}
      onClick={onToggle}
      type="button"
    >
      <span className="relative inline-flex h-3.5 w-3.5">
        <Plus
          aria-hidden="true"
          className={`absolute inset-0 h-3.5 w-3.5 transition-[opacity,transform] duration-200 ${
            inCompare ? "scale-75 opacity-0" : "scale-100 opacity-100"
          }`}
        />
        <Check
          aria-hidden="true"
          className={`absolute inset-0 h-3.5 w-3.5 transition-[opacity,transform] duration-200 ${
            inCompare ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
        />
      </span>
      <span>{inCompare ? "Comparing" : "Compare"}</span>
    </button>
  );
}

export function SandboxCard({
  sandbox,
  viewMode = "grid",
  featuredStyle = false,
}: SandboxCardProps) {
  const { getSandboxBySlug, isInCompare, toggleCompare, isFavorite, toggleFavorite } =
    useSandboxes();
  const inCompare = isInCompare(sandbox.slug);
  const stars = formatStars(sandbox.githubStars);
  const rating = typeof sandbox.rating === "number" ? sandbox.rating : null;
  const bootMs = parseBootTimeMs(sandbox.techSpecs?.bootTime);
  const pauseKept = sandbox.lifecycle?.pauseRetains;
  // A pause that keeps nothing is not a resume, whatever latency the vendor
  // measured, so only pair the figure with a real retained state.
  const resumeMs = resumeLatencyMs(sandbox);
  // A card that shows no price should say why: quote-only and unverified
  // listings are the ones a reader must not assume are cheap.
  const pricingNote =
    sandbox.pricing.transparency === "quote_only" || sandbox.pricing.transparency === "unverified"
      ? PRICING_NOTE[sandbox.pricing.transparency]
      : null;
  const onToggleCompare = () => toggleCompare(sandbox.slug);
  // A dependency, not a competitor: say what this listing runs on.
  const builtOnBase = (sandbox.builtOn ?? [])
    .map((baseSlug) => getSandboxBySlug(baseSlug))
    .filter((base): base is NonNullable<typeof base> => Boolean(base))
    .at(0);
  const boundary = isolationBoundary(sandbox);

  if (viewMode === "list") {
    return (
      <div className="group relative flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#262C4A]/70 bg-[#131625] shadow-[0_1px_2px_rgba(0,0,0,0.35)] p-4 transition-colors duration-150 hover:border-[#3A4370] hover:bg-[#171B2E] md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3.5 sm:items-center">
          <BrandLogo
            logoBg={sandbox.logoBg}
            logoTextColor={sandbox.logoTextColor}
            name={sandbox.name}
            size="md"
            slug={sandbox.slug}
          />

          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-[#F2F3FA] text-[15px]">
                <Link
                  className="transition-colors hover:text-[#A78BFA]"
                  to={`/sandbox/${sandbox.slug}`}
                >
                  {sandbox.name}
                </Link>
              </h3>
              <span
                className={`rounded-full px-2.5 py-0.5 font-medium text-[11px] ${STATUS_BADGE[sandbox.status].className}`}
              >
                {STATUS_BADGE[sandbox.status].label}
              </span>
              {!!sandbox.openSource && (
                <span className="text-[#9BA1BE] text-[11px]">Open Source</span>
              )}
            </div>
            <p className="line-clamp-2 text-[#9BA1BE] text-xs">{sandbox.description}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              {cardCategories(sandbox)
                .slice(0, 2)
                .map((cat) => (
                  <span
                    className="rounded-[10px] bg-[#1A1E32] px-2 py-0.5 text-[#9BA1BE] text-[11px]"
                    key={cat}
                  >
                    {cat}
                  </span>
                ))}
              {!!sandbox.capabilities.mobile && !sandbox.categories.includes("Mobile") && (
                <span className="rounded-[10px] bg-[#1A1E32] px-2 py-0.5 text-[#A78BFA] text-[11px]">
                  Mobile
                </span>
              )}
              {boundary !== "unknown" && (
                <span
                  className={`rounded-[10px] border px-2 py-0.5 text-[11px] ${
                    boundary === "hardware"
                      ? "border-[#065F46]/60 bg-[#0C2A20] text-[#6EE7B7]"
                      : "border-[#262C4A] bg-[#1A1E32] text-[#9BA1BE]"
                  }`}
                  title="Containment boundary derived from the documented backend"
                >
                  {ISOLATION_BOUNDARY_LABEL[boundary]}
                </span>
              )}
              {!!builtOnBase && (
                <span
                  className="rounded-[10px] border border-[#6D4DFF]/40 bg-[#1E183E] px-2 py-0.5 text-[#C4B5FD] text-[11px]"
                  title={`Runs on ${builtOnBase.name}, so its isolation is that product's isolation`}
                >
                  on {builtOnBase.name}
                </span>
              )}
              {!!pricingNote && (
                <span
                  className={`rounded-[10px] border px-2 py-0.5 text-[11px] ${pricingNote.className}`}
                  title={pricingNote.title}
                >
                  {pricingNote.label}
                </span>
              )}
              {stars ? (
                <span className="flex items-center gap-1 font-mono text-[#9BA1BE] text-[11px] tabular-nums">
                  <Star aria-hidden="true" className="h-3 w-3 fill-[#FBBF24] text-[#FBBF24]" />
                  {stars}
                </span>
              ) : null}
              {rating === null ? null : (
                <span
                  className="flex items-center gap-1 font-mono text-[#A78BFA] text-[11px] tabular-nums"
                  title="Editorial rating out of 5"
                >
                  <Gauge aria-hidden="true" className="h-3 w-3" />
                  {rating.toFixed(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 self-end md:self-start md:pt-1">
          <CompareButton inCompare={inCompare} name={sandbox.name} onToggle={onToggleCompare} />

          <Link
            className="-my-1 flex shrink-0 items-center gap-1 whitespace-nowrap py-1 font-medium text-[#F2F3FA] text-xs transition-colors hover:text-[#A78BFA]"
            to={`/sandbox/${sandbox.slug}`}
          >
            <span>View details</span>
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Featured card: larger type, one row of condensed metadata.
  if (featuredStyle) {
    return (
      <div className="group relative flex flex-col justify-between rounded-2xl border border-[#262C4A]/70 bg-[#131625] shadow-[0_1px_2px_rgba(0,0,0,0.35)] p-[18px] transition-colors duration-150 hover:border-[#3A4370] hover:bg-[#171B2E]">
        <div>
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <BrandLogo
                logoBg={sandbox.logoBg}
                logoTextColor={sandbox.logoTextColor}
                name={sandbox.name}
                size="sm"
                slug={sandbox.slug}
              />
              <h3 className="truncate font-bold text-[#F2F3FA] text-[20px] leading-tight">
                <Link
                  className="transition-colors group-hover:text-[#A78BFA]"
                  to={`/sandbox/${sandbox.slug}`}
                >
                  {sandbox.name}
                </Link>
              </h3>
            </div>

            <span
              className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 font-medium text-[11px] ${STATUS_BADGE[sandbox.status].className}`}
            >
              {STATUS_BADGE[sandbox.status].label}
            </span>
          </div>

          <p className="mb-3.5 line-clamp-2 text-[#9BA1BE] text-[13px] leading-[20px]">
            {sandbox.description}
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {cardCategories(sandbox)
              .slice(0, 2)
              .map((cat) => (
                <span
                  className="whitespace-nowrap rounded-[10px] bg-[#1A1E32] px-2.5 py-1 text-[#9BA1BE] text-[11px]"
                  key={cat}
                >
                  {cat}
                </span>
              ))}
            {!!sandbox.capabilities.mobile && !sandbox.categories.includes("Mobile") && (
              <span className="whitespace-nowrap rounded-[10px] bg-[#1A1E32] px-2.5 py-1 text-[#A78BFA] text-[11px]">
                Mobile
              </span>
            )}
            {!!builtOnBase && (
              <span
                className="whitespace-nowrap rounded-[10px] border border-[#6D4DFF]/40 bg-[#1E183E] px-2.5 py-1 text-[#C4B5FD] text-[11px]"
                title={`Runs on ${builtOnBase.name}, so its isolation is that product's isolation`}
              >
                on {builtOnBase.name}
              </span>
            )}
            {!!pricingNote && (
              <span
                className={`whitespace-nowrap rounded-[10px] border px-2.5 py-1 text-[11px] ${pricingNote.className}`}
                title={pricingNote.title}
              >
                {pricingNote.label}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <Link
            className="-my-1 inline-flex items-center gap-1 py-1 font-medium text-[#F2F3FA] text-[13px] transition-colors hover:text-[#A78BFA]"
            to={`/sandbox/${sandbox.slug}`}
          >
            <span>View details</span>
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </Link>

          <CompareButton
            compact
            inCompare={inCompare}
            name={sandbox.name}
            onToggle={onToggleCompare}
          />
        </div>
      </div>
    );
  }

  // Standard grid card.
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-[#262C4A]/70 bg-[#131625] shadow-[0_1px_2px_rgba(0,0,0,0.35)] p-4 transition-colors duration-150 hover:border-[#3A4370] hover:bg-[#171B2E]">
      <div>
        <div className="mb-2.5 flex items-start justify-between gap-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <BrandLogo
              logoBg={sandbox.logoBg}
              logoTextColor={sandbox.logoTextColor}
              name={sandbox.name}
              size="sm"
              slug={sandbox.slug}
            />
            <div className="min-w-0">
              <h3 className="truncate font-bold text-[#F2F3FA] text-[15px]">
                <Link
                  className="transition-colors group-hover:text-[#A78BFA]"
                  to={`/sandbox/${sandbox.slug}`}
                >
                  {sandbox.name}
                </Link>
              </h3>
              <div className="truncate text-[#8289AA] text-[11px]">{getSubtitle(sandbox)}</div>
            </div>
          </div>

          <span
            className={`shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 font-medium text-[10px] ${STATUS_BADGE[sandbox.status].className}`}
          >
            {STATUS_BADGE[sandbox.status].label}
          </span>
        </div>

        <div className="mt-2.5 mb-2 flex flex-wrap gap-2">
          {!!sandbox.openSource && (
            <span className="whitespace-nowrap rounded-[10px] bg-[#1A1E32] px-2.5 py-1 text-[#9BA1BE] text-[11px]">
              Open Source
            </span>
          )}
          {cardCategories(sandbox)
            .slice(0, 1)
            .map((cat) => (
              <span
                className="whitespace-nowrap rounded-[10px] bg-[#1A1E32] px-2.5 py-1 text-[#9BA1BE] text-[11px]"
                key={cat}
              >
                {cat}
              </span>
            ))}
          {!!sandbox.capabilities.mobile && !sandbox.categories.includes("Mobile") && (
            <span className="whitespace-nowrap rounded-[10px] bg-[#1A1E32] px-2.5 py-1 text-[#A78BFA] text-[11px]">
              Mobile
            </span>
          )}
          {!!builtOnBase && (
            <span
              className="whitespace-nowrap rounded-[10px] border border-[#6D4DFF]/40 bg-[#1E183E] px-2.5 py-1 text-[#C4B5FD] text-[11px]"
              title={`Runs on ${builtOnBase.name}, so its isolation is that product's isolation`}
            >
              on {builtOnBase.name}
            </span>
          )}
          {!!pricingNote && (
            <span
              className={`whitespace-nowrap rounded-[10px] border px-2.5 py-1 text-[11px] ${pricingNote.className}`}
              title={pricingNote.title}
            >
              {pricingNote.label}
            </span>
          )}
          {sandbox.lifecycle?.idleBilling === "idle_free" && (
            <span className="whitespace-nowrap rounded-[10px] border border-[#4ADE80]/20 bg-[#123524] px-2.5 py-1 text-[#86EFAC] text-[11px]">
              Idle-free
            </span>
          )}
          {/* The inverse of Idle-free matters just as much to a buyer: a
              monthly or hourly meter keeps running while nothing is used. */}
          {sandbox.lifecycle?.idleBilling === "wall_clock" && (
            <span
              className="whitespace-nowrap rounded-[10px] border border-[#F59E0B]/25 bg-[#2E2410] px-2.5 py-1 text-[#FCD34D] text-[11px]"
              title="Billed while idle, paused or stopped"
            >
              Bills idle
            </span>
          )}
        </div>

        {(Number.isFinite(bootMs) || Number.isFinite(resumeMs) || pauseKept) && (
          <p className="mb-3.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[#8289AA] text-[10px] tabular-nums">
            {Number.isFinite(bootMs) && <span>boot {formatBoot(bootMs)}</span>}
            {Number.isFinite(resumeMs) && (
              <span title="Published resume latency">resume {formatBoot(resumeMs)}</span>
            )}
            {!!pauseKept && <span>keeps {PAUSE_SHORT[pauseKept] ?? pauseKept}</span>}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between border-[#262C4A]/60 border-t pt-2 text-xs">
        <Link
          className="-my-1 inline-flex items-center gap-1 py-1 font-medium text-[#9BA1BE] transition-colors group-hover:text-[#F2F3FA]"
          to={`/sandbox/${sandbox.slug}`}
        >
          <span>View details</span>
          <ArrowRight
            aria-hidden="true"
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
          />
        </Link>

        <div className="flex items-center gap-2">
          {rating === null ? null : (
            <span
              className="flex items-center gap-1 font-mono text-[#A78BFA] text-[11px] tabular-nums"
              title="Editorial rating out of 5"
            >
              <Gauge aria-hidden="true" className="h-3 w-3" />
              {rating.toFixed(1)}
            </span>
          )}
          <button
            aria-label={isFavorite(sandbox.slug) ? "Remove from favorites" : "Add to favorites"}
            className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border transition-colors active:scale-[0.96] ${
              isFavorite(sandbox.slug)
                ? "border-[#FBBF24]/60 bg-[#FBBF24]/20 text-[#FBBF24]"
                : "border-[#262C4A] bg-[#1A1E32] text-[#8289AA] hover:border-[#3A4370] hover:text-[#F2F3FA]"
            }`}
            onClick={() => toggleFavorite(sandbox.slug)}
            type="button"
          >
            <Star
              aria-hidden="true"
              className={`h-3.5 w-3.5 ${isFavorite(sandbox.slug) ? "fill-[#FBBF24]" : ""}`}
            />
          </button>
          {stars ? (
            <span className="flex items-center gap-1 font-mono text-[#9BA1BE] text-[12px] tabular-nums">
              <Star aria-hidden="true" className="h-3 w-3 fill-[#FBBF24] text-[#FBBF24]" />
              {stars}
            </span>
          ) : null}

          <CompareButton
            compact
            inCompare={inCompare}
            name={sandbox.name}
            onToggle={onToggleCompare}
          />
        </div>
      </div>
    </div>
  );
}
