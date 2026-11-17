export type ProductType =
  | "commercial_saas"
  | "open_source_tool"
  | "microvm_hypervisor"
  | "runtime_engine"
  | "source_available";

export type SandboxStatus = "active" | "beta" | "deprecated" | "unknown";

export type PricingTransparency = "official_verified" | "unverified" | "quote_only";

/** How a provider charges while a sandbox is idle or suspended. */
export type IdleBilling = "idle_free" | "wall_clock" | "usage_metered";

/** What a provider keeps when a sandbox is paused or suspended. */
export type PauseStateRetention = "memory" | "disk" | "none";

export interface SandboxLifecycle {
  /** Whether idle/suspended time is billed. */
  idleBilling?: IdleBilling;
  /** State retained across pause: live memory+processes, disk only, or nothing. */
  pauseRetains?: PauseStateRetention;
  /** Published resume latency, e.g. "~25ms", "a few seconds". */
  resumeTime?: string;
  /** Maximum session lifetime, e.g. "24h", "unlimited". */
  sessionLimit?: string;
}

export interface SandboxRuntime {
  docker?: boolean | null;
  firecracker?: boolean | null;
  gvisor?: boolean | null;
  other?: string[];
}

export interface SandboxDeployment {
  byoc?: boolean;
  cloud?: boolean;
  selfHosted?: boolean;
}

export interface SandboxCapabilities {
  api?: boolean | null;
  autoSleep?: boolean | null; // Pause / resume or idle hibernation
  browser?: boolean | null;
  cli?: boolean | null;
  desktop?: boolean | null;
  egressControl?: boolean | null; // Network egress allowlists / firewall
  fork?: boolean | null;
  gpu?: boolean | null;
  mcp?: boolean | null;
  mobile?: boolean | null; // Mobile / Android / Phone Cloud Sandbox
  persistent?: boolean | null;
  sdk?: boolean | null;
  snapshot?: boolean | null;
  webhook?: boolean | null;
}

export interface SandboxPricing {
  billingUnit?: string;
  costSummary?: string;
  freeTier?: boolean | null;
  model?: string[]; // 'Free Tier', 'Pay as you go', 'Subscription', 'Enterprise'
  pricingUrl?: string;
  transparency?: PricingTransparency;
  verifiedAt?: string;
}

export interface SandboxTechSpecs {
  bootTime?: string;
  maxRam?: string;
  maxVcpu?: string;
  networkIsolation?: string;
  operatingSystems?: string[];
  storageLimit?: string;
}

export interface SandboxSampleCode {
  code: string;
  filename: string;
  language: string;
}

export interface Sandbox {
  alternatives?: string[]; // slugs
  /** Slugs of products this one is built on top of, not merely alternatives. */
  builtOn?: string[];
  capabilities: SandboxCapabilities;
  categories: string[]; // 'Code Sandbox', 'Cloud Computer', 'Browser Sandbox', 'Desktop Sandbox', 'MicroVM', 'Self-hosted', 'AI Agent Sandbox', 'Code Execution'
  /** Compliance attestations, e.g. "SOC 2 Type 2", "HIPAA", "GDPR". */
  compliance?: string[];

  createdAt: string;
  deployment: SandboxDeployment;
  description: string;
  documentation?: string;
  featured?: boolean;
  github?: string;
  githubStars?: number;
  id: string;
  keyFeatures?: string[];
  lifecycle?: SandboxLifecycle;
  logo: string;
  logoBg?: string;
  logoTextColor?: string;
  name: string;

  openSource: boolean;
  overview?: string;
  pricing: SandboxPricing;

  productType: ProductType;
  rating?: number;
  relatedGuideIds?: string[];

  runtime: SandboxRuntime;
  sampleCode?: SandboxSampleCode;
  /** First-class SDK languages, e.g. "TypeScript", "Python". */
  sdkLanguages?: string[];
  slug: string;

  status: SandboxStatus;

  /** Contact supplied by a community submitter. */
  submittedBy?: string;

  techSpecs?: SandboxTechSpecs;
  updatedAt: string;
  website: string;
}

export interface FilterState {
  billingShapes: string[];
  bootSpeeds: string[];
  capabilities: string[];
  categories: string[];
  compliance: string[];
  deployment: string[];
  /** Keep only listings that document pricing, containment and egress, the
   *  three claims a buyer cannot infer from a logo or a feature grid. */
  documentedCoreOnly: boolean;
  /** Hide products sold only as a hosted service, keeping self-hostable ones. */
  excludeCloudOnly: boolean;
  /** Hide deprecated and archived products, leaving live options only. */
  excludeDeprecated: boolean;
  /** Drop quote-only listings, whose price cannot be read without a sales call. */
  excludeQuoteOnly: boolean;
  favoritesOnly: boolean;
  idleBilling: string[];
  /** Containment tier: hardware VM, kernel sandbox, or userspace runtime. */
  isolationBoundaries: string[];
  /** Repository license family (MIT, Apache-2.0, copyleft...), from GitHub SPDX. */
  licenses: string[];
  /** Minimum editorial rating out of five, e.g. 4 or 4.5; 0 means no floor. */
  minRating: number;
  /** Minimum GitHub stars; 0 means no floor. Vendor products without a public repository are hidden once a floor is set. */
  minStars: number;
  openSourceOnly: boolean;
  operatingSystems: string[];
  pauseStates: string[];
  pricing: string[];
  /** What the project ships: hosted product, open-source tool, hypervisor or runtime engine. */
  productTypes: string[];
  /** Published pause-resume latency tiers. */
  resumeSpeeds: string[];
  runtimes: string[];
  /** Official client SDK languages, e.g. TypeScript, Python, Go. */
  sdkLanguages: string[];
  search: string;
  sortBy:
    | "popularity"
    | "stars"
    | "name"
    | "recently_added"
    | "recently_updated"
    | "open_source"
    | "rating"
    | "boot_speed"
    | "resume_speed"
    | "documented";
  /** Product lifecycle: active, beta, or unknown. */
  statuses: string[];
  /** Only show listings whose pricing was checked against an official source. */
  verifiedPricingOnly: boolean;
  viewMode: "grid" | "list";
}

export interface CostCalculatorInput {
  activeDaysPerMonth: number;
  activeHoursPerDay: number;
  customRamGbHourlyRate?: number;
  customStorageGbMonthlyRate?: number;
  customVcpuHourlyRate?: number;
  enableIdleSuspend: boolean;
  idleSuspendPercentage: number; // e.g. 50%
  memoryGb: number;
  sandboxesCount: number;
  storageGb: number;
  vCpu: number;
}

export interface CostCalculatorResult {
  estimatedCostUsd: number;
  hourlyTotalUsd: number;
  monthlyComputeHoursTotal: number;
  monthlyCpuHours: number;
  monthlyEffectiveHours: number;
  monthlyRamGbHours: number;
  monthlyStorageGbTotal: number;
  providerComparisons: {
    providerName: string;
    estimatedCostUsd: number | null;
    isVerified: boolean;
    notes: string;
  }[];
  savingsFromSuspendUsd: number;
}
