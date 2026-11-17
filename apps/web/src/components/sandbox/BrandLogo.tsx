import {
  AppWindow,
  Box,
  Castle,
  Cloud,
  Container,
  Cpu,
  Database,
  Fence,
  Flame,
  Gem,
  Globe,
  Layers,
  Lock,
  Monitor,
  Network,
  Package,
  Server,
  ShieldCheck,
  Smartphone,
  Smile,
  Snowflake,
  Sparkles,
  SquareTerminal,
  Terminal,
  Zap,
} from "lucide-react";

interface BrandLogoProps {
  className?: string;
  logoBg?: string;
  logoTextColor?: string;
  name: string;
  size?: "sm" | "md" | "lg";
  slug: string;
}

export function BrandLogo({
  slug,
  name,
  size = "md",
  className = "",
  logoBg,
  logoTextColor,
}: BrandLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8 rounded-lg text-xs ring-1 ring-white/10",
    md: "w-10 h-10 rounded-[12px] text-sm ring-1 ring-white/10",
    lg: "w-12 h-12 rounded-[12px] text-base ring-1 ring-white/10",
  }[size];

  // Render authentic brand marks matching the design mockup
  switch (slug) {
    case "e2b":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-white/15 bg-black shadow-md ${className}`}
        >
          {/* E2B crisp geometric polygon mark */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#F2F3FA]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M4 5h16v3H8v2h10v3H8v3h12v3H4V5z" />
          </svg>
        </div>
      );

    case "e2b-runtime":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-white/15 bg-black shadow-md ${className}`}
        >
          {/* Stacked slabs: the full E2B stack running on one node */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#F2F3FA]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M12 3 4 7l8 4 8-4-8-4Z" />
            <path d="m4 12 8 4 8-4" />
            <path d="m4 17 8 4 8-4" />
          </svg>
        </div>
      );

    case "hyperlight":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46]/70 bg-[#0A1F17] shadow-md ${className}`}
        >
          {/* Boundary brackets around a bolt: a tiny VM with one fast path in */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#6EE7B7]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M8 3H4v5M16 3h4v5M8 21H4v-5M16 21h4v-5" />
            <path d="m13 7-4 6h3l-1 5 6-7h-3l1-4Z" />
          </svg>
        </div>
      );

    case "ucloud-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0C4A6E]/70 bg-[#0A1B33] shadow-md ${className}`}
        >
          {/* Cloud with a terminal prompt: a hosted sandbox you reach by API */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#7DD3FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M7.5 18h9a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.6-1.2A3.9 3.9 0 0 0 7.5 18Z" />
            <path d="m10 11.5 2 2-2 2M14 15.5h3" />
          </svg>
        </div>
      );

    case "shadow-clone":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#312E81]/70 bg-[#111827] shadow-md ${className}`}
        >
          {/* Two overlapping pages: a fork sharing the template until it writes */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#A5B4FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="12" rx="2" width="10" x="3" y="7" />
            <path d="M8.5 7V5a2 2 0 0 1 2-2H19a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2h-2" />
            <path d="M8 4.5h4" />
          </svg>
        </div>
      );

    case "eclipse-che":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95]/70 bg-[#151022] shadow-md ${className}`}
        >
          {/* Browser window with code brackets: an IDE that lives in a pod */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#C4B5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="15" rx="2" width="18" x="3" y="4" />
            <path d="M3 8h18" />
            <path d="m9 11-2 2 2 2M15 11l2 2-2 2" />
          </svg>
        </div>
      );

    case "devpod":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#155E75]/70 bg-[#0B1F2A] shadow-md ${className}`}
        >
          {/* A workspace box with an up arrow: bring a devcontainer up anywhere */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#67E8F9]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="11" rx="2" width="18" x="3" y="9" />
            <path d="M8 9V6.5a4 4 0 0 1 8 0V9" />
            <path d="M12 17v-4.5M9.5 15 12 12.5l2.5 2.5" />
          </svg>
        </div>
      );

    case "forevervm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46]/70 bg-[#0B1F1A] shadow-md ${className}`}
        >
          {/* Refresh ring around a REPL prompt: the process outlives each call */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#6EE7B7]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M20 12a8 8 0 1 1-2.5-5.8" />
            <path d="M20 3.5V9h-5.5" />
            <path d="m9 10 2.5 2-2.5 2M14.5 14H17" />
          </svg>
        </div>
      );

    case "zode":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#155E75]/70 bg-[#071A24] shadow-md ${className}`}
        >
          {/* An angular Z that also reads as a fork branch: one path splits in two */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#67E8F9]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M6 6h11L7 18h11" />
            <circle cx="18.5" cy="6" fill="currentColor" r="1.4" stroke="none" />
            <circle cx="19" cy="18" fill="currentColor" r="1.4" stroke="none" />
          </svg>
        </div>
      );

    case "watasu-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#78350F]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* A W with a checkpoint dot: branchable workspace state */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FDE68A]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M3 6l3 12 6-9 6 9 3-12" />
            <circle cx="19" cy="4" fill="currentColor" r="1.5" stroke="none" />
          </svg>
        </div>
      );

    case "sandvault":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* A person inside a shield: the agent runs as its own limited account */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#6EE7B7]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M12 3l7 2.8V12c0 4-2.9 7-7 9-4.1-2-7-5-7-9V5.8z" />
            <circle cx="12" cy="9.6" r="1.7" />
            <path d="M9.2 15.2c.6-1.4 1.5-2.1 2.8-2.1s2.2.7 2.8 2.1" />
          </svg>
        </div>
      );

    case "clampdown":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7F1D1D]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* A clamp gripping a box: every tool container is checked before it runs */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FCA5A5]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M5 4h14M7 4v5h3M17 4v5h-3" />
            <rect height="7" rx="1.2" width="8" x="8" y="13" />
          </svg>
        </div>
      );

    case "leash":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* A collar and a short lead: the agent runs, the policy holds */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <circle cx="9" cy="9" r="4" />
            <path d="M12.5 12.5 15 15" />
            <rect height="6" rx="1.4" transform="rotate(12 18 18)" width="6" x="15" y="15" />
            <circle cx="18" cy="18" fill="currentColor" r="1" stroke="none" />
          </svg>
        </div>
      );

    case "bot-bottle":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#115E59]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* A sealed bottle: the agent is inside, egress goes through the neck */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#5EEAD4]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M9 3h6M10 3v4l-3 4v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-8l-3-4V3" />
            <path d="M9 15h6" />
            <circle cx="12" cy="18" fill="currentColor" r="1.2" stroke="none" />
          </svg>
        </div>
      );

    case "talyn":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0C4A6E]/70 bg-[#0F172A] shadow-md ${className}`}
        >
          {/* A T whose arms split into two parallel agent branches */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#7DD3FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M4 5h16M12 5v5" />
            <path d="M12 10 7 15M12 10l5 5" />
            <circle cx="6" cy="17" fill="currentColor" r="1.3" stroke="none" />
            <circle cx="18" cy="17" fill="currentColor" r="1.3" stroke="none" />
          </svg>
        </div>
      );

    case "flockvm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#78350F]/70 bg-[#1C1917] shadow-md ${className}`}
        >
          {/* A flock of VM instances sharing one host, with one paused */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FCD34D]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="6" rx="1.2" width="6" x="4" y="4" />
            <rect height="6" rx="1.2" width="6" x="14" y="4" />
            <rect height="6" rx="1.2" width="6" x="4" y="14" />
            <path d="M14 17h6M17 14v6" />
          </svg>
        </div>
      );

    case "dedalus-machines":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* A VM layer over a dormant core: the disk stays, the process sleeps */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="8" rx="1.5" width="16" x="4" y="4" />
            <path d="M8 8h.01M8 4v8M4 8h16" />
            <path d="M5 16h14M7 20h10" />
          </svg>
        </div>
      );

    case "daytona":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4c2d82] bg-[#1e1438] shadow-md ${className}`}
        >
          {/* Daytona purple ribbon D */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#9d68f6]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M4 4h7a8 8 0 0 1 8 8v0a8 8 0 0 1-8 8H4V4zm4 4v8h3a4 4 0 0 0 4-4v0a4 4 0 0 0-4-4H8z" />
          </svg>
        </div>
      );

    case "modal":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#164e2e] bg-[#0a1a12] shadow-md ${className}`}
        >
          {/* Modal concentric green wave arcs */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#22c55e]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M4 18a8 8 0 0 1 16 0" />
            <path d="M7 18a5 5 0 0 1 10 0" />
            <path d="M10 18a2 2 0 0 1 4 0" />
          </svg>
        </div>
      );

    case "firecracker":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7c2d12] bg-[#241005] shadow-md ${className}`}
        >
          <Flame className="h-5 w-5 fill-[#f97316]/20 text-[#f97316]" />
        </div>
      );

    case "cloud-hypervisor":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1e4976] bg-[#0b1c2e] shadow-md ${className}`}
        >
          {/* Hexagon geometric hypervisor */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#38bdf8]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2" />
            <circle cx="12" cy="12" fill="#38bdf8" r="3" />
          </svg>
        </div>
      );

    case "browserbase":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#83181f] bg-[#2a0e10] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#f43f5e] text-base">B</span>
        </div>
      );

    case "browserless":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3a2a12] bg-[#1a140c] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#f97316] text-base">BR</span>
        </div>
      );

    case "kasm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1e4976] bg-[#081e35] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#38bdf8] text-base">K</span>
        </div>
      );

    case "cua":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4c2d82] bg-[#1c1236] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#c084fc] text-base">C</span>
        </div>
      );

    case "omarchy":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#45475a] bg-[#161726] shadow-md ${className}`}
        >
          {/* Arch Linux swoosh */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#cba6f7]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 3L2 21h4.5l2.2-4.2c.8.2 1.6.3 2.5.3s1.7-.1 2.5-.3l2.2 4.2H22L12 3zm0 6.5l2.8 5.6c-.9.3-1.8.4-2.8.4s-1.9-.1-2.8-.4L12 9.5z" />
          </svg>
        </div>
      );

    case "mobilebox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#115e45] bg-[#06241b] shadow-md ${className}`}
        >
          <Smartphone className="h-5 w-5 text-[#34d399]" />
        </div>
      );

    case "redroid":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#135d2d] bg-[#0b2414] shadow-md ${className}`}
        >
          <Smartphone className="h-5 w-5 text-[#4ade80]" />
        </div>
      );

    case "gvisor":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1d4ed8] bg-[#0c1f2e] shadow-md ${className}`}
        >
          <ShieldCheck className="h-5 w-5 text-[#60a5fa]" />
        </div>
      );

    case "steel-dev":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#262C4A] bg-[#18181b] shadow-md ${className}`}
        >
          <Globe className="h-5 w-5 text-[#4ADE80]" />
        </div>
      );

    case "kata-containers":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#581c87] bg-[#18122e] shadow-md ${className}`}
        >
          <Layers className="h-5 w-5 text-[#A78BFA]" />
        </div>
      );

    case "dagger":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0e7490] bg-[#091e2b] shadow-md ${className}`}
        >
          <Zap className="h-5 w-5 text-[#22d3ee]" />
        </div>
      );

    case "flyio-sprites":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#701a75] bg-[#1f102e] shadow-md ${className}`}
        >
          <Sparkles className="h-5 w-5 text-fuchsia-400" />
        </div>
      );

    case "northflank":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#312e81] bg-[#0f172a] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#A78BFA]" />
        </div>
      );

    case "cloudflare-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9a3412] bg-[#2a1205] shadow-md ${className}`}
        >
          <Cpu className="h-5 w-5 text-orange-400" />
        </div>
      );

    case "cloudflare-computer":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9a3412] bg-[#2a1205] shadow-md ${className}`}
        >
          <Server className="h-5 w-5 text-orange-400" />
        </div>
      );

    case "agentos":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#164E63] bg-[#061820] shadow-md ${className}`}
        >
          <Layers className="h-5 w-5 text-[#22D3EE]" />
        </div>
      );

    case "arcbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95] bg-[#140B26] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#A78BFA]" />
        </div>
      );

    case "smol-machines":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46] bg-[#061A14] shadow-md ${className}`}
        >
          <Zap className="h-5 w-5 text-[#34D399]" />
        </div>
      );

    case "sandbox-runtime":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E] bg-[#1A1207] shadow-md ${className}`}
        >
          <ShieldCheck className="h-5 w-5 text-[#F59E0B]" />
        </div>
      );

    case "coop":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#831843] bg-[#1A0A14] shadow-md ${className}`}
        >
          <Terminal className="h-5 w-5 text-[#F472B6]" />
        </div>
      );

    case "ash":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412] bg-[#1A0F0A] shadow-md ${className}`}
        >
          <Lock className="h-5 w-5 text-[#FDBA74]" />
        </div>
      );

    case "astrid":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3730A3] bg-[#0B1020] shadow-md ${className}`}
        >
          <Sparkles className="h-5 w-5 text-[#818CF8]" />
        </div>
      );

    case "mirage":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3F3F46] bg-[#0C0C0C] shadow-md ${className}`}
        >
          <Globe className="h-5 w-5 text-[#F0ECE2]" />
        </div>
      );

    case "databricks-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9F1239] bg-[#1A0F0A] shadow-md ${className}`}
        >
          <Database className="h-5 w-5 text-[#FCA5A5]" />
        </div>
      );

    case "spheron-agent-gpu":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7C3AED] bg-[#170F26] shadow-md ${className}`}
        >
          <Cpu className="h-5 w-5 text-[#E9D5FF]" />
        </div>
      );

    case "boxcompute":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0F766E] bg-[#0B1A1A] shadow-md ${className}`}
        >
          <Cloud className="h-5 w-5 text-[#5EEAD4]" />
        </div>
      );

    case "prized":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#5B21B6] bg-[#141126] shadow-md ${className}`}
        >
          <Gem className="h-5 w-5 text-[#C4B5FD]" />
        </div>
      );

    case "munito":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#B45309] bg-[#1C1408] shadow-md ${className}`}
        >
          <Globe className="h-5 w-5 text-[#FBBF24]" />
        </div>
      );

    case "nodion":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1D4ED8] bg-[#0B1220] shadow-md ${className}`}
        >
          <Server className="h-5 w-5 text-[#60A5FA]" />
        </div>
      );

    case "krunvm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#155E75] bg-[#0F172A] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#67E8F9]" />
        </div>
      );

    case "clawless":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7F1D1D] bg-[#0B1220] shadow-md ${className}`}
        >
          <SquareTerminal className="h-5 w-5 text-[#FCA5A5]" />
        </div>
      );

    case "firecracker-containerd":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412] bg-[#1A0F0A] opacity-80 shadow-md ${className}`}
        >
          <Flame className="h-5 w-5 text-[#FB923C]" />
        </div>
      );

    case "nerdbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1D4ED8] bg-[#0B1220] shadow-md ${className}`}
        >
          <Container className="h-5 w-5 text-[#93C5FD]" />
        </div>
      );

    case "microvm-nix":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490] bg-[#0E1424] shadow-md ${className}`}
        >
          <Snowflake className="h-5 w-5 text-[#7DD3FC]" />
        </div>
      );

    case "ironcurtain":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#6B21A8] bg-[#141018] shadow-md ${className}`}
        >
          <Fence className="h-5 w-5 text-[#E9D5FF]" />
        </div>
      );

    case "sandcastle":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#6D28D9] bg-[#161022] shadow-md ${className}`}
        >
          <Castle className="h-5 w-5 text-[#D8B4FE]" />
        </div>
      );

    case "agent-substrate":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534] bg-[#0B1410] shadow-md ${className}`}
        >
          <Network className="h-5 w-5 text-[#86EFAC]" />
        </div>
      );

    case "agent-compute-engine":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#2563EB] bg-[#0B1220] shadow-md ${className}`}
        >
          <Cloud className="h-5 w-5 text-[#93C5FD]" />
        </div>
      );

    case "volcengine-cloud-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#C2410C] bg-[#1A0F08] shadow-md ${className}`}
        >
          <Flame className="h-5 w-5 text-[#FB923C]" />
        </div>
      );

    case "nehemiah":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E] bg-[#1A1206] shadow-md ${className}`}
        >
          <Monitor className="h-5 w-5 text-[#FBBF24]" />
        </div>
      );

    case "bhatti":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0F766E] bg-[#0B1A1A] shadow-md ${className}`}
        >
          <Cpu className="h-5 w-5 text-[#5EEAD4]" />
        </div>
      );

    case "tryboxi":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#C2410C] bg-[#1A0F08] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#FB923C]" />
        </div>
      );

    case "pullrun":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#5B21B6] bg-[#150F2B] shadow-md ${className}`}
        >
          <Package className="h-5 w-5 text-[#A78BFA]" />
        </div>
      );

    case "opencore-sandbox-sdk":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/60 bg-[#0E1B2A] shadow-md ${className}`}
        >
          <Terminal className="h-5 w-5 text-[#7DD3FC]" />
        </div>
      );

    case "kubeswift":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0369A1]/60 bg-[#0F1A24] shadow-md ${className}`}
        >
          <Server className="h-5 w-5 text-[#7DD3FC]" />
        </div>
      );

    case "clank-talk":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0F766E]/60 bg-[#0F1A20] shadow-md ${className}`}
        >
          <SquareTerminal className="h-5 w-5 text-[#5EEAD4]" />
        </div>
      );

    case "discobox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#7DD3FC]" />
        </div>
      );

    case "agentcage":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#047857]/60 bg-[#101B18] shadow-md ${className}`}
        >
          <Fence className="h-5 w-5 text-[#6EE7B7]" />
        </div>
      );

    case "byre":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4338CA]/60 bg-[#141B2A] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#A5B4FC]" />
        </div>
      );

    case "nucleus":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A]/60 bg-[#101827] shadow-md ${className}`}
        >
          <Container className="h-5 w-5 text-[#93C5FD]" />
        </div>
      );

    case "tinysandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#B45309]/60 bg-[#0F172A] shadow-md ${className}`}
        >
          <Terminal className="h-5 w-5 text-[#FBBF24]" />
        </div>
      );

    case "omnigent":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#5B21B6]/60 bg-[#141126] shadow-md ${className}`}
        >
          <Network className="h-5 w-5 text-[#C4B5FD]" />
        </div>
      );

    case "claude-code-bash-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E]/60 bg-[#1A1208] shadow-md ${className}`}
        >
          <Lock className="h-5 w-5 text-[#F5D0A9]" />
        </div>
      );

    case "codex-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4338CA]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          <Terminal className="h-5 w-5 text-[#A5B4FC]" />
        </div>
      );

    case "gemini-cli-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1D4ED8]/60 bg-[#0B1B33] shadow-md ${className}`}
        >
          <Sparkles className="h-5 w-5 text-[#93C5FD]" />
        </div>
      );

    case "cursor-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4B5563]/60 bg-[#10131C] shadow-md ${className}`}
        >
          <SquareTerminal className="h-5 w-5 text-[#E5E7EB]" />
        </div>
      );

    case "minijail":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#334155]/60 bg-[#0F172A] shadow-md ${className}`}
        >
          <Lock className="h-5 w-5 text-[#94A3B8]" />
        </div>
      );

    case "fuse-microvm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#344054]/70 bg-[#101828] shadow-md ${className}`}
        >
          <Layers className="h-5 w-5 text-[#F2F4F7]" />
        </div>
      );

    case "lelantos":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3B2A5C] bg-[#1B1230] shadow-md ${className}`}
        >
          <Zap className="h-5 w-5 text-[#D6BBFF]" />
        </div>
      );

    case "scratchrun":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A2B] bg-[#0B0D0B] shadow-md ${className}`}
        >
          <SquareTerminal className="h-5 w-5 text-[#4ADE80]" />
        </div>
      );

    case "island":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1B4B4B] bg-[#0E2A2E] shadow-md ${className}`}
        >
          <ShieldCheck className="h-5 w-5 text-[#7DD3C7]" />
        </div>
      );

    case "workpaper":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A5F] bg-[#0B1220] shadow-md ${className}`}
        >
          <Monitor className="h-5 w-5 text-[#93C5FD]" />
        </div>
      );

    case "ainclave":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#2A3138] bg-[#101418] shadow-md ${className}`}
        >
          <Fence className="h-5 w-5 text-[#E5E7EB]" />
        </div>
      );

    case "useagent":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#2E2550] bg-[#141024] shadow-md ${className}`}
        >
          <Layers className="h-5 w-5 text-[#C4B5FD]" />
        </div>
      );

    case "chamber":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#333333] bg-[#1A1A1A] shadow-md ${className}`}
        >
          <AppWindow className="h-5 w-5 text-[#F5F5F5]" />
        </div>
      );

    case "litterbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4A2A55] bg-[#1C1620] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#F0ABFC]" />
        </div>
      );

    case "syd":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#404040] bg-[#171717] shadow-md ${className}`}
        >
          <ShieldCheck className="h-5 w-5 text-[#D4D4D4]" />
        </div>
      );

    case "eryx":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1F3A3A] bg-[#12181B] shadow-md ${className}`}
        >
          <Terminal className="h-5 w-5 text-[#5EEAD4]" />
        </div>
      );

    case "ppio-agent-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A] bg-[#0B1220] shadow-md ${className}`}
        >
          <Cloud className="h-5 w-5 text-[#93C5FD]" />
        </div>
      );

    case "sandock":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A] bg-[#0B1220] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#93C5FD]" />
        </div>
      );

    case "cocoon-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0F766E] bg-[#0B1A1A] shadow-md ${className}`}
        >
          <Layers className="h-5 w-5 text-[#5EEAD4]" />
        </div>
      );

    case "sporevm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534] bg-[#0B1410] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#86EFAC]" />
        </div>
      );

    case "cleanroom":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46] bg-[#0B1A14] shadow-md ${className}`}
        >
          <ShieldCheck className="h-5 w-5 text-[#34D399]" />
        </div>
      );

    case "createos-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7C3AED] bg-[#170F26] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#E9D5FF]" />
        </div>
      );

    case "hopx":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#C2410C] bg-[#1A0F08] shadow-md ${className}`}
        >
          <Zap className="h-5 w-5 text-[#FDBA74]" />
        </div>
      );

    case "greywall":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4B5563] bg-[#111318] shadow-md ${className}`}
        >
          <Lock className="h-5 w-5 text-[#CBD5E1]" />
        </div>
      );

    case "hotcell":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412] bg-[#1A0F08] shadow-md ${className}`}
        >
          <Container className="h-5 w-5 text-[#F97316]" />
        </div>
      );

    case "librechat-code-interpreter":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46] bg-[#0B1A14] shadow-md ${className}`}
        >
          <Terminal className="h-5 w-5 text-[#34D399]" />
        </div>
      );

    case "paddock":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534] bg-[#0B1410] shadow-md ${className}`}
        >
          <Fence className="h-5 w-5 text-[#86EFAC]" />
        </div>
      );

    case "isorun":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0369A1] bg-[#081A24] shadow-md ${className}`}
        >
          <Cpu className="h-5 w-5 text-[#7DD3FC]" />
        </div>
      );

    case "digitalocean-managed-agents":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF] bg-[#0B1220] shadow-md ${className}`}
        >
          <Globe className="h-5 w-5 text-[#93C5FD]" />
        </div>
      );

    case "ailoy":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#047857] bg-[#0B1F1A] shadow-md ${className}`}
        >
          <Gem className="h-5 w-5 text-[#6EE7B7]" />
        </div>
      );

    case "wasmer":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4338CA] bg-[#12102A] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#A5B4FC]" />
        </div>
      );

    case "kumabox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490] bg-[#101820] shadow-md ${className}`}
        >
          <Server className="h-5 w-5 text-[#7DD3FC]" />
        </div>
      );

    case "fast-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#991B1B] bg-[#160D0D] shadow-md ${className}`}
        >
          <Flame className="h-5 w-5 text-[#FCA5A5]" />
        </div>
      );

    case "agents-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7F1D1D] bg-[#1A0F14] shadow-md ${className}`}
        >
          <Lock className="h-5 w-5 text-[#FCA5A5]" />
        </div>
      );

    case "terrarium":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534] bg-[#0B1A12] shadow-md ${className}`}
        >
          <Layers className="h-5 w-5 text-[#86EFAC]" />
        </div>
      );

    case "kuasar":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1D4ED8] bg-[#0C1420] shadow-md ${className}`}
        >
          <Network className="h-5 w-5 text-[#93C5FD]" />
        </div>
      );

    case "dify-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF] bg-[#0B1220] shadow-md ${className}`}
        >
          <SquareTerminal className="h-5 w-5 text-[#60A5FA]" />
        </div>
      );

    case "mosoo":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#5B21B6] bg-[#151024] shadow-md ${className}`}
        >
          <Package className="h-5 w-5 text-[#C4B5FD]" />
        </div>
      );

    case "open-managed-agents":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF] bg-[#0B1626] shadow-md ${className}`}
        >
          <Cloud className="h-5 w-5 text-[#93C5FD]" />
        </div>
      );

    case "hivebox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E] bg-[#1A1408] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#FDE68A]" />
        </div>
      );

    case "axern":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534] bg-[#0B1A12] shadow-md ${className}`}
        >
          <ShieldCheck className="h-5 w-5 text-[#86EFAC]" />
        </div>
      );

    case "ephemeral-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#5B21B6] bg-[#12101F] shadow-md ${className}`}
        >
          <Package className="h-5 w-5 text-[#C4B5FD]" />
        </div>
      );

    case "sandbase-harness":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E] bg-[#1A1206] shadow-md ${className}`}
        >
          <Database className="h-5 w-5 text-[#FCD34D]" />
        </div>
      );

    case "omnara":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4338CA] bg-[#101425] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#A5B4FC]" />
        </div>
      );

    case "kars":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E] bg-[#1A1206] shadow-md ${className}`}
        >
          <Network className="h-5 w-5 text-[#FDE68A]" />
        </div>
      );

    case "exec-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490] bg-[#0B1A1F] shadow-md ${className}`}
        >
          <SquareTerminal className="h-5 w-5 text-[#67E8F9]" />
        </div>
      );

    case "agentenv":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3730A3] bg-[#131033] shadow-md ${className}`}
        >
          <Layers className="h-5 w-5 text-[#A5B4FC]" />
        </div>
      );

    case "ai-jail":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412] bg-[#1C1008] shadow-md ${className}`}
        >
          <Fence className="h-5 w-5 text-[#FDBA74]" />
        </div>
      );

    case "cocoon":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#115E59] bg-[#08191B] shadow-md ${className}`}
        >
          <Package className="h-5 w-5 text-[#5EEAD4]" />
        </div>
      );

    case "sandbox-agent":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#5B21B6] bg-[#120F24] shadow-md ${className}`}
        >
          <Terminal className="h-5 w-5 text-[#C4B5FD]" />
        </div>
      );

    case "netclode":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46] bg-[#06180F] shadow-md ${className}`}
        >
          <Smartphone className="h-5 w-5 text-[#6EE7B7]" />
        </div>
      );

    case "sandboxd":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412] bg-[#1C1206] shadow-md ${className}`}
        >
          <AppWindow className="h-5 w-5 text-[#FDBA74]" />
        </div>
      );

    case "localsandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534] bg-[#0F1A14] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#86EFAC]" />
        </div>
      );

    case "libriscv":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#6B21A8] bg-[#1A0F26] shadow-md ${className}`}
        >
          <Cpu className="h-5 w-5 text-[#E9D5FF]" />
        </div>
      );

    case "openkruise-agents":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#075985] bg-[#08161F] shadow-md ${className}`}
        >
          <Network className="h-5 w-5 text-[#7DD3FC]" />
        </div>
      );

    case "agent-sandbox-nix":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          <Snowflake className="h-5 w-5 text-[#7EBAE4]" strokeWidth={2.2} />
        </div>
      );

    case "yoloai":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#854D0E] bg-[#181206] shadow-md ${className}`}
        >
          <Zap className="h-5 w-5 text-[#FDE047]" />
        </div>
      );

    case "matchlock":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF] bg-[#0F172A] shadow-md ${className}`}
        >
          <ShieldCheck className="h-5 w-5 text-[#93C5FD]" />
        </div>
      );

    case "orb":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3730A3] bg-[#0B1220] shadow-md ${className}`}
        >
          <Globe className="h-5 w-5 text-[#B4C6FF]" />
        </div>
      );

    case "yolobox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#A16207] bg-[#111827] shadow-md ${className}`}
        >
          <Container className="h-5 w-5 text-[#FCD34D]" />
        </div>
      );

    case "kern":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534] bg-[#0B1A12] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#86EFAC]" />
        </div>
      );

    case "mxc":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#075985] bg-[#0B1220] shadow-md ${className}`}
        >
          <ShieldCheck className="h-5 w-5 text-[#7DD3FC]" />
        </div>
      );

    case "zerobox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412] bg-[#1A0E08] shadow-md ${className}`}
        >
          <Package className="h-5 w-5 text-[#FDBA74]" />
        </div>
      );

    case "edgebox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#6D28D9] bg-[#120E22] shadow-md ${className}`}
        >
          <Monitor className="h-5 w-5 text-[#C4B5FD]" />
        </div>
      );

    case "tupper":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4B5563] bg-[#111827] shadow-md ${className}`}
        >
          <Gem className="h-5 w-5 text-[#E5E7EB]" />
        </div>
      );

    case "sandboxed-step":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#15803D] bg-[#0B1A12] shadow-md ${className}`}
        >
          <ShieldCheck className="h-5 w-5 text-[#4ADE80]" />
        </div>
      );

    case "isobox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0F766E] bg-[#0B1A18] shadow-md ${className}`}
        >
          <Layers className="h-5 w-5 text-[#5EEAD4]" />
        </div>
      );

    case "agentenv-framework":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3730A3] bg-[#12102A] shadow-md ${className}`}
        >
          <Database className="h-5 w-5 text-[#A5B4FC]" />
        </div>
      );

    case "pvisor":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4B5563] bg-[#111827] shadow-md ${className}`}
        >
          <AppWindow className="h-5 w-5 text-[#D1D5DB]" />
        </div>
      );

    case "plimsoll":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#115E59] bg-[#0B1A18] shadow-md ${className}`}
        >
          <Fence className="h-5 w-5 text-[#5EEAD4]" />
        </div>
      );

    case "crabbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E] bg-[#1A1206] shadow-md ${className}`}
        >
          <Package className="h-5 w-5 text-[#FCD34D]" />
        </div>
      );

    case "flintlock":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#5B21B6] bg-[#120E22] shadow-md ${className}`}
        >
          <Flame className="h-5 w-5 text-[#C4B5FD]" />
        </div>
      );

    case "coi":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46] bg-[#0B1A15] shadow-md ${className}`}
        >
          <Container className="h-5 w-5 text-[#6EE7B7]" />
        </div>
      );

    case "sandboxie-plus":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#881337] bg-[#1A0A10] shadow-md ${className}`}
        >
          <Monitor className="h-5 w-5 text-[#FB7185]" />
        </div>
      );

    case "x11docker":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0C4A6E] bg-[#0B1220] shadow-md ${className}`}
        >
          <AppWindow className="h-5 w-5 text-[#7DD3FC]" />
        </div>
      );

    case "vercel-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-white/20 bg-black shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4 text-[#F2F3FA]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 3L22 20H2L12 3z" />
          </svg>
        </div>
      );

    case "blaxel":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#60A5FA]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 5h5.5a3.5 3.5 0 0 1 2.6 5.85A4 4 0 0 1 9 18H3V5zm3 3v3h2.5a1.5 1.5 0 0 0 0-3H6zm0 6v3h3a1.5 1.5 0 0 0 0-3H6zm9-9h3v13h-3V5z" />
          </svg>
        </div>
      );

    case "runloop":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#831843]/70 bg-[#1A0B14] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#F472B6]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path d="M4 15c0-4 3.5-7 8-7s8 3 8 7" />
            <path d="M8 16c0-2.2 1.8-4 4-4s4 1.8 4 4" />
            <circle cx="12" cy="19" fill="currentColor" r="1.6" stroke="none" />
          </svg>
        </div>
      );

    case "microsandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#78350F]/70 bg-[#1C1917] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FBBF24] text-[15px] leading-none">
            µ
          </span>
        </div>
      );

    case "docker-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#123a57] bg-[#0b1b2b] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#2496ed] text-[13px]">SBX</span>
        </div>
      );

    case "flue":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#33265c] bg-[#140f2b] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#c4b5fd] text-[13px]">FL</span>
        </div>
      );

    case "tencent-agent-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#16446e] bg-[#0b1e3a] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#4da3ff] text-[12px]">TC</span>
        </div>
      );

    case "lightpanda":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#2f2f33] bg-[#0b0b0f] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#f5f5f4] text-[12px]">LP</span>
        </div>
      );

    case "onecli":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1e3a5f] bg-[#101828] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#7dd3fc] text-[13px]">1C</span>
        </div>
      );

    case "ona":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3a3a3a] bg-[#1f1f1f] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#ffae33] text-[13px]">ON</span>
        </div>
      );

    case "wasmedge":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#2c2660] bg-[#0b1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#8b7bff] text-[12px]">WE</span>
        </div>
      );

    case "machine0":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#2f2f33] bg-[#0e0e10] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#e4e4e7] text-[13px]">M0</span>
        </div>
      );

    case "drop":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1f3a30] bg-[#141414] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#34d399] text-sm">DR</span>
        </div>
      );

    case "aws-nitro-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3d3222] bg-[#232f3e] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#ff9900] text-[12px]">NS</span>
        </div>
      );

    case "morph":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#38BDF8]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M3 18V8l4.5 5L12 8l4.5 5L21 8v10" />
          </svg>
        </div>
      );

    case "beam":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534]/70 bg-[#07130C] shadow-md ${className}`}
        >
          <Zap className="h-5 w-5 text-[#4ADE80]" />
        </div>
      );

    case "tensorlake":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E]/70 bg-[#1A1207] shadow-md ${className}`}
        >
          <Layers className="h-5 w-5 text-[#F59E0B]" />
        </div>
      );

    case "bedrock-agentcore":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E]/60 bg-[#232F3E] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#FF9900] text-base">AC</span>
        </div>
      );

    case "deno-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-white/20 bg-black shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2a10 10 0 1 0 3.9 19.2l-2-3.4A6.2 6.2 0 1 1 18.2 12c0 1.1-.3 2.1-.8 3l2.1 3.6A10 10 0 0 0 12 2zm0 5.8a4.2 4.2 0 1 0 0 8.4 4.2 4.2 0 0 0 0-8.4z" />
          </svg>
        </div>
      );

    case "apple-containerization":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-white/20 bg-[#1C1C1E] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-4 w-4 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M16.7 12.9c0-2.4 1.9-3.5 2-3.6-1.1-1.6-2.8-1.8-3.4-1.9-1.4-.1-2.8.8-3.5.8-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 6.9 1.1 9.2.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3.1-.7 1.4 0 1.8.7 3 .7 1.3 0 2.1-1.1 2.9-2.2.9-1.3 1.3-2.5 1.3-2.6-.1 0-2.7-1-2.7-3.4zM14.4 5.5c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.5 2.7-1.3z" />
          </svg>
        </div>
      );

    case "wassette":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/50 bg-[#0B1220] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6 text-[#22D3EE]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.9"
            viewBox="0 0 24 24"
          >
            <rect height="11" rx="1.5" width="14" x="5" y="4" />
            <path d="M9 4v11M15 4v11" />
            <circle cx="7" cy="19" r="1.4" />
            <circle cx="17" cy="19" r="1.4" />
          </svg>
        </div>
      );

    case "zo-computer":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3B82F6]/45 bg-[#0B1220] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.9"
            viewBox="0 0 24 24"
          >
            <rect height="12" rx="2.5" width="18" x="3" y="4.5" />
            <path d="M8 20h8M12 16.5V20" />
            <path d="M8.5 9.5h7l-7 4h7" />
          </svg>
        </div>
      );

    case "heroku-code-execution-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#6B46C1]/55 bg-[#1B1232] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6 text-[#A78BFA]"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7L12 2.5z" />
            <path d="M9 8.5v7M15 8.5v7M9 12h6" />
          </svg>
        </div>
      );

    case "edera":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#16A34A]/45 bg-[#0B1220] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-6 w-6 text-[#4ADE80]"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.5 20.5 7v10L12 21.5 3.5 17V7L12 2.5z" />
            <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
          </svg>
        </div>
      );

    case "hugging-face-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#FFD21E]/40 bg-[#0B1220] shadow-md ${className}`}
        >
          <Smile className="h-6 w-6 text-[#FFD21E]" strokeWidth={2.6} />
        </div>
      );

    case "webcontainers":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          <Globe className="h-5 w-5 text-[#38BDF8]" />
        </div>
      );

    case "qbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#155E75]/70 bg-[#0C1A2B] shadow-md ${className}`}
        >
          <ShieldCheck className="h-5 w-5 text-[#22D3EE]" />
        </div>
      );

    case "superserve":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46]/70 bg-[#061A14] shadow-md ${className}`}
        >
          <Server className="h-5 w-5 text-[#34D399]" />
        </div>
      );

    case "koyeb-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95]/70 bg-[#0F0A1E] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#A78BFA] text-base">K</span>
        </div>
      );

    case "opensandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412]/70 bg-[#1A0D05] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#F97316] text-[15px]">OS</span>
        </div>
      );

    case "nsjail":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#334155]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#94A3B8] text-[13px]">ns</span>
        </div>
      );

    case "libkrun":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7F1D1D]/70 bg-[#170A0A] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#F87171] text-[12px]">krun</span>
        </div>
      );

    case "instavm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E]/70 bg-[#1A1207] shadow-md ${className}`}
        >
          <Zap className="h-5 w-5 text-[#F59E0B]" />
        </div>
      );

    case "leap0":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95]/70 bg-[#0F0A1E] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#C084FC] text-[13px]">L0</span>
        </div>
      );

    case "novita-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#38BDF8] text-[13px]">NV</span>
        </div>
      );

    case "islo":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#831843]/70 bg-[#1A0B14] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#F472B6] text-[13px]">IS</span>
        </div>
      );

    case "opencomputer":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534]/70 bg-[#07130C] shadow-md ${className}`}
        >
          <Cpu className="h-5 w-5 text-[#4ADE80]" />
        </div>
      );

    case "celesto":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E]/70 bg-[#1A1207] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FBBF24] text-[11px]">CE</span>
        </div>
      );

    case "kernel":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1F2A44] bg-[#0B0F1A] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#F2F3FA] text-[14px]">K</span>
        </div>
      );

    case "anchor-browser":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A5F]/70 bg-[#0E1B2E] shadow-md ${className}`}
        >
          {/* Anchor mark */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#60A5FA]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="5" r="2.5" />
            <path d="M12 8v12M6 12h12M4 16a8 8 0 0 0 16 0" />
          </svg>
        </div>
      );

    case "pi-pod":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534]/60 bg-[#132018] shadow-md ${className}`}
        >
          {/* Pod: a rounded capsule around pi */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#86EFAC]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="12" rx="6" width="20" x="2" y="6" />
            <path d="M9 12h2.5M15 12h.01" strokeLinecap="round" />
          </svg>
        </div>
      );

    case "claude-managed-agents":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#B45309]/60 bg-[#22130F] shadow-md ${className}`}
        >
          <Sparkles className="h-5 w-5 text-[#F5D0A9]" />
        </div>
      );

    case "gemini-code-execution":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1D4ED8]/60 bg-[#0B1B33] shadow-md ${className}`}
        >
          <Sparkles className="h-5 w-5 text-[#93C5FD]" />
        </div>
      );

    case "pve-microvm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#C2410C]/60 bg-[#1A1207] shadow-md ${className}`}
        >
          <Cpu className="h-5 w-5 text-[#FDBA74]" />
        </div>
      );

    case "omnirun":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0369A1]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          <Cpu className="h-5 w-5 text-[#7DD3FC]" />
        </div>
      );

    case "tenki":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#B45309]/60 bg-[#111827] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCD34D] text-[12px]">TK</span>
        </div>
      );

    case "agentbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0F766E]/60 bg-[#0B1F1A] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#5EEAD4]" />
        </div>
      );

    case "agent-box":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#B45309]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Containers branching off one workspace: worktree-per-session */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FCD34D]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="6" rx="1.5" width="16" x="4" y="14" />
            <path d="M8 14V9m8 5V9M12 9V6" />
            <circle cx="8" cy="7" r="2" />
            <circle cx="16" cy="7" r="2" />
          </svg>
        </div>
      );

    case "bottlefire":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#B45309]/60 bg-[#101B2E] shadow-md ${className}`}
        >
          <Flame className="h-5 w-5 text-[#FDE68A]" />
        </div>
      );

    case "bunkervm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#991B1B]/60 bg-[#1C1917] shadow-md ${className}`}
        >
          <ShieldCheck className="h-5 w-5 text-[#FCA5A5]" />
        </div>
      );

    case "boxsh":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#047857]/60 bg-[#0F2419] shadow-md ${className}`}
        >
          <Terminal className="h-5 w-5 text-[#6EE7B7]" />
        </div>
      );

    case "flashvmm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#A21CAF]/60 bg-[#1A0B2E] shadow-md ${className}`}
        >
          <Zap className="h-5 w-5 text-[#F0ABFC]" />
        </div>
      );

    case "val-town":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#6D28D9]/60 bg-[#120A2E] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#C4B5FD] text-[12px]">VT</span>
        </div>
      );

    case "vibekit":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95]/60 bg-[#161226] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A78BFA] text-[12px]">VK</span>
        </div>
      );

    case "zeroboot":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/60 bg-[#101426] shadow-md ${className}`}
        >
          <Zap className="h-5 w-5 text-[#67E8F9]" />
        </div>
      );

    case "dormice":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95]/60 bg-[#171226] shadow-md ${className}`}
        >
          {/* Crescent: a sandbox asleep until acquired */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#C4B5FD]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M15.5 3a9 9 0 1 0 5.5 12.5A7 7 0 0 1 15.5 3z" />
          </svg>
        </div>
      );

    case "perplexity-space":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/50 bg-[#0E1B2E] shadow-md ${className}`}
        >
          {/* Eight-spoke asterisk */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#7DD3FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
          </svg>
        </div>
      );

    case "sandstorm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#115E59]/70 bg-[#0B1F22] shadow-md ${className}`}
        >
          {/* Whirl: three arcs spiralling inward */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#2DD4BF]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M20 8a8 8 0 0 0-13.7-2.6" />
            <path d="M4 16a8 8 0 0 0 13.7 2.6" />
            <path d="M9 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0z" />
          </svg>
        </div>
      );

    case "aio-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E]/70 bg-[#1A1207] shadow-md ${className}`}
        >
          {/* Four panes: browser, shell, files, editor */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FB923C]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect height="8" rx="1.5" width="8" x="2.5" y="2.5" />
            <rect height="8" opacity=".75" rx="1.5" width="8" x="13.5" y="2.5" />
            <rect height="8" opacity=".75" rx="1.5" width="8" x="2.5" y="13.5" />
            <rect height="8" opacity=".5" rx="1.5" width="8" x="13.5" y="13.5" />
          </svg>
        </div>
      );

    case "exe-dev":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95]/70 bg-[#1B1440] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#C4B5FD] text-[12px]">exe</span>
        </div>
      );

    case "cubesandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/70 bg-[#0B1A2B] shadow-md ${className}`}
        >
          {/* Isometric cube, one face cut out */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#38BDF8]"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.5 21 7.5v9L12 21.5 3 16.5v-9l9-5z" />
            <path d="M3 7.5 12 12.5l9-5M12 12.5v9" />
          </svg>
        </div>
      );

    case "k8s-agent-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A]/70 bg-[#0F1B33] shadow-md ${className}`}
        >
          {/* Kubernetes wheel */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="8.5" />
            <circle cx="12" cy="12" r="2.4" />
            <path d="M12 3.5v6M20.4 8.1l-5.6 3.3M17.1 19.4l-3.3-5.6M6.9 19.4l3.3-5.6M3.6 8.1l5.6 3.3" />
          </svg>
        </div>
      );

    case "boat":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#075985]/70 bg-[#07131D] shadow-md ${className}`}
        >
          {/* Sail mark: hull plus two sails */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#38BDF8]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2v11h6L12 2zM10 5v8H6l4-8z" />
            <path d="M3 15h18l-2 5H5l-2-5z" opacity=".75" />
          </svg>
        </div>
      );

    case "baponi":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95]/70 bg-[#0F0A1E] shadow-md ${className}`}
        >
          <span className="font-extrabold font-sans text-[#C4B5FD] text-[13px]">BP</span>
        </div>
      );

    case "runtime-cloud":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#334155]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          <Server className="h-5 w-5 text-[#94A3B8]" />
        </div>
      );

    case "cloudroom":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3F4A1B]/70 bg-[#0C1117] shadow-md ${className}`}
        >
          {/* Two panes with a transfer arrow: session moves Mac <-> cloud */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#BFFF00]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="7" rx="1.5" width="7" x="3" y="3" />
            <rect height="7" rx="1.5" width="7" x="14" y="14" />
            <path d="M13 6.5h4.5M15.5 4.5 17.5 6.5l-2 2M11 17.5H6.5M8.5 15.5l-2 2 2 2" />
          </svg>
        </div>
      );

    case "devvm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#134E4A]/70 bg-[#101418] shadow-md ${className}`}
        >
          {/* Stacked layers: one VM per project */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#5EEAD4]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" />
            <path d="M4 12.5 12 17l8-4.5" />
            <path d="M4 17 12 21.5 20 17" />
          </svg>
        </div>
      );

    case "strands-box":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#14532D]/70 bg-[#0F1A14] shadow-md ${className}`}
        >
          {/* Open box: policy enforced outside the agent process */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#86EFAC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5v-7Z" />
            <path d="M3 8.5 12 13l9-4.5M12 13v7" />
          </svg>
        </div>
      );

    case "agent-safehouse":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A]/60 bg-[#101828] shadow-md ${className}`}
        >
          {/* House outline with a keyhole: local agent, narrow access */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M4 10.5 12 4l8 6.5V20H4v-9.5Z" />
            <circle cx="12" cy="14" r="1.8" />
            <path d="M12 15.8V18" />
          </svg>
        </div>
      );

    case "landrun":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7F1D1D]/60 bg-[#141018] shadow-md ${className}`}
        >
          {/* Locked ring: kernel-enforced process boundary */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FCA5A5]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="9" rx="2" width="13" x="5.5" y="11" />
            <path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3" />
            <path d="M12 14.5v2" />
          </svg>
        </div>
      );

    case "clawk":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7C2D12]/70 bg-[#1A0F06] shadow-md ${className}`}
        >
          {/* Guest shell prompt: agent gets a disposable machine */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FB923C]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="m5 8 3.5 4L5 16" />
            <path d="M11.5 16H18" />
          </svg>
        </div>
      );

    case "nvx":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF]/60 bg-[#0A1220] shadow-md ${className}`}
        >
          {/* Nested box: guest inside a hardware boundary */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#60A5FA]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="16" rx="2" width="18" x="3" y="4" />
            <rect height="8" rx="1" width="10" x="7" y="8" />
            <path d="M3 20v.01M21 20v.01" />
          </svg>
        </div>
      );

    case "nono":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#701A75]/60 bg-[#12101A] shadow-md ${className}`}
        >
          {/* Shield with a check: verified agent runtime */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#F0ABFC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M12 3.5 19 6v5.5c0 4.2-2.8 7.6-7 9-4.2-1.4-7-4.8-7-9V6l7-2.5Z" />
            <path d="m9 12 2.2 2.2L15.5 10" />
          </svg>
        </div>
      );

    case "sandbox-mcp":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0C4A6E]/70 bg-[#0B1626] shadow-md ${className}`}
        >
          {/* Window with a pointer: an agent driving a real guest UI */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#38BDF8]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="13" rx="1.5" width="17" x="3.5" y="4" />
            <path d="M3.5 8h17" />
            <path d="m12 10 4.5 3.2-2 .5-.9 1.9L12 10Z" />
          </svg>
        </div>
      );

    case "vibemon":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46]/60 bg-[#101A2E] shadow-md ${className}`}
        >
          {/* Two offset squares joined by a line: fork from a shared snapshot */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#34D399]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="7" rx="1.5" width="9" x="3" y="3" />
            <rect height="7" rx="1.5" width="9" x="12" y="14" />
            <path d="M12 10v4" />
            <path d="M7.5 10v4h4.5" />
          </svg>
        </div>
      );

    case "brig":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95]/60 bg-[#131022] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#C4B5FD] text-[12px]">BR</span>
        </div>
      );

    case "kosa8":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#115E59]/70 bg-[#101A1F] shadow-md ${className}`}
        >
          {/* Rewind arrow: checkpoint and roll back the machine */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#2DD4BF]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M4 12a8 8 0 1 0 2.4-5.7" />
            <path d="M4 4v4.5h4.5" />
          </svg>
        </div>
      );

    case "akamai-agent-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/60 bg-[#0A1428] shadow-md ${className}`}
        >
          {/* Hexagon: a Wasm module boundary */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#22D3EE]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="m12 3 7.8 4.5v9L12 21l-7.8-4.5v-9L12 3Z" />
            <path d="m12 8 4 2.3v4.4L12 17l-4-2.3v-4.4L12 8Z" />
          </svg>
        </div>
      );

    case "openagentcore":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#6D4DFF]/50 bg-[#141026] shadow-md ${className}`}
        >
          {/* Swappable socket: one core, many providers */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#C4B5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="3.2" />
            <path d="M12 3v3.4M12 17.6V21M3 12h3.4M17.6 12H21" />
            <path d="M5.6 5.6l2.4 2.4M16 16l2.4 2.4M18.4 5.6 16 8M8 16l-2.4 2.4" />
          </svg>
        </div>
      );

    case "amla-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#B45309]/50 bg-[#1B1206] shadow-md ${className}`}
        >
          {/* Two tools, nothing else: the capability list is the boundary */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FDBA74]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M7 5.5v5a3 3 0 0 0 3 3h4a3 3 0 0 1 3 3v2.5" />
            <circle cx="7" cy="4" r="1.6" />
            <circle cx="17" cy="20" r="1.6" />
          </svg>
        </div>
      );

    case "boxd":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/50 bg-[#0B1418] shadow-md ${className}`}
        >
          {/* Stacked nodes: control, worker, proxy in one cluster */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#67E8F9]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="4.4" rx="1.1" width="14" x="5" y="4" />
            <rect height="4.4" rx="1.1" width="14" x="5" y="15.6" />
            <path d="M12 8.4v7.2" />
          </svg>
        </div>
      );

    case "nvidia-openshell":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4D7C0F]/50 bg-[#0F1706] shadow-md ${className}`}
        >
          {/* Shield with a keyhole: policy encloses the agent */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#A3E635]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M12 3.2 5 6v5.5c0 3.8 2.9 6.6 7 8.3 4.1-1.7 7-4.5 7-8.3V6l-7-2.8Z" />
            <circle cx="12" cy="10.4" r="1.6" />
            <path d="M12 12v3" />
          </svg>
        </div>
      );

    case "nemoclaw":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#15803D]/50 bg-[#0B1708] shadow-md ${className}`}
        >
          {/* Claw arc over a sandbox box: an agent wrapped by the runtime */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#86EFAC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M5 13a7 7 0 0 1 14 0" />
            <path d="M6.5 9.5 8 5l2.4 2.2M17.5 9.5 16 5l-2.4 2.2" />
            <rect height="6" rx="1.2" width="10" x="7" y="13.5" />
          </svg>
        </div>
      );

    case "llm-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0C4A6E]/60 bg-[#101828] shadow-md ${className}`}
        >
          {/* One API over several backends: stacked plates feeding a line */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#7DD3FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M12 3.5 4.5 7.2 12 11l7.5-3.8L12 3.5Z" />
            <path d="m4.5 12 7.5 3.8 7.5-3.8" />
            <path d="m4.5 16.8 7.5 3.7 7.5-3.7" />
          </svg>
        </div>
      );

    case "agent37":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7C3AED]/50 bg-[#170F26] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#E9D5FF] text-[10px] tracking-tight">
            37
          </span>
        </div>
      );

    case "containarium":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0F766E]/60 bg-[#0C1A16] shadow-md ${className}`}
        >
          {/* Box with a terminal prompt: a shell you reach, not a laptop */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#5EEAD4]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="14" rx="2" width="16" x="4" y="5" />
            <path d="m8 11 2.2 2.2L8 15.4M13 15.4h3" />
          </svg>
        </div>
      );

    case "agent-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF]/50 bg-[#0E1226] shadow-md ${className}`}
        >
          {/* Pod grid: many sandboxes, one runtime */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="5" rx="1" width="5" x="4" y="4.5" />
            <rect height="5" rx="1" width="5" x="15" y="4.5" />
            <rect height="5" rx="1" width="5" x="4" y="14.5" />
            <path d="M15 17h5M17.5 14.5V19.5" />
          </svg>
        </div>
      );

    case "layerfs":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#16324f] bg-[#0B1B33] shadow-md ${className}`}
        >
          <span className="relative flex h-5 w-5 items-center justify-center">
            <Layers className="h-5 w-5 text-[#7DD3FC]" />
            <span className="absolute right-0.5 bottom-0.5 h-1.5 w-1.5 rounded-full bg-[#38BDF8]" />
          </span>
        </div>
      );

    case "deltabox-lite":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3b2c63] bg-[#1A132E] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#C4B5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M12 3.5 20.5 19h-17L12 3.5Z" />
            <path d="M12 10v4M12 16.8v.2" />
          </svg>
        </div>
      );

    case "skypilot-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1e4976] bg-[#0C1B2A] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#7DD3FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M6.5 17.5a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 16.8 8.4a3.8 3.8 0 0 1 .7 7.54" />
            <path d="M12 11v7M9.5 15.5 12 18l2.5-2.5" />
          </svg>
        </div>
      );

    case "novitabox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#164e63] bg-[#101E2B] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#67E8F9]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" />
            <path d="M12 12v8M4 8.5 12 13l8-4.5" />
            <path d="m17.5 5.5.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6.6-1.4Z" />
          </svg>
        </div>
      );

    case "mobilerun":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#312e81] bg-[#1E1B4B] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#A5B4FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="16" rx="2" width="9" x="4" y="4" />
            <path d="M8.5 17h.01M15 9h5M17.5 6.5 20 9l-2.5 2.5" />
          </svg>
        </div>
      );

    case "corellium":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#33363f] bg-[#1A1C23] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#F9FAFB]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="13" rx="2.5" width="8" x="8" y="5.5" />
            <path d="M11 8.5h2M11 15.5h2M4 9v6M20 9v6" />
          </svg>
        </div>
      );

    case "genymotion":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1f4d3a] bg-[#14231C] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#86EFAC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="12" rx="2.5" width="8" x="8" y="7" />
            <path d="M8 7 6 4.5M16 7l2-2.5M10 11h.01M14 11h.01M10 15h4" />
          </svg>
        </div>
      );

    case "mobile-next":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#243250] bg-[#161B2E] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="12" rx="2" width="7" x="8.5" y="6" />
            <path d="M4 8v8M20 8v8M11 15h2" />
          </svg>
        </div>
      );

    case "tama":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4a3a16] bg-[#1C1710] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FCD34D]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="14" rx="2" width="16" x="4" y="5" />
            <path d="m7.5 9.5 3 2.5-3 2.5M13 15h3.5" />
          </svg>
        </div>
      );

    case "lizard":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1f4d3a] bg-[#10231A] shadow-md ${className}`}
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#86EFAC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M5 17.5c2.2 0 3.5-1.5 4.5-3.2C10.8 12 12 10 15 10h4" />
            <path d="M15 10V7.5M15 13.5V16M19 10l2 2-2 2" />
            <circle cx="6" cy="18" r="1" />
          </svg>
        </div>
      );

    case "piston":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1c3a26] bg-[#101C14] shadow-md ${className}`}
        >
          {/* Piston head and connecting rod */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#86EFAC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="6" rx="1.5" width="10" x="7" y="4" />
            <path d="M9.5 10v4M14.5 10v4M12 14v3" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </div>
      );

    case "arrakis":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3b2a56] bg-[#1B1226] shadow-md ${className}`}
        >
          {/* Dune with a sun behind it */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#D8B4FE]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <circle cx="16.5" cy="6.5" r="2.5" />
            <path d="M2 17c2.8-3.2 5.2-3.2 8 0s5.2 3.2 8 0" />
            <path d="M2 20.5c2.8-2 5.2-2 8 0s5.2 2 8 0" />
          </svg>
        </div>
      );

    case "judge0":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4a2230] bg-[#25101B] shadow-md ${className}`}
        >
          {/* Gavel */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FDA4AF]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="m14 4 6 6" />
            <path d="m10.5 7.5 6 6" />
            <path d="m12.5 5.5 3 3" />
            <path d="m8 10 3 3" />
            <path d="m10 13-5 5" />
            <path d="M4 21h7" />
          </svg>
        </div>
      );

    case "bubblewrap":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1c3a4a] bg-[#0C1A24] shadow-md ${className}`}
        >
          {/* Bubble outlines */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#7DD3FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <circle cx="9" cy="9" r="4.5" />
            <circle cx="17" cy="15" r="3" />
            <circle cx="8" cy="17" r="2" />
          </svg>
        </div>
      );

    case "monty":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4a3f1c] bg-[#1B1A12] shadow-md ${className}`}
        >
          {/* Python glyph, drawn as strokes */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FDE68A]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M12 3c-3 0-4.5 1.2-4.5 3.5V9h4.5v1.5H7.5C5.2 10.5 4 12 4 15s1.2 4.5 3.5 4.5H9V17" />
            <path d="M12 21c3 0 4.5-1.2 4.5-3.5V15H12v-1.5h4.5C18.8 13.5 20 12 20 9s-1.2-4.5-3.5-4.5H15V7" />
            <circle cx="9.5" cy="6" r=".8" />
            <circle cx="14.5" cy="18" r=".8" />
          </svg>
        </div>
      );

    case "logfire-agent-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#243356] bg-[#141B2E] shadow-md ${className}`}
        >
          {/* Flame over a trace line */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M12 3c1 2.5 0 3.5 0 5 2-1 2.5-2 2.5-3.5C16.5 6 18 8.5 18 11a6 6 0 0 1-12 0c0-2.5 1.5-4.5 3-6 0 1.5.5 2.5 2 3.5C10.2 6 10.5 4.5 12 3z" />
            <path d="M4 20h16" />
          </svg>
        </div>
      );

    case "offstage":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4a2a5c] bg-[#1A1420] shadow-md ${className}`}
        >
          {/* Curtain and stage */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#F0ABFC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M3 5c3 0 4.5 2 4.5 5v9H3V5z" />
            <path d="M21 5c-3 0-4.5 2-4.5 5v9H21V5z" />
            <path d="M7.5 19h9" />
            <path d="M12 3v9" />
          </svg>
        </div>
      );

    case "droneship":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1c3a4a] bg-[#101823] shadow-md ${className}`}
        >
          {/* Drone frame */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#67E8F9]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="5" rx="1.5" width="9" x="7.5" y="10" />
            <path d="M6 10 3.5 6.5M18 10l2.5-3.5M6 15l-2.5 3.5M18 15l2.5 3.5" />
            <circle cx="3" cy="5.5" r="1.5" />
            <circle cx="21" cy="5.5" r="1.5" />
            <circle cx="3" cy="19" r="1.5" />
            <circle cx="21" cy="19" r="1.5" />
          </svg>
        </div>
      );

    case "swe-rex":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1c3a34] bg-[#101C1A] shadow-md ${className}`}
        >
          {/* Terminal prompt with two sessions */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#5EEAD4]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="16" rx="2" width="20" x="2" y="4" />
            <path d="m6 9 3 3-3 3M12.5 15h5.5" />
          </svg>
        </div>
      );

    case "agent-governance-toolkit":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1e3547] bg-[#101822] shadow-md ${className}`}
        >
          {/* Shield with a policy check */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#7DD3FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M12 3 20 6v5c0 4.6-3.2 8.2-8 10-4.8-1.8-8-5.4-8-10V6z" />
            <path d="m8.5 12 2.4 2.4L15.5 9.8" />
          </svg>
        </div>
      );

    case "agentbay":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4a2c1c] bg-[#22130E] shadow-md ${className}`}
        >
          {/* Cloud with a terminal prompt */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FDBA74]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M7 18h10a4 4 0 0 0 .8-7.9A5.5 5.5 0 0 0 7.2 9 4.5 4.5 0 0 0 7 18z" />
            <path d="m9.5 12 2 2-2 2M14 16h1.5" />
          </svg>
        </div>
      );

    case "gondolin":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1c3a42] bg-[#111A20] shadow-md ${className}`}
        >
          {/* City gate */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#A5F3FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M4 20V9l4-2v3l4-2v3l4-2v3l4-2v10" />
            <path d="M9 20v-5a3 3 0 0 1 6 0v5" />
          </svg>
        </div>
      );

    case "vmette":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A5F] bg-[#0B1220] shadow-md ${className}`}
        >
          {/* VM frame with shield */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#7DD3FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="14" rx="2" width="16" x="4" y="5" />
            <path d="M8 19v2M16 19v2" />
            <path d="M12 9.2 9.5 10v2.2c0 1.6 1.2 2.4 2.5 3 1.3-.6 2.5-1.4 2.5-3V10z" />
          </svg>
        </div>
      );

    case "azure-container-apps-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A5F] bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Isolated box inside a group grid */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="7" rx="1" width="7" x="4" y="4" />
            <rect height="7" rx="1" width="7" x="13" y="4" />
            <rect height="7" rx="1" width="7" x="4" y="13" />
            <path d="M14.5 16.5h5M17 14v5" />
          </svg>
        </div>
      );

    case "tangle-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E2B52] bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Interlocking loops */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M8.5 5.5a6.5 6.5 0 0 0 0 13c3.6 0 6.5-2.9 6.5-6.5S12.1 5.5 8.5 5.5z" />
            <path d="M15.5 8.5a6.5 6.5 0 0 1 0 13" />
          </svg>
        </div>
      );

    case "bsdkrun":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#26305C] bg-[#141A33] shadow-md ${className}`}
        >
          {/* Prompt chevron inside a microVM box */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="12" rx="2" width="16" x="4" y="6" />
            <path d="m8 11 2 2-2 2M12.5 15h3.5" />
            <path d="M8 2v4M16 2v4M8 18v4M16 18v4" />
          </svg>
        </div>
      );

    case "nibrunner":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#17454A] bg-[#0B1B1E] shadow-md ${className}`}
        >
          {/* Stacked app layers with a suspend bar */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#5EEAD4]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="m12 4 8 4-8 4-8-4z" />
            <path d="m4 13 8 4 8-4" />
            <path d="M9.5 19.5h5" />
          </svg>
        </div>
      );

    case "rakazo":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#243B6B] bg-[#101625] shadow-md ${className}`}
        >
          {/* Desktop monitor with a bot head inside */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="11" rx="1.5" width="16" x="4" y="5" />
            <path d="M9 20h6M12 16v4" />
            <path d="M9 9v2M15 9v2" />
            <path d="M9.5 12.5h5" />
          </svg>
        </div>
      );

    case "yolo-cage":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4A2F14] bg-[#140E08] shadow-md ${className}`}
        >
          {/* Bars: roam freely inside, leave only the approved way */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FDBA74]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="16" rx="2.5" width="18" x="3" y="4" />
            <path d="M8 7.5v9M12 7.5v9M16 7.5v9" />
          </svg>
        </div>
      );

    case "bouvet":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#14532D] bg-[#0A1A14] shadow-md ${className}`}
        >
          {/* Locked microVM: no network to escape through */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#A7F3D0]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="10" rx="2.5" width="14" x="5" y="10.5" />
            <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" />
          </svg>
        </div>
      );

    case "smooth":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#155E75] bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Browser window with the agent's cursor inside */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#67E8F9]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="15" rx="2.5" width="18" x="3" y="4.5" />
            <path d="M3 9h18" />
            <path d="M11 12.5l5 2-2 1-1 2z" />
          </svg>
        </div>
      );

    case "limrun":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#14534D] bg-[#07211F] shadow-md ${className}`}
        >
          {/* A device you can launch from anywhere */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#5EEAD4]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="18" rx="3" width="12" x="6" y="3" />
            <path d="M10 8.5l5.5 3.5L10 15.5z" fill="currentColor" stroke="none" />
          </svg>
        </div>
      );

    case "shai":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#453A1C] bg-[#1F1A0E] shadow-md ${className}`}
        >
          {/* A shell prompt that stays in its box */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FCD34D]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M4.5 6.5l5.5 5.5-5.5 5.5" />
            <path d="M12.5 17.5h7" />
          </svg>
        </div>
      );

    case "arker":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1F3D2B] bg-[#0E1A12] shadow-md ${className}`}
        >
          {/* Double chevron: fork one warm VM into many, fast */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#86EFAC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M5.5 6.5l7 5.5-7 5.5" />
            <path d="M12.5 6.5l7 5.5-7 5.5" />
          </svg>
        </div>
      );

    case "voidrun":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#312E81] bg-[#12122B] shadow-md ${className}`}
        >
          {/* A void in the middle: the VM sleeps, state stays */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#818CF8]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="7.5" />
            <circle cx="12" cy="12" fill="currentColor" r="2" stroke="none" />
          </svg>
        </div>
      );

    case "isola":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#164E63] bg-[#082F49] shadow-md ${className}`}
        >
          {/* An island: pod outline with the sandboxed kernel inside */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#7DD3FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="17" rx="3" width="17" x="3.5" y="3.5" />
            <circle cx="12" cy="12" r="3.5" />
          </svg>
        </div>
      );

    case "sandboxer":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A5F] bg-[#0B1220] shadow-md ${className}`}
        >
          {/* A paused VM: the work is still in there */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="16" rx="2.5" width="18" x="3" y="4" />
            <path d="M9 9v6M15 9v6" />
          </svg>
        </div>
      );

    case "anona-compute":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#33275A] bg-[#161021] shadow-md ${className}`}
        >
          {/* One VM forking into a swarm */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#A5B4FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="7" rx="1.5" width="7" x="3.5" y="3.5" />
            <rect height="7" rx="1.5" width="7" x="13.5" y="3.5" />
            <rect height="7" rx="1.5" width="7" x="8.5" y="13.5" />
            <path d="M7 10.5v2h10v-2" />
          </svg>
        </div>
      );

    case "argent-cloud":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C2430] bg-[#101828] shadow-md ${className}`}
        >
          {/* Phone on a cloud runner */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FDA4AF]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="15" rx="2" width="9" x="7.5" y="4.5" />
            <path d="M11 16.5h2" />
            <path d="M4 8.5c-.8 1.1-.8 2.9 0 4M20 8.5c.8 1.1.8 2.9 0 4" />
          </svg>
        </div>
      );

    case "clusy-notebook":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4A2149] bg-[#141021] shadow-md ${className}`}
        >
          {/* Notebook page forking into two branches */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#F0ABFC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M6 4h12v16H6z" />
            <path d="M9 8h6" />
            <path d="M12 12v2" />
            <path d="M9 17h2M13 17h2" />
          </svg>
        </div>
      );

    case "agentsphere":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3B2F63] bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Sphere holding a paused process */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#C4B5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="8.5" />
            <path d="M9.5 9.5v5M14.5 9.5v5" />
            <path d="M3.5 12h1.5M19 12h1.5" />
          </svg>
        </div>
      );

    case "cplt":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1F4A3D] bg-[#111827] shadow-md ${className}`}
        >
          {/* Shield with a terminal prompt */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#6EE7B7]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9.5 4.1-1.9 7-5.3 7-9.5V6z" />
            <path d="m9.5 10.5 2 2-2 2" />
            <path d="M13 14.5h2.5" />
          </svg>
        </div>
      );

    case "firecrab":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4A2410] bg-[#2A1208] shadow-md ${className}`}
        >
          {/* Crab pincer brackets around a VM box */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FB923C]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="9" rx="1.5" width="10" x="7" y="9" />
            <path d="M4 7V5.5A1.5 1.5 0 0 1 5.5 4H7M17 4h1.5A1.5 1.5 0 0 1 20 5.5V7M20 17v1.5a1.5 1.5 0 0 1-1.5 1.5H17M7 20H5.5A1.5 1.5 0 0 1 4 18.5V17" />
            <path d="M10.5 13h3" />
          </svg>
        </div>
      );

    case "sidekernel":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3F3413] bg-[#111827] shadow-md ${className}`}
        >
          {/* Prompt inside a VM frame */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FBBF24]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="14" rx="2" width="18" x="3" y="5" />
            <path d="m7.5 9.5 2.5 2-2.5 2M12.5 14h4" />
          </svg>
        </div>
      );

    case "shuru":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1d4034] bg-[#0F1B17] shadow-md ${className}`}
        >
          {/* Chip with a play arrow */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#6EE7B7]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="12" rx="2" width="12" x="6" y="6" />
            <path d="m10.5 9.5 3.5 2.5-3.5 2.5z" />
            <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
          </svg>
        </div>
      );

    case "hyperbrowser":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#462a5c] bg-[#1A1024] shadow-md ${className}`}
        >
          {/* Globe with orbit */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#F0ABFC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="6" />
            <path d="M3 12h18M12 6c2 2 2 10 0 12M12 6c-2 2-2 10 0 12" />
            <path d="M4.5 4.5c4 1 11 1 15 0" />
          </svg>
        </div>
      );

    case "bromure":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3a2a56] bg-[#181026] shadow-md ${className}`}
        >
          {/* Wrapped frame: a sandboxed pane */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#C4B5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="12" rx="2" width="14" x="5" y="6" />
            <path d="M5 10h14M9 6V3M15 6V3M9 18v3M15 18v3M5 9H2M5 15H2M19 9h3M19 15h3" />
          </svg>
        </div>
      );

    case "browser-use":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1e3550] bg-[#101A2A] shadow-md ${className}`}
        >
          {/* Browser window with cursor */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="15" rx="2" width="19" x="2.5" y="4.5" />
            <path d="M2.5 8.5h19" />
            <path d="m10 11 6 2.5-2.5 1-1 2.5z" />
          </svg>
        </div>
      );

    case "capsem":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1c3a3a] bg-[#101C1C] shadow-md ${className}`}
        >
          {/* Locked VM capsule */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#5EEAD4]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="9" rx="4.5" width="14" x="5" y="10" />
            <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" />
            <circle cx="12" cy="14.5" r="1.2" />
          </svg>
        </div>
      );

    case "app-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#46242c] bg-[#171018] shadow-md ${className}`}
        >
          {/* Window with an app tile */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FDA4AF]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="15" rx="2" width="18" x="3" y="4.5" />
            <path d="M3 8.5h18M6.5 6.5h.01M9 6.5h.01" />
            <rect height="5" rx="1" width="5" x="9.5" y="11.5" />
          </svg>
        </div>
      );

    case "silos":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1e3550] bg-[#0F1822] shadow-md ${className}`}
        >
          {/* Granary silo */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M6 21V9a6 6 0 0 1 12 0v12" />
            <path d="M4 21h16M9 12h6M9 16h6" />
            <path d="m8 4 4-2 4 2" />
          </svg>
        </div>
      );

    case "firejail":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4a2c18] bg-[#1C120C] shadow-md ${className}`}
        >
          {/* Flame inside a cell */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FDBA74]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="16" rx="2" width="16" x="4" y="4" />
            <path d="M12 8c1.8 2 3 3.6 3 5.4A3 3 0 0 1 9 13.4C9 11.6 10.2 10 12 8z" />
          </svg>
        </div>
      );

    case "moltis":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1f4020] bg-[#101C10] shadow-md ${className}`}
        >
          {/* Rust gear with a terminal caret */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#86EFAC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" />
          </svg>
        </div>
      );

    case "azure-dynamic-sessions":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1e3550] bg-[#0D1B2E] shadow-md ${className}`}
        >
          {/* Cloud with a session bracket */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M7 17h10a4 4 0 0 0 .6-7.9A5.5 5.5 0 0 0 7.2 8 4.5 4.5 0 0 0 7 17z" />
            <path d="M10 12.5 8.5 14l1.5 1.5M14 12.5l1.5 1.5-1.5 1.5" />
          </svg>
        </div>
      );

    case "wasmtime":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#2a2350] bg-[#1A1533] shadow-md ${className}`}
        >
          {/* Module hexagon with a nested core */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#C4B5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M12 2.8 20 7.4v9.2L12 21.2 4 16.6V7.4z" />
            <path d="M12 8.4 15.5 10.4v4L12 16.4 8.5 14.4v-4z" />
          </svg>
        </div>
      );

    case "boxlite":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4a3a18] bg-[#221A0E] shadow-md ${className}`}
        >
          {/* Open box with a lighter core */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FCD34D]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5z" />
            <path d="M4 8.5 12 13l8-4.5M12 13v7" />
            <circle cx="12" cy="13" r="1.6" />
          </svg>
        </div>
      );

    case "computesdk":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1e3a4d] bg-[#101E2E] shadow-md ${className}`}
        >
          {/* One node fanning out to many providers */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#7DD3FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <circle cx="5" cy="12" r="2" />
            <circle cx="19" cy="6" r="2" />
            <circle cx="19" cy="18" r="2" />
            <path d="M6.7 11.2 17.3 6.8M6.7 12.8l10.6 4.4" />
          </svg>
        </div>
      );

    case "upstash-box":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#14402f] bg-[#0B1F17] shadow-md ${className}`}
        >
          {/* Box with a wake pulse */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#5EEAD4]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="12" rx="2" width="14" x="5" y="7" />
            <path d="M9 12.5h2.2l1.3-2.2 1.6 4 1.2-1.8H17" />
          </svg>
        </div>
      );

    case "github-codespaces":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#30363D] bg-[#0D1117] shadow-md ${className}`}
        >
          {/* Branch fork over a terminal pane */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#F0F6FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <circle cx="7" cy="6" r="2" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="9" r="2" />
            <path d="M7 8v8M9 10.5c3 0 6-0.5 6-1.5" />
          </svg>
        </div>
      );

    case "podman":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3B1D4E] bg-[#1B1023] shadow-md ${className}`}
        >
          {/* Rootless container: seal outline with a keyhole */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#D8B4FE]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M4 11c0-2 1.8-3.5 4-3.5 1 0 1.9.3 2.6.8a4.4 4.4 0 0 1 7.4 1.9A3.4 3.4 0 0 1 20 17H6a3 3 0 0 1-2-6z" />
            <circle cx="12" cy="12.5" r="1.4" />
            <path d="M12 13.9v2" />
          </svg>
        </div>
      );

    case "runpod":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3B2361] bg-[#160B25] shadow-md ${className}`}
        >
          {/* GPU die with fan blades */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#C4B5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="12" rx="2" width="12" x="6" y="6" />
            <circle cx="12" cy="12" r="2.2" />
            <path d="M9 6V3M12 6V3M15 6V3M9 21v-3M12 21v-3M15 21v-3" />
          </svg>
        </div>
      );

    case "aws-lambda-microvm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3A4553] bg-[#232F3E] shadow-md ${className}`}
        >
          {/* Lambda mark */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FF9900]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path d="M6 5h3.2l3.3 7.4L15.8 5H19l-5.2 11.5L19 19h-3.4l-2.8-6.2L9.6 19H6.4l5-10.8z" />
          </svg>
        </div>
      );

    case "coder":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#334155] bg-[#1F2937] shadow-md ${className}`}
        >
          {/* Terminal pane with a C brace */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="14" rx="2" width="18" x="3" y="5" />
            <path d="m7 10 2.2 2L7 14M16.5 9.5c-1.8 0-2.8 1.1-2.8 2.5s1 2.5 2.8 2.5" />
          </svg>
        </div>
      );

    case "codesandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#333333] bg-[#151515] shadow-md ${className}`}
        >
          {/* Cube made of stacked lines */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#5EEAD4]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9z" />
            <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
          </svg>
        </div>
      );

    case "freestyle":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A5F] bg-[#0F172A] shadow-md ${className}`}
        >
          {/* Bolt over a git branch */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#38BDF8]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M13.5 3 7 13h4l-1.5 8L17 10h-4z" />
          </svg>
        </div>
      );

    case "replit":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#F26207] bg-[#F26207] shadow-md ${className}`}
        >
          {/* Three stacked blocks */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="5" rx="1.5" width="8" x="6" y="4.5" />
            <rect height="5" rx="1.5" width="8" x="10" y="9.5" />
            <rect height="5" rx="1.5" width="8" x="6" y="14.5" />
          </svg>
        </div>
      );

    case "moejs":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3A3A24] bg-[#1B1B14] shadow-md ${className}`}
        >
          {/* JS braces with an isolated dot */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FDE68A]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M9 4c-2 0-2.5 1.2-2.5 3v3c0 1.2-.7 2-2 2 1.3 0 2 .8 2 2v3c0 1.8.5 3 2.5 3" />
            <path d="M15 4c2 0 2.5 1.2 2.5 3v3c0 1.2.7 2 2 2-1.3 0-2 .8-2 2v3c0 1.8-.5 3-2.5 3" />
            <circle cx="12" cy="12" r="1.5" />
          </svg>
        </div>
      );

    case "maritime":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/70 bg-[#0B1B2B] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#7DD3FC] text-[10px]">MA</span>
        </div>
      );

    case "kitesurf":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FBBF24] text-[10px]">KS</span>
        </div>
      );

    case "notte":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95]/70 bg-[#111827] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A78BFA] text-[10px]">NT</span>
        </div>
      );

    case "thunder-compute":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A]/70 bg-[#0E1B2C] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#93C5FD] text-[10px]">TC</span>
        </div>
      );

    case "nodus":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95]/70 bg-[#131022] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#C4B5FD] text-[10px]">ND</span>
        </div>
      );

    case "agent-next":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7F1D1D]/70 bg-[#161326] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCA5A5] text-[10px]">AN</span>
        </div>
      );

    case "phonebox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#115E59]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#5EEAD4] text-[10px]">PB</span>
        </div>
      );

    case "clousd":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534]/70 bg-[#101826] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#86EFAC] text-[10px]">CD</span>
        </div>
      );

    case "chainguard-workspaces":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#115E59]/70 bg-[#0A1826] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#5EEAD4] text-[10px]">CW</span>
        </div>
      );

    case "render-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#46E3B7]/45 bg-[#07110E] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#46E3B7] text-[13px] leading-none">
            R
          </span>
        </div>
      );

    case "k7":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#155E75]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#67E8F9] text-[10px]">k7</span>
        </div>
      );

    case "capsule":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3730A3]/70 bg-[#101728] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A5B4FC] text-[10px]">CA</span>
        </div>
      );

    case "claude-code-devcontainer":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7F1D1D]/70 bg-[#0F172A] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCA5A5] text-[10px]">TB</span>
        </div>
      );

    case "jurniti":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7F1D1D]/70 bg-[#111827] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCA5A5] text-[10px]">JU</span>
        </div>
      );

    case "agentsandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#075985]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#7DD3FC] text-[10px]">AS</span>
        </div>
      );

    case "exe":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#78350F]/70 bg-[#1A1410] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCD34D] text-[9px]">exe</span>
        </div>
      );

    case "hyper":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95]/70 bg-[#12121F] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A78BFA] text-[10px]">HY</span>
        </div>
      );

    case "contrast":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#86198F]/70 bg-[#170F1F] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#E879F9] text-[10px]">CO</span>
        </div>
      );

    case "appetize":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#075985]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#38BDF8] text-[10px]">AP</span>
        </div>
      );

    case "docker-android":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534]/70 bg-[#0E1B12] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#86EFAC] text-[10px]">dA</span>
        </div>
      );

    case "openvmm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/70 bg-[#0B1424] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#7DD3FC] text-[10px]">OV</span>
        </div>
      );

    case "dressage":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412]/70 bg-[#1B1206] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FDBA74] text-[11px]">D</span>
        </div>
      );

    case "nanvix":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#155E75]/70 bg-[#071A2B] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#67E8F9] text-[10px]">nan</span>
        </div>
      );

    case "hermit":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#78350F]/70 bg-[#101521] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCD34D] text-[11px]">H</span>
        </div>
      );

    case "runno":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A]/70 bg-[#0F1B2D] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#93C5FD] text-[11px]">R</span>
        </div>
      );

    case "sablejs":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3730A3]/70 bg-[#101A2E] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A5B4FC] text-[10px]">sb</span>
        </div>
      );

    case "hoplite":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#78350F]/70 bg-[#14100A] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCD34D] text-[10px]">HP</span>
        </div>
      );

    case "superhq":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#93C5FD] text-[10px]">SH</span>
        </div>
      );

    case "nanos":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3730A3]/70 bg-[#111827] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A5B4FC] text-[10px]">NS</span>
        </div>
      );

    case "nomac":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#374151]/80 bg-[#101418] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#E5E7EB] text-[10px]">NM</span>
        </div>
      );

    case "sandboxed-api":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF]/70 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#93C5FD] text-[9px]">SAPI</span>
        </div>
      );

    case "tart":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#334155]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#E5E7EB] text-[10px]">TA</span>
        </div>
      );

    case "kedge":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#134E4A]/80 bg-[#061A18] shadow-md ${className}`}
        >
          <span className="flex items-baseline gap-px font-extrabold font-mono text-[#5EEAD4] text-[13px] leading-none">
            K<span className="text-[#2DD4BF] text-[8px]">·</span>
          </span>
        </div>
      );

    case "buddy-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#78350F]/80 bg-[#1B1206] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCD34D] text-[12px] leading-none">
            B<span className="ml-px align-super text-[8px]">*</span>
          </span>
        </div>
      );

    case "apify-ai-code-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#93C5FD]" strokeWidth={2.4} />
        </div>
      );

    case "krova":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#064E3B]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A7F3D0] text-[13px] leading-none">
            K
          </span>
        </div>
      );

    case "stateset-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#C4B5FD] text-[11px] leading-none tracking-[-0.06em]">
            SS
          </span>
        </div>
      );

    case "shellbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#155E75]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#67E8F9] text-[11px] leading-none tracking-[-0.04em]">
            &gt;_
          </span>
        </div>
      );

    case "zipbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#78350F]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FDE68A] text-[11px] leading-none tracking-[-0.04em]">
            ZB
          </span>
        </div>
      );

    case "langsmith-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0C4A6E]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#7DD3FC] text-[11px] leading-none tracking-[-0.04em]">
            LS
          </span>
        </div>
      );

    case "railway-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#334155]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#E5E7EB] text-[11px] leading-none tracking-[-0.04em]">
            RW
          </span>
        </div>
      );

    case "coreweave-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#831843]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#F9A8D4] text-[11px] leading-none tracking-[-0.04em]">
            CW
          </span>
        </div>
      );

    case "orgo":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7C2D12]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FDBA74] text-[11px] leading-none tracking-[-0.04em]">
            OR
          </span>
        </div>
      );

    case "miosa":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3730A3]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A5B4FC] text-[11px] leading-none tracking-[-0.04em]">
            MI
          </span>
        </div>
      );

    case "caged":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7F1D1D]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCA5A5] text-[11px] leading-none tracking-[-0.04em]">
            CG
          </span>
        </div>
      );

    case "oblien":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#115E59]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#5EEAD4] text-[11px] leading-none tracking-[-0.04em]">
            OB
          </span>
        </div>
      );

    case "microsoft-foundry-hosted-agents":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center gap-[2px] border border-[#1E3A8A]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="h-2 w-2 bg-[#F25022]" />
          <span className="h-2 w-2 bg-[#7FBA00]" />
          <span className="h-2 w-2 bg-[#00A4EF]" />
          <span className="h-2 w-2 bg-[#FFB900]" />
        </div>
      );

    case "byteplus-cloud-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#93C5FD] text-[11px] leading-none tracking-[-0.04em]">
            BP
          </span>
        </div>
      );

    case "eqvps-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#C4B5FD] text-[11px] leading-none tracking-[-0.04em]">
            EQ
          </span>
        </div>
      );

    case "brimble-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#78350F]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FDE68A] text-[11px] leading-none tracking-[-0.04em]">
            BR
          </span>
        </div>
      );

    case "openpond-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0C4A6E]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#7DD3FC] text-[11px] leading-none tracking-[-0.04em]">
            OP
          </span>
        </div>
      );

    case "shardflux":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#115E59]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#5EEAD4] text-[11px] leading-none tracking-[-0.04em]">
            SF
          </span>
        </div>
      );

    case "pandastack":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#78350F]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCD34D] text-[11px] leading-none tracking-[-0.04em]">
            PS
          </span>
        </div>
      );

    case "depot-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#93C5FD] text-[11px] leading-none tracking-[-0.04em]">
            DP
          </span>
        </div>
      );

    case "vers":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#C4B5FD] text-[11px] leading-none tracking-[-0.04em]">
            VE
          </span>
        </div>
      );

    case "namespace":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#86EFAC] text-[11px] leading-none tracking-[-0.04em]">
            NS
          </span>
        </div>
      );

    case "sail":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#155E75]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#67E8F9] text-[11px] leading-none tracking-[-0.04em]">
            SL
          </span>
        </div>
      );

    case "mosaic":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7C2D12]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FDBA74] text-[11px] leading-none tracking-[-0.04em]">
            MO
          </span>
        </div>
      );

    case "solari":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#831843]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#F9A8D4] text-[11px] leading-none tracking-[-0.04em]">
            SO
          </span>
        </div>
      );

    case "sendblue-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0C4A6E]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#7DD3FC] text-[11px] leading-none tracking-[-0.04em]">
            SB
          </span>
        </div>
      );

    case "collimate":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3730A3]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A5B4FC] text-[11px] leading-none tracking-[-0.04em]">
            CO
          </span>
        </div>
      );

    case "sandbox0":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7F1D1D]/80 bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCA5A5] text-[11px] leading-none tracking-[-0.04em]">
            S0
          </span>
        </div>
      );

    case "alibaba-cloud-agent-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412]/80 bg-[#1A1207] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FF8A3D] text-[11px] leading-none tracking-[-0.04em]">
            AS
          </span>
        </div>
      );

    case "together-code-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#5B21B6]/80 bg-[#140F24] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#C4B5FD] text-[11px] leading-none tracking-[-0.04em]">
            TG
          </span>
        </div>
      );

    case "aws-agentcore-code-interpreter":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E]/80 bg-[#1A1206] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FF9900] text-[11px] leading-none tracking-[-0.04em]">
            AW
          </span>
        </div>
      );

    case "ix":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#A16207]/80 bg-[#12100A] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FDE68A] text-[11px] leading-none tracking-[-0.04em]">
            IX
          </span>
        </div>
      );

    case "openai-code-interpreter":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#047857]/80 bg-[#071812] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A7F3D0] text-[11px] leading-none tracking-[-0.04em]">
            OA
          </span>
        </div>
      );

    case "anthropic-code-execution":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412]/80 bg-[#1A120A] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FDBA74] text-[11px] leading-none tracking-[-0.04em]">
            AN
          </span>
        </div>
      );

    case "prime-intellect-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#831843]/80 bg-[#1A0B14] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#F9A8D4] text-[11px] leading-none tracking-[-0.04em]">
            PI
          </span>
        </div>
      );

    case "thunder-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/80 bg-[#071A1F] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#67E8F9] text-[11px] leading-none tracking-[-0.04em]">
            TC
          </span>
        </div>
      );

    case "aws-agentcore-runtime":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E] bg-[#1A1206] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FF9900] text-[11px] leading-none tracking-[-0.04em]">
            AR
          </span>
        </div>
      );

    case "digitalocean-microvms":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#60A5FA] text-[11px] leading-none tracking-[-0.04em]">
            DM
          </span>
        </div>
      );

    case "veris":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534] bg-[#0B1A14] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#4ADE80] text-[11px] leading-none tracking-[-0.04em]">
            VR
          </span>
        </div>
      );

    case "sauce-labs":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46] bg-[#0A1F1A] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#34D399] text-[11px] leading-none tracking-[-0.04em]">
            SL
          </span>
        </div>
      );

    case "shells":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF] bg-[#0A1424] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#38BDF8] text-[11px] leading-none tracking-[-0.04em]">
            SH
          </span>
        </div>
      );

    case "baseten-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46] bg-[#06140F] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#34D399] text-[14px] lowercase leading-none tracking-[-0.06em]">
            b
          </span>
        </div>
      );

    case "unikraft-cloud":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#155E75] bg-[#101828] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#67E8F9] text-[11px] leading-none tracking-[-0.04em]">
            UK
          </span>
        </div>
      );

    case "browserpod":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF] bg-[#0B1A2A] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#60A5FA] text-[11px] leading-none tracking-[-0.04em]">
            BP
          </span>
        </div>
      );

    case "nebius-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#854D0E] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FACC15] text-[11px] leading-none tracking-[-0.04em]">
            NB
          </span>
        </div>
      );

    case "deepinfra-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#34D399] text-[11px] leading-none tracking-[-0.04em]">
            DI
          </span>
        </div>
      );

    case "warpbuild-macos":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#831843] bg-[#111827] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#F472B6] text-[11px] leading-none tracking-[-0.04em]">
            WB
          </span>
        </div>
      );

    case "sandboxfusion":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#831843] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#F472B6] text-[11px] leading-none tracking-[-0.04em]">
            SF
          </span>
        </div>
      );

    case "lightning-sandboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#6B21A8] bg-[#0B1220] shadow-md ${className}`}
        >
          <Zap className="h-5 w-5 text-[#C084FC]" fill="#C084FC" strokeWidth={1.4} />
        </div>
      );

    case "tinfoil-containers":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#854D0E] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FBBF24] text-[11px] leading-none tracking-[-0.04em]">
            TF
          </span>
        </div>
      );

    case "airtop":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FBBF24] text-[11px] leading-none tracking-[-0.04em]">
            AT
          </span>
        </div>
      );

    case "firecrawl-browser":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FB923C] text-[11px] leading-none tracking-[-0.04em]">
            FC
          </span>
        </div>
      );

    case "expo-simulators":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A7F3D0] text-[11px] leading-none tracking-[-0.04em]">
            EX
          </span>
        </div>
      );

    case "helixml":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9D174D] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#F9A8D4] text-[11px] leading-none tracking-[-0.04em]">
            HX
          </span>
        </div>
      );

    case "browserbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#93C5FD] text-[11px] leading-none tracking-[-0.04em]">
            BB
          </span>
        </div>
      );

    case "brightdata-browser":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1D4ED8] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#60A5FA] text-[11px] leading-none tracking-[-0.04em]">
            BD
          </span>
        </div>
      );

    case "revyl":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#A16207] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FDE68A] text-[11px] leading-none tracking-[-0.04em]">
            RV
          </span>
        </div>
      );

    case "signadot":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0369A1] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#7DD3FC] text-[11px] leading-none tracking-[-0.04em]">
            SD
          </span>
        </div>
      );

    case "windows-365-agents":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#075985] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#7DD3FC] text-[11px] leading-none tracking-[-0.04em]">
            W3
          </span>
        </div>
      );

    case "cloudflare-browser-run":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCD34D] text-[11px] leading-none tracking-[-0.04em]">
            CB
          </span>
        </div>
      );

    case "oxylabs-agent-browser":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#86198F] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#F0ABFC] text-[11px] leading-none tracking-[-0.04em]">
            OX
          </span>
        </div>
      );

    case "aws-device-farm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FDBA74] text-[11px] leading-none tracking-[-0.04em]">
            DF
          </span>
        </div>
      );

    case "firebase-test-lab":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#A16207] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FDE047] text-[11px] leading-none tracking-[-0.04em]">
            FL
          </span>
        </div>
      );

    case "lambdatest":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#5B21B6] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#C4B5FD] text-[11px] leading-none tracking-[-0.04em]">
            LT
          </span>
        </div>
      );

    case "amp-orbs":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#991B1B] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCA5A5] text-[11px] leading-none tracking-[-0.04em]">
            AO
          </span>
        </div>
      );

    case "scrapingbee":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#86EFAC] text-[11px] leading-none tracking-[-0.04em]">
            SB
          </span>
        </div>
      );

    case "cerebrium":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#155E75] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#67E8F9] text-[11px] leading-none tracking-[-0.04em]">
            CR
          </span>
        </div>
      );

    case "browsercat":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#A16207] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCD34D] text-[11px] leading-none tracking-[-0.04em]">
            BC
          </span>
        </div>
      );

    case "zenrows":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3730A3] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A5B4FC] text-[11px] leading-none tracking-[-0.04em]">
            ZR
          </span>
        </div>
      );

    case "okteto":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9D174D] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#F9A8D4] text-[11px] leading-none tracking-[-0.04em]">
            OK
          </span>
        </div>
      );

    case "fly-machines":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#155E75] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A5F3FC] text-[11px] leading-none tracking-[-0.04em]">
            FM
          </span>
        </div>
      );

    case "koyeb":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9D174D] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FBCFE8] text-[11px] leading-none tracking-[-0.04em]">
            KY
          </span>
        </div>
      );

    case "browserstack":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FDBA74] text-[11px] leading-none tracking-[-0.04em]">
            BS
          </span>
        </div>
      );

    case "capy":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#991B1B] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCA5A5] text-[11px] leading-none tracking-[-0.04em]">
            CP
          </span>
        </div>
      );

    case "google-cloud-workstations":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#93C5FD] text-[11px] leading-none tracking-[-0.04em]">
            GW
          </span>
        </div>
      );

    case "cursor-cloud-agents":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3A4370] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#E5E7EB] text-[11px] leading-none tracking-[-0.04em]">
            CU
          </span>
        </div>
      );

    case "openai-codex-cloud":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A7F3D0] text-[11px] leading-none tracking-[-0.04em]">
            OA
          </span>
        </div>
      );

    case "nearai-red-sandbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FDE68A] text-[11px] leading-none tracking-[-0.04em]">
            NR
          </span>
        </div>
      );

    case "onlyboxes":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#93C5FD] text-[11px] leading-none tracking-[-0.04em]">
            OB
          </span>
        </div>
      );

    case "google-agent-platform-code-execution":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#93C5FD] text-[11px] leading-none tracking-[-0.04em]">
            GO
          </span>
        </div>
      );

    case "amika":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3730A3] bg-[#101426] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A5B4FC] text-[11px] leading-none tracking-[-0.04em]">
            AM
          </span>
        </div>
      );

    case "mudroom":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490] bg-[#0C1B22] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#7DD3FC] text-[11px] leading-none tracking-[-0.04em]">
            MU
          </span>
        </div>
      );

    case "forgerun":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#15803D] bg-[#0B1F1A] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#4ADE9B] text-[11px] leading-none tracking-[-0.04em]">
            FR
          </span>
        </div>
      );

    case "opendsec":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF] bg-[#101826] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#93C5FD] text-[11px] leading-none tracking-[-0.04em]">
            OD
          </span>
        </div>
      );

    case "lingcage":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7E22CE] bg-[#1C1026] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#E9D5FF] text-[11px] leading-none tracking-[-0.04em]">
            LC
          </span>
        </div>
      );

    case "purgatorium":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#B45309] bg-[#1A1206] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCD34D] text-[11px] leading-none tracking-[-0.04em]">
            P9
          </span>
        </div>
      );

    case "davit":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF] bg-[#0B1626] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#93C5FD] text-[11px] leading-none tracking-[-0.04em]">
            DV
          </span>
        </div>
      );

    case "koto":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#831843] bg-[#1A0B14] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#F9A8D4] text-[11px] leading-none tracking-[-0.04em]">
            KO
          </span>
        </div>
      );

    case "cratera":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#991B1B] bg-[#1A0A0A] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCA5A5] text-[11px] leading-none tracking-[-0.04em]">
            CR
          </span>
        </div>
      );

    case "rust-nano-vm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#374151] bg-[#111827] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FCA5A5] text-[11px] leading-none tracking-[-0.04em]">
            NV
          </span>
        </div>
      );

    case "nightona":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF] bg-[#0E1B2E] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#93C5FD] text-[11px] leading-none tracking-[-0.04em]">
            NI
          </span>
        </div>
      );

    case "clawker":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E40AF] bg-[#101625] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#93C5FD] text-[11px] leading-none tracking-[-0.04em]">
            CW
          </span>
        </div>
      );

    case "mcp-runner":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#7DD3FC] text-[11px] leading-none tracking-[-0.04em]">
            MR
          </span>
        </div>
      );

    case "ironclaw":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412] bg-[#1A1006] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FDBA74] text-[11px] leading-none tracking-[-0.04em]">
            IC
          </span>
        </div>
      );

    case "hyperagent":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#047857] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A7F3D0] text-[11px] leading-none tracking-[-0.04em]">
            HA
          </span>
        </div>
      );

    case "drydock":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490] bg-[#0B1A24] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#7DD3FC] text-[11px] leading-none tracking-[-0.04em]">
            DD
          </span>
        </div>
      );

    case "nilbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#86198F] bg-[#1A0F1E] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#F0ABFC] text-[11px] leading-none tracking-[-0.04em]">
            NB
          </span>
        </div>
      );

    case "agent-vm":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490] bg-[#0B1B22] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#67E8F9] text-[11px] leading-none tracking-[-0.04em]">
            AV
          </span>
        </div>
      );

    case "nexusbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#064E3B] bg-[#0B1220] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A7F3D0] text-[11px] leading-none tracking-[-0.04em]">
            NX
          </span>
        </div>
      );

    case "cage-bro":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#115E59] bg-[#0B1A18] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#5EEAD4] text-[11px] leading-none tracking-[-0.04em]">
            CB
          </span>
        </div>
      );

    case "peerd":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95] bg-[#111827] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#C4B5FD] text-[11px] leading-none tracking-[-0.04em]">
            PD
          </span>
        </div>
      );

    case "dockside":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A] bg-[#0F172A] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#93C5FD] text-[11px] leading-none tracking-[-0.04em]">
            DO
          </span>
        </div>
      );

    case "orchard":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412] bg-[#1C1917] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FDBA74] text-[11px] leading-none tracking-[-0.04em]">
            OR
          </span>
        </div>
      );

    case "bubblejail":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3730A3] bg-[#1E1B4B] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#A5B4FC] text-[11px] leading-none tracking-[-0.04em]">
            BJ
          </span>
        </div>
      );

    case "kyushu":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#7E22CE] bg-[#1E1033] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#F0ABFC] text-[11px] leading-none tracking-[-0.04em]">
            KY
          </span>
        </div>
      );

    case "emulator-wtf":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#581C87] bg-[#1B0F2E] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#D8B4FE] text-[11px] leading-none tracking-[-0.04em]">
            EW
          </span>
        </div>
      );

    case "devicefarmer-stf":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534] bg-[#0B1C14] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#86EFAC] text-[11px] leading-none tracking-[-0.04em]">
            DF
          </span>
        </div>
      );

    case "waydroid":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A] bg-[#0F1B2E] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#7DD3FC] text-[11px] leading-none tracking-[-0.04em]">
            WD
          </span>
        </div>
      );

    case "cuttlefish":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#78350F] bg-[#17130A] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#FDE68A] text-[11px] leading-none tracking-[-0.04em]">
            CF
          </span>
        </div>
      );

    case "neko":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#155E75] bg-[#0B1B2B] shadow-md ${className}`}
        >
          <span className="font-extrabold font-mono text-[#7DD3FC] text-[11px] leading-none tracking-[-0.04em]">
            NK
          </span>
        </div>
      );

    case "sandlock":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534]/60 bg-[#0B1A12] shadow-md ${className}`}
        >
          {/* Padlock: kernel-enforced process confinement */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#86EFAC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="9" rx="2" width="13" x="5.5" y="11" />
            <path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3" />
            <path d="M12 14.5v2" />
          </svg>
        </div>
      );

    case "mvm-runtime":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#075985]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Chip: one kernel per workload */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#7DD3FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="10" rx="2" width="10" x="7" y="7" />
            <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" />
          </svg>
        </div>
      );

    case "codapi":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0C4A6E]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Play button inside a snippet frame */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#7DD3FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="15" rx="2" width="18" x="3" y="4.5" />
            <path d="m10 9 5 3-5 3V9Z" />
          </svg>
        </div>
      );

    case "tilde-run":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#6B21A8]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Rollback arrow: each agent run was a revertible transaction */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#C084FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
            <path d="M3.5 4.5V10H9" />
            <path d="M12 8.5V12l2.5 1.5" />
          </svg>
        </div>
      );

    case "sandbox-check":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Shield with check: an isolation audit, not a runtime */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#34D399]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M12 3 5 6v5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z" />
            <path d="m9 11.5 2.2 2.2L15.5 9.5" />
          </svg>
        </div>
      );

    case "claudebox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Container box: Docker boundary around a terminal */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FB923C]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M4 8.5 12 4l8 4.5v7L12 20l-8-4.5v-7Z" />
            <path d="m4.5 8.7 7.5 4.2 7.5-4.2" />
            <path d="M12 12.9V20" />
          </svg>
        </div>
      );

    case "lilbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0369A1]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Shield around a shell prompt: an outer sandbox for the agent */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#7DD3FC]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M12 3 5 6v6c0 4.2 2.9 7.7 7 9 4.1-1.3 7-4.8 7-9V6l-7-3Z" />
            <path d="m9 10 2.5 2.5L9 15M13 15h3" />
          </svg>
        </div>
      );
    case "clawdhome":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#5B21B6]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Two agent accounts behind one home window */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#C4B5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M4 9.5 12 5l8 4.5v9L12 23l-8-4.5v-9Z" />
            <circle cx="9.5" cy="12.5" r="1.6" />
            <circle cx="14.5" cy="12.5" r="1.6" />
            <path d="M7 17.2c.5-1.4 1.5-2.1 2.5-2.1s2 .7 2.5 2.1M12 17.2c.5-1.4 1.5-2.1 2.5-2.1s2 .7 2.5 2.1" />
          </svg>
        </div>
      );
    case "smolbsd":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Tiny VM frame around a boot bolt: microVM boot in milliseconds */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FB923C]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="16" rx="2.5" width="18" x="3" y="4" />
            <path d="M13 7.5 9.5 12.5H12l-1 4 3.5-5H12l1-4Z" />
          </svg>
        </div>
      );
    case "kbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Kernel inside the process box */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#38BDF8]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="16" rx="2.5" width="16" x="4" y="4" />
            <rect height="7" rx="1.2" width="7" x="8.5" y="8.5" />
            <path d="M11 15.5h5M11 17.7h2.5" />
          </svg>
        </div>
      );

    case "z-jail":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#A16207]/60 bg-[#141018] shadow-md ${className}`}
        >
          {/* Padlock: a sealed exec path, one binary wide */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FBBF24]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="9" rx="2" width="13" x="5.5" y="10.5" />
            <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
            <path d="M12 14v2.5" />
          </svg>
        </div>
      );

    case "vetu":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9D174D]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Machine with pull/push arrows: VMs through a registry */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#F472B6]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="8" rx="1.5" width="12" x="6" y="3" />
            <path d="M8.5 7h.01M11 7h.01M13.5 7h.01" />
            <path d="M9 15v6M7.5 19.5 9 21l1.5-1.5" />
            <path d="M15 21v-6M13.5 16.5 15 15l1.5 1.5" />
          </svg>
        </div>
      );

    case "minimal":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#115E59]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Deliberately empty frame with one block: the smallest session */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#2DD4BF]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="15" rx="2" width="17" x="3.5" y="4.5" />
            <rect height="5" rx="1" width="5" x="9.5" y="9.5" />
          </svg>
        </div>
      );

    case "rudderstack-devbox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1D4ED8]/60 bg-[#0F172A] shadow-md ${className}`}
        >
          {/* Branch with a pull request: ticket in, draft PR out */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#60A5FA]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <circle cx="6.5" cy="6" r="2.2" />
            <circle cx="6.5" cy="18" r="2.2" />
            <circle cx="17.5" cy="8.5" r="2.2" />
            <path d="M6.5 8.2v7.6M8.7 8.5h3.6a3 3 0 0 1 3 0" />
            <path d="M17.5 10.7v4.3M16 13.5l1.5 1.5 1.5-1.5" />
          </svg>
        </div>
      );

    case "bytebot":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#6D28D9]/60 bg-[#120F24] shadow-md ${className}`}
        >
          {/* Desktop with a pointer: an agent clicking through the screen */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#A78BFA]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="12" rx="2" width="18" x="3" y="4" />
            <path d="M9 20h6M12 16v4" />
            <path d="m13 7.5 5 2-2.2 1.2L15 13l-2-5.5Z" />
          </svg>
        </div>
      );

    case "hypeman":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#166534]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Stacked VM layers on one host */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#4ADE80]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M12 3 3 7.5l9 4.5 9-4.5L12 3Z" />
            <path d="m3 12 9 4.5 9-4.5" />
            <path d="m3 16.5 9 4.5 9-4.5" />
          </svg>
        </div>
      );

    case "clawpatrol":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0E7490]/60 bg-[#0B1620] shadow-md ${className}`}
        >
          {/* Fence with a gated arrow: traffic leaves only through the check */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#22D3EE]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M5 4v16M19 4v16" />
            <path d="M3 8.5h7M14 8.5h7M3 15.5h7M14 15.5h7" />
            <path d="M9.5 12h5M12.8 10.2 14.5 12l-1.7 1.8" />
          </svg>
        </div>
      );

    case "infisical-agent-vault":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#854D0E]/60 bg-[#161208] shadow-md ${className}`}
        >
          {/* Key: credentials handed over outside the agent */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FACC15]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <circle cx="8.5" cy="8.5" r="4" />
            <path d="m11.4 11.4 7.1 7.1M16 15.5l1.8-1.8M18.2 17.7l1.8-1.8" />
          </svg>
        </div>
      );

    case "iximiuz-labs":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1D4ED8]/60 bg-[#0B1424] shadow-md ${className}`}
        >
          {/* Beaker with a prompt: a lab you can type into */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#60A5FA]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M9 3h6M10 3v5.2L5.6 17a3 3 0 0 0 2.7 4.3h7.4a3 3 0 0 0 2.7-4.3L14 8.2V3" />
            <path d="M7.3 14.5h9.4" />
            <path d="m10.5 17.5 1.5 1.2-1.5 1.2" />
            <path d="M14 18.7h2" />
          </svg>
        </div>
      );

    case "cupcake":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9D174D]/60 bg-[#1A0B1E] shadow-md ${className}`}
        >
          {/* Policy shield with rule lines */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#F472B6]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M12 3 5 6v5c0 4.4 3 7.6 7 9 4-1.4 7-4.6 7-9V6l-7-3Z" />
            <path d="M8.5 9.5h7M8.5 12.5h7M8.5 15.5h4" />
          </svg>
        </div>
      );

    case "zapcode":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#854D0E]/60 bg-[#1A160B] shadow-md ${className}`}
        >
          {/* Bolt: microsecond interpreter start */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FACC15]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M13.5 2.5 4.5 13.5h6L9 21.5l9.5-12h-6l1-7Z" />
          </svg>
        </div>
      );

    case "pctx":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#115E59]/60 bg-[#0B1A1A] shadow-md ${className}`}
        >
          {/* Linked nodes: one protocol front for many MCP servers */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#2DD4BF]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="18" cy="6.5" r="2.5" />
            <circle cx="18" cy="17.5" r="2.5" />
            <path d="m8.3 10.9 7.4-3.3M8.3 13.1l7.4 3.3" />
          </svg>
        </div>
      );

    case "nixcage":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3F6212]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Cage bars: one project, nothing else */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#A3E635]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="14" rx="2" width="16" x="4" y="6" />
            <path d="M8 6v14M12 6v14M16 6v14M4 10h16M4 16h16" />
          </svg>
        </div>
      );

    case "scrapybara":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3B82F6]/50 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Agent cursor over a remote desktop: the product's original pitch */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#60A5FA]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="14" rx="2" width="18" x="3" y="4" />
            <path d="M3 8h18" />
            <path d="m12 11 5.5 2.2-2.3.9-.9 2.3L12 11Z" />
          </svg>
        </div>
      );

    case "agentshield":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#047857]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Shield over a keyhole: kernel boundary plus secret defense */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#34D399]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M12 3 5 6v5c0 4.4 3 8.4 7 10 4-1.6 7-5.6 7-10V6l-7-3Z" />
            <circle cx="12" cy="10.5" r="1.6" />
            <path d="M12 12v3" />
          </svg>
        </div>
      );

    case "browser-pilot":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0369A1]/60 bg-[#0B1220] shadow-md ${className}`}
        >
          {/* Browser window steered by a command cursor: remote Chrome plus CLI */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#38BDF8]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="15" rx="2" width="18" x="3" y="4" />
            <path d="M3 8h18" />
            <path d="M7 6h.01M10 6h.01" />
            <path d="m9 12 6 2.4-2.4 1-1 2.4L9 12Z" />
          </svg>
        </div>
      );

    case "kindling":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#9A3412]/60 bg-[#160D08] shadow-md ${className}`}
        >
          {/* Flame over a twig: a frozen VM catching fire from a small start */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#FB923C]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <path d="M12 3c2.5 3 4.5 5 4.5 8a4.5 4.5 0 0 1-9 0c0-1.2.4-2.2 1.1-3.2.7 1.4 1.6 2.2 2.4 2.2 1.2 0 1.9-1.1 1-2.7-.5-.9-.9-1.9 0-4.3Z" />
            <path d="M4 20h16" />
            <path d="m8 17 4-2 4 2" />
          </svg>
        </div>
      );

    case "l4es":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#0F766E]/70 bg-[#062A2E] shadow-md ${className}`}
        >
          {/* Shield with a check and a ring: a kernel with an attestation seal */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#5EEAD4]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M12 3 5 6v5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z" />
            <circle cx="12" cy="10.5" r="3.2" />
            <path d="m10.6 10.6 1 1 1.9-2.1" />
          </svg>
        </div>
      );

    case "brood-box":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#4C1D95]/70 bg-[#120A24] shadow-md ${className}`}
        >
          {/* Hexagonal brood cell with slats: a hive for isolated agent VMs */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#C4B5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M12 3 4.5 7.3v9.4L12 21l7.5-4.3V7.3L12 3Z" />
            <path d="M12 8.2 8.8 10v4.4L12 16.2l3.2-1.8V10L12 8.2Z" />
          </svg>
        </div>
      );

    case "computer-use-linux":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A]/70 bg-[#0B1020] shadow-md ${className}`}
        >
          {/* Desktop with an agent cursor: real window, pointed at a target */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#93C5FD]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="10" rx="1.5" width="16" x="3" y="4.5" />
            <path d="M9 17.5v2.5M6 20h9" />
            <path d="m12 8 5 6-4.6.4-2 4.1L12 8Z" fill="currentColor" stroke="none" />
          </svg>
        </div>
      );

    case "tracekit-box":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E]/60 bg-[#1C1A1C] shadow-md ${className}`}
        >
          {/* Sealed box with a check: every run leaves a verifiable record */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#F3B23B]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M12 3 4.5 7v10L12 21l7.5-4V7L12 3Z" />
            <path d="m8.5 11.8 2.4 2.4 4.6-4.9" />
          </svg>
        </div>
      );

    case "agentjail":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#92400E]/70 bg-[#1A1206] shadow-md ${className}`}
        >
          {/* Shield with a keyhole: policy at the tool-call edge */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#F59E0B]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <path d="M12 3 5 6v5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z" />
            <circle cx="12" cy="10.5" r="1.6" />
            <path d="M12 12.1v3.2" />
          </svg>
        </div>
      );

    case "agent-workspace-linux":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#065F46]/70 bg-[#06231A] shadow-md ${className}`}
        >
          {/* Two offset screens: the agent's hidden desktop behind yours */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#34D399]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
          >
            <rect height="10" rx="2" width="14" x="6" y="4" />
            <path d="M9 14v3M6 20h9" />
            <path d="M3.5 7.5v8a2 2 0 0 0 2 2" strokeDasharray="2 2" />
            <circle cx="16.5" cy="10.5" fill="currentColor" r="1.2" stroke="none" />
          </svg>
        </div>
      );

    case "wirken":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#3B4252]/60 bg-[#10131A] shadow-md ${className}`}
        >
          {/* Switchboard node: gateway lines crossing one controlled box */}
          <svg
            aria-hidden="true"
            className="h-5 w-5 text-[#88C0D0]"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.7"
            viewBox="0 0 24 24"
          >
            <rect height="9" rx="1.5" width="9" x="7.5" y="7.5" />
            <path d="M3 5.5c2 0 2 1.5 0 1.5M3 17c2 0 2 1.5 0 1.5" />
            <path d="M5 6.2h2.5M5 17.8h2.5M16.5 9.5h2.5" />
            <path d="M19 9.5c2 0 2 1.5 0 1.5" />
          </svg>
        </div>
      );

    case "instabox":
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#1E3A8A] bg-[#0B1220] shadow-md ${className}`}
        >
          <Box className="h-5 w-5 text-[#93C5FD]" />
        </div>
      );

    default:
      return (
        <div
          className={`${sizeClasses} flex shrink-0 items-center justify-center border border-[#232f50] font-bold text-[#F2F3FA] shadow-md ${className}`}
          style={logoBg ? { backgroundColor: logoBg } : undefined}
        >
          <span style={logoTextColor ? { color: logoTextColor } : undefined}>
            {name.slice(0, 2).toUpperCase()}
          </span>
        </div>
      );
  }
}
