export interface CategoryMeta {
  description: string;
  iconName: string;
  id: string;
  name: string;
  popularCount: number;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: "AI Agent Sandbox",
    name: "AI Agent Sandbox",
    description:
      "Sandboxes designed specifically for autonomous AI agents, tool calling, and automated workflows.",
    iconName: "Bot",
    popularCount: 16,
  },
  {
    id: "Cloud Desktop",
    name: "Cloud Desktop",
    description:
      "Virtual Linux desktops with VNC/streaming display for agent Computer Use and GUI automation.",
    iconName: "Monitor",
    popularCount: 12,
  },
  {
    id: "MicroVM",
    name: "MicroVM",
    description:
      "Hardware-isolated lightweight virtual machines with sub-second boot times and minimal memory footprint.",
    iconName: "Cpu",
    popularCount: 10,
  },
  {
    id: "Browser Sandbox",
    name: "Browser Sandbox",
    description:
      "Managed headless & headed Chromium environments with anti-bot, stealth proxies, and debugging.",
    iconName: "Globe",
    popularCount: 8,
  },
  {
    id: "Code Execution",
    name: "Code Execution",
    description:
      "Fast, secure REPL and multi-language script execution environments with isolation.",
    iconName: "Code2",
    popularCount: 15,
  },
  {
    id: "Self-hosted",
    name: "Self-hosted",
    description:
      "Open-source sandbox engines and runtimes you can deploy on your own bare-metal or cloud clusters.",
    iconName: "Server",
    popularCount: 11,
  },
  {
    id: "Code Sandbox",
    name: "Code Sandbox",
    description:
      "General-purpose hosted sandboxes for running untrusted code, from browser IDEs to API-first execution.",
    iconName: "Code2",
    popularCount: 58,
  },
  {
    id: "Desktop Sandbox",
    name: "Desktop Sandbox",
    description:
      "Full desktop sessions on a remote host, usually open-source and often self-hosted behind a web gateway.",
    iconName: "Monitor",
    popularCount: 17,
  },
  {
    id: "Mobile",
    name: "Mobile",
    description:
      "Android and iOS devices in the cloud, for testing apps and driving mobile-only agent workflows.",
    iconName: "Smartphone",
    popularCount: 2,
  },
];

export const EXPLORE_CATEGORIES = [
  "Code Sandbox",
  "Cloud Computer",
  "Browser Sandbox",
  "Desktop Sandbox",
  "MicroVM",
  "Self-hosted",
  "AI Agent Sandbox",
  "Code Execution",
  "Cloud Desktop",
  "Mobile",
];

export const RUNTIME_OPTIONS = [
  { id: "firecracker", label: "Firecracker MicroVM" },
  { id: "docker", label: "Docker / OCI" },
  { id: "gvisor", label: "gVisor Kernel" },
  { id: "v8_wasm", label: "V8 Isolate / Wasm" },
  { id: "kvm_kata", label: "Kata / KVM" },
  { id: "interpreter", label: "Language interpreter" },
];

export const BOOT_SPEED_OPTIONS = [
  { id: "instant", label: "< 200ms (Instant)" },
  { id: "subsecond", label: "< 1s (Sub-second)" },
  { id: "standard", label: "1s+ (Standard)" },
];

export const RESUME_SPEED_OPTIONS = [
  { id: "instant", label: "< 200ms (Instant resume)" },
  { id: "subsecond", label: "< 1s (Sub-second resume)" },
  { id: "standard", label: "1s+ (Slow resume)" },
];

export const PRICING_OPTIONS = ["Free Tier", "Pay as you go", "Subscription", "Enterprise"];

/**
 * How the number on a pricing page is actually charged. Seat, licence and
 * self-hosted plans cannot be compared to a per-hour rate, so they get their
 * own axis rather than being summed into one "price".
 */
export const BILLING_SHAPE_OPTIONS = [
  { id: "metered", label: "Per-hour / per-second" },
  { id: "seat", label: "Per seat / month" },
  { id: "self_hosted", label: "Runs on your machines" },
  { id: "software", label: "Licence only" },
];

export const IDLE_BILLING_OPTIONS = [
  { id: "idle_free", label: "Zero idle cost" },
  { id: "usage_metered", label: "Usage-metered" },
  { id: "wall_clock", label: "Wall-clock" },
];

export const PAUSE_STATE_OPTIONS = [
  { id: "memory", label: "Memory + processes" },
  { id: "disk", label: "Disk only" },
  { id: "none", label: "Nothing survives" },
];

