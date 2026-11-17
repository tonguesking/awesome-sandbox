import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Copy,
  Cpu,
  ExternalLink,
  GitBranch,
  Globe,
  HelpCircle,
  Link2,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Star,
  Terminal,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import { BrandLogo } from "../components/sandbox/BrandLogo";
import { PRODUCT_TYPE_OPTIONS } from "../data/categories";
import { GUIDES } from "../data/guides";
import { REPO_LICENSES } from "../data/licenses";
import { isSelfReportedBootTime, isUnpublishedBootTime } from "../lib/bootTime";
import { copyText } from "../lib/clipboard";
import { parseBootTimeMs } from "../lib/filter";
import { formatVerifiedOn, isStaleVerification } from "../lib/freshness";
import { ISOLATION_BOUNDARY_LABEL, isolationBoundary } from "../lib/isolation";
import { Link, useRouter } from "../lib/router";
import { useSandboxes } from "../lib/sandboxContext";
import type { SandboxStatus } from "../types/sandbox";

type CopyState = "idle" | "copied" | "failed";

// Announced politely after a copy attempt; empty means "say nothing".
const COPY_FEEDBACK: Record<CopyState, string> = {
  idle: "",
  copied: "Code copied to clipboard",
  failed: "Could not copy code. Select the snippet and copy manually.",
};

// Backends that are worth surfacing even when a product also sets a runtime
// flag: a gVisor listing that also ships Seatbelt is not "gVisor only".
const OTHER_PLATFORM_MARKER =
  /seatbelt|appcontainer|bubblewrap|lxc|wsl|virtualization\.framework|hyper-v|linux vm/i;

const STATUS_BADGES: Record<
  Exclude<SandboxStatus, "unknown">,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: "text-[#4ADE80] bg-[#123524] border-[#4ADE80]/25",
  },
  beta: {
    label: "Beta",
    className: "text-[#A78BFA] bg-[#1E183E] border-[#6D4DFF]/45",
  },
  deprecated: {
    label: "Deprecated",
    className: "text-[#FBBF24] bg-[#2A2210] border-[#FBBF24]/30",
  },
};

const IDLE_BILLING_LABELS: Record<string, string> = {
  idle_free: "Zero cost while idle",
  usage_metered: "Usage-metered",
  wall_clock: "Wall-clock billing",
};

const PAUSE_STATE_LABELS: Record<string, string> = {
  memory: "Memory + processes retained",
  disk: "Disk only",
  none: "Nothing survives",
};

const PRICING_TRANSPARENCY = {
  official_verified: {
    label: "Official Verified",
    icon: ShieldCheck,
    className: "text-[#4ADE80] bg-[#123524] border-[#4ADE80]/25",
  },
  unverified: {
    label: "Pending Audit",
    icon: ShieldAlert,
    className: "text-[#FBBF24] bg-[#2A2210] border-[#FBBF24]/30",
  },
  quote_only: {
    label: "Quote Only",
    icon: ShieldAlert,
    className: "text-[#FBBF24] bg-[#2A2210] border-[#FBBF24]/30",
  },
} as const;

function CapabilityStatus({ value }: { value?: boolean | null }) {
  if (value === true) {
    return (
      <span className="inline-flex items-center gap-1 font-medium text-[#4ADE80] text-xs">
        <Check aria-hidden="true" className="h-4 w-4" />
        <span>Supported</span>
      </span>
    );
  }

  if (value === false) {
    return (
      <span className="inline-flex items-center gap-1 font-medium text-[#8289AA] text-xs">
        <X aria-hidden="true" className="h-4 w-4" />
        <span>Not supported</span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1 font-medium text-[#FBBF24] text-xs"
      title="Not officially specified"
    >
      <HelpCircle aria-hidden="true" className="h-3.5 w-3.5" />
      <span>Unknown</span>
    </span>
  );
}

/** Data is written in Markdown, but this page renders plain text: turn paired
 *  backticks into real inline code instead of showing the tick characters. */
function InlineText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("`") && part.endsWith("`") && part.length > 2 ? (
          <code
            className="rounded bg-[#262C4A]/70 px-1 py-0.5 font-mono text-[#C4B5FD] text-[0.92em]"
            key={`${index}-${part}`}
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={`${index}-${part}`}>{part}</span>
        ),
      )}
    </>
  );
}

function SpecRow({
  label,
  value,
  mono = false,
  tone,
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: string;
}) {
  // Short values read fine on the label's baseline; anything that wraps should
  // stack, otherwise a right-aligned paragraph turns into a ragged block.
  const stacked = value.length > 40;
  return (
    <div
      className={
        stacked ? "flex flex-col gap-1 py-2.5" : "flex items-center justify-between gap-4 py-2.5"
      }
    >
      <dt className="text-[#9BA1BE]">{label}</dt>
      <dd
        className={`${stacked ? "leading-normal" : "max-w-[64%] text-right"} ${
          mono ? "font-mono font-semibold" : "font-medium"
        } ${tone ?? "text-[#F2F3FA]"}`}
      >
        <InlineText text={value} />
      </dd>
    </div>
  );
}

