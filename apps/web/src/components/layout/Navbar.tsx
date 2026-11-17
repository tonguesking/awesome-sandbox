import { ChevronDown, GitBranch, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useRouter } from "../../lib/router";
import { useSandboxes } from "../../lib/sandboxContext";
import { SiteMark } from "./SiteMark";

const EXPLORE_LINKS = [
  { to: "/explore", label: "All Sandboxes (Full Catalog)" },
  { to: "/matrix", label: "Pricing & Lifecycle Matrix" },
  { to: "/benchmarks", label: "Cold Start Benchmarks" },
  { to: "/explore?category=AI+Agent+Sandbox", label: "AI Agent Sandboxes" },
  { to: "/explore?category=MicroVM", label: "MicroVM Hypervisors" },
  { to: "/explore?category=Browser+Sandbox", label: "Browser Sandboxes" },
  { to: "/explore?category=Desktop+Sandbox", label: "Desktop & Computer Use" },
  { to: "/explore?category=Self-hosted", label: "Self-hosted & Open Source" },
];

export function Navbar() {
  const { route } = useRouter();
  const { compareList } = useSandboxes();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);

  const exploreActive = route.path === "/explore" || route.path === "/sandbox/:slug";

  // Close transient navigation when the destination changes.
  useEffect(() => {
    setMobileMenuOpen(false);
    setExploreDropdownOpen(false);
  }, [route.path]);

  // Dismiss the dropdown from anywhere: Escape restores focus, outside click just closes.
  useEffect(() => {
    if (!exploreDropdownOpen) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!exploreRef.current?.contains(event.target as Node)) {
        setExploreDropdownOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExploreDropdownOpen(false);
        exploreRef.current?.querySelector("button")?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [exploreDropdownOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const navLinkClass = (active: boolean) =>
    `transition-colors whitespace-nowrap shrink-0 py-1 ${
      active ? "text-[#F2F3FA] font-medium" : "text-[#9BA1BE] hover:text-[#F2F3FA]"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-[#262C4A]/60 border-b bg-[#080B1A]/90 backdrop-blur-md">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:gap-8 sm:px-6 lg:px-9">
        {/* Left zone: brand + primary navigation */}
        <div className="flex min-w-0 items-center gap-7">
          <Link
            className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[#F2F3FA] transition-colors hover:text-white"
            to="/"
          >
            <SiteMark />
            <span className="font-semibold text-[#F2F3FA] text-[15px] tracking-tight">
              awesome-sandbox.dex
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 font-normal text-[#9BA1BE] text-[14px] md:flex"
          >
            <div
              className="relative"
              onMouseEnter={() => setExploreDropdownOpen(true)}
              onMouseLeave={() => setExploreDropdownOpen(false)}
              ref={exploreRef}
            >
              <button
                aria-controls="explore-menu"
                aria-expanded={exploreDropdownOpen}
                className={`flex cursor-pointer items-center gap-1 ${navLinkClass(exploreActive)}`}
                onClick={() => setExploreDropdownOpen((open) => !open)}
                type="button"
              >
                <span>Explore</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 transition-transform duration-150 ${
                    exploreDropdownOpen ? "rotate-180 text-[#A78BFA]" : "text-[#8289AA]"
                  }`}
                />
              </button>

              {exploreDropdownOpen && (
                <div
                  className="absolute top-full left-0 z-50 w-60 pt-1.5"
                  id="explore-menu"
                  onMouseEnter={() => setExploreDropdownOpen(true)}
                >
                  <div className="rounded-[14px] border border-[#262C4A] bg-[#131625] py-1.5 shadow-[0_18px_40px_-12px_rgba(3,5,16,0.9)]">
                    {EXPLORE_LINKS.map((item, index) => (
                      <Link
                        className={`block px-4 py-2 transition-colors hover:bg-[#1A1E32] hover:text-[#F2F3FA] ${
                          index === 0
                            ? "font-medium text-[#F2F3FA] text-xs"
                            : "text-[#9BA1BE] text-xs"
                        }`}
                        key={item.to}
                        onClick={() => setExploreDropdownOpen(false)}
                        to={item.to}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              aria-current={route.path === "/choose" ? "page" : undefined}
              className={navLinkClass(route.path === "/choose")}
              to="/choose"
            >
              Choose
            </Link>

            <Link
              aria-current={route.path === "/compare" ? "page" : undefined}
              className={`flex items-center gap-1.5 ${navLinkClass(route.path === "/compare")}`}
              to="/compare"
            >
              <span>Compare</span>
              {compareList.length > 0 && (
                <span className="font-mono text-[#A78BFA] text-[11px] tabular-nums">
                  ({compareList.length})
                </span>
              )}
            </Link>

            <Link
              aria-current={route.path.startsWith("/guides") ? "page" : undefined}
              className={navLinkClass(route.path.startsWith("/guides"))}
              to="/guides"
            >
              Guides
            </Link>

            <Link
              aria-current={route.path === "/about" ? "page" : undefined}
              className={navLinkClass(route.path === "/about")}
              to="/about"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Right zone: source link + primary action */}
        <div className="flex shrink-0 items-center gap-3">
          <a
            className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#262C4A] bg-[#1A1E32] px-3 py-1.5 font-normal text-[#F2F3FA] text-[13px] transition-colors hover:border-[#3A4370] hover:bg-[#222742] sm:flex"
            href="https://github.com/tonguesking/awesome-sandbox"
            rel="noopener noreferrer"
            target="_blank"
            title="awesome-sandbox.dex on GitHub"
          >
            <GitBranch aria-hidden="true" className="h-3.5 w-3.5 text-[#9BA1BE]" />
            <span>GitHub</span>
          </a>

          <Link
            className="hidden shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-full bg-[#6D4DFF] px-4 py-2 font-semibold text-[13px] text-white shadow-[0_2px_14px_rgba(109,77,255,0.35)] transition-colors active:scale-[0.96] hover:bg-[#7B5EFF] active:bg-[#5D3DF0] sm:flex"
            to="/submit"
          >
            Submit Product
          </Link>

          <button
            aria-controls="mobile-nav"
            aria-expanded={mobileMenuOpen}
            className="-mr-2 cursor-pointer rounded-lg p-2 text-[#9BA1BE] transition-colors hover:bg-[#131625] hover:text-[#F2F3FA] md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
          >
            <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
            {mobileMenuOpen ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Mobile"
          className="space-y-1 border-[#262C4A] border-t bg-[#080B1A] px-4 pt-3 pb-6 md:hidden"
          id="mobile-nav"
        >
          <Link
            className="block py-2.5 font-medium text-[#F2F3FA] text-sm hover:text-[#A78BFA]"
            to="/explore"
          >
            Explore Sandboxes
          </Link>
          <Link
            className="block py-2.5 font-medium text-[#9BA1BE] text-sm hover:text-[#F2F3FA]"
            to="/matrix"
          >
            Pricing &amp; lifecycle
          </Link>
          <Link
            className="block py-2.5 font-medium text-[#9BA1BE] text-sm hover:text-[#F2F3FA]"
            to="/benchmarks"
          >
            Cold start benchmarks
          </Link>
          <Link
            className="block py-2.5 font-medium text-[#9BA1BE] text-sm hover:text-[#F2F3FA]"
            to="/choose"
          >
            Find your sandbox
          </Link>
          <Link
            className="flex items-center justify-between py-2.5 font-medium text-[#9BA1BE] text-sm hover:text-[#F2F3FA]"
            to="/compare"
          >
            <span>Compare</span>
            {compareList.length > 0 && (
              <span className="font-mono text-[#A78BFA] text-xs">
                {compareList.length} selected
              </span>
            )}
          </Link>
          <Link
            className="block py-2.5 font-medium text-[#9BA1BE] text-sm hover:text-[#F2F3FA]"
            to="/calculator"
          >
            Cost Estimator
          </Link>
          <Link
            className="block py-2.5 font-medium text-[#9BA1BE] text-sm hover:text-[#F2F3FA]"
            to="/guides"
          >
            Guides
          </Link>
          <Link
            className="block py-2.5 font-medium text-[#9BA1BE] text-sm hover:text-[#F2F3FA]"
            to="/about"
          >
            About
          </Link>
          <a
            className="flex items-center gap-2 py-2.5 font-medium text-[#9BA1BE] text-sm hover:text-[#F2F3FA]"
            href="https://github.com/tonguesking/awesome-sandbox"
            rel="noopener"
            target="_blank"
          >
            <GitBranch aria-hidden="true" className="h-4 w-4" />
            <span>GitHub</span>
          </a>
          <Link
            className="mt-3 flex items-center justify-center rounded-full bg-[#6D4DFF] px-4 py-2.5 font-semibold text-sm text-white hover:bg-[#7B5EFF]"
            to="/submit"
          >
            Submit Product
          </Link>
        </nav>
      )}
    </header>
  );
}
