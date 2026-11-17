import {
  Check,
  ChevronDown,
  ExternalLink,
  FileCode,
  HelpCircle,
  Plus,
  Scale,
  Share2,
  X,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { BrandLogo } from "../components/sandbox/BrandLogo";
import { PRODUCT_TYPE_OPTIONS } from "../data/categories";
import { REPO_LICENSES } from "../data/licenses";
import { BILLING_SHAPE_LABEL, billingShape } from "../lib/billing";
import { isMeasuredBootTime } from "../lib/bootTime";
import { formatVerifiedOn, isStaleVerification } from "../lib/freshness";
import { ISOLATION_BOUNDARY_LABEL, isolationBoundary } from "../lib/isolation";
import { Link, useRouter } from "../lib/router";
import { useSandboxes } from "../lib/sandboxContext";
import type { Sandbox } from "../types/sandbox";

const MAX_COMPARE = 4;

const PRESETS = [
  { label: "E2B vs Daytona vs Modal", slugs: ["e2b", "daytona", "modal"] },
  {
    label: "MicroVM Hypervisors",
    slugs: ["firecracker", "cloud-hypervisor", "kata-containers"],
  },
  { label: "Desktop & Computer Use", slugs: ["cua", "kasm"] },
  {
    label: "Idle-free self-hosted",
    slugs: ["dormice", "sandstorm", "microsandbox"],
  },
  {
    label: "Local containment SDKs",
    slugs: ["mxc", "sandbox-runtime", "agent-safehouse", "lilbox"],
  },
];

function StatusCell({
  value,
  labelTrue,
  labelFalse,
}: {
  value?: boolean | null;
  labelTrue: string;
  labelFalse: string;
}) {
  if (value === true) {
    return (
      <span className="flex items-center gap-1.5 font-medium text-[#4ADE80]">
        <Check aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span>{labelTrue}</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="flex items-center gap-1.5 font-medium text-[#8289AA]">
        <X aria-hidden="true" className="h-4 w-4 shrink-0" />
        <span>{labelFalse}</span>
      </span>
    );
  }
  return (
    <span
      className="flex items-center gap-1.5 font-medium text-[#FBBF24]"
      title="Unknown or not officially specified"
    >
      <HelpCircle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
      <span>Unknown</span>
    </span>
  );
}

function runtimeName(sandbox: Sandbox) {
  if (sandbox.runtime.firecracker) {
    return "AWS Firecracker MicroVM";
  }
  if (sandbox.runtime.docker) {
    return "Docker / Container Namespaces";
  }
  if (sandbox.runtime.gvisor) {
    return "Google gVisor Syscall Trap";
  }
  return sandbox.runtime.other?.[0] || "Unknown";
}

function isolationName(sandbox: Sandbox) {
  if (sandbox.runtime.firecracker) {
    return "Hardware KVM VM boundary";
  }
  if (sandbox.runtime.gvisor) {
    return "User-space application kernel";
  }
  if (sandbox.runtime.docker) {
    return "Shared host kernel (namespaces)";
  }
  return "Isolated process";
}

interface CompareRow {
  /** Shown as a hover title on the row label; explains how to read the row. */
  hint?: string;
  label: string;
  render: (sandbox: Sandbox) => ReactNode;
}

interface CompareSection {
  rows: CompareRow[];
  title: string;
}

const IDLE_BILLING_LABELS: Record<string, string> = {
  idle_free: "Zero while idle",
  usage_metered: "Usage-metered",
  wall_clock: "Wall-clock",
};

const PAUSE_STATE_LABELS: Record<string, string> = {
  memory: "Memory + processes",
  disk: "Disk only",
  none: "Nothing survives",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  beta: "Beta / preview",
  deprecated: "Deprecated / archived",
  unknown: "Status unconfirmed",
};

const SECTIONS: CompareSection[] = [
  {
    title: "Basic information",
    rows: [
      {
        label: "Category",
        render: (s) => (
          <span className="flex flex-wrap gap-1">
            {s.categories.map((category) => (
              <span
                className="rounded border border-[#262C4A] bg-[#1A1E32] px-2 py-0.5 text-[#C7CCE2] text-[11px]"
                key={category}
              >
                {category}
              </span>
            ))}
          </span>
        ),
      },
      {
        label: "Open source",
        render: (s) => (
          <StatusCell labelFalse="Proprietary" labelTrue="Yes (Open Source)" value={s.openSource} />
        ),
      },
      {
        label: "License",
        render: (s) =>
          REPO_LICENSES[s.slug] ? (
            <span className="font-mono text-[#C7CCE2]">{REPO_LICENSES[s.slug]}</span>
          ) : (
            <span className="text-[#8289AA]">No public repository</span>
          ),
      },
      {
        label: "Product type",
        render: (s) => (
          <span className="text-[#C7CCE2]">
            {PRODUCT_TYPE_OPTIONS.find((option) => option.id === s.productType)?.label ??
              s.productType}
          </span>
        ),
      },
      {
        label: "Product status",
        render: (s) => (
          <span
            className={
              s.status === "deprecated"
                ? "font-semibold text-[#FBBF24]"
                : s.status === "beta"
                  ? "text-[#A78BFA]"
                  : "text-[#C7CCE2]"
            }
            title={
              s.status === "deprecated"
                ? "Shut down or no longer maintained; pricing and availability are historical"
                : undefined
            }
          >
            {STATUS_LABELS[s.status] ?? STATUS_LABELS.unknown}
            {s.status === "deprecated" && (
              <span className="mt-1 block font-normal text-[#8289AA] text-[11px]">
                Do not budget against this listing
              </span>
            )}
          </span>
        ),
      },
      {
        label: "Deployment",
        render: (s) => (
          <span className="block space-y-1 text-[#C7CCE2]">
            {s.deployment.cloud && <span className="block">Managed cloud</span>}
            {s.deployment.selfHosted && <span className="block">Self-hosted</span>}
            {s.deployment.byoc && <span className="block">BYOC (own cloud)</span>}
          </span>
        ),
      },
    ],
  },
  {
    title: "Runtime & architecture",
    rows: [
      {
        label: "Containment",
        render: (s) => {
          const boundary = isolationBoundary(s);
          return (
            <span className="block">
              <span
                className={
                  boundary === "hardware"
                    ? "font-medium text-[#4ADE80]"
                    : boundary === "unknown"
                      ? "text-[#8289AA]"
                      : "text-[#F2F3FA]"
                }
              >
                {ISOLATION_BOUNDARY_LABEL[boundary]}
              </span>
              {boundary === "unknown" && (
                <span className="mt-0.5 block text-[#8289AA] text-[11px]">
                  Backend not documented
                </span>
              )}
            </span>
          );
        },
      },
      {
        label: "Rating",
        render: (s) =>
          typeof s.rating === "number" ? (
            <span className="font-mono font-semibold text-[#C4B5FD] tabular-nums">
              {s.rating.toFixed(1)} / 5
            </span>
          ) : (
            <span className="text-[#8289AA]">Not rated</span>
          ),
      },
      {
        label: "Hypervisor / runtime",
        render: (s) => <span className="font-medium text-[#F2F3FA]">{runtimeName(s)}</span>,
      },
      {
        label: "Boot latency",
        render: (s) => (
          // Green implies a measured cold start; self-reported figures and missing data stay neutral.
          <span
            className={`font-mono font-semibold ${
              isMeasuredBootTime(s.techSpecs?.bootTime) ? "text-[#4ADE80]" : "text-[#C7CCE2]"
            }`}
          >
            {s.techSpecs?.bootTime || "Unknown"}
          </span>
        ),
      },
      {
        label: "Kernel isolation",
        render: (s) => <span className="text-[#C7CCE2]">{isolationName(s)}</span>,
      },
    ],
  },
  {
    title: "Infrastructure sizing",
    rows: [
      {
        label: "Max vCPU",
        render: (s) => (
          <span className="font-mono text-[#C7CCE2]">{s.techSpecs?.maxVcpu || "Configurable"}</span>
        ),
      },
      {
        label: "Max memory",
        render: (s) => (
          <span className="font-mono text-[#C7CCE2]">{s.techSpecs?.maxRam || "Configurable"}</span>
        ),
      },
      {
        label: "GPU acceleration",
        render: (s) => (
          <StatusCell labelFalse="No GPU" labelTrue="GPU supported" value={s.capabilities.gpu} />
        ),
      },
    ],
  },
  {
    title: "Lifecycle & state",
    rows: [
      {
        label: "Persistence",
        render: (s) => (
          <StatusCell
            labelFalse="Ephemeral"
            labelTrue="Persistent volume"
            value={s.capabilities.persistent}
          />
        ),
      },
      {
        label: "Instant snapshots",
        render: (s) => (
          <StatusCell
            labelFalse="No snapshot"
            labelTrue="Snapshot capable"
            value={s.capabilities.snapshot}
          />
        ),
      },
      {
        label: "Instant forking",
        render: (s) => (
          <StatusCell labelFalse="No fork" labelTrue="Fork capable" value={s.capabilities.fork} />
        ),
      },
      {
        label: "Pause / auto-sleep",
        render: (s) => (
          <StatusCell
            labelFalse="No auto-sleep"
            labelTrue="Hibernate / auto-sleep"
            value={s.capabilities.autoSleep}
          />
        ),
      },
      {
        label: "Idle billing",
        render: (s) => (
          <span className="text-[#C7CCE2]">
            {IDLE_BILLING_LABELS[s.lifecycle?.idleBilling ?? ""] ?? "Not published"}
          </span>
        ),
      },
      {
        label: "State kept on pause",
        render: (s) => (
          <span className="text-[#C7CCE2]">
            {PAUSE_STATE_LABELS[s.lifecycle?.pauseRetains ?? ""] ?? "Not published"}
          </span>
        ),
      },
      {
        label: "Resume latency",
        render: (s) => (
          <span className="font-mono text-[#C7CCE2]">{s.lifecycle?.resumeTime ?? "—"}</span>
        ),
      },
      {
        label: "Session limit",
        render: (s) => (
          <span className="text-[#C7CCE2]">{s.lifecycle?.sessionLimit ?? "Not published"}</span>
        ),
      },
      {
        label: "Egress firewall control",
        render: (s) => (
          <StatusCell
            labelFalse="Unrestricted"
            labelTrue="Egress policy / proxy"
            value={s.capabilities.egressControl}
          />
        ),
      },
    ],
  },
  {
    title: "Desktop, mobile & browser access",
    rows: [
      {
        label: "Streaming GUI desktop",
        render: (s) => (
          <StatusCell
            labelFalse="Headless only"
            labelTrue="Full desktop (VNC/WebRTC)"
            value={s.capabilities.desktop}
          />
        ),
      },
      {
        label: "Mobile / Android sandbox",
        render: (s) => (
          <StatusCell
            labelFalse="No mobile"
            labelTrue="Mobile / cloud phone"
            value={s.capabilities.mobile}
          />
        ),
      },
      {
        label: "Mobile OS targets",
        render: (s) =>
          s.capabilities.mobile === true ? (
            <span className="text-[#C7CCE2]">
              {s.techSpecs?.operatingSystems?.join(", ") || "Not published"}
            </span>
          ) : (
            <span className="text-[#8289AA]">—</span>
          ),
      },
      {
        label: "Browser automation",
        render: (s) => (
          <StatusCell
            labelFalse="No browser suite"
            labelTrue="Browser sandbox"
            value={s.capabilities.browser}
          />
        ),
      },
    ],
  },
  {
    title: "Developer tooling & protocols",
    rows: [
      {
        label: "REST API / SDK",
        render: (s) => (
          <StatusCell
            labelFalse="CLI / socket only"
            labelTrue="SDK & API available"
            value={s.capabilities.api && s.capabilities.sdk}
          />
        ),
      },
      {
        label: "Model Context Protocol",
        render: (s) => (
          <StatusCell
            labelFalse="No MCP server"
            labelTrue="MCP server included"
            value={s.capabilities.mcp}
          />
        ),
      },
      {
        label: "CLI interface",
        render: (s) => (
          <StatusCell labelFalse="No CLI" labelTrue="CLI supported" value={s.capabilities.cli} />
        ),
      },
    ],
  },
  {
    title: "Pricing & transparency",
    rows: [
      {
        label: "Free tier",
        render: (s) =>
          s.status === "deprecated" ? (
            <span className="text-[#8289AA]">Not applicable — archived</span>
          ) : (
            <StatusCell
              labelFalse="Paid only"
              labelTrue="Free tier available"
              value={s.pricing.freeTier}
            />
          ),
      },
      {
        label: "Billing model",
        render: (s) => {
          const shape = billingShape(s);
          return (
            <span className="text-[#C7CCE2]">
              <span className="block">{s.pricing.model?.join(", ") || "Custom"}</span>
              {s.pricing.billingUnit && (
                <span
                  className={`mt-1 block text-[11px] ${
                    shape === "metered"
                      ? "text-[#8289AA]"
                      : shape === "unpublished"
                        ? "text-[#8289AA]/70"
                        : "text-[#FBBF24]"
                  }`}
                >
                  {s.pricing.billingUnit}
                </span>
              )}
            </span>
          );
        },
      },
      {
        label: "Rate comparability",
        hint: "Not interchangeable: only the metered row supports per-hour math.",
        render: (s) => {
          const shape = billingShape(s);
          return (
            <span
              className={
                shape === "metered"
                  ? "text-[#C7CCE2]"
                  : shape === "unpublished"
                    ? "text-[#8289AA]"
                    : "text-[#FBBF24]"
              }
            >
              {BILLING_SHAPE_LABEL[shape]}
            </span>
          );
        },
      },
      {
        label: "Pricing audit",
        render: (s) => {
          if (s.pricing.transparency === "quote_only") {
            return (
              <span
                className="font-medium text-[#C7CCE2]"
                title="Vendor sells by quote, so there is no public rate to audit"
              >
                Quote only
              </span>
            );
          }
          if (s.pricing.transparency !== "official_verified") {
            return <span className="font-medium text-[#FBBF24]">Pending audit</span>;
          }
          const verifiedAt = s.pricing.verifiedAt;
          if (isStaleVerification(verifiedAt) && verifiedAt) {
            return (
              <span className="font-medium text-[#FBBF24]">
                Verified {verifiedAt.slice(0, 4)} — rate read {formatVerifiedOn(verifiedAt)}
              </span>
            );
          }
          return <span className="font-semibold text-[#4ADE80]">Official verified</span>;
        },
      },
    ],
  },
];

export function ComparePage() {
  const { sandboxes, compareList, removeFromCompare, replaceCompare, toggleCompare } =
    useSandboxes();
  const { route } = useRouter();

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(() => {
    const urlItems = route.searchParams.get("items");
    if (urlItems) {
      const parsed = urlItems.split(",").filter(Boolean);
      if (parsed.length > 0) {
        return parsed.slice(0, MAX_COMPARE);
      }
    }
    return compareList.length >= 2
      ? compareList.slice(0, MAX_COMPARE)
      : ["e2b", "daytona", "modal"];
  });
  const urlItemsKey = route.searchParams.get("items") ?? "";

  // A shared link is the matrix on screen, so the tray behind the navbar badge
  // has to match it. Otherwise a stale local tray reports four selected while
  // three products are displayed and "remove" acts on the wrong list.
  useEffect(() => {
    if (!urlItemsKey) {
      return;
    }
    replaceCompare(urlItemsKey.split(",").filter(Boolean).slice(0, MAX_COMPARE));
  }, [urlItemsKey, replaceCompare]);

  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [markdownStatus, setMarkdownStatus] = useState<"idle" | "copied" | "downloaded">("idle");
  const addDropdownRef = useRef<HTMLDivElement>(null);

  // Keep a shareable URL in sync with the current matrix.
  useEffect(() => {
    if (selectedSlugs.length === 0) {
      return;
    }
    const newQuery = `?items=${selectedSlugs.join(",")}`;
    if (window.location.search !== newQuery) {
      window.history.replaceState({}, "", `/compare${newQuery}`);
    }
  }, [selectedSlugs]);

  useEffect(() => {
    if (!addDropdownOpen) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!addDropdownRef.current?.contains(event.target as Node)) {
        setAddDropdownOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAddDropdownOpen(false);
        addDropdownRef.current?.querySelector("button")?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [addDropdownOpen]);

  const selectedSandboxes = selectedSlugs
    .map((slug) => sandboxes.find((s) => s.slug === slug || s.id === slug))
    .filter((s): s is Sandbox => Boolean(s));

  const availableToAdd = sandboxes.filter(
    (s) => !(selectedSlugs.includes(s.slug) || selectedSlugs.includes(s.id)),
  );

  // The question buyers actually ask of a comparison: which of these is cheap
  // to leave paused, and which keeps billing while the agent thinks.
  const lifecycleKnown = selectedSandboxes.filter((sandbox) => sandbox.lifecycle?.idleBilling);
  const pauseRank: Record<string, number> = { memory: 0, disk: 1, none: 2 };
  const idleFreePick =
    lifecycleKnown
      .filter((sandbox) => sandbox.lifecycle?.idleBilling === "idle_free")
      .sort(
        (a, b) =>
          (pauseRank[a.lifecycle?.pauseRetains ?? ""] ?? 3) -
          (pauseRank[b.lifecycle?.pauseRetains ?? ""] ?? 3),
      )[0] ?? null;
  const wallClock = lifecycleKnown.filter(
    (sandbox) => sandbox.lifecycle?.idleBilling === "wall_clock",
  );

  // Pairs where one selected product is built on another selected product.
  // builtOn entries may be slugs or display names, so compare both.
  const dependencyPairs: { base: Sandbox; child: Sandbox }[] = [];
  for (const child of selectedSandboxes) {
    for (const baseRef of child.builtOn ?? []) {
      const normalized = baseRef.trim().toLowerCase();
      const base = selectedSandboxes.find(
        (item) =>
          item.slug === baseRef ||
          item.slug === normalized ||
          item.name.toLowerCase() === normalized,
      );
      if (base) {
        dependencyPairs.push({ base, child });
      }
    }
  }

  const handleAddProduct = (slug: string) => {
    if (selectedSlugs.length >= MAX_COMPARE || selectedSlugs.includes(slug)) {
      return;
    }
    setSelectedSlugs([...selectedSlugs, slug]);
    // Keep the global comparison tray in step with this matrix.
    if (!compareList.includes(slug)) {
      toggleCompare(slug);
    }
    setAddDropdownOpen(false);
  };

  const handleRemoveProduct = (slug: string) => {
    if (selectedSlugs.length <= 1) {
      return;
    }
    setSelectedSlugs(selectedSlugs.filter((s) => s !== slug));
    removeFromCompare(slug);
  };

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareStatus("copied");
    } catch {
      setShareStatus("failed");
    }
    window.setTimeout(() => setShareStatus("idle"), 2000);
  };

  const handleCopyMarkdown = async () => {
    const escapeCell = (value: string) => value.replaceAll("|", "\\|");
    const typeLabel = (sandbox: Sandbox) =>
      PRODUCT_TYPE_OPTIONS.find((option) => option.id === sandbox.productType)?.label ??
      sandbox.productType;
    const header = [
      "Product",
      "Type",
      "Containment",
      "Rating",
      "Categories",
      "Open source",
      "License",
      "Idle billing",
      "Boot time",
      "Pricing model",
      "Website",
    ];
    const rows = selectedSandboxes.map((sandbox) => [
      sandbox.name,
      typeLabel(sandbox),
      ISOLATION_BOUNDARY_LABEL[isolationBoundary(sandbox)],
      typeof sandbox.rating === "number" ? sandbox.rating.toFixed(1) : "Not rated",
      sandbox.categories.join(", "),
      sandbox.openSource ? "Yes" : "No",
      REPO_LICENSES[sandbox.slug] ?? "No public repository",
      sandbox.lifecycle?.idleBilling ?? "Not published",
      sandbox.techSpecs?.bootTime ?? "Not published",
      sandbox.pricing.model?.join(", ") ?? "Not published",
      sandbox.website,
    ]);
    const markdown = [
      `# Sandbox comparison (${selectedSandboxes.length} products)`,
      "",
      `| ${header.join(" | ")} |`,
      `| ${header.map(() => "---").join(" | ")} |`,
      ...rows.map((row) => `| ${row.map((cell) => escapeCell(cell)).join(" | ")} |`),
      "",
      `Source: ${window.location.href}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(markdown);
      setMarkdownStatus("copied");
    } catch {
      // Clipboard access can be blocked; fall back to a file download so the
      // comparison still leaves the page in a usable form.
      const blob = new Blob([markdown], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "sandbox-comparison.md";
      anchor.click();
      URL.revokeObjectURL(url);
      setMarkdownStatus("downloaded");
    }
    window.setTimeout(() => setMarkdownStatus("idle"), 2000);
  };

  const canAddMore = selectedSlugs.length < MAX_COMPARE;

  return (
    <div className="space-y-8 pt-6 pb-20">
      {/* Header */}
      <div className="space-y-4 border-[#262C4A] border-b pb-4">
        <div className="max-w-2xl">
          <div className="mb-2 inline-flex items-center gap-2 font-semibold text-[#A78BFA] text-xs uppercase tracking-wider">
            <Scale aria-hidden="true" className="h-4 w-4" />
            <span>Interactive matrix</span>
          </div>
          <h1 className="font-extrabold text-2xl text-[#F2F3FA] tracking-tight md:text-3xl">
            Compare sandbox infrastructure
          </h1>
          <p className="mt-1 text-[#9BA1BE] text-sm">
            Evaluate architectural specs, microVM runtimes, desktop capabilities, and pricing models
            side by side.
          </p>
        </div>

        {/* Toolbar: presets on the left, actions on the right */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="hidden items-center gap-2 text-[#9BA1BE] text-xs lg:flex">
            <span className="text-[#8289AA]">Presets:</span>
            {PRESETS.map((preset) => (
              <button
                className="cursor-pointer rounded-md border border-[#262C4A] bg-[#131625] px-2.5 py-1 text-[#C7CCE2] transition-colors hover:border-[#3A4370] hover:bg-[#1A1E32] hover:text-[#F2F3FA]"
                key={preset.label}
                onClick={() => setSelectedSlugs(preset.slugs)}
                type="button"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              className="flex cursor-pointer items-center gap-1.5 rounded-[12px] border border-[#262C4A] bg-[#131625] px-3.5 py-2 font-semibold text-[#C7CCE2] text-xs transition-colors hover:border-[#3A4370] hover:bg-[#1A1E32]"
              onClick={handleShareLink}
              type="button"
            >
              {shareStatus === "copied" ? (
                <>
                  <Check aria-hidden="true" className="h-3.5 w-3.5 text-[#4ADE80]" />
                  <span className="text-[#4ADE80]">Link copied</span>
                </>
              ) : shareStatus === "failed" ? (
                <>
                  <Share2 aria-hidden="true" className="h-3.5 w-3.5 text-[#FBBF24]" />
                  <span className="text-[#FBBF24]">Copy the URL manually</span>
                </>
              ) : (
                <>
                  <Share2 aria-hidden="true" className="h-3.5 w-3.5 text-[#9BA1BE]" />
                  <span>Share compare</span>
                </>
              )}
            </button>

            <button
              className="flex cursor-pointer items-center gap-1.5 rounded-[12px] border border-[#262C4A] bg-[#131625] px-3.5 py-2 font-semibold text-[#C7CCE2] text-xs transition-colors hover:border-[#3A4370] hover:bg-[#1A1E32]"
              onClick={handleCopyMarkdown}
              type="button"
            >
              {markdownStatus === "copied" ? (
                <>
                  <Check aria-hidden="true" className="h-3.5 w-3.5 text-[#4ADE80]" />
                  <span className="text-[#4ADE80]">Markdown copied</span>
                </>
              ) : markdownStatus === "downloaded" ? (
                <>
                  <Check aria-hidden="true" className="h-3.5 w-3.5 text-[#4ADE80]" />
                  <span className="text-[#4ADE80]">.md downloaded</span>
                </>
              ) : (
                <>
                  <FileCode aria-hidden="true" className="h-3.5 w-3.5 text-[#9BA1BE]" />
                  <span>Markdown</span>
                </>
              )}
            </button>

            {canAddMore && (
              <div className="relative" ref={addDropdownRef}>
                <button
                  aria-controls="add-product-menu"
                  aria-expanded={addDropdownOpen}
                  className="flex cursor-pointer items-center gap-1.5 rounded-[12px] bg-[#6D4DFF] px-3.5 py-2 font-semibold text-white text-xs shadow-[0_2px_14px_rgba(109,77,255,0.35)] transition-colors hover:bg-[#7B5EFF]"
                  onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                  type="button"
                >
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>
                    Add product ({selectedSlugs.length}/{MAX_COMPARE})
                  </span>
                  <ChevronDown aria-hidden="true" className="ml-0.5 h-3 w-3" />
                </button>

                {addDropdownOpen && (
                  <div
                    className="absolute top-full right-0 z-50 mt-2 max-h-72 w-72 overflow-y-auto rounded-[12px] border border-[#262C4A] bg-[#131625] p-1.5 shadow-[0_18px_40px_-12px_rgba(3,5,16,0.9)]"
                    id="add-product-menu"
                  >
                    <div className="px-3 py-1.5 font-semibold text-[#8289AA] text-[11px] uppercase tracking-wider">
                      Select to add
                    </div>
                    {availableToAdd.map((s) => (
                      <button
                        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[#F2F3FA] text-xs transition-colors hover:bg-[#6D4DFF]/15 hover:text-[#C4B5FD]"
                        key={s.id}
                        onClick={() => handleAddProduct(s.slug)}
                        type="button"
                      >
                        <span className="font-medium">{s.name}</span>
                        <span className="shrink-0 text-[#8289AA] text-[11px]">
                          {s.categories[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cost-while-idle verdict, derived from the current selection */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div
          className={`rounded-[14px] border p-4 ${
            idleFreePick ? "border-[#22C55E]/30 bg-[#0B1A12]" : "border-[#262C4A] bg-[#0F1324]"
          }`}
        >
          <p
            className={`font-semibold text-[11px] uppercase tracking-[0.06em] ${
              idleFreePick ? "text-[#86EFAC]" : "text-[#8289AA]"
            }`}
          >
            Cheapest to leave paused
          </p>
          {idleFreePick ? (
            <>
              <p className="mt-1 font-bold text-[#F2F3FA] text-sm">{idleFreePick.name}</p>
              <p className="mt-0.5 text-[#9BA1BE] text-[11px]">
                Zero idle billing
                {idleFreePick.lifecycle?.pauseRetains === "memory"
                  ? " and keeps memory plus processes across the pause."
                  : idleFreePick.lifecycle?.pauseRetains === "disk"
                    ? ", but only disk survives the pause."
                    : "."}
                {billingShape(idleFreePick) === "seat" &&
                  " Billed per seat / month, so read the rate against the plan's concurrency, not against a per-hour listing."}
              </p>
            </>
          ) : (
            <>
              <p className="mt-1 font-bold text-[#F2F3FA] text-sm">None of these publish it</p>
              <p className="mt-0.5 text-[#9BA1BE] text-[11px]">
                No selected listing publishes zero-idle billing, so a paused agent&apos;s bill is
                unknown here.
              </p>
            </>
          )}
        </div>

        <div
          className={`rounded-[14px] border p-4 ${
            wallClock.length > 0
              ? "border-[#F59E0B]/30 bg-[#1A1409]"
              : "border-[#262C4A] bg-[#0F1324]"
          }`}
        >
          <p
            className={`font-semibold text-[11px] uppercase tracking-[0.06em] ${
              wallClock.length > 0 ? "text-[#FBBF24]" : "text-[#8289AA]"
            }`}
          >
            Bills while idle
          </p>
          {wallClock.length > 0 ? (
            <>
              <p className="mt-1 font-bold text-[#F2F3FA] text-sm">
                {wallClock.map((sandbox) => sandbox.name).join(", ")}
              </p>
              <p className="mt-0.5 text-[#9BA1BE] text-[11px]">
                Wall-clock billing keeps charging through every second the agent waits on a model
                call.
              </p>
            </>
          ) : (
            <>
              <p className="mt-1 font-bold text-[#F2F3FA] text-sm">None of these</p>
              <p className="mt-0.5 text-[#9BA1BE] text-[11px]">
                No selected listing charges by wall-clock time; the rest are usage-metered or
                unpriced here.
              </p>
            </>
          )}
        </div>
      </div>

      {/* A stack and its runtime are not peers; say so before the table. */}
      {dependencyPairs.length > 0 && (
        <div className="rounded-[12px] border border-[#6D4DFF]/35 bg-[#151233] px-3.5 py-2.5 text-[11px] leading-[17px]">
          <span className="font-semibold text-[#C4B5FD]">This table mixes layers.</span>{" "}
          <span className="text-[#9BA1BE]">
            {dependencyPairs
              .map((pair) => `${pair.child.name} runs inside ${pair.base.name}`)
              .join("; ")}
            . Their isolation is the same boundary, so the isolation and egress rows describe the
            runtime, not the layer above it.
          </span>
        </div>
      )}

      {/* Matrix */}
      <p className="text-[#8289AA] text-[11px] lg:hidden">Scroll sideways to see every product.</p>
      <div className="overflow-x-auto rounded-[14px] border border-[#262C4A] bg-[#131625]">
        <table className="w-full min-w-[760px] border-collapse text-left text-xs">
          <caption className="sr-only">
            Side-by-side comparison of {selectedSandboxes.map((s) => s.name).join(", ")}
          </caption>
          <thead>
            <tr className="border-[#262C4A] border-b bg-[#151A35]">
              <th
                className="sticky left-0 z-10 w-48 bg-[#151A35] p-5 font-bold text-[#8289AA] text-xs uppercase tracking-wider"
                scope="col"
              >
                Specification
              </th>
              {selectedSandboxes.map((s) => (
                <th className="w-64 p-5 align-top font-normal" key={s.id} scope="col">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <BrandLogo
                          logoBg={s.logoBg}
                          logoTextColor={s.logoTextColor}
                          name={s.name}
                          size="md"
                          slug={s.slug}
                        />
                        <div className="min-w-0">
                          <Link
                            className="block truncate font-bold text-[#F2F3FA] text-sm transition-colors hover:text-[#A78BFA]"
                            to={`/sandbox/${s.slug}`}
                          >
                            {s.name}
                          </Link>
                          <span className="text-[#9BA1BE] text-[11px]">
                            {s.openSource ? "Open source" : "Commercial"}
                          </span>
                        </div>
                      </div>

                      {selectedSandboxes.length > 1 && (
                        <button
                          aria-label={`Remove ${s.name} from comparison`}
                          className="shrink-0 cursor-pointer rounded p-1 text-[#8289AA] transition-colors hover:bg-[#1A1E32] hover:text-[#F87171]"
                          onClick={() => handleRemoveProduct(s.slug)}
                          type="button"
                        >
                          <X aria-hidden="true" className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <p className="line-clamp-2 text-[#9BA1BE] text-xs leading-relaxed">
                      {s.description}
                    </p>

                    <Link
                      className="inline-flex items-center gap-1 font-semibold text-[#A78BFA] text-xs transition-colors hover:text-[#C4B5FD]"
                      to={`/sandbox/${s.slug}`}
                    >
                      <span>View full profile</span>
                      <ExternalLink aria-hidden="true" className="h-3 w-3" />
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#262C4A]/70">
            {SECTIONS.map((section, sectionIndex) => [
              <tr className="bg-[#151A35]/60" key={section.title}>
                <th
                  className="px-5 py-2.5 text-left font-semibold text-[#A78BFA] text-[11px] uppercase tracking-wider"
                  colSpan={selectedSandboxes.length + 1}
                  scope="colgroup"
                >
                  {sectionIndex + 1}. {section.title}
                </th>
              </tr>,
              ...section.rows.map((row) => (
                <tr key={`${section.title}-${row.label}`}>
                  <th
                    className="sticky left-0 bg-[#131625] p-5 text-left align-top font-medium text-[#9BA1BE]"
                    scope="row"
                  >
                    {row.label}
                    {row.hint && (
                      <span className="mt-1 block max-w-[180px] font-normal text-[#8289AA] text-[11px] leading-[15px]">
                        {row.hint}
                      </span>
                    )}
                  </th>
                  {selectedSandboxes.map((s) => (
                    <td className="p-5 align-top" key={s.id}>
                      {row.render(s)}
                    </td>
                  ))}
                </tr>
              )),
            ])}
          </tbody>
        </table>
      </div>
    </div>
  );
}