function runtimeLabel(runtime: {
  firecracker?: boolean | null;
  docker?: boolean | null;
  gvisor?: boolean | null;
  other?: string[];
}) {
  // A product that supports several runtimes should not be reduced to whichever flag was checked first.
  const flags = [
    runtime.firecracker && "Firecracker MicroVM",
    runtime.docker && "Docker / Container",
    runtime.gvisor && "gVisor Kernel",
  ].filter((label): label is string => Boolean(label));

  if (flags.length > 1) {
    return runtime.other?.[0] ?? flags.join(" + ");
  }
  if (flags.length === 1) {
    // Some products set one flag for the headline backend but ship several (for example gVisor on
    // Linux plus Seatbelt and AppContainer elsewhere). Prefer the curated description when it names
    // another platform backend, so the detail page does not reduce the product to one OS.
    const other = runtime.other?.[0];
    if (other && OTHER_PLATFORM_MARKER.test(other)) {
      return other;
    }
    return flags[0];
  }
  return runtime.other?.[0] ?? "Unknown";
}

/**
 * The one-line summary hides everything the curation actually recorded about a runtime: the
 * preinstalled library set, the host hypervisor, the fallback isolation on other OSes. Those
 * bullets are the reason a buyer picks one sandbox over another, so the rest of them render
 * under the summary instead of staying in the data file.
 */
function runtimeDetails(runtime: {
  firecracker?: boolean | null;
  docker?: boolean | null;
  gvisor?: boolean | null;
  other?: string[];
}) {
  const shown = runtimeLabel(runtime);
  return (runtime.other ?? []).filter((detail) => detail !== shown);
}

