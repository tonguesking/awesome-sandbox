import { ArrowRight, CheckCircle, Eye, Plus, Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import { SandboxCard } from "../components/sandbox/SandboxCard";
import type { Sandbox } from "../types/sandbox";

const CATEGORY_CHOICES = [
  "Code Sandbox",
  "AI Agent Sandbox",
  "Cloud Computer",
  "Browser Sandbox",
  "Desktop Sandbox",
  "MicroVM",
  "Self-hosted",
];

const RUNTIME_CHOICES = [
  { value: "firecracker", label: "AWS Firecracker MicroVM" },
  { value: "docker", label: "Docker / Container namespaces" },
  { value: "gvisor", label: "Google gVisor" },
  { value: "other", label: "Other / custom hypervisor" },
];

const CAPABILITY_CHOICES = [
  { key: "persistent", label: "Persistent storage" },
  { key: "snapshot", label: "Instant snapshot" },
  { key: "fork", label: "Fast forking" },
  { key: "gpu", label: "GPU acceleration" },
  { key: "desktop", label: "GUI desktop / VNC" },
  { key: "mobile", label: "Mobile / phone sandbox" },
  { key: "browser", label: "Browser sandbox" },
  { key: "egressControl", label: "Egress firewall control" },
  { key: "autoSleep", label: "Pause / auto-sleep" },
  { key: "api", label: "REST API" },
  { key: "sdk", label: "Python / TS SDK" },
  { key: "cli", label: "CLI tool" },
  { key: "mcp", label: "MCP protocol" },
] as const;

const PRICING_CHOICES = ["Free Tier", "Pay as you go", "Subscription", "Enterprise"];

const INITIAL_FORM = {
  name: "",
  website: "",
  github: "",
  openSourceLicense: false,
  documentation: "",
  description: "",
  categories: ["Code Sandbox", "AI Agent Sandbox"],
  runtimeType: "firecracker",
  deploymentCloud: true,
  deploymentSelfHosted: false,
  deploymentByoc: false,
  capabilities: {
    persistent: false,
    snapshot: true,
    fork: false,
    gpu: false,
    desktop: false,
    mobile: false,
    browser: false,
    egressControl: true,
    autoSleep: false,
    api: true,
    sdk: true,
    cli: true,
    mcp: true,
  } as Record<(typeof CAPABILITY_CHOICES)[number]["key"], boolean>,
  pricingModels: ["Free Tier", "Pay as you go"],
  pricingUrl: "",
  submitterEmail: "",
};

const inputClass =
  "w-full px-3 py-2 bg-[#080B1A] border border-[#262C4A] hover:border-[#3A4370] text-xs text-[#F2F3FA] placeholder:text-[#8289AA] rounded-lg focus:outline-none focus:border-[#6D4DFF] transition-colors";

const fieldLabelClass = "text-xs font-semibold text-[#F2F3FA] block mb-1";

export function SubmitPage() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [issueUrl, setIssueUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const set = <K extends keyof typeof INITIAL_FORM>(key: K, value: (typeof INITIAL_FORM)[K]) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const toggleCapability = (key: keyof typeof formData.capabilities) => {
    setFormData((prev) => ({
      ...prev,
      capabilities: { ...prev.capabilities, [key]: !prev.capabilities[key] },
    }));
  };

  const togglePricing = (model: string) => {
    setFormData((prev) => ({
      ...prev,
      pricingModels: prev.pricingModels.includes(model)
        ? prev.pricingModels.filter((m) => m !== model)
        : [...prev.pricingModels, model],
    }));
  };

  const hasGithub = formData.github.trim().length > 0;

  const previewSandbox: Sandbox = {
    id: "preview",
    slug: "preview",
    name: formData.name.trim() || "My Sandbox Service",
    description:
      formData.description.trim() ||
      "Fast and secure isolated sandbox execution environment for AI agents.",
    logo: formData.name.trim() ? formData.name.trim().slice(0, 2).toUpperCase() : "SB",
    logoBg: "#6D4DFF",
    logoTextColor: "#FFFFFF",
    website: formData.website || "https://example.com",
    productType: hasGithub
      ? formData.openSourceLicense
        ? "open_source_tool"
        : "source_available"
      : "commercial_saas",
    categories: formData.categories.length > 0 ? formData.categories : ["Code Sandbox"],
    runtime: {
      firecracker: formData.runtimeType === "firecracker",
      docker: formData.runtimeType === "docker",
      gvisor: formData.runtimeType === "gvisor",
    },
    deployment: {
      cloud: formData.deploymentCloud,
      selfHosted: formData.deploymentSelfHosted,
      byoc: formData.deploymentByoc,
    },
    capabilities: formData.capabilities,
    pricing: {
      model: formData.pricingModels,
      freeTier: formData.pricingModels.includes("Free Tier"),
      transparency: "unverified",
    },
    openSource: hasGithub && formData.openSourceLicense,
    status: "active",
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim()) {
      setErrorMsg("Product name is required.");
      return;
    }
    if (!formData.website.trim()) {
      setErrorMsg("Website URL is required.");
      return;
    }
    if (!formData.description.trim()) {
      setErrorMsg("Short description is required.");
      return;
    }
    if (formData.categories.length === 0) {
      setErrorMsg("Select at least one category.");
      return;
    }

    const title = `New sandbox submission: ${formData.name.trim()}`;
    const body = [
      "### Product name",
      formData.name.trim(),
      "",
      "### Website",
      formData.website.trim(),
      "",
      "### GitHub repository",
      formData.github.trim() || "_none_",
      "",
      "### Documentation URL",
      formData.documentation.trim() || "_none_",
      "",
      "### Short description",
      formData.description.trim(),
      "",
      "### Categories",
      formData.categories.join(", "),
      "",
      "### Underlying runtime",
      formData.runtimeType,
      "",
      "### Deployment options",
      [
        formData.deploymentCloud && "Cloud",
        formData.deploymentSelfHosted && "Self-hosted",
        formData.deploymentByoc && "BYOC",
      ]
        .filter(Boolean)
        .join(", ") || "_none_",
      "",
      "### Capabilities",
      Object.entries(formData.capabilities)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(", ") || "_none_",
      "",
      "### Pricing model",
      formData.pricingModels.join(", ") || "_none_",
      "",
      "### Pricing URL",
      formData.pricingUrl.trim() || "_none_",
      "",
      "### Submitter email",
      formData.submitterEmail.trim() || "_none_",
      "",
      "### Open source",
      hasGithub && formData.openSourceLicense ? "Yes (OSI-approved license)" : "No",
    ].join("\n");

    const url = `https://github.com/tonguesking/awesome-sandbox/issues/new?title=${encodeURIComponent(
      title,
    )}&body=${encodeURIComponent(body)}&labels=submission`;

    window.open(url, "_blank", "noopener,noreferrer");
    setIssueUrl(url);
  };

  if (issueUrl) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#4ADE80]/30 bg-[#123524] text-[#4ADE80]">
          <CheckCircle aria-hidden="true" className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-extrabold text-2xl text-[#F2F3FA] tracking-tight sm:text-3xl">
            GitHub issue opened
          </h1>
          <p className="mx-auto max-w-lg text-[#9BA1BE] text-sm">
            A new issue with your submission details has been opened in a new tab. Review it and
            click “Submit new issue” on GitHub to propose your listing. Pricing claims stay “Pending
            audit” until verified against official docs.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            className="flex items-center gap-1.5 rounded-full bg-[#6D4DFF] px-5 py-2.5 font-semibold text-white text-xs transition-colors hover:bg-[#7B5EFF]"
            href={issueUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span>Open issue again</span>
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </a>

          <button
            className="cursor-pointer rounded-full border border-[#262C4A] bg-[#131625] px-5 py-2.5 font-semibold text-[#C7CCE2] text-xs transition-colors hover:border-[#3A4370] hover:bg-[#1A1E32]"
            onClick={() => {
              setFormData(INITIAL_FORM);
              setIssueUrl(null);
            }}
            type="button"
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-6 pb-20">
      {/* Header */}
      <div className="border-[#262C4A] border-b pb-4">
        <div className="mb-2 inline-flex items-center gap-2 font-semibold text-[#A78BFA] text-xs uppercase tracking-wider">
          <Plus aria-hidden="true" className="h-4 w-4" />
          <span>Community contribution</span>
        </div>
        <h1 className="font-extrabold text-2xl text-[#F2F3FA] tracking-tight md:text-3xl">
          Submit a sandbox infrastructure
        </h1>
        <p className="mt-1 max-w-2xl text-[#9BA1BE] text-sm">
          Help developers and AI researchers discover new sandbox runtimes, microVM systems, and
          cloud computer solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <form className="space-y-4 lg:col-span-7" onSubmit={handleSubmit}>
          {errorMsg && (
            <div
              className="rounded-[12px] border border-[#F87171]/40 bg-[#2A1215] p-3 text-[#FCA5A5] text-xs"
              role="alert"
            >
              {errorMsg}
            </div>
          )}

          {/* 1. Basics */}
          <section className="space-y-4 rounded-[14px] border border-[#262C4A] bg-[#131625] p-5">
            <h2 className="border-[#262C4A] border-b pb-2 font-bold text-[#F2F3FA] text-sm uppercase tracking-wider">
              1. Basic information
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={fieldLabelClass} htmlFor="product-name">
                  Product name <span className="text-[#A78BFA]">*</span>
                </label>
                <input
                  className={inputClass}
                  id="product-name"
                  onChange={(event) => set("name", event.target.value)}
                  placeholder="e.g. Acme Sandbox"
                  required
                  type="text"
                  value={formData.name}
                />
              </div>

              <div>
                <label className={fieldLabelClass} htmlFor="product-website">
                  Website URL <span className="text-[#A78BFA]">*</span>
                </label>
                <input
                  className={inputClass}
                  id="product-website"
                  onChange={(event) => set("website", event.target.value)}
                  placeholder="https://example.com"
                  required
                  type="url"
                  value={formData.website}
                />
              </div>
            </div>

            <div>
              <label className={fieldLabelClass} htmlFor="product-description">
                Tagline / short description <span className="text-[#A78BFA]">*</span>
              </label>
              <textarea
                className={`${inputClass} resize-y leading-relaxed`}
                id="product-description"
                onChange={(event) => set("description", event.target.value)}
                placeholder="One sentence describing what makes this sandbox unique..."
                required
                rows={2}
                value={formData.description}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={fieldLabelClass} htmlFor="product-github">
                  GitHub repository <span className="font-normal text-[#8289AA]">(optional)</span>
                </label>
                <input
                  className={inputClass}
                  id="product-github"
                  onChange={(event) => set("github", event.target.value)}
                  placeholder="https://github.com/..."
                  type="url"
                  value={formData.github}
                />
                <label className="mt-2 flex cursor-pointer items-center gap-2 text-[#9BA1BE] text-[11px]">
                  <input
                    checked={formData.openSourceLicense}
                    className="h-3.5 w-3.5 cursor-pointer"
                    disabled={!hasGithub}
                    onChange={(event) => set("openSourceLicense", event.target.checked)}
                    type="checkbox"
                  />
                  Repository carries an OSI-approved open-source license
                </label>
              </div>

              <div>
                <label className={fieldLabelClass} htmlFor="product-docs">
                  Documentation URL <span className="font-normal text-[#8289AA]">(optional)</span>
                </label>
                <input
                  className={inputClass}
                  id="product-docs"
                  onChange={(event) => set("documentation", event.target.value)}
                  placeholder="https://docs.example.com"
                  type="url"
                  value={formData.documentation}
                />
              </div>
            </div>
          </section>

          {/* 2. Architecture */}
          <section className="space-y-4 rounded-[14px] border border-[#262C4A] bg-[#131625] p-5">
            <h2 className="border-[#262C4A] border-b pb-2 font-bold text-[#F2F3FA] text-sm uppercase tracking-wider">
              2. Architecture &amp; categories
            </h2>

            <fieldset>
              <legend className="mb-2 font-semibold text-[#F2F3FA] text-xs">
                Primary categories
              </legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {CATEGORY_CHOICES.map((category) => (
                  <label
                    className="flex cursor-pointer select-none items-center gap-2 rounded-lg border border-[#262C4A] bg-[#080B1A] p-2 text-[#C7CCE2] text-xs transition-colors hover:border-[#3A4370] hover:text-[#F2F3FA]"
                    key={category}
                  >
                    <input
                      checked={formData.categories.includes(category)}
                      className="h-3.5 w-3.5 cursor-pointer"
                      onChange={() => toggleCategory(category)}
                      type="checkbox"
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2">
              <div>
                <label className={fieldLabelClass} htmlFor="product-runtime">
                  Underlying runtime
                </label>
                <select
                  className={`${inputClass} cursor-pointer`}
                  id="product-runtime"
                  onChange={(event) => set("runtimeType", event.target.value)}
                  value={formData.runtimeType}
                >
                  {RUNTIME_CHOICES.map((choice) => (
                    <option key={choice.value} value={choice.value}>
                      {choice.label}
                    </option>
                  ))}
                </select>
              </div>

              <fieldset>
                <legend className={fieldLabelClass}>Deployment options</legend>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1.5 text-[#C7CCE2] text-xs">
                  {[
                    { key: "deploymentCloud" as const, label: "Cloud" },
                    {
                      key: "deploymentSelfHosted" as const,
                      label: "Self-hosted",
                    },
                    { key: "deploymentByoc" as const, label: "BYOC" },
                  ].map((option) => (
                    <label className="flex cursor-pointer items-center gap-1.5" key={option.key}>
                      <input
                        checked={formData[option.key]}
                        className="h-3.5 w-3.5 cursor-pointer"
                        onChange={(event) => set(option.key, event.target.checked)}
                        type="checkbox"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>

          {/* 3. Capabilities */}
          <section className="space-y-4 rounded-[14px] border border-[#262C4A] bg-[#131625] p-5">
            <h2 className="border-[#262C4A] border-b pb-2 font-bold text-[#F2F3FA] text-sm uppercase tracking-wider">
              3. Features &amp; capabilities
            </h2>

            <fieldset>
              <legend className="sr-only">Supported capabilities</legend>
              <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                {CAPABILITY_CHOICES.map((item) => (
                  <label
                    className="flex cursor-pointer select-none items-center gap-2 rounded-lg border border-[#262C4A] bg-[#080B1A] p-2 text-[#C7CCE2] transition-colors hover:border-[#3A4370] hover:text-[#F2F3FA]"
                    key={item.key}
                  >
                    <input
                      checked={formData.capabilities[item.key]}
                      className="h-3.5 w-3.5 cursor-pointer"
                      onChange={() => toggleCapability(item.key)}
                      type="checkbox"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </section>

          {/* 4. Pricing & contact */}
          <section className="space-y-4 rounded-[14px] border border-[#262C4A] bg-[#131625] p-5">
            <h2 className="border-[#262C4A] border-b pb-2 font-bold text-[#F2F3FA] text-sm uppercase tracking-wider">
              4. Pricing &amp; contact
            </h2>

            <fieldset>
              <legend className="mb-2 font-semibold text-[#F2F3FA] text-xs">Pricing model</legend>
              <div className="flex flex-wrap gap-2">
                {PRICING_CHOICES.map((model) => (
                  <label
                    className="flex cursor-pointer select-none items-center gap-1.5 rounded-lg border border-[#262C4A] bg-[#080B1A] px-3 py-1.5 text-[#C7CCE2] text-xs transition-colors hover:border-[#3A4370]"
                    key={model}
                  >
                    <input
                      checked={formData.pricingModels.includes(model)}
                      className="h-3.5 w-3.5 cursor-pointer"
                      onChange={() => togglePricing(model)}
                      type="checkbox"
                    />
                    <span>{model}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={fieldLabelClass} htmlFor="product-pricing-url">
                  Pricing URL
                </label>
                <input
                  className={inputClass}
                  id="product-pricing-url"
                  onChange={(event) => set("pricingUrl", event.target.value)}
                  placeholder="https://example.com/pricing"
                  type="url"
                  value={formData.pricingUrl}
                />
              </div>

              <div>
                <label className={fieldLabelClass} htmlFor="product-email">
                  Submitter email <span className="font-normal text-[#8289AA]">(optional)</span>
                </label>
                <input
                  className={inputClass}
                  id="product-email"
                  onChange={(event) => set("submitterEmail", event.target.value)}
                  placeholder="author@example.com"
                  type="email"
                  value={formData.submitterEmail}
                />
              </div>
            </div>
          </section>

          <button
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[12px] bg-[#6D4DFF] py-3 font-semibold text-white text-xs transition-colors hover:bg-[#7B5EFF] active:bg-[#5D3DF0]"
            type="submit"
          >
            <Send aria-hidden="true" className="h-4 w-4" />
            <span>Submit sandbox to directory</span>
          </button>
        </form>

        {/* Live preview */}
        <div className="space-y-3 lg:sticky lg:top-[84px] lg:col-span-5">
          <div className="flex items-center gap-2 font-semibold text-[#9BA1BE] text-xs">
            <Eye aria-hidden="true" className="h-4 w-4 text-[#A78BFA]" />
            <span>Live directory card preview</span>
          </div>

          <SandboxCard sandbox={previewSandbox} />

          <div className="space-y-2 rounded-[14px] border border-[#262C4A] bg-[#131625] p-4 text-[#9BA1BE] text-xs">
            <div className="font-semibold text-[#F2F3FA]">Submission guidelines</div>
            <ul className="list-inside list-disc space-y-1 text-[11px] leading-relaxed">
              <li>
                Submissions must be legitimate sandbox infrastructure, runtimes, or dev
                environments.
              </li>
              <li>Generic chatbot apps or wrapper frontends will not be listed.</li>
              <li>Pricing claims stay “Pending audit” until verified against official docs.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
