import type { Sandbox } from "../types/sandbox";
import { ECOSYSTEM_SANDBOXES } from "./sandboxes-ecosystem";
import { COLLECTED_SANDBOXES } from "./sandboxes-data";

const CORE_SANDBOXES: Sandbox[] = [
  {
    id: "omarchy",
    slug: "omarchy",
    name: "Omarchy",
    description:
      "Opinionated Arch Linux OS & Cloud Sandboxes with pre-wired AI agent harnesses and digital twin clones.",
    logo: "OM",
    logoBg: "#1E1E2E",
    logoTextColor: "#CBA6F7",
    website: "https://omarchy.org",
    documentation: "https://omarchy.org",
    github: "https://github.com/omacom/omarchy",
    productType: "open_source_tool",
    categories: ["Cloud Computer", "AI Agent Sandbox", "Desktop Sandbox", "Self-hosted"],
    runtime: {
      firecracker: true,
      docker: true,
      gvisor: false,
      other: ["Arch Linux with Hyprland & Waybar"],
    },
    deployment: {
      cloud: true,
      selfHosted: true,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: true,
      gpu: true,
      desktop: true,
      mobile: false,
      browser: true,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: true,
      cli: true,
      mcp: true,
      webhook: true,
    },
    pricing: {
      model: ["Free Tier"],
      freeTier: true,
      pricingUrl: "https://omarchy.org",
      verifiedAt: "2026-11-15",
      costSummary:
        "Omarchy is a free Arch-based Linux distribution you install on your own machine; there is no hosted sandbox rate. Development is funded through the Omacom Foundation, not usage fees.",
      billingUnit: "your own hardware",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "32 vCPU",
      maxRam: "64 GB RAM",
      storageLimit: "100 GB NVMe",
      bootTime: "~400ms",
      networkIsolation:
        "Private overlay with automated credential scrubbing (.env, SSH keys, tool tokens) prior to agent handoff.",
      operatingSystems: ["Arch Linux (Rolling release kernel with Hyprland)"],
    },
    overview:
      'Created by David Heinemeier Hansson (DHH) and the open-source agent community, Omarchy is an opinionated Arch Linux distribution and cloud sandbox infrastructure built as a "malleable OS for the age of AI agents". It integrates agent harnesses (Claude Code, OpenCode, Hermes) directly into the desktop, allowing models to inspect windows, tweak configs, and write tools. The Omarchy Cloud Sandbox allows spinning up "Digital Twins" of developer environments that automatically scrub sensitive credentials before agents execute.',
    keyFeatures: [
      "Pre-wired AI agent harnesses (Claude Code, OpenCode, Hermes) on first boot",
      "System-level MCP integrations for complete desktop & window control",
      "Digital Twin Clones: mirrors exact workstation setup without leaking secrets",
      "Hyprland Wayland compositor with automated UI scripting for visual agents",
      "100% Open Source Arch-based foundation with rolling release updates",
    ],
    sampleCode: {
      language: "bash",
      filename: "omarchy-agent-twin.sh",
      code: `# Spin up a secure Omarchy digital twin sandbox for Claude Code
omarchy sandbox create --twin --strip-secrets \\
  --harness claude-code \\
  --task "Audit dependency vulnerabilities and build Dockerfile"

# Inspect running agent inside Hyprland virtual display
omarchy sandbox attach --view-desktop`,
    },
    openSource: true,
    githubStars: 47_041,
    featured: true,
    rating: 4.9,
    status: "active",
    lifecycle: {
      idleBilling: "idle_free",
      pauseRetains: "disk",
      resumeTime: "Seconds",
      sessionLimit: "Seat-based",
    },
    alternatives: ["daytona", "kasm"],
    relatedGuideIds: [
      "ai-agent-sandbox-guide",
      "e2b-vs-daytona",
      "egress-and-credential-isolation",
    ],
    createdAt: "2024-06-01",
    updatedAt: "2024-11-10",
  },
  {
    id: "mobilebox",
    slug: "mobilebox",
    name: "Mobilebox",
    description:
      "Cloud-based disposable Android & iOS mobile sandboxes for autonomous AI agents with touch, swipe, and MCP.",
    logo: "📱",
    logoBg: "#059669",
    logoTextColor: "#FFFFFF",
    website: "https://mobilebox.dev",
    documentation: "https://mobilebox.dev",
    productType: "commercial_saas",
    categories: ["AI Agent Sandbox", "Cloud Computer"],
    runtime: {
      docker: true,
      firecracker: false,
      gvisor: false,
      other: ["Cloud Android (AOSP) & Virtual iOS"],
    },
    deployment: {
      cloud: true,
      selfHosted: false,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: true,
      gpu: true,
      desktop: false,
      mobile: true,
      browser: true,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: true,
      cli: true,
      mcp: true,
      webhook: true,
    },
    pricing: {
      model: ["Pay as you go"],
      freeTier: false,
      pricingUrl: "https://mobilebox.dev/pricing",
      verifiedAt: "2026-11-15",
      costSummary:
        "Cloud Android phones cost $0.01 per phone-minute billed by the second while the phone runs; boot time is free. iPhone and iPad cost $0.05 per phone-minute, real Android devices $0.01, and dedicated devices start at $79/month. Residential IPs add $8/GB and mobile-carrier IPs $15/GB.",
      billingUnit: "per phone-minute, billed by the second",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "8 vCPU",
      maxRam: "16 GB RAM",
      storageLimit: "32 GB flash storage",
      bootTime: "< 1s",
      networkIsolation: "Carrier cellular proxy network and isolated bridge.",
      operatingSystems: ["Android 14 (AOSP)", "iOS Simulator"],
    },
    overview:
      "Mobilebox is the premier cloud phone and mobile sandbox built specifically for autonomous mobile agents and AI app testers. It spins up virtual Android and iOS devices in the cloud, allowing agents to see mobile screens, tap UI elements, swipe, type, install APKs, and handle multi-factor SMS flows via MCP and REST APIs.",
    keyFeatures: [
      "Disposable cloud Android and iOS mobile sandboxes launched in seconds",
      "Native touch, swipe, pinch, and scroll programmatic APIs for vision models",
      "Pre-installed Google Play Services, ADB remote bridge, and APK sideloading",
      "Virtual SIM card support for testing SMS OTP verifications",
      "Direct Model Context Protocol (MCP) server for mobile agent workflows",
    ],
    sampleCode: {
      language: "typescript",
      filename: "mobile_agent.ts",
      code: `import { Mobilebox } from '@mobilebox/sdk';

// Launch a cloud Android phone sandbox for mobile agent
const phone = await Mobilebox.create({
  os: 'android-14',
  device: 'pixel-8'
});

// Install APK and interact with mobile touch coordinates
await phone.installApp('./build/app-release.apk');
await phone.touch({ x: 540, y: 1200 }); // Tap button
await phone.swipe({ from: [540, 1600], to: [540, 400], durationMs: 200 }); // Scroll

const screenshot = await phone.getScreenshot();
await phone.destroy();`,
    },
    openSource: false,
    featured: true,
    rating: 4.8,
    status: "active",
    lifecycle: {
      idleBilling: "usage_metered",
      pauseRetains: "disk",
      resumeTime: "Seconds",
      sessionLimit: "Session-based",
    },
    alternatives: ["redroid", "cua"],
    relatedGuideIds: [
      "mobile-sandboxes-guide",
      "desktop-environments-guide",
      "ai-agent-sandbox-guide",
      "egress-and-credential-isolation",
    ],
    createdAt: "2024-07-15",
    updatedAt: "2024-11-05",
  },
  {
    id: "redroid",
    slug: "redroid",
    name: "Redroid",
    description:
      "GPU-accelerated open-source Android in Cloud container sandbox for mobile automation and AI agents.",
    logo: "🤖",
    logoBg: "#3DDC84",
    logoTextColor: "#000000",
    website: "https://github.com/remote-android/redroid-doc",
    documentation: "https://github.com/remote-android/redroid-doc",
    github: "https://github.com/remote-android/redroid-doc",
    productType: "open_source_tool",
    categories: ["Self-hosted", "AI Agent Sandbox"],
    runtime: {
      docker: true,
      firecracker: false,
      gvisor: false,
      other: ["AOSP Container with binder & ashmem kernel modules"],
    },
    deployment: {
      cloud: true,
      selfHosted: true,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: false,
      fork: false,
      gpu: true,
      desktop: false,
      mobile: true,
      browser: true,
      egressControl: false,
      autoSleep: false,
      api: true,
      sdk: false,
      cli: true,
      mcp: false,
      webhook: false,
    },
    pricing: {
      model: ["Free Tier"],
      freeTier: true,
      pricingUrl: "https://github.com/remote-android/redroid-doc",
      verifiedAt: "2026-11-15",
      costSummary:
        "Open-source Android container images built on AOSP; there is no vendor rate, so you pay only for the host machine. The project splits across many AOSP-derived repos, so check the licence of the image you deploy.",
      billingUnit: "infrastructure hosting only",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "Host hardware bounded",
      maxRam: "Host hardware bounded",
      storageLimit: "Host docker volume mapping",
      bootTime: "~3 - 5s",
      networkIsolation: "Docker bridge network with isolated adb daemon.",
      operatingSystems: ["Android 11, 12, 13, 14 AOSP"],
    },
    overview:
      "Redroid (Remote Android) is an open-source, GPU-accelerated Android-in-Cloud system. It enables developers and AI researchers to run multiple isolated Android instances inside Docker containers on Linux bare-metal hosts with hardware GPU passthrough for gaming, mobile app testing, and autonomous mobile agents.",
    keyFeatures: [
      "Runs multiple Android instances concurrently on a single Linux host",
      "GPU acceleration via host graphics drivers (NVIDIA, AMD, Intel)",
      "Native ADB connection support over standard TCP sockets",
      "Zero-latency WebRTC and scrcpy video streaming capabilities",
      "Ideal for hosting self-hosted mobile agent farms",
    ],
    sampleCode: {
      language: "bash",
      filename: "run_redroid.sh",
      code: `# Run an isolated Android 14 container with GPU acceleration
docker run -itd --rm --privileged \\
  --pull always \\
  -v ~/data11:/data \\
  -p 5555:5555 \\
  redroid/redroid:14.0.0-latest \\
  androidboot.hardware=mt6885 \\
  ro.secure=0 \\
  ro.boot.hwcomposer=ranchu \\
  androidboot.redroid_gpu_mode=guest

# Connect ADB from mobile AI agent prober
adb connect localhost:5555
adb shell input tap 500 800`,
    },
    openSource: true,
    githubStars: 7145,
    featured: false,
    rating: 4.7,
    status: "active",
    lifecycle: {
      idleBilling: "idle_free",
      pauseRetains: "none",
      resumeTime: "Instant (local container)",
      sessionLimit: "Local process lifetime",
    },
    alternatives: ["mobilebox"],
    relatedGuideIds: [
      "mobile-sandboxes-guide",
      "self-hosted-vs-cloud",
      "desktop-environments-guide",
    ],
    createdAt: "2021-03-01",
    updatedAt: "2024-10-20",
  },
  {
    id: "e2b",
    slug: "e2b",
    name: "E2B",
    description: "AI Agent code execution sandbox powered by Firecracker MicroVMs.",
    logo: "E2B",
    logoBg: "#1F2937",
    logoTextColor: "#FFFFFF",
    website: "https://e2b.dev",
    documentation: "https://e2b.dev/docs",
    github: "https://github.com/e2b-dev/E2B",
    productType: "commercial_saas",
    categories: ["Code Sandbox", "MicroVM", "AI Agent Sandbox", "Code Execution"],
    runtime: {
      firecracker: true,
      docker: false,
      gvisor: false,
      other: ["Linux MicroVM (KVM)"],
    },
    deployment: {
      cloud: true,
      selfHosted: false,
      byoc: true,
    },
    capabilities: {
      persistent: false,
      snapshot: true,
      fork: true,
      gpu: false,
      desktop: false,
      browser: false,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: true,
      cli: true,
      mcp: true,
      webhook: true,
    },
    pricing: {
      model: ["Free Tier", "Subscription", "Pay as you go"],
      freeTier: true,
      pricingUrl: "https://e2b.dev/pricing",
      verifiedAt: "2026-11-15",
      costSummary:
        "Hobby is free with a one-time $100 usage credit, 10 concurrent sandboxes and sessions up to 1 hour. Pro is $150/month plus usage billed by the second, 100 concurrent and sessions up to 24 hours; concurrency add-ons cost $500/month for 600 and $1,000/month for 1,100. Enterprise starts at a $2,000/month commit with 500 concurrent included, multi-day persistent sessions and BYOC. Usage rates are published per second: 1 vCPU $0.000014, the 2 vCPU default $0.000028, 4 vCPU $0.000056 and 8 vCPU $0.000112; memory is $0.0000045 per GiB-second, so the 4 GiB default adds $0.000018. A default 2 vCPU / 4 GiB sandbox therefore runs at $0.000046 per second, about $0.166 per hour. Disk is free at 10 GiB on Hobby and 20 GiB on Pro.",
      billingUnit: "per-second CPU and memory while the sandbox runs",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "8 vCPU",
      maxRam: "8 GB RAM",
      storageLimit: "10 GB rootfs",
      bootTime: "< 150ms",
      networkIsolation:
        "Strict virtual TAP/TUN isolation with configurable outbound internet egress.",
      operatingSystems: ["Ubuntu 22.04 LTS (Custom microVM kernel)"],
    },
    overview:
      "E2B is the reference implementation of the agent-sandbox category, and most of the newer listings in this catalog are either clones of its API or reactions to its pricing. The model is simple: a Firecracker microVM per sandbox, booting in well under a second, addressed through a Python or TypeScript SDK with streaming stdout and stderr, so an agent can run untrusted code and read the output as it arrives. Templates are ordinary Dockerfiles, which means the environment is something you build and version rather than configure at runtime, and sessions can be paused, resumed and snapshotted. The free tier is genuinely usable for evaluation, $100 of one-time credit with 10 concurrent sandboxes and one-hour sessions, while Pro at $150 a month moves to 24-hour sessions and 100 concurrent sandboxes with concurrency add-ons up to 1,100. Usage bills per second on CPU and memory, so the plan fee is a concurrency and duration product rather than a compute one. Two things to know: the API surface is the de facto standard other vendors implement, which cuts switching costs in both directions, and the repository is open source even though the hosted service is not free.",
    keyFeatures: [
      "Sub-150ms cold-start boot time powered by Firecracker MicroVMs",
      "Python and TypeScript SDKs with built-in streaming stdout/stderr",
      "Model Context Protocol (MCP) server support out-of-the-box",
      "Custom sandbox templates built with standard Dockerfiles",
      "Session pause, resume, and instant filesystem snapshots",
      "Free tier: $100 credit, 10 concurrent sandboxes, 1-hour sessions",
      "Pro: $150/month, 24-hour sessions, 100 concurrent, add-ons to 1,100",
    ],
    sampleCode: {
      language: "typescript",
      filename: "agent-sandbox.ts",
      code: `import { Sandbox } from '@e2b/code-interpreter';

// Spawn an isolated Firecracker microVM for your agent
const sandbox = await Sandbox.create();

// Execute arbitrary untrusted code generated by LLM
const execution = await sandbox.runCode(\`
import numpy as np
import pandas as pd
print("Analyzing agent data...")
df = pd.DataFrame({"score": np.random.randn(5)})
print(df.describe())
\`);

console.log(execution.text);
await sandbox.kill();`,
    },
    openSource: true,
    githubStars: 14_863,
    featured: true,
    rating: 4.9,
    status: "active",
    lifecycle: {
      idleBilling: "wall_clock",
      pauseRetains: "memory",
      resumeTime: "~150ms",
      sessionLimit: "Sandbox lifetime, extendable",
    },
    compliance: ["SOC 2 Type II"],
    sdkLanguages: ["Python", "TypeScript"],
    alternatives: ["daytona", "modal", "firecracker"],
    relatedGuideIds: [
      "egress-and-credential-isolation",
      "ai-agent-sandbox-guide",
      "e2b-vs-daytona",
      "firecracker-vs-docker-vs-gvisor",

      "sandbox-escapes-guide",
    ],
    createdAt: "2023-11-01",
    updatedAt: "2026-11-15",
  },
  {
    id: "daytona",
    slug: "daytona",
    name: "Daytona",
    description:
      "Commercial platform for persistent agent sandboxes and cloud computers; the public repository was archived in July 2026 and no longer carries a license.",
    logo: "D",
    logoBg: "#4F46E5",
    logoTextColor: "#FFFFFF",
    website: "https://daytona.io",
    documentation: "https://www.daytona.io/docs",
    github: "https://github.com/daytonaio/daytona",
    productType: "commercial_saas",
    categories: ["Cloud Computer", "Code Sandbox", "Desktop Sandbox", "Self-hosted"],
    runtime: {
      docker: true,
      firecracker: true,
      gvisor: false,
      other: ["Container & MicroVM hybrid"],
    },
    deployment: {
      cloud: true,
      selfHosted: true,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: true,
      gpu: true,
      desktop: true,
      browser: true,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: true,
      cli: true,
      mcp: true,
      webhook: true,
    },
    pricing: {
      model: ["Free Tier", "Pay as you go", "Enterprise"],
      freeTier: true,
      pricingUrl: "https://www.daytona.io/pricing",
      verifiedAt: "2026-11-15",
      costSummary:
        "Cloud bills per second: compute at $0.0504 per vCPU-hour and memory at $0.0162 per GiB-hour, with the first 5 GiB of storage free and storage after that at $0.000108 per GiB-hour. Windows costs $0.0858 per vCPU-hour. GPUs are listed by model and mode: preemptible runs from $0.57 per hour for an RTX 4090 to $4.08 for a B300, and on-demand from $0.99 to $6.25 for the same range, with H100, H200, L40S and RTX PRO 6000 in between. The account starts with $200 of free compute. The public repository is archived with no license, so self-hosting now depends on the commercial enterprise offer rather than the open-source distribution.",
      billingUnit: "per-vCPU-hour plus memory and storage",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "32 vCPU",
      maxRam: "64 GB RAM",
      storageLimit: "Up to 500 GB NVMe",
      bootTime: "~800ms",
      networkIsolation:
        "Private overlay mesh network with automated TLS tunneling & reverse proxy.",
      operatingSystems: ["Debian", "Ubuntu", "Alpine", "Custom OCI Images"],
    },
    overview:
      "Daytona is a commercial sandbox platform for AI-generated code: persistent Linux environments, snapshots, forking, sub-90ms starts and a broad OS matrix including Windows, macOS and GPU machines. It began as an open-source development-environment manager, but the public repository was archived in July 2026 and now carries no license, so the open-source route is closed rather than merely stale. The product itself remains active and is sold as a managed cloud with an enterprise self-hosted offer. Buyers comparing it with E2B or Modal should price the compute and memory lines together and confirm the self-hosted terms directly with Daytona.",
    keyFeatures: [
      "Self-hosted and managed cloud deployment models",
      "Persistent storage volumes with instant Git repo sync",
      "Direct SSH, VS Code, and browser IDE integration",
      "Multi-provider support (Docker, Kubernetes, Libvirt)",
      "Rich CLI and programmatic REST API for agent workflows",
    ],
    sampleCode: {
      language: "python",
      filename: "daytona_agent.py",
      code: `from daytona_sdk import Daytona, CreateWorkspaceParams

daytona = Daytona()
workspace = daytona.create(CreateWorkspaceParams(
    language="python",
    image="daytonaio/workspace-project:latest"
))

# Agent executes terminal commands inside persistent workspace
response = workspace.process.exec("git status && python main.py")
print("Exit code:", response.exit_code)
print("Output:", response.result)`,
    },
    openSource: false,
    githubStars: 71_312,
    featured: true,
    rating: 4.8,
    status: "active",
    lifecycle: {
      idleBilling: "wall_clock",
      pauseRetains: "disk",
      resumeTime: "< 90ms",
      sessionLimit: "Sandbox lifetime",
    },
    sdkLanguages: ["Python", "TypeScript"],
    alternatives: ["e2b", "kasm"],
    relatedGuideIds: [
      "egress-and-credential-isolation",
      "e2b-vs-daytona",
      "desktop-environments-guide",
      "self-hosted-vs-cloud",
    ],
    createdAt: "2024-02-15",
    updatedAt: "2026-11-15",
  },
  {
    id: "modal",
    slug: "modal",
    name: "Modal",
    description:
      "High-performance serverless cloud compute and sandbox execution for any workload.",
    logo: "M",
    logoBg: "#10B981",
    logoTextColor: "#FFFFFF",
    website: "https://modal.com",
    documentation: "https://modal.com/docs",
    productType: "commercial_saas",
    categories: ["Code Sandbox", "Cloud Computer", "Code Execution"],
    runtime: {
      gvisor: true,
      docker: true,
      firecracker: false,
      other: ["Custom Linux container sandbox with sub-second cold starts"],
    },
    deployment: {
      cloud: true,
      selfHosted: false,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: false,
      gpu: true,
      desktop: false,
      browser: false,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: true,
      cli: true,
      mcp: null,
      webhook: false,
    },
    pricing: {
      model: ["Free Tier", "Pay as you go"],
      freeTier: true,
      pricingUrl: "https://modal.com/pricing",
      verifiedAt: "2026-11-15",
      costSummary:
        "Billed by the second on whichever is higher, what you request or what you use: CPU at $0.0000131 per core-second, where a physical core counts as two vCPU equivalents and each container has a 0.125-core and 128 MiB minimum, memory at $0.00000222 per GiB-second, volumes at $0.09 per GiB-month with 1 TiB free, and egress at $0.04 per GiB. GPUs are quoted per second: B300 $0.001972, B200 $0.001736, H200 SXM $0.001261, H100 SXM5 $0.001097, RTX PRO 6000 $0.000842, A100 80 GB $0.000694, A100 40 GB $0.000583, L40S $0.000542, A10 $0.000306, L4 $0.000222 and T4 $0.000164. Sandboxes bill at the non-preemptible Function rate. Starter is $0 plus compute with $30 a month of free credits, 3 seats, 100 containers and 10 GPU concurrency.",
      billingUnit: "per core-second and GiB-second",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "64 vCPU",
      maxRam: "256 GB RAM",
      storageLimit: "Shared Network Volumes (Petabyte scale)",
      bootTime: "< 1 second",
      networkIsolation: "Sandboxed gVisor network namespace with custom proxy routing.",
      operatingSystems: ["Debian/Ubuntu customized for AI ML workloads"],
    },
    overview:
      "Modal is the compute substrate that much of the current agent wave runs on, and its shape is different from a sandbox product: you write Python, decorate a function, and Modal schedules it onto a pool of machines with optional GPUs. Sandboxes are the imperative counterpart, created from an app and driven with exec commands, so an agent gets a container it can keep talking to rather than a function that returns once. The pricing is the reason teams take it seriously. Billing is per second on the higher of requested or used resources, CPU at $0.0000131 per core-second with a 0.125-core minimum, memory at $0.00000222 per GiB-second, and volumes at $0.09 per GiB-month with 1 TiB free, all of which makes a short, small sandbox cheap in a way hourly plans cannot match. GPU rates are quoted per second too, from an L4 at $0.000222 to a B300 at $0.001972, and sandboxes bill at the non-preemptible Function rate so an interruption cannot quietly change the price. Around the sandbox it ships file access, exec with timeouts, memory snapshots and sidecars, plus a free starter tier with $30 a month of credits and 10 GPU concurrency. The trade is that Modal is a platform to learn, not an endpoint to call.",
    keyFeatures: [
      "Sub-second container cold-starts on bare metal",
      "Instant access to NVIDIA A100 & H100 GPU clusters",
      "Serverless function decorators in pure Python",
      "Persistent volume mounts across thousands of parallel sandboxes",
      "Real-time streaming output and live web endpoints",
      "Per-second billing on the higher of requested or used resources",
      "Memory snapshots, sidecars and file access on sandboxes",
      "Free starter tier: $30/month credits, 10 GPU concurrency",
    ],
    sampleCode: {
      language: "python",
      filename: "modal_inference.py",
      code: `import modal

app = modal.App("agent-compute")

@app.function(
    gpu="A10G",
    timeout=60,
    mounts=[modal.Mount.from_local_dir("./agent_tools")]
)
def run_agent_task(prompt: str):
    import torch
    print(f"CUDA Available: {torch.cuda.is_available()}")
    return {"status": "completed", "result": f"Executed: {prompt}"}
`,
    },
    openSource: false,
    featured: true,
    rating: 4.9,
    status: "active",
    lifecycle: {
      idleBilling: "usage_metered",
      pauseRetains: "none",
      resumeTime: "Warm start",
      sessionLimit: "Configurable timeout",
    },
    compliance: ["SOC 2 Type II", "HIPAA"],
    sdkLanguages: ["Python", "TypeScript", "Go"],
    alternatives: ["e2b", "flyio-sprites"],
    relatedGuideIds: [
      "egress-and-credential-isolation",
      "ai-agent-sandbox-guide",
      "firecracker-vs-docker-vs-gvisor",
    ],
    createdAt: "2023-01-10",
    updatedAt: "2026-11-15",
  },
  {
    id: "firecracker",
    slug: "firecracker",
    name: "Firecracker",
    description:
      "Open-source lightweight MicroVM hypervisor developed by AWS for serverless workloads.",
    logo: "🔥",
    logoBg: "#EA580C",
    logoTextColor: "#FFFFFF",
    website: "https://firecracker-microvm.github.io/",
    documentation: "https://github.com/firecracker-microvm/firecracker/tree/main/docs",
    github: "https://github.com/firecracker-microvm/firecracker",
    productType: "microvm_hypervisor",
    categories: ["MicroVM", "Self-hosted", "Code Sandbox"],
    runtime: {
      firecracker: true,
      docker: false,
      gvisor: false,
      other: ["Linux Kernel-based Virtual Machine (KVM)"],
    },
    deployment: {
      cloud: false,
      selfHosted: true,
      byoc: true,
    },
    capabilities: {
      persistent: false,
      snapshot: true,
      fork: false,
      gpu: false,
      desktop: false,
      browser: false,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: false,
      cli: true,
      mcp: false,
      webhook: false,
    },
    lifecycle: {
      idleBilling: "idle_free",
    },
    pricing: {
      model: ["Free Tier"],
      freeTier: true,
      pricingUrl: "https://github.com/firecracker-microvm/firecracker/blob/main/LICENSE",
      verifiedAt: "2026-11-15",
      costSummary: "100% Free & Open Source under Apache 2.0 License.",
      billingUnit: "infrastructure hosting costs only",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "32 vCPU per MicroVM",
      maxRam: "Customizable up to host capacity",
      storageLimit: "VirtIO block devices",
      bootTime: "< 5ms (kernel boot) / < 125ms total",
      networkIsolation: "cgroups, seccomp filters, chroot jail, TAP network interfaces.",
      operatingSystems: ["Minimal Linux Kernels (v4.14+)"],
    },
    overview:
      "Firecracker is the reason most of this catalog can exist. It is an open-source virtualization technology, Apache-2.0 licensed, purpose-built for creating and managing secure, multi-tenant container and function-based services, and it made the microVM cheap enough that per-agent machines became an economic option rather than a luxury. Each workload runs in a lightweight virtual machine with its own kernel, which gives a hardware isolation boundary instead of a shared-kernel one, and it starts and resumes near-instantly by VM standards. The project page now also points at AWS Lambda MicroVMs as the fully managed version of the same primitive, which is a useful signal about where the model is heading: the open-source VMM for people building their own infrastructure, and a hosted product for people who would rather not. If you are choosing between the listings here, the honest framing is that Firecracker is a building block rather than a product. It gives you the boundary and the boot time; everything an agent platform adds on top, from snapshots to networking policy to an SDK, is work someone still has to do.",
    keyFeatures: [
      "Minimal memory overhead (< 5 MB per microVM)",
      "Ultra-fast startup: launches in as little as 5 milliseconds",
      "Defense-in-depth isolation utilizing Linux cgroups and seccomp filters",
      "Over-subscription support: thousands of microVMs per physical machine",
      "Direct REST socket interface for hypervisor management",
    ],
    sampleCode: {
      language: "bash",
      filename: "launch_microvm.sh",
      code: `# Start firecracker process attached to unix domain socket
./firecracker --api-sock /tmp/firecracker.socket &

# Configure boot kernel via REST API
curl --unix-socket /tmp/firecracker.socket -X PUT 'http://localhost/boot-source' \\
    -H 'Accept: application/json' \\
    -H 'Content-Type: application/json' \\
    -d '{
        "kernel_image_path": "./vmlinux.bin",
        "boot_args": "console=ttyS0 reboot=k panic=1 pci=off"
    }'`,
    },
    openSource: true,
    githubStars: 38_025,
    featured: false,
    rating: 4.9,
    status: "active",
    alternatives: ["cloud-hypervisor", "kata-containers", "gvisor"],
    relatedGuideIds: [
      "firecracker-vs-docker-vs-gvisor",
      "firecracker-vs-docker-vs-gvisor",
      "self-hosted-vs-cloud",

      "sandbox-escapes-guide",
      "egress-and-credential-isolation",
    ],
    createdAt: "2018-11-26",
    updatedAt: "2024-10-30",
  },
  {
    id: "cloud-hypervisor",
    slug: "cloud-hypervisor",
    name: "Cloud Hypervisor",
    description:
      "Modern, Rust-based Virtual Machine Monitor (VMM) focused on modern cloud workloads.",
    logo: "CH",
    logoBg: "#0284C7",
    logoTextColor: "#FFFFFF",
    website: "https://www.cloudhypervisor.org",
    documentation: "https://github.com/cloud-hypervisor/cloud-hypervisor/tree/main/docs",
    github: "https://github.com/cloud-hypervisor/cloud-hypervisor",
    productType: "microvm_hypervisor",
    categories: ["MicroVM", "Self-hosted"],
    runtime: {
      firecracker: false,
      docker: false,
      gvisor: false,
      other: ["KVM and Microsoft MSHV hypervisor"],
    },
    deployment: {
      cloud: false,
      selfHosted: true,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: false,
      gpu: true,
      desktop: false,
      browser: false,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: false,
      cli: true,
      mcp: false,
      webhook: false,
    },
    lifecycle: {
      idleBilling: "idle_free",
    },
    pricing: {
      model: ["Free Tier"],
      freeTier: true,
      pricingUrl: "https://github.com/cloud-hypervisor/cloud-hypervisor/tree/main/LICENSES",
      verifiedAt: "2026-11-15",
      costSummary:
        "Apache-2.0 and BSD-3-Clause licensed source; there is no vendor rate, so you pay only for the host machine.",
      billingUnit: "infrastructure hosting only",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "Up to host vCPUs; hot-plug supported",
      maxRam: "Up to host physical memory; hot-plug supported",
      storageLimit: "Virtio-blk, vhost-user-blk and physical device passthrough via VFIO",
      bootTime: "Boot to userspace in under 100 ms with direct kernel boot, per the project",
      networkIsolation:
        "vhost-user-net and VFIO PCIe device passthrough; the API also exposes live migration and restore",
      operatingSystems: ["Linux x86-64 and aarch64 guests", "Windows guests"],
    },
    overview:
      "Cloud Hypervisor is the hypervisor to reach for when Firecracker's minimalism is too minimal and QEMU's surface area is too large. It is a Rust VMM with deliberately little device emulation, booting to userspace in under 100 ms with direct kernel boot and offering the pieces a real sandbox fleet needs: virtio and vhost-user devices, VFIO passthrough for physical NICs and GPUs, CPU and memory hot-plug, snapshot and restore, and live migration that the project now keeps compatible across the two previous releases. It runs on KVM and on Microsoft's MSHV, on x86-64 and aarch64, and it is the VMM Kata Containers supports for secure container workloads, which is the shortest explanation of its niche: the isolation of a VM with enough device model to behave like a machine. Governance matters for anyone betting infrastructure on it. The project sits under the Linux Foundation with backing from Alibaba, AMD, Ampere, ARM, ByteDance, Intel, Microsoft, SAP and Tencent Cloud, and releases are frequent, v54.0 in October 2026. There is no rate card because there is no vendor: you pay for hosts. The REST API is the integration point, and the bits that most hosted sandbox vendors build privately, migration, passthrough and snapshot, are exposed here as documented primitives.",
    keyFeatures: [
      "Rust VMM with minimal device emulation and a small attack surface",
      "Boot to userspace in under 100 ms with direct kernel boot",
      "VFIO PCIe passthrough, including GPUs and migratable NIC VFs",
      "CPU and memory hot-plug, snapshot and restore",
      "Live migration with n-2 release compatibility",
      "Runs on KVM and Microsoft MSHV, on x86-64 and aarch64",
      "HTTP REST API for full VM lifecycle control",
      "Linux Foundation project backed by Alibaba, AMD, ARM, Intel, Microsoft and Tencent",
    ],
    sampleCode: {
      language: "bash",
      filename: "boot-vm.sh",
      code: `# Boot a minimal Linux guest with Cloud Hypervisor
cloud-hypervisor \
  --kernel ./vmlinux \
  --disk path=./rootfs.img \
  --cpus boot=2 \
  --memory size=1024M \
  --serial tty \
  --console off`,
    },

    openSource: true,
    githubStars: 6525,
    featured: false,
    rating: 4.6,
    status: "active",
    alternatives: ["firecracker", "kata-containers"],
    relatedGuideIds: ["firecracker-vs-docker-vs-gvisor", "egress-and-credential-isolation"],
    createdAt: "2019-06-01",
    updatedAt: "2026-11-15",
  },
  {
    id: "browserbase",
    slug: "browserbase",
    name: "Browserbase",
    description:
      "Developer platform and serverless browser sandbox infrastructure for AI web agents.",
    logo: "B",
    logoBg: "#DC2626",
    logoTextColor: "#FFFFFF",
    website: "https://www.browserbase.com",
    documentation: "https://docs.browserbase.com",
    productType: "commercial_saas",
    categories: ["Browser Sandbox", "AI Agent Sandbox"],
    runtime: {
      docker: true,
      firecracker: false,
      gvisor: false,
      other: ["Hardened Headless & Headed Chromium"],
    },
    deployment: {
      cloud: true,
      selfHosted: false,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: false,
      gpu: false,
      desktop: false,
      browser: true,
      egressControl: true,
      autoSleep: false,
      api: true,
      sdk: true,
      cli: true,
      mcp: true,
      webhook: true,
    },
    pricing: {
      model: ["Free Tier", "Subscription", "Pay as you go"],
      freeTier: true,
      pricingUrl: "https://www.browserbase.com/pricing",
      verifiedAt: "2026-11-15",
      costSummary:
        "Free is $0 with 3 concurrent browsers, 1 browser hour, 3 Agent runs, 1,000 Search and 1,000 Fetch calls, 15-minute sessions and $5 of model tokens. Developer is $20 a month for 25 concurrent browsers, 100 browser hours then $0.12 per hour, 15 Agent runs, 1,000 Search calls then $5 per 1,000, 1,000 Fetch calls then $1 per 1,000, and 1 GB of proxies then $12 per GB. Startup is $99 a month for 100 concurrent browsers, 500 hours then $0.10 per hour, 50 Agent runs, 1,000 Search calls then $5 per 1,000, 10,000 Fetch calls then $0.5 per 1,000, and 5 GB of proxies then $10 per GB. Scale is custom with 250+ concurrent browsers and 500+ included hours. Runtime is included rather than billed by the minute.",
      billingUnit: "per browser hour",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "Customizable per browser instance",
      maxRam: "Up to 8 GB per session",
      storageLimit: "Persistent context & session profiles",
      bootTime: "< 500ms",
      networkIsolation: "Built-in residential proxy network with automatic stealth fingerprints.",
      operatingSystems: ["Chromium / Linux"],
    },
    overview:
      "Browserbase is the browser layer of this catalog, and the distinction matters: it does not try to be a general-purpose VM, it sells hardened Chromium sessions that an agent drives over CDP. Playwright, Puppeteer and Selenium connect as they would locally, which keeps the agent code portable, while Browserbase handles the parts that break in production: residential proxies, fingerprint randomization, CAPTCHA solving, session recordings with HAR export, and a live debugger that shows the DOM and console while the agent runs. Sessions keep context and profiles, so a logged-in state can outlive a single run. The pricing is legible by browser time rather than by compute: Free gives 3 concurrent browsers and a single hour, Developer at $20 gives 25 concurrent and 100 included hours, Startup at $99 gives 100 concurrent and 500 hours, with overage at $0.12 and $0.10 per hour. Two caveats worth noting: proxy bandwidth is metered separately and jumps to $12 per GB beyond the small included allowance, and the platform is built for browsing rather than for arbitrary code execution, so pair it with a sandbox when the agent also needs a shell.",
    keyFeatures: [
      "Residential proxy rotation and automatic fingerprint randomization",
      "Built-in CAPTCHA solving capabilities",
      "Live remote session debugger with live DOM and console inspect",
      "Session recording with video replay and network HAR export",
      "Playwright, Puppeteer, and Selenium drop-in compatibility",
      "Free: 3 concurrent browsers, 1 hour, $5 of tokens",
      "Developer $20: 25 concurrent, 100 hours then $0.12/hour",
      "Startup $99: 100 concurrent, 500 hours then $0.10/hour",
    ],
    sampleCode: {
      language: "typescript",
      filename: "browser_agent.ts",
      code: `import { Browserbase } from '@browserbaseHQ/sdk';
import { chromium } from 'playwright-core';

const bb = new Browserbase({ apiKey: process.env.BROWSERBASE_API_KEY });
const session = await bb.sessions.create({ projectId: process.env.PROJECT_ID });

// Connect standard Playwright to remote cloud browser sandbox
const browser = await chromium.connectOverCDP(session.connectUrl);
const page = await browser.newPage();
await page.goto('https://news.ycombinator.com');
console.log('Page Title:', await page.title());`,
    },
    openSource: false,
    featured: false,
    rating: 4.8,
    status: "active",
    lifecycle: {
      idleBilling: "wall_clock",
      pauseRetains: "disk",
      resumeTime: "Session warm start",
      sessionLimit: "Session timeout",
    },
    alternatives: ["steel-dev", "kasm"],
    relatedGuideIds: [
      "ai-agent-sandbox-guide",
      "how-to-build-agent-environment",
      "egress-and-credential-isolation",
    ],
    createdAt: "2024-03-01",
    updatedAt: "2024-11-02",
  },
  {
    id: "kasm",
    slug: "kasm",
    name: "Kasm Workspaces",
    description:
      "Enterprise containerized streaming desktop sandbox, browser isolation and DLP platform.",
    logo: "K",
    logoBg: "#2563EB",
    logoTextColor: "#FFFFFF",
    website: "https://kasmweb.com",
    documentation: "https://kasmweb.com/docs/latest/index.html",
    github: "https://github.com/kasmtech/workspaces-images",
    productType: "open_source_tool",
    categories: ["Desktop Sandbox", "Self-hosted", "Browser Sandbox", "Cloud Computer"],
    runtime: {
      docker: true,
      firecracker: false,
      gvisor: false,
      other: ["Containerized X11 / Wayland VNC streaming"],
    },
    deployment: {
      cloud: true,
      selfHosted: true,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: false,
      fork: false,
      gpu: true,
      desktop: true,
      browser: true,
      egressControl: true,
      autoSleep: false,
      api: true,
      sdk: false,
      cli: true,
      mcp: null,
      webhook: false,
    },
    pricing: {
      model: ["Free Tier", "Subscription", "Enterprise"],
      freeTier: true,
      pricingUrl: "https://kasm.com/community-edition",
      verifiedAt: "2026-11-15",
      costSummary:
        "Community Edition is free to self-host. Commercial Workspaces licensing is quoted per concurrent user by sales; the per-user price list is no longer published on the site.",
      billingUnit: "per concurrent seat / self-hosted free",
      transparency: "quote_only",
    },
    techSpecs: {
      maxVcpu: "Configurable per Docker host",
      maxRam: "Configurable per container",
      storageLimit: "Host volume mapping / S3 persistent profiles",
      bootTime: "~2 - 4s",
      networkIsolation: "Docker bridge networks, egress proxy, DLP file transfer policies.",
      operatingSystems: ["Ubuntu, Alpine, Debian, CentOS XFCE images"],
    },
    overview:
      "Kasm is the enterprise end of container streaming: a self-hosted control plane that launches containerized X11 workspaces and streams them to an ordinary browser tab, with no client install. Three uses collide here and all three matter for sandboxes. Disposable browser sessions give an agent or a user an isolated Chromium that discards its state at logout, which is web isolation rather than a full desktop. Streaming desktops and individual applications covers remote work, and the data-loss-prevention layer is the part enterprises actually buy: clipboard restrictions, file-transfer policy, upload and download controls, all enforced per group rather than per image. The images themselves are open source, built on Ubuntu, Debian, Alpine and others, and the KasmVNC remote-desktop server underneath is its own project. Licensing is the honest caveat. Community Edition is free to self-host and is what most individuals and small teams use, while commercial Workspaces licensing is quoted per concurrent user and the public price list is no longer on the site, so a commercial deployment needs a quote before it can be budgeted against the rest of this catalog. Programmatic provisioning exists through the REST API, but the SDK surface is thin and automation usually goes through the API or infrastructure-as-code instead.",
    keyFeatures: [
      "HTML5 streaming of containerized Linux desktops, no client install",
      "Disposable browser sessions that discard state at logout",
      "Per-group DLP: clipboard, file transfer, upload and download policy",
      "Open-source workspace images for Ubuntu, Debian, Alpine and more",
      "KasmVNC remote desktop server as a separate open-source project",
      "REST API for on-demand session provisioning",
      "Community Edition free to self-host",
      "Commercial licensing quoted per concurrent user",
    ],
    openSource: true,
    githubStars: 1242,
    featured: false,
    rating: 4.7,
    status: "active",
    lifecycle: {
      idleBilling: "idle_free",
      pauseRetains: "disk",
      resumeTime: "Seconds",
      sessionLimit: "Session timeout",
    },
    alternatives: ["daytona", "cua"],
    relatedGuideIds: [
      "desktop-environments-guide",
      "self-hosted-vs-cloud",
      "egress-and-credential-isolation",
    ],
    createdAt: "2020-04-10",
    updatedAt: "2026-11-15",
  },
  {
    id: "cua",
    slug: "cua",
    name: "Cua",
    description:
      "Agents' own desktops on machines you already own: Spaces streams a Mac, a Linux box or a cloud VM over QUIC, with an MIT-licensed driver that drives desktop apps in the background.",
    logo: "C",
    logoBg: "#7C3AED",
    logoTextColor: "#FFFFFF",
    website: "https://cua.ai",
    documentation: "https://docs.cua.ai",
    github: "https://github.com/trycua/cua",
    productType: "commercial_saas",
    categories: ["Desktop Sandbox", "Cloud Computer", "AI Agent Sandbox"],
    runtime: {
      docker: null,
      firecracker: null,
      gvisor: null,
      other: [
        "Spaces run on hardware you own or rent: a Mac through Lume VMs on Apple's Virtualization framework, a Linux machine, or a VM in your own cloud account",
        "Cua Driver is MIT licensed and drives native macOS, Windows and Linux apps in the background without taking over the cursor or keyboard",
        "Streaming prefers a direct QUIC path and falls back to Cua's relay when peers cannot reach each other",
        "Cua does not rent or host the computers, so their cloud bills stay on your account",
      ],
    },
    deployment: {
      cloud: true,
      selfHosted: true,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: null,
      fork: null,
      gpu: null,
      desktop: true,
      browser: null,
      egressControl: null,
      autoSleep: null,
      api: true,
      sdk: true,
      cli: true,
      mcp: true,
      webhook: null,
    },
    pricing: {
      model: ["Free Tier", "Subscription"],
      freeTier: true,
      pricingUrl: "https://cua.ai/pricing",
      verifiedAt: "2026-11-15",
      costSummary:
        "Cua sells access to your own computers, not computers. Free is $0 with no account needed to start: Spaces on every computer you connect, Teleport, sharing a Space with named people, up to 2 computers in use at once and 20 remote hours a month. Pro is $15 per month billed yearly, or $18 monthly, for one person with up to 5 computers in use and 200 remote hours a month. Teams is $25 per seat per month billed yearly, or $30 monthly, for 1 to 100 seats: each seat adds 5 computers and 200 remote hours to a shared pool, plus shared team computers, roles and device approval, while SSO and audit export are listed as coming rather than included. A remote hour is any hour with at least one computer in use through the relay, counted per calendar month; going over does not cut access, the app just shows an upgrade notice. The computers and their cloud bills stay yours.",
      billingUnit: "per seat per month, plus the cost of your own machines",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "Whatever the connected machine has; Cua provisions none",
      maxRam: "Whatever the connected machine has",
      storageLimit: "The connected machine's own disk; Lume VMs are local files on a Mac",
      bootTime:
        "A Space streams an already-running desktop; a local Lume VM starts on the Mac, with no figure published",
      networkIsolation:
        "Direct QUIC when peers can reach each other, Cua's relay otherwise. Teleport requires approval, uses Touch ID for sensitive items and checks a bundle's SHA-256 before opening it.",
      operatingSystems: ["macOS", "Linux", "Windows (preview)"],
    },
    overview:
      "Cua changed shape, and the catalog entry has to follow: it is no longer a place to rent GUI sandboxes. The current product, Cua Spaces, turns the computers a team already owns into shared desktops that agents can work in and people can watch, with the Mac in the corner, the Linux box under the desk and a VM in your own cloud account all appearing in one list. The economics are the interesting part. Cua charges for access, not compute: free covers two computers in use at once and 20 remote hours a month, Pro is $15 per month billed yearly for five computers and 200 hours, and Teams at $25 per seat pools five computers and 200 hours per seat with roles and device approval. The machines and their cloud bills remain yours, which makes this the cheapest way in this catalog to give an agent a real desktop, provided you already have hardware to spare. The open-source half is genuinely reusable: Cua Driver is MIT licensed and drives native apps on macOS, Windows and Linux in the background without hijacking the cursor, Lume runs macOS and Linux VMs on Apple silicon, and the SDK and CLI address sandboxes, Spaces and MCP from code. Teleport is the clever security detail, moving an app's signed-in session into a Space only after approval, with Touch ID for sensitive items and a hash check before the bundle opens. The catch is that nothing here is a managed sandbox: there is no fleet to scale, patching and uptime are your problem, and remote hours are capped per plan.",
    keyFeatures: [
      "Bring-your-own computers, including Macs, Linux boxes and your own cloud VMs",
      "Free: 2 computers in use at once and 20 remote hours a month",
      "Pro $15/month yearly: 5 computers and 200 remote hours",
      "Teams $25 per seat/month: pooled computers and hours, roles, device approval",
      "MIT-licensed Cua Driver for background desktop automation",
      "Lume VMs on Apple's Virtualization framework",
      "Teleport moves an app's signed-in session into a Space after approval",
      "Python, TypeScript and Rust SDKs plus a CLI and MCP",
    ],
    sdkLanguages: ["Python", "TypeScript", "Rust"],
    openSource: true,
    githubStars: 32_353,
    featured: false,
    rating: 4.6,
    status: "active",
    lifecycle: {
      idleBilling: "idle_free",
      pauseRetains: "none",
      resumeTime:
        "A Space connects to a machine that is already running; there is no hibernation to time",
      sessionLimit:
        "Remote hours are metered monthly: 20 on Free, 200 on Pro and 200 per seat pooled on Teams. The underlying machines run for as long as you keep them running.",
    },
    alternatives: ["kasm", "opencomputer", "daytona"],
    relatedGuideIds: ["desktop-environments-guide", "ai-agent-sandbox-guide"],
    createdAt: "2024-08-10",
    updatedAt: "2026-11-15",
  },
  {
    id: "gvisor",
    slug: "gvisor",
    name: "gVisor",
    description:
      "Application kernel written in Go that provides a virtualized boundary for containers.",
    logo: "gV",
    logoBg: "#059669",
    logoTextColor: "#FFFFFF",
    website: "https://gvisor.dev",
    documentation: "https://gvisor.dev/docs",
    github: "https://github.com/google/gvisor",
    productType: "runtime_engine",
    categories: ["Code Sandbox", "Self-hosted"],
    runtime: {
      docker: true,
      firecracker: false,
      gvisor: true,
      other: ["runsc OCI runtime engine"],
    },
    deployment: {
      cloud: false,
      selfHosted: true,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: false,
      gpu: true,
      desktop: false,
      browser: false,
      egressControl: true,
      autoSleep: false,
      api: false,
      sdk: false,
      cli: true,
      mcp: false,
      webhook: false,
    },
    lifecycle: {
      idleBilling: "idle_free",
    },
    pricing: {
      model: ["Free Tier"],
      freeTier: true,
      pricingUrl: "https://github.com/google/gvisor/blob/master/LICENSE",
      verifiedAt: "2026-11-15",
      costSummary: "100% Free & Open Source under Apache 2.0 (Google project).",
      billingUnit: "open source software",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "Host bounded",
      maxRam: "Host bounded",
      storageLimit: "Host file mount / Gofer filesystem proxy",
      bootTime: "< 50ms",
      networkIsolation: "Netstack: in-process user-space TCP/IP stack in Go.",
      operatingSystems: ["Linux kernel emulation on x86_64, ARM64"],
    },
    overview:
      "gVisor takes the third position in the isolation debate documented throughout this catalog. It is not a VM and it is not a hardened container: it is an application kernel written in Go that implements a Linux-like interface, runs in userspace, and intercepts the system calls an application makes, so the interfaces normally handled by the host kernel are served by a per-sandbox kernel instead. The project is explicit about what it is not, calling itself neither a syscall filter like seccomp-bpf nor a wrapper over Linux primitives like firejail or AppArmor, and not a VM either. That matters because the consequence is different: you get a much smaller host attack surface than a shared-kernel container, without paying the memory and boot cost of a virtual machine, but you inherit compatibility limits where the application kernel has not caught up. The ecosystem around it is what earns it a listing. It ships as the `runsc` OCI runtime, so Docker and Kubernetes can adopt it by changing a runtime class, and it covers checkpoint and restore, filesystem and rootfs snapshots, rootless sandboxes and GPU support. When a team wants stronger isolation without rearchitecting to microVMs, this is the usual detour.",
    keyFeatures: [
      "OCI runtime (runsc) integrates directly with Docker and Kubernetes",
      "Intercepts and filters untrusted guest syscalls in user space",
      "Includes Netstack: complete user-space TCP/IP networking stack",
      "Supports NVIDIA GPU passthrough via nvproxy",
      "Powers multi-tenant Google Cloud products (Cloud Run, GKE Sandbox)",
    ],
    sampleCode: {
      language: "bash",
      filename: "run_gvisor_docker.sh",
      code: `# Run untrusted code with gVisor runsc sandbox runtime
docker run --runtime=runsc --rm -it alpine sh -c "uname -a"
# Notice that kernel name shows gVisor virtualization signature!`,
    },
    openSource: true,
    githubStars: 20_005,
    featured: false,
    rating: 4.8,
    status: "active",
    alternatives: ["firecracker", "kata-containers"],
    relatedGuideIds: [
      "firecracker-vs-docker-vs-gvisor",
      "firecracker-vs-docker-vs-gvisor",

      "sandbox-escapes-guide",
      "egress-and-credential-isolation",
    ],
    createdAt: "2018-05-02",
    updatedAt: "2024-10-20",
  },
  {
    id: "kata-containers",
    slug: "kata-containers",
    name: "Kata Containers",
    description:
      "Open-source container runtime delivering the isolation of VMs with the feel of containers.",
    logo: "KC",
    logoBg: "#0D9488",
    logoTextColor: "#FFFFFF",
    website: "https://katacontainers.io",
    documentation: "https://github.com/kata-containers/kata-containers/tree/main/docs",
    github: "https://github.com/kata-containers/kata-containers",
    productType: "runtime_engine",
    categories: ["MicroVM", "Self-hosted", "Code Sandbox"],
    runtime: {
      firecracker: true,
      docker: true,
      gvisor: false,
      other: ["QEMU, Cloud Hypervisor, Dragonball"],
    },
    deployment: {
      cloud: false,
      selfHosted: true,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: false,
      fork: false,
      gpu: true,
      desktop: false,
      browser: false,
      egressControl: true,
      autoSleep: false,
      api: false,
      sdk: false,
      cli: true,
      mcp: false,
      webhook: false,
    },
    lifecycle: {
      idleBilling: "idle_free",
    },
    pricing: {
      model: ["Free Tier"],
      freeTier: true,
      pricingUrl: "https://github.com/kata-containers/kata-containers/blob/main/LICENSE",
      verifiedAt: "2026-11-15",
      costSummary: "100% Free & Open Source under Apache 2.0 (OpenInfra Foundation).",
      billingUnit: "open source software",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "Host hardware bounded",
      maxRam: "Host hardware bounded",
      storageLimit: "Virtio-fs / host volumes",
      bootTime: "~300 - 500ms",
      networkIsolation: "Dedicated virtual network interface (tc-filter/macvtap).",
      operatingSystems: ["Optimized Kata guest Linux kernel"],
    },
    overview:
      "Kata Containers builds lightweight virtual machines that seamlessly plug into the container ecosystem. Each container or Kubernetes pod runs inside its own dedicated lightweight VM, providing hardware-enforced isolation without requiring developers to change their Docker/Kube workflows.",
    keyFeatures: [
      "True hardware-enforced VM isolation for Kubernetes pods",
      "Pluggable hypervisors: Cloud Hypervisor, QEMU, Firecracker",
      "Compliant with Kubernetes CRI (Container Runtime Interface)",
      "Hardware GPU and accelerator passthrough support",
      "Confidential Computing support for sensitive workloads",
    ],
    sampleCode: {
      language: "yaml",
      filename: "kata-pod.yaml",
      code: `apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: kata
handler: kata-qemu
---
apiVersion: v1
kind: Pod
metadata:
  name: agent
spec:
  runtimeClassName: kata
  containers:
    - name: agent
      image: python:3.13-slim
      command: ["python", "-c", "print(6 * 7)"]`,
    },

    openSource: true,
    githubStars: 9148,
    featured: false,
    rating: 4.6,
    status: "active",
    alternatives: ["firecracker", "cloud-hypervisor", "gvisor"],
    relatedGuideIds: [
      "firecracker-vs-docker-vs-gvisor",
      "firecracker-vs-docker-vs-gvisor",

      "sandbox-escapes-guide",
      "egress-and-credential-isolation",
    ],
    createdAt: "2017-12-05",
    updatedAt: "2024-09-28",
  },
  {
    id: "steel-dev",
    slug: "steel-dev",
    name: "Steel.dev",
    description:
      "Open-source browser sandbox infrastructure purpose-built for AI agents and web automation.",
    logo: "S",
    logoBg: "#3B82F6",
    logoTextColor: "#FFFFFF",
    website: "https://steel.dev",
    documentation: "https://docs.steel.dev",
    github: "https://github.com/steel-dev/steel-browser",
    productType: "commercial_saas",
    categories: ["Browser Sandbox", "AI Agent Sandbox", "Self-hosted"],
    runtime: {
      docker: true,
      firecracker: false,
      gvisor: false,
      other: ["Hardened Headless Chromium"],
    },
    deployment: {
      cloud: true,
      selfHosted: true,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: false,
      fork: false,
      gpu: false,
      desktop: false,
      browser: true,
      egressControl: true,
      autoSleep: false,
      api: true,
      sdk: true,
      cli: true,
      mcp: true,
      webhook: true,
    },
    pricing: {
      model: ["Free Tier", "Subscription", "Pay as you go"],
      freeTier: true,
      pricingUrl: "https://steel.dev/pricing",
      verifiedAt: "2026-11-15",
      costSummary:
        "The browser server is open source and self-hostable. Cloud Launch is $0/month plus usage with $30 of starter credits; Scale is $250/month plus usage with $100 of monthly credits, 100 concurrent sessions, 1-hour sessions and dedicated IPs at $5 each.",
      billingUnit: "per browser hour",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "Not published on the pricing page",
      maxRam: "Not published on the pricing page",
      storageLimit:
        "Session data retained 7 days on Launch and 14 days on Scale; Enterprise is custom",
      bootTime: "Not published",
      networkIsolation:
        "Smart proxy chaining and anti-fingerprint emulation, with proxy bandwidth metered at $10 per GB on Launch and $6 per GB on Scale",
      operatingSystems: ["Chromium on Linux"],
    },
    overview:
      "Steel sells one thing well: a browser that an agent can drive without getting blocked, and it gives the browser away as open source so the paid product is capacity rather than access. The self-hosted Steel Browser is a hardened headless Chromium behind a session API, with CDP access, a live viewer for taking over a session by hand, proxy chaining, CAPTCHA solving and fingerprint work, and the cloud service fronts the same API so moving between them is a base-URL change. The published rate card is unusually legible for a browser vendor: $0.10 per browser hour on Launch and $0.08 on Scale, proxy bandwidth at $10 or $6 per GB, CAPTCHA solves at $3 or $1 per thousand, and scrape calls at $5 per thousand on both. Plans themselves are capacity gates as much as discounts: Launch is free plus usage with $30 of one-time credits, 10 concurrent sessions and 15-minute sessions, while Scale at $250 per month brings $100 of monthly credits, 100 concurrent sessions, 1-hour sessions, dedicated IPs at $5 each and a 600 request-per-minute ceiling. Enterprise adds stealth browsers, reserved pools, 24-hour sessions and a HIPAA BAA. The caveats are the limits themselves: a 15-minute cap rules out long research runs on the free path, data retention is 7 or 14 days rather than indefinite, and per-instance CPU and memory are not published, so sizing is a sales question.",
    keyFeatures: [
      "$0.10 per browser hour on Launch, $0.08 on Scale",
      "Free plus usage: $30 credits, 10 concurrent sessions, 15-minute cap",
      "Scale at $250/month: $100 credits, 100 sessions, 1-hour cap, $5 IPs",
      "Proxy bandwidth $10 or $6 per GB; CAPTCHA $3 or $1 per 1,000",
      "Open-source Steel Browser, self-hostable with Docker",
      "Live session viewer with manual takeover",
      "Session data retained 7 or 14 days by plan",
      "Enterprise: stealth browser, reserved pools, 24-hour sessions, HIPAA BAA",
    ],
    sampleCode: {
      language: "typescript",
      filename: "steel_agent.ts",
      code: `import Steel from 'steel-sdk';

const client = new Steel({ steelApiKey: process.env.STEEL_API_KEY });
const session = await client.sessions.create({
  useProxy: true,
  solveCaptcha: true,
});

console.log('Steel Browser WebSocket:', session.websocketUrl);
// Connect any browser automation library...`,
    },
    openSource: true,
    githubStars: 7966,
    featured: false,
    rating: 4.7,
    status: "active",
    lifecycle: {
      idleBilling: "wall_clock",
      pauseRetains: "none",
      resumeTime: "Session warm start; boot time is not published",
      sessionLimit:
        "Sessions cap at 15 minutes on Launch, 1 hour on Scale and up to 24 hours on Enterprise, with 7 or 14 days of data retention",
    },
    alternatives: ["browserbase"],
    relatedGuideIds: [
      "ai-agent-sandbox-guide",
      "how-to-build-agent-environment",
      "egress-and-credential-isolation",
    ],
    createdAt: "2024-05-15",
    updatedAt: "2026-11-15",
  },
  {
    id: "flyio-sprites",
    slug: "flyio-sprites",
    name: "Fly.io Sprites",
    description:
      "Persistent, hardware-isolated Linux microVMs on Fly.io that keep their disk between runs, suspend to a warm state in 100-500 ms, and bill only while awake.",
    logo: "F",
    logoBg: "#7047EB",
    logoTextColor: "#FFFFFF",
    website: "https://fly.io/docs/sprites/",
    documentation: "https://fly.io/docs/sprites/quickstart",
    productType: "commercial_saas",
    categories: ["MicroVM", "Code Sandbox", "Cloud Computer"],
    runtime: {
      firecracker: true,
      docker: true,
      gvisor: false,
      other: [
        "Each Sprite is a hardware-isolated microVM with its own kernel, not a container",
        "The filesystem is a real ext4 disk on NVMe, backed up to object storage when the Sprite goes cold",
        "Warm pause freezes the VM with memory in place; a long idle period drops memory and the next wake starts processes fresh",
        "Open TCP connections do not survive a pause, warm or cold",
        "Services declared to the runtime restart on crash and after a cold wake, and the Tasks API holds a Sprite awake until a run finishes",
      ],
    },
    deployment: {
      cloud: true,
      selfHosted: false,
      byoc: false,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: null,
      gpu: null,
      desktop: null,
      browser: null,
      egressControl: null,
      autoSleep: true,
      api: true,
      sdk: true,
      cli: true,
      mcp: true,
      webhook: null,
    },
    pricing: {
      model: ["Free Tier", "Pay as you go", "Subscription"],
      freeTier: true,
      pricingUrl: "https://fly.io/pricing",
      verifiedAt: "2026-11-15",
      costSummary:
        "Compute is metered per hour of active use: $0.0385 per CPU-hour, measured from cumulative CPU usage in cpu.stat, and $0.021875 per GB-hour of memory at actual usage. Storage bills in GB-hours at two rates: hot at $0.000683 per GB-hour ($0.50 per GB-month) while the Sprite is awake, cold at $0.000027 per GB-hour ($0.02 per GB-month) for as long as the data is kept. Billing has three states: running is billed, warm and cold are not, so an idle Sprite costs only storage. Plans bundle allowances that overage bills on top of: Hero is $100 per month with 1,200 CPU-hours, 4,800 RAM GB-hours and 150 GB of storage, while Mythic is $2,000 per month and includes 28,000 RAM GB-hours. Adventurer, Veteran, Champion, Legend and Epic sit between them with unpublished allowances in the static page. Hero allows 100 running and 100 warm Sprites with unlimited cold Sprites; creation is 10 per minute on pay-as-you-go up to 240 per minute on Mythic. Bandwidth is not metered, and Fly account credits cover usage but not the plan fee. A $1 credit with no card covers a 7-day trial.",
      billingUnit: "per CPU-hour and GB-hour of active use, plus hot or cold storage",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "8 vCPU per Sprite",
      maxRam: "Not published; the lifecycle page states 8 vCPU and 100 GB storage as the limits",
      storageLimit: "100 GB ext4 filesystem per Sprite",
      bootTime: "Warm resume in 100-500 ms; a cold wake takes 1-2 s",
      networkIsolation:
        "Each Sprite is a hardware-isolated microVM with its own kernel and a unique public URL; TCP connections are dropped on any pause and must reconnect",
      operatingSystems: ["Linux"],
    },
    overview:
      "Sprites are the sandbox form of Fly Machines, and the design is a clean answer to the usual serverless trade. A Sprite keeps a real ext4 filesystem, not a temporary overlay, so PostgreSQL data directories, SQLite in every journal mode, shared-memory files and installed packages survive between runs. When the idle monitor sees no activity for a few seconds it pauses in two stages: first warm, with the VM suspended and memory frozen, resumable in 100-500 ms with running processes picking up mid-thought; later cold, with memory dropped and a 1-2 s wake that starts processes fresh. Compute billing stops at the first stage, which is the part that changes budgets: an idle Sprite costs only cold storage at $0.02 per GB-month, while active compute runs $0.0385 per CPU-hour plus $0.021875 per GB-hour of memory measured at actual use. Checkpoints cover the other half of persistence: a copy-on-write filesystem snapshot with sequential version IDs, restorable by command, with the last five mounted read-only inside the Sprite so an agent can diff before rolling back. Limits are modest and stated plainly: 8 vCPU and 100 GB of disk. There is no GPU, no fork primitive, and memory is not persisted across a cold wake, so this is the listing for stateful Linux workloads and agent workspaces rather than for parallel rollout experiments.",
    keyFeatures: [
      "$0.0385 per CPU-hour, $0.021875 per GB-hour of actual memory",
      "Compute free when idle; cold storage $0.02 per GB-month",
      "Warm resume in 100-500 ms, cold wake in 1-2 s",
      "Persistent ext4 disk that survives pauses and cold wakes",
      "Checkpoints with version IDs, plus the last five mounted read-only",
      "Services and a Tasks API keep long work alive across pauses",
      "8 vCPU and 100 GB disk per Sprite",
      "Plans bundle CPU, RAM and storage allowances, overage at standard rates",
      "Unique public URL per Sprite for HTTP services",
    ],
    sampleCode: {
      language: "bash",
      filename: "sprite.sh",
      code: `# Create a Sprite, run a command, checkpoint, then check it back in
sprite create my-agent
sprite exec -s my-agent -- python -m pip install pandas
sprite checkpoint create -s my-agent --comment "pandas ready"
sprite list
sprite console -s my-agent`,
    },
    openSource: false,
    featured: false,
    rating: 4.8,
    status: "active",
    lifecycle: {
      idleBilling: "idle_free",
      pauseRetains: "memory",
      resumeTime:
        "Warm resume in 100-500 ms keeps running processes; after a cold wake 1-2 s and processes start fresh",
      sessionLimit:
        "No fixed session cap. A running Sprite moves to warm within seconds of the idle monitor seeing no activity, and both warm and cold states are unbilled; only storage costs anything. Four things reset the timer: an in-flight HTTP or API request, output to a session or exec, an open TCP connection, or an active task. Disk persists across pauses; memory persists only while warm.",
    },
    sdkLanguages: ["TypeScript", "Go"],
    alternatives: ["e2b", "modal", "firecracker"],
    relatedGuideIds: ["firecracker-vs-docker-vs-gvisor", "self-hosted-vs-cloud"],
    createdAt: "2022-09-01",
    updatedAt: "2026-11-15",
  },
  {
    id: "dagger",
    slug: "dagger",
    name: "Dagger",
    description:
      "Programmable container execution engine delivering isolated, reproducible sandbox pipelines.",
    logo: "DG",
    logoBg: "#1E293B",
    logoTextColor: "#38BDF8",
    website: "https://dagger.io",
    documentation: "https://docs.dagger.io",
    github: "https://github.com/dagger/dagger",
    productType: "open_source_tool",
    categories: ["Code Sandbox", "Self-hosted", "Code Execution"],
    runtime: {
      docker: true,
      firecracker: false,
      gvisor: false,
      other: ["BuildKit container engine DAG"],
    },
    deployment: {
      cloud: true,
      selfHosted: true,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: true,
      gpu: true,
      desktop: false,
      browser: false,
      egressControl: false,
      autoSleep: false,
      api: true,
      sdk: true,
      cli: true,
      mcp: true,
      webhook: true,
    },
    pricing: {
      model: ["Free Tier", "Subscription", "Enterprise"],
      freeTier: true,
      pricingUrl: "https://dagger.io/pricing",
      verifiedAt: "2026-11-15",
      costSummary:
        "The engine is free and open source, and Dagger Cloud bills the resources a pipeline actually uses, with idle capacity free. New work costs $0.005 per CPU-minute and per GB-minute of memory, $0.025 per GB of pipeline input and $0.10 per GB of output; repeat work, meaning the same inputs ran in the last 30 days, costs a fifth of that at $0.001 per CPU-minute or GB-minute, $0.005 per GB of input and $0.02 per GB of output. Starter is $20 per month for one user and Scale is $200 per month with unlimited users, access control and a year of trace retention; the bill is the plan price or usage, whichever is higher.",
      billingUnit: "per seat per month or metered pipeline usage, whichever is higher",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "Configurable per host",
      maxRam: "Configurable per container",
      storageLimit: "Content-addressed BuildKit cache",
      bootTime: "< 1 second",
      networkIsolation: "Container network namespaces with isolated build graphs.",
      operatingSystems: ["Any standard Linux container image"],
    },
    overview:
      "Dagger is not a sandbox vendor, and it belongs in this catalog because it is how a lot of teams end up running agent tool calls without building a sandbox service. A pipeline is code, in Go, Python, TypeScript, Java, .NET, PHP or Elixir, and every step executes in a container built by BuildKit; the dependency graph is content-addressed, so identical work is served from cache rather than repeated. For agents the useful primitive is that a container, with its filesystem and its tool output, is an ordinary value in the program, which makes fork-like fan-out, diffing and reuse natural without a microVM API. The pricing model has been reworked around that caching claim: Dagger Cloud charges CPU and memory per minute plus input and output per GB, and repeat work, defined as the same inputs as an operation run in the last 30 days, costs one fifth of new work. Idle capacity is free. Starter is $20 per month for one user; Scale is $200 per month with unlimited users and a year of traces. The caveat is conceptual rather than technical: this is CI-shaped isolation, container-level rather than hardware-level, so a hostile multi-tenant workload still wants a microVM boundary, and Dagger is best used as the orchestration layer that calls one.",
    keyFeatures: [
      "Pipelines as code in Go, Python, TypeScript, Java, .NET, PHP or Elixir",
      "Every step runs in a BuildKit container",
      "Content-addressed graph, so identical work comes from cache",
      "Repeat work billed at one fifth of new work",
      "Idle capacity free; CPU, memory, input and output metered",
      "Starter $20/month, Scale $200/month with unlimited users",
      "Runs locally, in CI or on Kubernetes with the same engine",
      "MCP integration for agents to call pipeline functions",
    ],
    sampleCode: {
      language: "typescript",
      filename: "dagger_sandbox.ts",
      code: `import { connect } from '@dagger.io/dagger';

connect(async (client) => {
  // Execute untrusted build inside isolated container
  const out = await client
    .container()
    .from('python:3.11-alpine')
    .withExec(['python3', '-c', 'print("Hello from Dagger sandbox!")'])
    .stdout();

  console.log(out);
});`,
    },
    openSource: true,
    githubStars: 16_615,
    featured: false,
    rating: 4.8,
    status: "active",
    lifecycle: {
      idleBilling: "idle_free",
      pauseRetains: "none",
      resumeTime: "Cold container start",
      sessionLimit: "Pipeline runtime",
    },
    alternatives: ["modal", "e2b", "daytona"],
    relatedGuideIds: ["how-to-build-agent-environment", "self-hosted-vs-cloud"],
    createdAt: "2021-10-15",
    updatedAt: "2026-11-15",
  },
  {
    id: "cloudflare-sandboxes",
    slug: "cloudflare-sandboxes",
    name: "Cloudflare Sandboxes",
    description:
      "Linux microVM sandboxes and isolated Dynamic Workers behind a Durable Object, with snapshots, credential injection and coding-agent runner recipes.",
    logo: "CF",
    logoBg: "#F97316",
    logoTextColor: "#FFFFFF",
    website: "https://developers.cloudflare.com/sandbox/",
    documentation: "https://developers.cloudflare.com/sandbox/",
    productType: "commercial_saas",
    categories: ["Code Sandbox", "Code Execution", "AI Agent Sandbox"],
    runtime: {
      docker: true,
      firecracker: false,
      gvisor: false,
      other: [
        "Cloudflare Containers: one microVM per instance with its own kernel and network",
        "Durable Object per sandbox",
        "Dynamic Workers: V8 isolates for JavaScript, Python and WebAssembly",
      ],
    },
    deployment: {
      cloud: true,
      selfHosted: false,
      byoc: false,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: false,
      gpu: false,
      desktop: false,
      browser: false,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: true,
      cli: true,
      mcp: null,
      webhook: false,
    },
    pricing: {
      model: ["Pay as you go"],
      freeTier: false,
      pricingUrl: "https://developers.cloudflare.com/containers/platform/pricing/",
      verifiedAt: "2026-11-15",
      costSummary:
        "Sandboxes run on Containers, which need the Workers Paid plan at $5/month. That plan includes 25 GiB-hours of memory, 375 vCPU-minutes and 200 GB-hours of disk per month. Past the allowance memory costs $0.0000025/GiB-second, CPU $0.000020/vCPU-second and disk $0.00000007/GB-second, metered in 10 ms steps. CPU is charged for active use only, while memory and disk are charged for provisioned resources the whole time an instance runs, including while it waits on a model. An instance that has stopped is not billed. Snapshots are free during the Containers public beta, with pricing to be announced at general availability. Egress is $0.04/GB in most regions and $0.05/GB in Oceania, Korea and Taiwan, with 500 GB/month included.",
      billingUnit: "per GiB-second, vCPU-second and GB-second",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu:
        "1/16 to 4 vCPU by instance type (lite, basic, standard-1 to standard-4); custom sizes also accepted",
      maxRam: "256 MiB to 12 GiB by instance type, or a custom memory size",
      storageLimit:
        "2 to 20 GB container disk by instance type; files can be saved as a Container snapshot (public beta) or backed up to R2",
      bootTime: "On-demand instance start; Cloudflare publishes no start-time SLA",
      networkIsolation:
        "Each instance is a microVM with its own kernel and network, so no other workload shares it. The Worker decides whether the instance reaches the public Internet, and host allow/deny rules can narrow it further. Credentials stay in the Worker and are injected per request, so sandbox code never holds the token. Dynamic Workers get a V8 isolate plus the Workers process sandbox and reach the application only through methods the Worker passes in.",
      operatingSystems: ["Linux (bring your own image)"],
    },
    overview:
      "Cloudflare Sandboxes now offer two environments from one Worker. Containers run your image in a full Linux microVM with its own kernel and network, started by a Durable Object that is addressed by name, so the same session ID returns to the same workspace. Dynamic Workers create a fresh Worker at runtime for JavaScript, Python or WebAssembly and expose only the methods and data you pass in, which suits interpreters and lightweight agent code without a container boot. The Worker remains the policy point: it decides who gets a sandbox, whether the instance reaches the Internet, and which credentials are injected, so tokens never enter sandbox code. Snapshots save the writable root filesystem into the next instance, browser terminals and previews cover interactive work, and the docs ship full recipes for Claude Code, Codex, Cursor, Devin and OpenCode. The trade-offs are Workers-specific: you deploy a Worker and an image, the sandbox is tied to Cloudflare's runtime, snapshots are still public beta and do not save memory or processes, and billing follows Containers metering rather than a simple per-box rate.",
    keyFeatures: [
      "Linux microVM per instance, with its own kernel and network",
      "Dynamic Workers for JavaScript, Python and WebAssembly isolates",
      "One Durable Object per named sandbox, so sessions can be resumed",
      "Container snapshots save the writable root filesystem (public beta)",
      "Worker-side credential injection, so sandbox code never holds tokens",
      "Outbound Internet on/off plus host allow/deny rules",
      "Preview URLs, WebSocket terminals and streamed command output",
      "Coding-agent recipes for Claude Code, Codex, Cursor, Devin and OpenCode",
    ],
    sampleCode: {
      language: "typescript",
      filename: "src/index.ts",
      code: `import { DurableObject } from "cloudflare:workers";

export class MyContainer extends DurableObject<Env> {
  async exec(argv: string[]) {
    const container = this.ctx.container;
    if (!container) {
      throw new Error("No container is configured");
    }

    if (!container.running) {
      container.start({
        image: "cloudflare/debian-trixie",
        entrypoint: ["sleep", "infinity"],
        enableInternet: false,
      });
    }

    const process = await container.exec(argv);
    const output = await process.output();
    return {
      stdout: new TextDecoder().decode(output.stdout),
      exitCode: output.exitCode,
    };
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { argv } = (await request.json()) as { argv: string[] };
    const sandbox = env.MY_CONTAINER.getByName("sandbox");
    return Response.json(await sandbox.exec(argv));
  },
};`,
    },

    openSource: false,
    featured: false,
    rating: 4.7,
    status: "active",
    lifecycle: {
      idleBilling: "wall_clock",
      pauseRetains: "disk",
      resumeTime: "Next request starts a fresh instance from the image or from a saved snapshot",
      sessionLimit:
        "The application sets the inactivity timeout; without one Cloudflare stops the instance shortly after the Durable Object goes inactive. An idle instance is still billed for memory and disk until it stops.",
    },
    sdkLanguages: ["TypeScript"],
    alternatives: ["vercel-sandbox", "e2b", "modal"],
    relatedGuideIds: [
      "ai-agent-sandbox-guide",
      "how-to-build-agent-environment",

      "sandbox-escapes-guide",
      "egress-and-credential-isolation",
    ],
    createdAt: "2022-05-01",
    updatedAt: "2026-11-15",
  },
  {
    id: "vercel-sandbox",
    slug: "vercel-sandbox",
    name: "Vercel Sandbox",
    description:
      "Firecracker microVMs with a dedicated kernel behind the Vercel platform, persistent by default with snapshot-and-resume.",
    logo: "V",
    logoBg: "#000000",
    logoTextColor: "#FFFFFF",
    website: "https://vercel.com/docs/vercel-sandbox",
    documentation: "https://vercel.com/docs/vercel-sandbox",
    productType: "commercial_saas",
    categories: ["MicroVM", "AI Agent Sandbox", "Code Execution", "Cloud Computer"],
    runtime: {
      docker: false,
      firecracker: true,
      gvisor: false,
      other: ["Firecracker", "Dedicated kernel per sandbox"],
    },
    deployment: {
      cloud: true,
      selfHosted: false,
      byoc: false,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: true,
      gpu: false,
      desktop: false,
      browser: false,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: true,
      cli: true,
      mcp: false,
      webhook: false,
    },
    pricing: {
      model: ["Free Tier", "Subscription", "Pay as you go"],
      freeTier: true,
      pricingUrl: "https://vercel.com/docs/vercel-sandbox/pricing",
      verifiedAt: "2026-11-15",
      costSummary:
        "Billed on active CPU at $0.128/hour, provisioned memory at $0.0212/GB-hour, sandbox creations at $0.60 per million, data transfer at $0.15/GB and snapshot storage at $0.08/GB-month. Hobby includes 5 CPU hours and 420 GB-hours per month.",
      billingUnit: "per active CPU-hour plus provisioned GB-hour",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "4 vCPU Hobby, 8 Pro, 32 Enterprise",
      maxRam: "2 GB per vCPU (8 GB Pro, 64 GB Enterprise)",
      storageLimit: "64 GB ephemeral NVMe on current images",
      bootTime: "Milliseconds (Firecracker)",
      networkIsolation:
        "Each sandbox is a Firecracker microVM with its own kernel, plus firewall rules and port exposure controls. The docs compare the microVM boundary directly against container isolation.",
      operatingSystems: ["Linux (Ubuntu-based images)"],
    },
    overview:
      "Vercel Sandbox exposes the Firecracker infrastructure behind Vercel's build fleet as a product: one microVM per sandbox, a dedicated kernel, and millisecond starts. Persistence is the default rather than an add-on, since stopping a sandbox snapshots its filesystem and the next session resumes from it, which suits agents that install packages once and return across turns. Resource ceilings are published per plan, from 4 vCPUs on Hobby to 32 on Enterprise, with 2 GB of memory per vCPU. The constraints are the platform-product ones: no self-hosting, no bring-your-own-cloud, no GPU, and a hard 45-minute session cap on Hobby. The isolation itself is real microVM isolation, not a namespace trick.",
    keyFeatures: [
      "Firecracker microVM with a dedicated kernel",
      "Persistent by default: snapshot on stop, resume on start",
      "Millisecond starts on shared Vercel infrastructure",
      "Start from a Git repository, image or snapshot",
      "Firewall rules and port exposure for running servers",
      "TypeScript and Python SDKs plus a CLI",
    ],
    sampleCode: {
      language: "typescript",
      filename: "vercel-sandbox.ts",
      code: `import { Sandbox } from "@vercel/sandbox";

const sandbox = await Sandbox.create({ resources: { vcpus: 2 } });
const command = await sandbox.runCommand({
  cmd: "python",
  args: ["-c", "print(6 * 7)"],
});
console.log(command.exitCode, await command.stdout());
// Stopping snapshots the filesystem; the next run resumes from it.
await sandbox.stop();`,
    },

    openSource: false,
    featured: false,
    rating: 4.6,
    status: "active",
    lifecycle: {
      idleBilling: "usage_metered",
      pauseRetains: "disk",
      resumeTime: "Milliseconds",
      sessionLimit: "45m Hobby / 24h Pro, default timeout 5 minutes",
    },
    sdkLanguages: ["TypeScript", "Python"],
    alternatives: ["cloudflare-sandboxes", "e2b", "modal"],
    relatedGuideIds: [
      "ai-agent-sandbox-guide",
      "how-to-build-agent-environment",
      "egress-and-credential-isolation",
    ],
    createdAt: "2021-08-01",
    updatedAt: "2026-11-15",
  },
  {
    id: "northflank",
    slug: "northflank",
    name: "Northflank",
    description:
      "Enterprise-grade multi-tenant microVM and container sandboxes with BYOC, GPU pools, and huge persistent volumes.",
    logo: "NF",
    logoBg: "#0F172A",
    logoTextColor: "#818CF8",
    website: "https://northflank.com",
    documentation: "https://northflank.com/docs",
    productType: "commercial_saas",
    categories: ["Code Sandbox", "MicroVM", "AI Agent Sandbox", "Code Execution"],
    runtime: {
      firecracker: true,
      docker: true,
      gvisor: true,
      other: ["Kata Containers, Firecracker MicroVM & gVisor isolation"],
    },
    deployment: {
      cloud: true,
      selfHosted: false,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: true,
      gpu: true,
      desktop: false,
      mobile: false,
      browser: false,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: true,
      cli: true,
      mcp: true,
      webhook: true,
    },
    pricing: {
      model: ["Free Tier", "Pay as you go", "Enterprise"],
      freeTier: true,
      pricingUrl: "https://northflank.com/pricing",
      verifiedAt: "2026-11-15",
      costSummary:
        "Free tier keeps 2 services, 2 jobs and 1 database running with up to $20/month of resources and one BYOC cluster of 12 vCPU / 48 GB. Pay as you go starts at $0.01667 per vCPU-hour, billed to the second, with no seat fees.",
      billingUnit: "per-vCPU-hour, billed to the second",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "64 vCPU",
      maxRam: "256 GB RAM",
      storageLimit: "Up to 64 TB persistent volumes",
      bootTime: "< 500ms",
      networkIsolation:
        "Strict Kubernetes NetworkPolicies, egress IP allowlisting, and private VPC peering.",
      operatingSystems: ["Any OCI Linux image with Kata / Firecracker kernel"],
    },
    overview:
      "Northflank provides hardware-isolated microVM and hardened container sandboxes engineered for enterprise AI agent workloads. Teams can switch seamlessly between Kata Containers, Firecracker, and gVisor per workload while deploying either on Northflank Cloud or inside their own AWS/GCP/Azure VPCs via BYOC.",
    keyFeatures: [
      "Pluggable isolation: Kata Containers, Firecracker, or gVisor per workload",
      "Bring Your Own Cloud (BYOC) on AWS, GCP, Azure, Oracle, or bare metal",
      "Massive persistent storage volumes up to 64 TB and instant snapshots",
      "NVIDIA H100/A100 GPU acceleration for code + inference agent sandboxes",
      "Fine-grained egress firewall rules and VPC private networking",
    ],
    lifecycle: {
      idleBilling: "wall_clock",
      pauseRetains: "disk",
      resumeTime: "Seconds",
      sessionLimit: "Configurable",
    },
    compliance: ["SOC 2 Type II", "ISO 27001"],
    sdkLanguages: ["TypeScript", "Python", "Go"],
    openSource: false,
    featured: false,
    rating: 4.8,
    status: "active",
    alternatives: ["e2b", "daytona", "modal"],
    relatedGuideIds: [
      "firecracker-vs-docker-vs-gvisor",
      "self-hosted-vs-cloud",
      "egress-and-credential-isolation",
    ],
    createdAt: "2023-06-15",
    updatedAt: "2024-11-08",
  },
  {
    id: "freestyle",
    slug: "freestyle",
    name: "Freestyle",
    description:
      "Full Linux VMs for AI agents with millisecond provisioning, long-running sessions, snapshots, and domains.",
    logo: "FS",
    logoBg: "#0F172A",
    logoTextColor: "#38BDF8",
    website: "https://freestyle.sh",
    documentation: "https://freestyle.sh/docs",
    github: "",
    productType: "commercial_saas",
    categories: ["Cloud Computer", "AI Agent Sandbox", "Code Sandbox"],
    runtime: {
      firecracker: false,
      docker: true,
      gvisor: false,
      other: ["Full Linux VMs"],
    },
    deployment: {
      cloud: true,
      selfHosted: false,
      byoc: false,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: true,
      gpu: false,
      desktop: false,
      mobile: false,
      browser: true,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: true,
      cli: true,
      mcp: null,
      webhook: false,
    },
    pricing: {
      model: ["Pay as you go", "Subscription"],
      freeTier: true,
      pricingUrl: "https://freestyle.sh/pricing",
      verifiedAt: "2026-11-15",
      costSummary:
        "Free is $0 forever with hard-stop allowances, 10 concurrent and 10 saved VMs, capped at 4 vCPU / 8 GiB / 32 GiB disk and no persistent VMs. Hobby is $50/month and Pro $500/month, both covering usage dollar-for-dollar before overage, with 40 or 400 concurrent VMs. Usage per hour: vCPU $0.04032, GiB memory $0.0129, GiB storage $0.000086 and $0.02 per GB transferred, against monthly allowances of 200 vCPU-hours, 400 GiB-hours and 60,000 GiB-hours of storage.",
      billingUnit: "vCPU-hour, GiB-hour memory and storage, GB transfer",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "32 vCPU (Pro); 4 vCPU on Free",
      maxRam: "64 GiB (Pro); 8 GiB on Free",
      storageLimit: "256 GiB disk per VM on Pro; persistent VMs from Hobby up",
      bootTime: "< 400ms",
      networkIsolation: "Per-VM network isolation with egress controls",
      operatingSystems: ["Linux"],
    },
    overview:
      "Freestyle sells full Linux VMs rather than sandboxes, and pitches the difference in terms agents actually hit: work that runs for hours, days or weeks, on a machine that is not reset between steps. Startup is quoted at 65ms, which is fast enough that the VM feels like a process, and two features follow from the long-running model. Live cloning copies a running VM including its memory, so a prepared state can be branched for parallel attempts instead of rebuilt, and pause and resume keep state intact for the gaps in between. Networking is stricter than most: default deny, with per-VM rules you write, plus WireGuard tunnels that connect a VM to a private cloud so it can reach internal services without exposing them. Previews get a real URL, either a generated subdomain or a custom domain with managed HTTPS, which is what makes the output of an agent shareable rather than a file in a VM. The plans are shaped around usage rather than seats: a free tier with hard stops, Hobby at $50 and Pro at $500 covering usage dollar-for-dollar, at $0.04032 per vCPU-hour, $0.0129 per GiB-hour of memory and $0.02 per GB transferred.",
    keyFeatures: [
      "Millisecond VM provisioning (p99 under 400ms)",
      "Long-running VMs for multi-hour or multi-day agent tasks",
      "Snapshots and restore for reproducible agent environments",
      "Custom domains and networking for agent-built apps",
      "Built for code you did not write",
    ],
    sampleCode: {
      language: "typescript",
      filename: "freestyle_vm.ts",
      code: `import { Freestyle } from "freestyle";

const vm = await Freestyle.createVM();
await vm.exec("echo hello from sandbox");`,
    },
    lifecycle: {
      idleBilling: "usage_metered",
      pauseRetains: "memory",
      resumeTime: "Milliseconds",
      sessionLimit: "Long-running",
    },
    sdkLanguages: ["TypeScript"],
    openSource: false,
    featured: false,
    rating: 4.6,
    status: "active",
    alternatives: ["e2b", "daytona", "modal"],
    relatedGuideIds: ["ai-agent-sandbox-guide", "egress-and-credential-isolation"],
    createdAt: "2024-06-01",
    updatedAt: "2026-11-14",
  },
  {
    id: "aws-lambda-microvm",
    slug: "aws-lambda-microvm",
    name: "AWS Lambda MicroVMs",
    description:
      "Firecracker microVMs inside AWS Lambda for user- and AI-generated code: launch from a pre-initialized snapshot, keep memory and disk state, suspend for up to 8 hours.",
    logo: "AWS",
    logoBg: "#232F3E",
    logoTextColor: "#FF9900",
    website: "https://aws.amazon.com/lambda/",
    documentation: "https://docs.aws.amazon.com/lambda/",
    productType: "commercial_saas",
    categories: ["Code Execution", "AI Agent Sandbox", "MicroVM"],
    runtime: {
      firecracker: true,
      docker: false,
      gvisor: false,
      other: [
        "One Firecracker MicroVM per user session, with no shared kernel",
        "A MicroVM Image is built from your Dockerfile and a zip code artifact in S3, then snapshotted with the application already initialized",
        "Each launch and resume restores that pre-initialized memory and disk snapshot instead of booting cold",
      ],
    },
    deployment: {
      cloud: true,
      selfHosted: false,
      byoc: false,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: false,
      gpu: false,
      desktop: false,
      mobile: false,
      browser: false,
      egressControl: null,
      autoSleep: true,
      api: true,
      sdk: true,
      cli: true,
      mcp: null,
      webhook: false,
    },
    pricing: {
      model: ["Pay as you go"],
      freeTier: false,
      pricingUrl: "https://aws.amazon.com/lambda/pricing/",
      verifiedAt: "2026-11-15",
      costSummary:
        "Per-second compute on ARM64 in US East: $0.0000276944 per vCPU-second and $0.0000036667 per GB-second for the baseline, with vertical scaling to 4x charged only for the active excess. Snapshots bill $0.08 per GB-month with a one-week minimum retention, $0.00155 per GB read and $0.0038 per GB written. Suspended time has no compute charge; data transfer is at standard AWS rates.",
      billingUnit: "instance-second plus snapshot read, write and storage",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "16 vCPU",
      maxRam: "32 GB",
      storageLimit: "32 GB of disk per MicroVM",
      bootTime:
        "Near-instant per AWS, because launches resume a pre-initialized Firecracker snapshot; no boot-time figure is published",
      networkIsolation:
        "Each session gets a dedicated Firecracker MicroVM with no shared kernel. Launch needs no networking setup and returns a dedicated HTTPS endpoint with a short-lived auth token; a MicroVM can also reach a VPC, billed at standard data-transfer rates. AWS does not publish an egress allowlist or default-deny policy for the MicroVM itself.",
      operatingSystems: ["Amazon Linux 2023 (al2023-minimal base image)"],
    },
    overview:
      "Lambda MicroVMs are the most consequential sandbox launch of 2026 for one reason: Firecracker isolation arrives as a managed AWS primitive instead of a platform a team has to build. A MicroVM Image is a Dockerfile plus a zip in S3; Lambda builds it, starts the app, and snapshots running memory and disk, so every later launch resumes pre-initialized rather than booting. Each end user or session gets its own MicroVM with no shared kernel, state survives idle suspension for up to eight hours, and resumes happen on the next request, which makes it a credible fit for hosted coding assistants and multi-tenant code execution. The limits are concrete: ARM64 only at launch, 16 vCPU, 32 GB memory and 32 GB disk per MicroVM, eight hours of total runtime, and availability in five regions. Pricing is per instance-second with snapshot reads, writes and storage billed separately, and idle suspension removes the compute charge but not storage. Two honest caveats: apps that create unique content or open network connections during initialization may need vendor-provided hooks because they start from a snapshot, and AWS publishes no per-MicroVM egress policy, so network containment is yours to enforce.",
    keyFeatures: [
      "Firecracker MicroVM per session inside AWS Lambda",
      "Launch from a pre-initialized memory and disk snapshot",
      "Stateful: memory, disk and processes survive the session",
      "Suspend idle MicroVMs for up to 8 hours, auto-resume on traffic",
      "Dedicated HTTPS endpoint and short-lived auth token",
      "Up to 16 vCPU, 32 GB memory and 32 GB disk",
      "Per-second compute plus separately billed snapshots",
      "ARM64 only; five regions at launch",
    ],
    openSource: false,
    featured: false,
    rating: 4.3,
    status: "active",
    lifecycle: {
      idleBilling: "usage_metered",
      pauseRetains: "memory",
      resumeTime:
        "Near-instant, resumed from a Firecracker snapshot; AWS publishes no millisecond figure",
      sessionLimit:
        "Up to 8 hours of total runtime per MicroVM; a suspended MicroVM keeps memory and disk for up to 8 hours and can auto-resume on traffic",
    },
    alternatives: ["e2b", "modal", "cloudflare-sandboxes"],
    relatedGuideIds: ["firecracker-vs-docker-vs-gvisor", "self-hosted-vs-cloud"],
    createdAt: "2014-11-13",
    updatedAt: "2026-11-15",
  },
  {
    id: "coder",
    slug: "coder",
    name: "Coder",
    description:
      "Self-hosted cloud development environments with Terraform templates, RBAC, and audit logging for agent workspaces.",
    logo: "CD",
    logoBg: "#1F2937",
    logoTextColor: "#FFFFFF",
    website: "https://coder.com",
    documentation: "https://coder.com/docs",
    github: "https://github.com/coder/coder",
    productType: "open_source_tool",
    categories: ["Self-hosted", "Cloud Computer", "Code Sandbox"],
    runtime: {
      docker: true,
      firecracker: false,
      gvisor: false,
      other: ["Terraform-provisioned VMs/containers"],
    },
    deployment: {
      cloud: true,
      selfHosted: true,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: true,
      gpu: true,
      desktop: true,
      mobile: false,
      browser: true,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: true,
      cli: true,
      mcp: true,
      webhook: false,
    },
    pricing: {
      model: ["Free Tier", "Subscription", "Enterprise"],
      freeTier: true,
      pricingUrl: "https://coder.com/pricing",
      verifiedAt: "2026-11-14",
      costSummary:
        "Community is free and self-hosted with unlimited workspaces, AI agents in ephemeral workspaces, up to 5 active Coder Agents and one platform integration. Premium is priced annually per user with no public figure: it adds audit, high availability, RBAC and unlimited integrations but still caps at 5 agents. AI Premium is custom and removes the agent cap, adding network-isolated agent workspaces, Agent Firewall, AI Gateway and an MCP server.",
      billingUnit: "per user per year on paid tiers",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "Template-defined: a workspace is whatever the Terraform template provisions",
      maxRam: "Template-defined",
      storageLimit: "Persistent volumes declared in the template",
      bootTime: "Seconds to minutes, set by the template's provisioner",
      networkIsolation:
        "Terraform-defined networking per workspace, with RBAC and audit logging; AI Premium adds network-isolated agent workspaces, an Agent Firewall and an AI Gateway",
      operatingSystems: ["Linux", "Windows", "macOS (remote)"],
    },
    overview:
      "Coder is the self-hosted answer to the hosted sandboxes in this catalog: workspaces come from Terraform templates, so a team decides for itself whether a workspace is a container, a VM, a Kubernetes pod or bare metal, and the control plane runs in its own infrastructure. That makes it the listing to pick when sandbox policy is a compliance argument rather than a pricing argument. The agent story has moved to the centre of the product: the pricing page now leads with AI agents in ephemeral workspaces, and the paid AI Premium tier adds network-isolated agent workspaces alongside an Agent Firewall and AI Gateway, plus an MCP server for agent tooling. Read the licence edges before adopting it for agents. The free Community edition allows unlimited workspaces but caps at five active Coder Agents and one platform integration; Premium is quoted annually per user with no public figure and still caps at five agents; only AI Premium removes the cap. That cap is the practical difference between running a demo fleet and running production, and it is the first thing to price out.",
    keyFeatures: [
      "Terraform-based workspace templates for any infrastructure",
      "Self-hosted on your own cloud, cluster or datacenter",
      "AI agents in ephemeral workspaces, plus persistent dev workspaces",
      "Community edition: unlimited workspaces, up to 5 active agents",
      "AI Premium: network-isolated agent workspaces, Agent Firewall, AI Gateway, MCP server",
      "RBAC, audit logs and SSO on paid tiers",
      "GPU and desktop-capable workspaces",
      "Open-source core with 17k+ GitHub stars",
    ],
    sampleCode: {
      language: "hcl",
      filename: "coder-template.tf",
      code: `resource "coder_agent" "main" {
  arch = "amd64"
  os   = "linux"
}`,
    },
    openSource: true,
    githubStars: 17_384,
    featured: false,
    rating: 4.6,
    status: "active",
    lifecycle: {
      idleBilling: "wall_clock",
      pauseRetains: "disk",
      resumeTime: "Seconds to minutes, depending on the provisioner",
      sessionLimit:
        "Workspace lifetime, set by the template's lifecycle policy; agent workspaces can be ephemeral by design and are destroyed after a task",
    },
    alternatives: ["ona", "github-codespaces", "northflank"],
    relatedGuideIds: ["self-hosted-vs-cloud", "egress-and-credential-isolation"],
    createdAt: "2019-01-01",
    updatedAt: "2026-11-15",
  },
  {
    id: "ona",
    slug: "ona",
    name: "Ona",
    description:
      "Background software agents on isolated cloud VMs inside your VPC, with dev-container environments and kernel-level policy.",
    logo: "ON",
    logoBg: "#1F1F1F",
    logoTextColor: "#FFAE33",
    website: "https://ona.com",
    documentation: "https://ona.com/docs",
    github: "https://github.com/gitpod-io/gitpod",
    productType: "commercial_saas",
    categories: ["Cloud Computer", "AI Agent Sandbox", "Code Sandbox"],
    runtime: {
      docker: true,
      firecracker: false,
      gvisor: false,
      other: [
        "Isolated cloud VMs inside your VPC",
        "Kernel-level enforcement (Veto)",
        "Dev containers",
      ],
    },
    deployment: {
      cloud: true,
      selfHosted: false,
      byoc: true,
    },
    capabilities: {
      persistent: true,
      snapshot: null,
      fork: null,
      gpu: null,
      desktop: false,
      mobile: false,
      browser: true,
      egressControl: true,
      autoSleep: null,
      api: null,
      sdk: null,
      cli: null,
      mcp: null,
      webhook: false,
    },
    pricing: {
      model: ["Subscription", "Enterprise"],
      freeTier: false,
      pricingUrl: "https://ona.com/pricing",
      verifiedAt: "2026-11-15",
      costSummary:
        "Core plans start at $20/month and are usage-based; Enterprise runs in your VPC with custom pricing. No free tier is listed.",
      billingUnit: "per-seat plan plus usage",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "Template-defined",
      maxRam: "Template-defined",
      storageLimit: "Persistent environment storage",
      bootTime: "Seconds (prebuilt environments)",
      networkIsolation:
        "Each agent gets an isolated cloud VM deployed in Ona's cloud or inside your VPC. Policy is enforced in the kernel (Veto), credentials are scoped per environment, and Enterprise adds SSO, audit logging, org guardrails, SOC 2 and GDPR claims.",
      operatingSystems: ["Linux (dev containers)"],
    },
    overview:
      "Ona is Gitpod's rebrand into what it calls mission control for background software agents. Each agent gets an isolated cloud VM that runs the full toolchain and test suite, deployed either in Ona's cloud or entirely inside your VPC, with the company claiming code, inference and orchestration never leave the perimeter. Environments are dev containers with preconfigured tools and scoped credentials, and kernel-level policy (Veto) constrains what an agent can execute, access or connect to. It is closer to a managed agent fleet than a raw sandbox API: built-in SCM support, audit trails and parallel agents matter more here than a per-second VM rate. The legacy gitpod-io/gitpod core remains AGPL, while the hosted agent product is commercial with plans starting at $20/month.",
    keyFeatures: [
      "Background agents on isolated cloud VMs",
      "Runs inside your VPC (BYOC) or Ona's cloud",
      "Kernel-level policy enforcement (Veto)",
      "Dev-container environments with scoped credentials",
      "Parallel agents and fleet-wide automations",
      "GitHub, GitLab, Bitbucket and Azure DevOps",
      "VS Code, Cursor, JetBrains, Windsurf and Zed support",
      "Enterprise SSO, audit logs and guardrails",
    ],
    sampleCode: {
      language: "json",
      filename: "devcontainer.json",
      code: `{
  "name": "agent-environment",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {},
    "ghcr.io/devcontainers/features/python:1": {}
  },
  "postCreateCommand": "npm install"
}`,
    },
    openSource: true,
    githubStars: 13_797,
    featured: false,
    rating: 4.5,
    status: "active",
    lifecycle: {
      idleBilling: "usage_metered",
      pauseRetains: "disk",
      resumeTime: "Seconds (prebuilt environments)",
      sessionLimit: "Environment lifetime tied to the agent run",
    },
    alternatives: ["coder", "github-codespaces", "daytona"],
    relatedGuideIds: [
      "self-hosted-vs-cloud",
      "ai-agent-sandbox-guide",
      "egress-and-credential-isolation",
    ],
    createdAt: "2019-01-01",
    updatedAt: "2026-11-15",
  },
  {
    id: "codesandbox",
    slug: "codesandbox",
    name: "CodeSandbox",
    description:
      "Browser development environments backed by a microVM-per-sandbox SDK, with snapshot restores in about a second and clones in about two.",
    logo: "CS",
    logoBg: "#151515",
    logoTextColor: "#FFFFFF",
    website: "https://codesandbox.io",
    documentation: "https://codesandbox.io/docs",
    productType: "commercial_saas",
    categories: ["Code Sandbox", "Cloud Computer", "Browser Sandbox"],
    runtime: {
      docker: true,
      firecracker: false,
      gvisor: false,
      other: [
        "CodeSandbox's own microVM infrastructure spins up each sandbox",
        "Any Dockerfile can be built inside the sandbox",
        "Snapshot restore inside about 1 second and VM or snapshot clone inside about 2 seconds, per the SDK README",
      ],
    },
    deployment: {
      cloud: true,
      selfHosted: false,
      byoc: false,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: true,
      gpu: false,
      desktop: false,
      mobile: false,
      browser: true,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: true,
      cli: false,
      mcp: null,
      webhook: false,
    },
    pricing: {
      model: ["Free Tier", "Subscription", "Enterprise"],
      freeTier: true,
      pricingUrl: "https://codesandbox.io/pricing",
      verifiedAt: "2026-11-15",
      costSummary:
        "Build is $0 with 5 members, 20 GB storage, 10 concurrent SDK VMs, 20 new sandboxes an hour, 1,000 requests an hour and VMs up to 4 vCPU / 8 GiB. Scale starts at $170 per month per workspace with 20 members, 160 monthly VM hours, on-demand credits at $0.15 per hour, 250 concurrent VMs and 16 vCPU / 32 GiB machines; a Pro tier is listed in the feature table at the same sizes but its price is not shown on the cards. Enterprise is custom up to 64 vCPU / 128 GiB with SSO and a dedicated cluster. VM credits cost $0.015 each: Pico 5 credits per hour ($0.075, 2 GB), Nano 10 ($0.15, 4 GB), Micro 20 ($0.30, 8 GB), Small 40 ($0.60, 16 GB, Pro and up), Medium 80 ($1.20, 32 GB), Large 160 ($2.40, 64 GB) and XLarge 320 ($4.80, 128 GB). Browser Sandboxes are unlimited on every plan.",
      billingUnit: "workspace subscription plus VM credits",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "4 vCPU on Build, 16 vCPU on Scale, 64 vCPU on Enterprise",
      maxRam: "8 GiB on Build, 32 GiB on Scale, 128 GiB on Enterprise",
      storageLimit: "20 GB on Build; paid-plan storage is not published",
      bootTime:
        "Not published. Snapshot restores resolve within about 1 second and clones within about 2 seconds, per the SDK README",
      networkIsolation:
        "Each sandbox runs in its own microVM, which gives a kernel boundary per workspace. The SDK README does not document a default egress policy, so treat outbound network control as plan-dependent.",
      operatingSystems: ["Linux (microVM)"],
    },
    overview:
      "CodeSandbox is best understood through its SDK rather than its editor. CodeSandbox SDK (@codesandbox/sdk) spins up development environments and runs untrusted code on the company's microVM infrastructure, which means every sandbox gets its own kernel instead of sharing a container daemon. The README publishes the numbers that matter for agent loops: snapshot restore within about one second, and cloning a VM or a snapshot within about two seconds, so a pool of warm sandboxes can be branched per task rather than rebuilt. You can run any Dockerfile inside, wire source control through git, GitHub or CodeSandbox SCM, and drive it all from TypeScript over an API token. The browser editor and instant previews remain the human-facing surface. The company is now part of Together AI and publishes pricing directly: Build is free, Scale starts at $170 per month per workspace, and VM capacity is sold in credits at $0.015 each, from Pico at 5 credits an hour up to XLarge at 320. A Pro tier appears in the comparison table but has no public card price, and browsing happens through the same microVM pool so Browser Sandboxes need no separate quota.",
    keyFeatures: [
      "MicroVM per sandbox with its own kernel",
      "Snapshot restore within about 1 second",
      "VM and snapshot clone within about 2 seconds",
      "Run any Dockerfile inside the sandbox",
      "@codesandbox/sdk TypeScript client with API tokens",
      "Git, GitHub and CodeSandbox SCM integration",
      "Browser editor with instant previews",
    ],
    sampleCode: {
      language: "javascript",
      filename: "index.js",
      code: `console.log("Hello from CodeSandbox");`,
    },
    openSource: false,
    featured: false,
    rating: 4.4,
    status: "active",
    lifecycle: {
      idleBilling: "usage_metered",
      pauseRetains: "memory",
      resumeTime: "~2s",
      sessionLimit: "Unlimited session length on every plan; idle hibernation is configurable",
    },
    sdkLanguages: ["TypeScript", "Go"],
    alternatives: ["replit", "ona", "github-codespaces"],
    relatedGuideIds: ["ai-agent-sandbox-guide", "egress-and-credential-isolation"],
    createdAt: "2017-01-01",
    updatedAt: "2026-11-15",
  },
  {
    id: "replit",
    slug: "replit",
    name: "Replit",
    description:
      "Browser-based coding environment with an AI agent, deployments and multiplayer, now running each workspace in a Cloud Hypervisor microVM with memory snapshots.",
    logo: "RP",
    logoBg: "#F26207",
    logoTextColor: "#FFFFFF",
    website: "https://replit.com",
    documentation: "https://docs.replit.com",
    productType: "commercial_saas",
    categories: ["Code Sandbox", "Cloud Computer", "AI Agent Sandbox", "MicroVM"],
    runtime: {
      docker: true,
      firecracker: false,
      gvisor: false,
      other: [
        "Cloud Hypervisor microVM per sandbox, each with its own Linux kernel",
        "Containers (minimal runc) run inside the microVM for namespaces and resource limits",
        "Nix environments",
        "Memory snapshots and copy-on-write disk forks for warm pools",
      ],
    },
    deployment: {
      cloud: true,
      selfHosted: false,
      byoc: false,
    },
    capabilities: {
      persistent: true,
      snapshot: true,
      fork: true,
      gpu: false,
      desktop: false,
      mobile: false,
      browser: true,
      egressControl: true,
      autoSleep: true,
      api: true,
      sdk: true,
      cli: true,
      mcp: null,
      webhook: false,
    },
    pricing: {
      model: ["Free Tier", "Subscription", "Enterprise"],
      freeTier: true,
      pricingUrl: "https://replit.com/pricing",
      verifiedAt: "2026-11-15",
      costSummary:
        "Core is $20/month or $18/month billed yearly and includes $20 toward premium models; Free Mode is listed at up to 30 hours of chat and 60 projects. Pro is $100/month or $90/month yearly with $100 of model credit and higher tiers at $215, $425, $825 and $2,000/month. Enterprise is custom. Deployment and agent usage bill separately and this catalog did not read exact deployment rates.",
      billingUnit: "seat-month plus model and deployment usage",
      transparency: "official_verified",
    },
    techSpecs: {
      maxVcpu: "Not published per sandbox",
      maxRam: "Not published per sandbox",
      storageLimit: "Remote block storage fetched on demand rather than a full filesystem download",
      bootTime:
        "About 500 ms to acquire a sandbox, including volume attach and service setup, as stated by the vendor",
      networkIsolation:
        "Each sandbox gets its own network namespace and routing table over Linux VRF, so tenants can reuse the same private IPs. Egress policy is enforced host-side with TLS SNI inspection without payload decryption, DNS filtering and virtual-NIC bandwidth limits the guest cannot disable. The guest kernel is built from tinyconfig with module loading off, and a credential broker keeps upstream API keys away from the workload.",
      operatingSystems: ["Linux (Nix), per-sandbox kernel"],
    },
    overview:
      "Replit rebuilt its sandbox engine around microVMs in November 2026 and published the reasoning, which makes it one of the few large platforms whose isolation layer can be checked rather than inferred. Each workspace now runs in a Cloud Hypervisor microVM with its own kernel, not a shared container host; containers still run inside the VM for namespaces and limits. The performance story is warm pools plus memory snapshots: acquiring a sandbox takes about 500 ms including volume attach, and copy-on-write disks make forks cheap. Networking is the other interesting part. Sandboxes share private IPs through Linux VRF, egress is enforced outside the guest with SNI inspection and DNS filtering, and rate limits sit on the virtual NIC so the workload cannot turn them off. The vendor also audited 6,211 Linux CVEs against its tinyconfig kernel and reports avoiding 96.1% of them, a self-reported figure. Worth keeping in view: containers inside one VM still share that guest kernel, which the team judged acceptable for tenant isolation. For users the practical change is fewer cold starts and mid-session state that survives, not a new API.",
    keyFeatures: [
      "Browser IDE, AI agent and multiplayer",
      "Cloud Hypervisor microVM per sandbox",
      "About 500 ms sandbox acquisition in warm pools",
      "Memory snapshots and copy-on-write disk forks",
      "Host-side egress policy with SNI and DNS filtering",
      "Credential broker outside the workload",
      "tinyconfig guest kernel with module loading disabled",
      "One-click deployments and Nix environments",
    ],
    sampleCode: {
      language: "python",
      filename: "main.py",
      code: `print("Hello from Replit")`,
    },
    openSource: false,
    featured: false,
    rating: 4.5,
    status: "active",
    lifecycle: {
      idleBilling: "wall_clock",
      pauseRetains: "disk",
      resumeTime: "Seconds",
      sessionLimit: "Unlimited (paid)",
    },
    alternatives: ["codesandbox", "ona", "github-codespaces"],
    relatedGuideIds: ["ai-agent-sandbox-guide", "egress-and-credential-isolation"],
    createdAt: "2016-01-01",
    updatedAt: "2026-11-15",
  },
];

export const INITIAL_SANDBOXES: Sandbox[] = [
  ...ECOSYSTEM_SANDBOXES,
  ...CORE_SANDBOXES,
  ...COLLECTED_SANDBOXES,
];