export function SandboxDetailPage() {
  const { route } = useRouter();
  const { slug } = route.params;
  const { sandboxes, getSandboxBySlug, isInCompare, toggleCompare } = useSandboxes();
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [linkCopied, setLinkCopied] = useState<CopyState>("idle");

  const sandbox = getSandboxBySlug(slug);

  // Handlers are defined above the not-found return so the hook order never
  // changes between a missing slug and a real one.
  const sampleCode = sandbox?.sampleCode?.code;
  const compareSlug = sandbox?.slug;
  const handleCopyCode = useCallback(async () => {
    if (!sampleCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(sampleCode);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }

    window.setTimeout(() => setCopyState("idle"), 2000);
  }, [sampleCode]);
  const handleCompareToggle = useCallback(() => {
    if (compareSlug) {
      toggleCompare(compareSlug);
    }
  }, [compareSlug, toggleCompare]);

  if (!sandbox) {
    return (
      <div className="space-y-4 py-20 text-center">
        <h1 className="font-bold text-[#F2F3FA] text-xl">Sandbox not found</h1>
        <p className="text-[#9BA1BE] text-sm">
          The sandbox “{slug}” is not in the catalog. It may have been renamed or removed.
        </p>
        <Link
          className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#6D4DFF] px-4 py-2 font-semibold text-white text-xs transition-colors hover:bg-[#7B5EFF]"
          to="/explore"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Browse all sandboxes</span>
        </Link>
      </div>
    );
  }

  const inCompare = isInCompare(sandbox.slug);
  const statusBadge = sandbox.status === "unknown" ? null : STATUS_BADGES[sandbox.status];
  const transparency = PRICING_TRANSPARENCY[sandbox.pricing.transparency ?? "unverified"];
  const pricingStale = isStaleVerification(sandbox.pricing.verifiedAt);
  const TransparencyIcon = transparency.icon;
  const lifecycle = sandbox.lifecycle
    ? {
        idleBillingLabel:
          IDLE_BILLING_LABELS[sandbox.lifecycle.idleBilling ?? ""] ?? "Not published",
        pauseRetainsLabel:
          PAUSE_STATE_LABELS[sandbox.lifecycle.pauseRetains ?? ""] ?? "Not published",
      }
    : null;

  // Where this listing sits in the two rankings this directory exists for.
  const bootRows = sandboxes
    .map((item) => ({ ms: parseBootTimeMs(item.techSpecs?.bootTime), item }))
    .filter(
      (row) =>
        Number.isFinite(row.ms) &&
        !isUnpublishedBootTime(row.item.techSpecs?.bootTime) &&
        !isSelfReportedBootTime(row.item.techSpecs?.bootTime),
    )
    .sort((a, b) => a.ms - b.ms);
  const bootIndex = bootRows.findIndex((row) => row.item.slug === sandbox.slug);
  const bootIsSelfReported = isSelfReportedBootTime(sandbox.techSpecs?.bootTime);
  const containment = isolationBoundary(sandbox);
  const fasterPct =
    bootIndex >= 0 && bootRows.length > 1
      ? Math.round(((bootRows.length - 1 - bootIndex) / (bootRows.length - 1)) * 100)
      : null;
  const idleGroup = sandbox.lifecycle?.idleBilling;
  // Free self-hosted tools record "your own infrastructure" as the billing
  // unit. Printing that under a "Metered unit" heading reads like a vendor
  // meter, so the tile says plainly that no meter exists.
  const selfHostedBilling = /your own infrastructure/i.test(sandbox.pricing.billingUnit ?? "");
  const idlePeers = idleGroup
    ? sandboxes.filter((item) => item.lifecycle?.idleBilling === idleGroup).length
    : null;
  const idlePeerNote = (() => {
    if (!idlePeers) {
      return "Vendor does not sell idle time; runs on your hardware";
    }
    if (idleGroup === "idle_free") {
      return `${idlePeers} listings stay free while idle`;
    }
    if (idleGroup === "usage_metered") {
      return `${idlePeers} listings meter active runtime`;
    }
    return `${idlePeers} listings bill wall-clock while running`;
  })();

  const alternativesList = (sandbox.alternatives ?? [])
    .map((altSlug) => getSandboxBySlug(altSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  // Products this listing is built on: a dependency, not a competitor.
  const builtOnList = (sandbox.builtOn ?? [])
    .map((baseSlug) => getSandboxBySlug(baseSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  // Some listings name a technology that is not itself in the catalog
  // (Wasmer built on Wasmtime, Tart on Apple Virtualization.framework). Keep
  // those visible as text rather than dropping them on the floor.
  const builtOnNamed = (sandbox.builtOn ?? []).filter((baseSlug) => !getSandboxBySlug(baseSlug));

  // The reverse edge, so a base runtime can show what depends on it.
  const dependentsList = sandboxes.filter((item) => item.builtOn?.includes(sandbox.slug));

  const relatedGuidesList = GUIDES.filter(
    (guide) =>
      sandbox.relatedGuideIds?.includes(guide.id) || sandbox.relatedGuideIds?.includes(guide.slug),
  );

  return (
    <div className="space-y-10 pt-2 pb-16">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-[#9BA1BE] text-xs"
      >
        <Link className="transition-colors hover:text-[#F2F3FA]" to="/">
          Home
        </Link>
        <ChevronRight aria-hidden="true" className="h-3 w-3 text-[#8289AA]" />
        <Link className="transition-colors hover:text-[#F2F3FA]" to="/explore">
          Explore
        </Link>
        <ChevronRight aria-hidden="true" className="h-3 w-3 text-[#8289AA]" />
        <span className="max-w-[60vw] truncate font-medium text-[#F2F3FA]">{sandbox.name}</span>
      </nav>

      <section className="rounded-[14px] border border-[#262C4A] bg-[#131625] p-6 sm:p-8">
        {sandbox.status === "deprecated" && (
          <div className="mb-6 flex items-start gap-3 rounded-[10px] border border-[#FBBF24]/30 bg-[#2A2210] px-4 py-3">
            <ShieldAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#FBBF24]" />
            <p className="text-[#FDE68A] text-sm leading-relaxed">
              <span className="font-semibold">Archived listing.</span> This product is shut down or
              no longer maintained. Pricing, availability and support claims are historical; read
              the overview before relying on any figure here.
            </p>
          </div>
        )}
        <div className="flex flex-col items-start justify-between gap-6 border-[#262C4A] border-b pb-6 md:flex-row md:items-center">
          <div className="flex items-start gap-5 sm:items-center">
            <BrandLogo
              className="h-16 w-16 shrink-0 rounded-[14px]"
              logoBg={sandbox.logoBg}
              logoTextColor={sandbox.logoTextColor}
              name={sandbox.name}
              size="lg"
              slug={sandbox.slug}
            />

            <div className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-balance font-extrabold text-2xl text-[#F2F3FA] tracking-tight sm:text-3xl">
                  {sandbox.name}
                </h1>
                {!!statusBadge && (
                  <span
                    className={`rounded-full border px-2.5 py-0.5 font-semibold text-xs ${statusBadge.className}`}
                  >
                    {statusBadge.label}
                  </span>
                )}
                {!!sandbox.openSource && (
                  <span className="rounded-full border border-[#262C4A] bg-[#1A1E32] px-2.5 py-0.5 font-semibold text-[#C7CCE2] text-xs">
                    Open Source
                  </span>
                )}
                {REPO_LICENSES[sandbox.slug] ? (
                  <span
                    className="rounded-full border border-[#262C4A] bg-[#1A1E32] px-2.5 py-0.5 font-mono text-[#C7CCE2] text-xs"
                    title="SPDX identifier GitHub reports for the public repository; NOASSERTION means a LICENSE file GitHub could not map"
                  >
                    {REPO_LICENSES[sandbox.slug]}
                  </span>
                ) : null}
                {sandbox.githubStars ? (
                  <span className="flex items-center gap-1 rounded-full border border-[#262C4A] bg-[#1A1E32] px-2.5 py-0.5 font-mono text-[#C7CCE2] text-xs">
                    <Star
                      aria-hidden="true"
                      className="h-3.5 w-3.5 fill-[#FBBF24] text-[#FBBF24]"
                    />
                    {sandbox.githubStars.toLocaleString()} stars
                  </span>
                ) : null}
              </div>
              <p className="max-w-2xl text-[#C7CCE2] text-sm leading-relaxed">
                {sandbox.description}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
            <button
              aria-pressed={inCompare}
              className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border px-4 py-2 font-semibold text-xs transition-colors md:flex-none ${
                inCompare
                  ? "border-[#6D4DFF]/60 bg-[#6D4DFF]/30 text-[#A78BFA]"
                  : "border-[#262C4A] bg-[#1A1E32] text-[#F2F3FA] hover:border-[#3A4370] hover:bg-[#222742]"
              }`}
              onClick={handleCompareToggle}
              type="button"
            >
              <Scale aria-hidden="true" className="h-3.5 w-3.5 text-[#A78BFA]" />
              <span>{inCompare ? "In comparison tray" : "Add to compare"}</span>
            </button>

            <a
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] bg-[#6D4DFF] px-4 py-2 font-semibold text-white text-xs shadow-[0_2px_14px_rgba(109,77,255,0.35)] transition-colors hover:bg-[#7B5EFF] md:flex-none"
              href={sandbox.website}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>Visit website</span>
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-[#9BA1BE]">Categories</span>
            {sandbox.categories.map((category) => (
              <span
                className="rounded-md border border-[#262C4A] bg-[#1A1E32] px-2.5 py-0.5 font-medium text-[#C7CCE2] text-[11px]"
                key={category}
              >
                {category}
              </span>
            ))}
            <span className="ml-1 inline-flex items-center gap-2 whitespace-nowrap">
              <span className="font-medium text-[#9BA1BE]">Type</span>
              <span className="rounded-md border border-[#3730A3]/60 bg-[#161433] px-2.5 py-0.5 font-medium text-[#A5B4FC] text-[11px]">
                {PRODUCT_TYPE_OPTIONS.find((option) => option.id === sandbox.productType)?.label ??
                  sandbox.productType}
              </span>
            </span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <span className="font-medium text-[#9BA1BE]">Containment</span>
              <span
                className={`rounded-md border px-2.5 py-0.5 font-medium text-[11px] ${
                  containment === "hardware"
                    ? "border-[#065F46]/60 bg-[#0C2A20] text-[#6EE7B7]"
                    : containment === "unknown"
                      ? "border-[#262C4A] bg-[#131625] text-[#8289AA]"
                      : "border-[#262C4A] bg-[#1A1E32] text-[#C7CCE2]"
                }`}
                title="The boundary that actually contains the workload, derived from the documented runtime backend"
              >
                {ISOLATION_BOUNDARY_LABEL[containment]}
              </span>
            </span>
            {typeof sandbox.rating === "number" && (
              <span className="inline-flex items-center gap-2 whitespace-nowrap">
                <span className="font-medium text-[#9BA1BE]">Rating</span>
                <span
                  className="rounded-md border border-[#6D4DFF]/50 bg-[#1E183E] px-2.5 py-0.5 font-medium text-[#C4B5FD] text-[11px] tabular-nums"
                  title="Editorial rating out of 5"
                >
                  {sandbox.rating.toFixed(1)} / 5
                </span>
              </span>
            )}
          </div>

          {(builtOnList.length > 0 || builtOnNamed.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-[#9BA1BE]">Built on</span>
              {builtOnList.map((base) => (
                <Link
                  className="rounded-md border border-[#6D4DFF]/50 bg-[#1E183E] px-2.5 py-0.5 font-medium text-[#C4B5FD] text-[11px] transition-colors hover:border-[#6D4DFF] hover:text-[#E9E4FF]"
                  key={base.id}
                  to={`/sandbox/${base.slug}`}
                >
                  {base.name}
                </Link>
              ))}
              {builtOnNamed.map((name) => (
                <span
                  className="rounded-md border border-[#262C4A] bg-[#131625] px-2.5 py-0.5 font-medium text-[#9BA1BE] text-[11px]"
                  key={name}
                >
                  {name}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 text-[#9BA1BE]">
            {!!sandbox.documentation && (
              <a
                className="flex items-center gap-1 transition-colors hover:text-[#A78BFA]"
                href={sandbox.documentation}
                rel="noopener noreferrer"
                target="_blank"
              >
                <BookOpen aria-hidden="true" className="h-3.5 w-3.5" />
                {/* Some vendors publish specs and rates on the same page;
                    say so rather than printing two links to one URL. */}
                <span>
                  {sandbox.pricing.pricingUrl === sandbox.documentation ? "Docs & pricing" : "Docs"}
                </span>
              </a>
            )}
            {!!sandbox.github && (
              <a
                className="flex items-center gap-1 transition-colors hover:text-[#A78BFA]"
                href={sandbox.github}
                rel="noopener noreferrer"
                target="_blank"
              >
                <GitBranch aria-hidden="true" className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {sandbox.pricing.pricingUrl &&
              sandbox.pricing.pricingUrl !== sandbox.github &&
              sandbox.pricing.pricingUrl !== sandbox.documentation && (
                <a
                  className="flex items-center gap-1 transition-colors hover:text-[#A78BFA]"
                  href={sandbox.pricing.pricingUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Globe aria-hidden="true" className="h-3.5 w-3.5" />
                  {/* A repository is not a pricing page. Name it what it is, and do not repeat
                    the GitHub link that already sits beside it. */}
                  <span>
                    {sandbox.pricing.pricingUrl.includes("github.com")
                      ? "Pricing notes"
                      : "Pricing page"}
                  </span>
                </a>
              )}
            <button
              aria-live="polite"
              className="flex cursor-pointer items-center gap-1 transition-colors hover:text-[#A78BFA]"
              onClick={async () => {
                const copied = await copyText(window.location.href);
                setLinkCopied(copied ? "copied" : "failed");
                window.setTimeout(() => setLinkCopied("idle"), 2000);
              }}
              title="Copy a link to this listing"
              type="button"
            >
              {linkCopied === "copied" ? (
                <Check aria-hidden="true" className="h-3.5 w-3.5 text-[#4ADE80]" />
              ) : (
                <Link2 aria-hidden="true" className="h-3.5 w-3.5" />
              )}
              <span>
                {linkCopied === "copied"
                  ? "Copied"
                  : linkCopied === "failed"
                    ? "Copy failed"
                    : "Copy link"}
              </span>
            </button>
          </div>
        </div>
      </section>

      {(bootIndex >= 0 || bootIsSelfReported || idlePeers) && (
        <dl className="grid gap-3 sm:grid-cols-3">
          {bootIndex >= 0 && (
            <div className="rounded-[14px] border border-[#262C4A] bg-[#0F1324] p-3.5">
              <dt className="text-[#8289AA] text-[11px] uppercase tracking-[0.06em]">Boot rank</dt>
              <dd className="mt-1 font-extrabold font-mono text-[#F2F3FA] text-lg tabular-nums">
                #{bootIndex + 1}
                <span className="font-normal text-[#8289AA] text-xs"> / {bootRows.length}</span>
              </dd>
              <dd className="mt-0.5 text-[#8289AA] text-[11px]">
                {fasterPct === 0
                  ? "Slowest published cold start"
                  : `${fasterPct}% of published starts are slower`}
              </dd>
            </div>
          )}

          {bootIndex < 0 && bootIsSelfReported && (
            <div className="rounded-[14px] border border-[#262C4A] bg-[#0F1324] p-3.5">
              <dt className="text-[#8289AA] text-[11px] uppercase tracking-[0.06em]">Boot rank</dt>
              <dd className="mt-1 font-semibold text-[#C7CCE2] text-sm">Vendor claim</dd>
              <dd className="mt-0.5 text-[#8289AA] text-[11px]">
                Self-reported figure, not ranked against measured cold starts
              </dd>
            </div>
          )}

          {/* Without a measured boot figure the third slot would sit empty, so
              spend it on the billing unit — the number people compare next. */}
          {bootIndex < 0 && !bootIsSelfReported && (
            <div className="rounded-[14px] border border-[#262C4A] bg-[#0F1324] p-3.5">
              <dt className="text-[#8289AA] text-[11px] uppercase tracking-[0.06em]">
                {selfHostedBilling ? "Billing unit" : "Metered unit"}
              </dt>
              <dd className="mt-1 font-semibold text-[#F2F3FA] text-sm">
                {selfHostedBilling
                  ? "No vendor meter"
                  : sandbox.pricing.billingUnit || "Not published"}
              </dd>
              <dd className="mt-0.5 text-[#8289AA] text-[11px]">
                {selfHostedBilling
                  ? `Runs on hardware you already pay for${
                      sandbox.pricing.model?.length ? ` · ${sandbox.pricing.model.join(" · ")}` : ""
                    }`
                  : sandbox.pricing.model?.join(" · ") || "Pricing model not published"}
              </dd>
            </div>
          )}

          <div className="rounded-[14px] border border-[#262C4A] bg-[#0F1324] p-3.5">
            <dt className="text-[#8289AA] text-[11px] uppercase tracking-[0.06em]">Idle billing</dt>
            <dd className="mt-1 font-semibold text-[#F2F3FA] text-sm">
              {lifecycle?.idleBillingLabel ?? "Not published"}
            </dd>
            <dd className="mt-0.5 text-[#8289AA] text-[11px]">
              {selfHostedBilling && idleGroup === "idle_free"
                ? "Self-hosted; no vendor invoice while it sits idle"
                : idlePeerNote}
            </dd>
          </div>

          <div className="rounded-[14px] border border-[#262C4A] bg-[#0F1324] p-3.5">
            <dt className="text-[#8289AA] text-[11px] uppercase tracking-[0.06em]">
              State kept on pause
            </dt>
            <dd className="mt-1 font-semibold text-[#F2F3FA] text-sm">
              {lifecycle?.pauseRetainsLabel ?? "Not published"}
            </dd>
            <dd className="mt-0.5 text-[#8289AA] text-[11px]">
              {sandbox.lifecycle?.resumeTime
                ? `Resume: ${sandbox.lifecycle.resumeTime}`
                : "Resume latency not published"}
            </dd>
          </div>
        </dl>
      )}

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="min-w-0 space-y-8 lg:col-span-8">
          <section className="space-y-4 rounded-[14px] border border-[#262C4A] bg-[#131625] p-6">
            <h2 className="font-bold text-[#F2F3FA] text-lg tracking-tight">Overview</h2>
            <div className="space-y-3 text-[#C7CCE2] text-sm leading-relaxed">
              <p>
                <InlineText text={sandbox.overview || sandbox.description} />
              </p>
            </div>
          </section>

          {sandbox.keyFeatures && sandbox.keyFeatures.length > 0 && (
            <section className="space-y-4 rounded-[14px] border border-[#262C4A] bg-[#131625] p-6">
              <h2 className="font-bold text-[#F2F3FA] text-lg tracking-tight">Key capabilities</h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {sandbox.keyFeatures.map((feature) => (
                  <li
                    className="flex items-start gap-2.5 rounded-[12px] border border-[#262C4A]/70 bg-[#171B2E] p-3 text-[#F2F3FA] text-xs"
                    key={feature}
                  >
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#A78BFA]" />
                    <span>
                      <InlineText text={feature} />
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!!sandbox.sampleCode && (
            <section className="overflow-hidden rounded-[14px] border border-[#262C4A] bg-[#131625]">
              <div className="flex items-center justify-between gap-3 border-[#262C4A] border-b bg-[#171B2E] px-6 py-3.5">
                <h2 className="flex min-w-0 items-center gap-2 font-mono font-normal text-[#C7CCE2] text-xs">
                  <Terminal aria-hidden="true" className="h-4 w-4 shrink-0 text-[#A78BFA]" />
                  <span className="truncate">{sandbox.sampleCode.filename}</span>
                </h2>
                <button
                  className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[6px] bg-[#1A1E32] px-2.5 py-1 font-medium text-[#F2F3FA] text-[11px] transition-colors hover:bg-[#222742]"
                  onClick={handleCopyCode}
                  type="button"
                >
                  {copyState === "copied" ? (
                    <>
                      <Check aria-hidden="true" className="h-3.5 w-3.5 text-[#4ADE80]" />
                      <span className="text-[#4ADE80]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy aria-hidden="true" className="h-3.5 w-3.5" />
                      <span>{copyState === "failed" ? "Copy failed" : "Copy snippet"}</span>
                    </>
                  )}
                </button>
              </div>

              <p aria-live="polite" className="sr-only">
                {COPY_FEEDBACK[copyState]}
              </p>

              <div className="overflow-x-auto bg-[#080B1A] p-6">
                <pre className="font-mono text-[#C4B5FD] text-xs leading-relaxed">
                  <code>{sandbox.sampleCode.code}</code>
                </pre>
              </div>
            </section>
          )}

          {dependentsList.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-bold text-[#F2F3FA] text-lg tracking-tight">
                Products built on this
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {dependentsList.map((dependent) => (
                  <Link
                    className="group flex items-center justify-between gap-3 rounded-[12px] border border-[#6D4DFF]/30 bg-[#131625] p-4 transition-colors hover:border-[#6D4DFF]/60 hover:bg-[#171B2E]"
                    key={dependent.id}
                    to={`/sandbox/${dependent.slug}`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <BrandLogo
                        className="h-10 w-10 shrink-0 rounded-[10px]"
                        logoBg={dependent.logoBg}
                        logoTextColor={dependent.logoTextColor}
                        name={dependent.name}
                        size="sm"
                        slug={dependent.slug}
                      />
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-[#F2F3FA] text-sm transition-colors group-hover:text-[#A78BFA]">
                          {dependent.name}
                        </div>
                        <div className="truncate text-[#9BA1BE] text-[11px]">
                          {dependent.description}
                        </div>
                      </div>
                    </div>
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[#8289AA] transition-colors group-hover:translate-x-0.5 group-hover:text-[#A78BFA]"
                    />
                  </Link>
                ))}
              </div>
              <p className="text-[#8289AA] text-[11px]">
                These listings run their agents inside this runtime, so they are dependencies rather
                than alternatives. Their isolation is this product&apos;s isolation.
              </p>
            </section>
          )}

          {alternativesList.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-bold text-[#F2F3FA] text-lg tracking-tight">
                Similar alternatives
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {alternativesList.map((alt) => (
                  <Link
                    className="group flex items-center justify-between gap-3 rounded-[12px] border border-[#262C4A] bg-[#131625] p-4 transition-colors hover:border-[#6D4DFF]/45 hover:bg-[#171B2E]"
                    key={alt.id}
                    to={`/sandbox/${alt.slug}`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <BrandLogo
                        className="h-10 w-10 shrink-0 rounded-[10px]"
                        logoBg={alt.logoBg}
                        logoTextColor={alt.logoTextColor}
                        name={alt.name}
                        size="sm"
                        slug={alt.slug}
                      />
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-[#F2F3FA] text-sm transition-colors group-hover:text-[#A78BFA]">
                          {alt.name}
                        </div>
                        <div className="truncate text-[#9BA1BE] text-[11px]">{alt.description}</div>
                      </div>
                    </div>
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-[#8289AA] transition-colors group-hover:translate-x-0.5 group-hover:text-[#A78BFA]"
                    />
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6 lg:col-span-4">
          <section className="space-y-4 rounded-[14px] border border-[#262C4A] bg-[#131625] p-5">
            <h2 className="flex items-center gap-2 border-[#262C4A] border-b pb-2 font-bold text-[#F2F3FA] text-sm tracking-tight">
              <Cpu aria-hidden="true" className="h-4 w-4 text-[#A78BFA]" />
              <span>Technical specifications</span>
            </h2>

            <dl className="divide-y divide-[#262C4A]/80 text-xs">
              <SpecRow label="Runtime architecture" value={runtimeLabel(sandbox.runtime)} />

              {runtimeDetails(sandbox.runtime).length > 0 && (
                <div className="flex flex-col gap-1.5 py-2.5">
                  <dt className="text-[#9BA1BE]">Runtime notes</dt>
                  <dd>
                    <ul className="space-y-1.5 text-[#C7CCE2] text-[11px] leading-normal">
                      {runtimeDetails(sandbox.runtime).map((detail) => (
                        <li className="flex gap-1.5" key={detail}>
                          <span
                            aria-hidden="true"
                            className="mt-[4px] h-1 w-1 shrink-0 rounded-full bg-[#6D4DFF]"
                          />
                          <span>
                            <InlineText text={detail} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}

              <SpecRow
                label="Cold-start boot time"
                mono={true}
                tone={
                  isUnpublishedBootTime(sandbox.techSpecs?.bootTime) ||
                  isSelfReportedBootTime(sandbox.techSpecs?.bootTime)
                    ? "text-[#9BA1BE]"
                    : "text-[#4ADE80]"
                }
                value={sandbox.techSpecs?.bootTime || "Unknown"}
              />

              <SpecRow
                label="Max vCPU"
                mono={true}
                value={sandbox.techSpecs?.maxVcpu || "Not published"}
              />

              <SpecRow
                label="Max memory"
                mono={true}
                value={sandbox.techSpecs?.maxRam || "Not published"}
              />

              <SpecRow
                label="Storage model"
                value={sandbox.techSpecs?.storageLimit || "Not published"}
              />

              <div className="flex flex-col gap-1 py-2.5">
                <dt className="text-[#9BA1BE]">Network isolation</dt>
                <dd className="text-[#C7CCE2] text-[11px] leading-normal">
                  <InlineText text={sandbox.techSpecs?.networkIsolation || "Not published."} />
                </dd>
              </div>
            </dl>
          </section>

          <section className="space-y-4 rounded-[14px] border border-[#262C4A] bg-[#131625] p-5">
            <h2 className="border-[#262C4A] border-b pb-2 font-bold text-[#F2F3FA] text-sm tracking-tight">
              Lifecycle &amp; capabilities
            </h2>

            <dl className="space-y-2.5 text-xs">
              {(
                [
                  ["Filesystem persistence", sandbox.capabilities.persistent],
                  ["Memory / disk snapshot", sandbox.capabilities.snapshot],
                  ["Instant forking", sandbox.capabilities.fork],
                  ["GPU acceleration", sandbox.capabilities.gpu],
                  ["GUI desktop / VNC", sandbox.capabilities.desktop],
                  ["Mobile / cloud phone", sandbox.capabilities.mobile],
                  ["Browser automation", sandbox.capabilities.browser],
                  ["Network egress control", sandbox.capabilities.egressControl],
                  ["Pause / auto-sleep", sandbox.capabilities.autoSleep],
                  ["MCP protocol server", sandbox.capabilities.mcp],
                  ["REST API & SDKs", sandbox.capabilities.api && sandbox.capabilities.sdk],
                ] as const
              ).map(([label, value]) => (
                <div className="flex items-center justify-between gap-3" key={label}>
                  <dt className="text-[#9BA1BE]">{label}</dt>
                  <dd>
                    <CapabilityStatus value={value} />
                  </dd>
                </div>
              ))}
            </dl>

            {!!lifecycle && (
              <dl className="space-y-2.5 border-[#262C4A]/70 border-t pt-3 text-xs">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#9BA1BE]">Idle billing</dt>
                  <dd className="text-[#F2F3FA]">{lifecycle.idleBillingLabel}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-[#9BA1BE]">State kept on pause</dt>
                  <dd className="text-[#F2F3FA]">{lifecycle.pauseRetainsLabel}</dd>
                </div>
                {!!sandbox.lifecycle?.resumeTime && (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[#9BA1BE]">Resume latency</dt>
                    <dd className="font-mono font-semibold text-[#4ADE80]">
                      {sandbox.lifecycle.resumeTime}
                    </dd>
                  </div>
                )}
                {!!sandbox.lifecycle?.sessionLimit && (
                  <div className="flex flex-col gap-1">
                    <dt className="text-[#9BA1BE]">Session limit</dt>
                    <dd className="text-[#F2F3FA] leading-normal">
                      {sandbox.lifecycle.sessionLimit}
                    </dd>
                  </div>
                )}
                {sandbox.sdkLanguages && sandbox.sdkLanguages.length > 0 && (
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[#9BA1BE]">SDKs</dt>
                    <dd className="text-right text-[#F2F3FA]">{sandbox.sdkLanguages.join(", ")}</dd>
                  </div>
                )}
                {sandbox.compliance && sandbox.compliance.length > 0 && (
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-[#9BA1BE]">Compliance</dt>
                    <dd className="flex flex-wrap justify-end gap-1">
                      {sandbox.compliance.map((item) => (
                        <span
                          className="rounded border border-[#4ADE80]/25 bg-[#123524] px-1.5 py-0.5 text-[#EFEFEF] text-[10px]"
                          key={item}
                        >
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </section>

          <section className="space-y-4 rounded-[14px] border border-[#262C4A] bg-[#131625] p-5">
            <div className="flex items-center justify-between gap-3 border-[#262C4A] border-b pb-2">
              <h2 className="font-bold text-[#F2F3FA] text-sm">Pricing model</h2>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-semibold text-[11px] ${transparency.className}`}
              >
                <TransparencyIcon aria-hidden="true" className="h-3.5 w-3.5" />
                <span>{transparency.label}</span>
              </span>
            </div>

            {!!sandbox.pricing.verifiedAt && (
              <p className={`text-[11px] ${pricingStale ? "text-[#FBBF24]" : "text-[#8289AA]"}`}>
                Rate read {formatVerifiedOn(sandbox.pricing.verifiedAt)}
                {pricingStale
                  ? " — older than 90 days, so re-check it before relying on the figure."
                  : "."}
              </p>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <span className="mb-1 block text-[#9BA1BE]">Pricing tiers</span>
                <div className="flex flex-wrap gap-1.5">
                  {sandbox.pricing.model && sandbox.pricing.model.length > 0 ? (
                    sandbox.pricing.model.map((tier) => (
                      <span
                        className="rounded border border-[#262C4A] bg-[#1A1E32] px-2 py-0.5 text-[#C7CCE2]"
                        key={tier}
                      >
                        {tier}
                      </span>
                    ))
                  ) : (
                    <span className="text-[#9BA1BE]">Unknown</span>
                  )}
                </div>
              </div>

              {!!sandbox.pricing.costSummary && (
                <div>
                  <span className="mb-0.5 block text-[#9BA1BE]">Summary</span>
                  <p className="text-[#C7CCE2] text-[11px] leading-relaxed">
                    {sandbox.pricing.costSummary}
                  </p>
                </div>
              )}

              {!!sandbox.pricing.billingUnit && (
                <div className="flex items-center justify-between gap-3 text-[#9BA1BE]">
                  <span>Billing unit</span>
                  <span className="font-medium text-[#F2F3FA]">{sandbox.pricing.billingUnit}</span>
                </div>
              )}

              {!!sandbox.pricing.pricingUrl && (
                <a
                  className="mt-2 block w-full rounded-[10px] border border-[#262C4A] bg-[#1A1E32] py-2 text-center font-semibold text-[#A78BFA] text-xs transition-colors hover:border-[#3A4370] hover:bg-[#222742]"
                  href={sandbox.pricing.pricingUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  View official pricing page
                </a>
              )}
            </div>
          </section>

          {relatedGuidesList.length > 0 && (
            <section className="space-y-3 rounded-[14px] border border-[#262C4A] bg-[#131625] p-5">
              <h2 className="flex items-center gap-2 font-bold text-[#F2F3FA] text-sm">
                <BookOpen aria-hidden="true" className="h-4 w-4 text-[#A78BFA]" />
                <span>Related architecture guides</span>
              </h2>
              <div className="space-y-2">
                {relatedGuidesList.map((guide) => (
                  <Link
                    className="block rounded-[12px] border border-[#262C4A] bg-[#171B2E] p-2.5 text-[#F2F3FA] text-xs transition-colors hover:bg-[#222742] hover:text-[#A78BFA]"
                    key={guide.id}
                    to={`/guides/${guide.slug}`}
                  >
                    <div className="line-clamp-1 font-semibold">{guide.title}</div>
                    <div className="mt-0.5 text-[#9BA1BE] text-[11px]">{guide.readTime}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
