import { AppWindow, Bot, CodeXml, ShieldCheck } from "lucide-react";

export function HeroIsometricArt() {
  return (
    <div className="pointer-events-none relative flex h-[210px] w-full max-w-[460px] select-none items-center justify-center sm:h-[270px] lg:h-[320px]">
      {/* Soft Violet Radial Atmospheric Glow */}
      <div
        className="absolute top-1/2 left-1/2 -z-10 h-[280px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(109, 77, 255, 0.55) 0%, rgba(43, 59, 255, 0.16) 48%, rgba(8, 11, 26, 0) 100%)",
          filter: "blur(26px)",
        }}
      />

      {/* Crisp Isometric Indigo/Cobalt 3D Cube SVG */}
      <svg aria-hidden="true" className="h-full w-full overflow-visible" viewBox="0 0 460 320">
        <defs>
          <linearGradient id="cubeTop" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#6D4DFF" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#3B42F6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1E278E" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="cubeLeft" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#1D268A" />
            <stop offset="100%" stopColor="#090D3D" />
          </linearGradient>

          <linearGradient id="cubeRight" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#2E36B8" />
            <stop offset="100%" stopColor="#0E1257" />
          </linearGradient>

          <linearGradient id="edgeViolet" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="screenRecess" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#080B1A" />
            <stop offset="100%" stopColor="#121738" />
          </linearGradient>
        </defs>

        {/* Subtle Floor Concentric Rings */}
        <ellipse
          cx="230"
          cy="258"
          fill="none"
          rx="132"
          ry="42"
          stroke="#4F46E5"
          strokeDasharray="5 5"
          strokeOpacity="0.22"
          strokeWidth="1"
        />
        <ellipse
          cx="230"
          cy="258"
          fill="none"
          rx="86"
          ry="26"
          stroke="#6D4DFF"
          strokeOpacity="0.32"
          strokeWidth="1"
        />

        {/* 3D Isometric Cube */}
        <g>
          {/* Left Face */}
          <polygon
            fill="url(#cubeLeft)"
            points="132,126 230,182 230,270 132,214"
            stroke="url(#edgeViolet)"
            strokeLinejoin="round"
            strokeWidth="1.25"
          />

          {/* Right Face */}
          <polygon
            fill="url(#cubeRight)"
            points="230,182 328,126 328,214 230,270"
            stroke="url(#edgeViolet)"
            strokeLinejoin="round"
            strokeWidth="1.25"
          />

          {/* Subtle Side Architectural Lines */}
          <line
            stroke="#A78BFA"
            strokeOpacity="0.14"
            strokeWidth="1"
            x1="164"
            x2="164"
            y1="160"
            y2="218"
          />
          <line
            stroke="#A78BFA"
            strokeOpacity="0.14"
            strokeWidth="1"
            x1="196"
            x2="196"
            y1="178"
            y2="236"
          />
          <line
            stroke="#A78BFA"
            strokeOpacity="0.16"
            strokeWidth="1"
            x1="264"
            x2="264"
            y1="178"
            y2="236"
          />
          <line
            stroke="#A78BFA"
            strokeOpacity="0.16"
            strokeWidth="1"
            x1="296"
            x2="296"
            y1="160"
            y2="218"
          />

          {/* Top Face */}
          <polygon
            fill="url(#cubeTop)"
            points="230,70 328,126 230,182 132,126"
            stroke="url(#edgeViolet)"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />

          {/* Recessed Terminal Window on Top Face */}
          <polygon
            fill="url(#screenRecess)"
            points="230,94 294,130 230,166 166,130"
            stroke="#8B75FF"
            strokeOpacity="0.55"
            strokeWidth="1.2"
          />

          {/* Terminal Prompt >_ in Isometric Plane */}
          <polyline
            fill="none"
            points="206,126 218,132 206,138"
            stroke="#C4B5FD"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <line
            stroke="#A78BFA"
            strokeLinecap="round"
            strokeWidth="3"
            x1="226"
            x2="244"
            y1="142"
            y2="150"
          />

          {/* Crisp Center Edge Highlight */}
          <line
            stroke="#C4B5FD"
            strokeLinecap="round"
            strokeOpacity="0.65"
            strokeWidth="1.5"
            x1="230"
            x2="230"
            y1="182"
            y2="270"
          />
        </g>
      </svg>

      {/* 4 Symmetric Architectural Icon Tiles (#1A2150 + #3A4390 outline + #A9B3FF icon) */}
      <div
        aria-hidden="true"
        className="absolute top-[12px] left-[34px] flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#3A4390] bg-[#1A2150]/95 text-[#A9B3FF] shadow-[0_8px_24px_rgba(8,11,26,0.65)]"
      >
        <Bot className="h-6 w-6" />
      </div>

      <div
        aria-hidden="true"
        className="absolute top-[28px] right-[34px] flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#3A4390] bg-[#1A2150]/95 text-[#A9B3FF] shadow-[0_8px_24px_rgba(8,11,26,0.65)]"
      >
        <AppWindow className="h-6 w-6" />
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-[32px] left-[34px] flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#3A4390] bg-[#1A2150]/95 text-[#A9B3FF] shadow-[0_8px_24px_rgba(8,11,26,0.65)]"
      >
        <CodeXml className="h-6 w-6" />
      </div>

      <div
        aria-hidden="true"
        className="absolute right-[34px] bottom-[24px] flex h-14 w-14 items-center justify-center rounded-[14px] border border-[#3A4390] bg-[#1A2150]/95 text-[#A9B3FF] shadow-[0_8px_24px_rgba(8,11,26,0.65)]"
      >
        <ShieldCheck className="h-6 w-6" />
      </div>
    </div>
  );
}
