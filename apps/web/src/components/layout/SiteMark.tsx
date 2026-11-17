interface SiteMarkProps {
  className?: string;
  size?: "sm" | "md";
}

const SIZES = {
  sm: { tile: "w-6 h-6 rounded-md", icon: "w-3.5 h-3.5" },
  md: { tile: "w-7 h-7 rounded-lg", icon: "w-4 h-4" },
} as const;

export function SiteMark({ size = "md", className = "" }: SiteMarkProps) {
  const s = SIZES[size];

  return (
    <div
      aria-hidden="true"
      className={`${s.tile} flex shrink-0 items-center justify-center bg-[#6D4DFF] shadow-[0_2px_12px_rgba(109,77,255,0.45)] ${className}`}
    >
      <svg
        aria-hidden="true"
        className={`${s.icon} text-[#F2F3FA]`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" fill="rgba(255,255,255,0.22)" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </div>
  );
}
