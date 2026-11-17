import { ArrowRight, Scale, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useRouter } from "../../lib/router";
import { useSandboxes } from "../../lib/sandboxContext";

const IDLE_DOT: Record<string, { color: string; label: string }> = {
  idle_free: { color: "bg-[#22C55E]", label: "Zero idle billing" },
  usage_metered: { color: "bg-[#6D4DFF]", label: "Usage-metered while idle" },
  wall_clock: { color: "bg-[#F59E0B]", label: "Bills wall-clock while idle" },
};

export function CompareFloatingBar() {
  const { compareList, removeFromCompare, clearCompare, getSandboxBySlug } = useSandboxes();
  const { route, navigate } = useRouter();
  const barRef = useRef<HTMLElement | null>(null);
  const visible = compareList.length > 0 && route.path !== "/compare";

  // The dock is fixed, so the page has to reserve room for it or the last
  // row of cards sits underneath. Body padding follows the dock's real height,
  // which changes between the phone and desktop layouts.
  useEffect(() => {
    if (!visible) {
      return;
    }
    const reserve = () => {
      const height = barRef.current?.offsetHeight ?? 0;
      document.body.style.paddingBottom = `${height + 28}px`;
    };
    reserve();
    const observer = new ResizeObserver(reserve);
    if (barRef.current) {
      observer.observe(barRef.current);
    }
    window.addEventListener("resize", reserve);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", reserve);
      document.body.style.paddingBottom = "";
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <aside
      aria-label="Comparison dock"
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[calc(100vw-2rem)] max-w-[92vw] -translate-x-1/2 items-center gap-2.5 rounded-[14px] border border-[#6D4DFF]/50 bg-[#131625]/95 px-3 py-2.5 shadow-[0_18px_40px_-12px_rgba(3,5,16,0.9)] backdrop-blur-xl sm:w-auto sm:gap-4 sm:px-4"
      data-compare-tray
      ref={barRef}
    >
      <div className="flex shrink-0 items-center gap-2 font-semibold text-[#A78BFA] text-xs">
        <Scale aria-hidden="true" className="h-4 w-4 text-[#A78BFA]" />
        <span className="hidden sm:inline">Compare</span>
        <span
          aria-live="polite"
          className="rounded bg-[#1E183E] px-1.5 py-0.5 font-mono text-[#A78BFA] text-[11px] tabular-nums"
        >
          {compareList.length}/4
        </span>
      </div>

      <div className="scrollbar-none flex max-w-[42vw] items-center gap-1.5 overflow-x-auto py-0.5 sm:max-w-[min(56vw,560px)]">
        {compareList.map((slug) => {
          const item = getSandboxBySlug(slug);
          return (
            <div
              className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#262C4A] bg-[#1A1E32] px-2.5 py-1 text-[#F2F3FA] text-xs"
              key={slug}
            >
              {/* Idle-billing marker travels with the candidate, so the dock
                  answers "which of these is cheap to leave paused" on its own. */}
              <span
                aria-label={
                  IDLE_DOT[item?.lifecycle?.idleBilling ?? ""]?.label ??
                  "Idle billing not published"
                }
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                  IDLE_DOT[item?.lifecycle?.idleBilling ?? ""]?.color ?? "bg-[#3A4370]"
                }`}
                role="img"
              />
              <span className="max-w-[130px] truncate font-medium">{item?.name || slug}</span>
              <button
                aria-label={`Remove ${item?.name || slug} from compare`}
                className="cursor-pointer p-0.5 text-[#9BA1BE] hover:text-[#F2F3FA]"
                onClick={() => removeFromCompare(slug)}
                type="button"
              >
                <X aria-hidden="true" className="h-3 w-3" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          className="flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full bg-[#6D4DFF] px-3.5 py-1.5 font-semibold text-white text-xs transition-colors hover:bg-[#7B5EFF]"
          onClick={() => navigate(`/compare?items=${compareList.join(",")}`)}
          type="button"
        >
          <span>Compare Now</span>
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </button>

        <button
          aria-label="Clear comparison list"
          className="cursor-pointer p-1 text-[#9BA1BE] hover:text-[#F2F3FA]"
          onClick={clearCompare}
          type="button"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