export const DEPLOYMENT_OPTIONS = ["Cloud", "Self-hosted", "BYOC"];

/**
 * What the project actually ships. A hosted product and an embeddable runtime
 * are different adoption decisions even when both are open source.
 */
export const PRODUCT_TYPE_OPTIONS = [
  { id: "commercial_saas", label: "Commercial SaaS" },
  { id: "open_source_tool", label: "Open-source tool" },
  { id: "microvm_hypervisor", label: "MicroVM hypervisor" },
  { id: "runtime_engine", label: "Runtime engine" },
  { id: "source_available", label: "Source-available, no OSS license" },
];

/** Product lifecycle, not infrastructure maturity. */
export const STATUS_OPTIONS = [
  { id: "active", label: "Generally available / active" },
  { id: "beta", label: "Beta / preview" },
  { id: "deprecated", label: "Deprecated / archived" },
  { id: "unknown", label: "Status unconfirmed" },
];

/** License families, matched against the GitHub SPDX id per listing. Copyleft
 *  is one bucket because the buyer's question is redistribution terms, not the
 *  difference between GPL-2.0 and GPL-3.0. */
export const LICENSE_OPTIONS = [
  { id: "mit", label: "MIT" },
  { id: "apache", label: "Apache-2.0" },
  { id: "bsd", label: "BSD / ISC" },
  { id: "copyleft", label: "Copyleft (GPL / AGPL / MPL)" },
  { id: "other", label: "Other / unlisted" },
];

/**
 * What contains the workload. Kept separate from the runtime list because
 * "Docker" and "Firecracker" are both labels, but only one is a hardware
 * boundary, and buyers filter on strength, not on the label.
 */
export const ISOLATION_BOUNDARY_OPTIONS = [
  {
    id: "hardware",
    label: "Hardware VM",
    hint: "Separate kernel behind KVM, Firecracker, libkrun or a hypervisor",
  },
  {
    id: "kernel",
    label: "Kernel sandbox",
    hint: "Shared kernel, filtered by gVisor, namespaces, seccomp or containers",
  },
  {
    id: "userspace",
    label: "Userspace runtime",
    hint: "Wasm or interpreter isolation inside the host process",
  },
  {
    id: "none",
    label: "No containment boundary",
    hint: "Display, GUI or browser-profile isolation only; code runs as you",
  },
];

/** Languages with an official first-party SDK, not a community wrapper. */
export const SDK_LANGUAGE_OPTIONS = [
  { id: "TypeScript", label: "TypeScript" },
  { id: "Python", label: "Python" },
  { id: "Go", label: "Go" },
  { id: "Rust", label: "Rust" },
  { id: "Java", label: "Java" },
  { id: "Ruby", label: "Ruby" },
];

export const CAPABILITY_OPTIONS = [
  { id: "persistent", label: "Persistent" },
  { id: "snapshot", label: "Snapshot" },
  { id: "fork", label: "Fork" },
  { id: "gpu", label: "GPU" },
  { id: "desktop", label: "Desktop" },
  { id: "mobile", label: "Mobile" },
  { id: "browser", label: "Browser" },
  { id: "mcp", label: "MCP" },
  { id: "egressControl", label: "Egress Control" },
  { id: "autoSleep", label: "Pause / Auto-Sleep" },
  { id: "api", label: "API" },
  { id: "sdk", label: "SDK" },
  { id: "cli", label: "CLI" },
  { id: "webhook", label: "Webhook" },
  { id: "open source", label: "Open Source" },
];

/**
 * Compliance claims are worded differently across vendors ("SOC 2 Type II" vs
 * "SOC 2 Type 2" vs plain "SOC 2"), so the options are grouped and matched by
 * family in `matchesCompliance` rather than by exact string.
 */
export const COMPLIANCE_OPTIONS = [
  { id: "soc2", label: "SOC 2" },
  { id: "iso27001", label: "ISO 27001" },
  { id: "hipaa", label: "HIPAA" },
  { id: "gdpr", label: "GDPR" },
  { id: "zdr", label: "Zero data retention" },
];

/** Guest or host OS families documented in `techSpecs.operatingSystems`. */
export const OS_OPTIONS = [
  { id: "linux", label: "Linux" },
  { id: "macos", label: "macOS" },
  { id: "windows", label: "Windows" },
  { id: "android", label: "Android" },
  { id: "ios", label: "iOS" },
];
