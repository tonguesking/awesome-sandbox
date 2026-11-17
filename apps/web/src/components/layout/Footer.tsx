import { X } from "lucide-react";
import { Link } from "../../lib/router";
import { SiteMark } from "./SiteMark";

/** GitHub's octocat mark, inline because lucide dropped brand icons. */
function GithubMark() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 w-full border-[#262C4A] border-t bg-[#080B1A] py-6 text-[#9BA1BE] text-xs">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-9">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Brand */}
          <Link
            className="flex shrink-0 items-center gap-2 font-bold text-[#F2F3FA] text-[14px]"
            to="/"
          >
            <SiteMark size="sm" />
            <span>awesome-sandbox.dev</span>
          </Link>

          {/* Center tagline */}
          <div className="text-center text-[#8289AA] text-[11px]">
            A curated directory for the sandbox infrastructure ecosystem.
          </div>

          {/* Right links & socials */}
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-5 text-[#9BA1BE] text-xs">
            <Link className="transition-colors hover:text-[#F2F3FA]" to="/about">
              About
            </Link>
            <Link className="transition-colors hover:text-[#F2F3FA]" to="/explore">
              Explore
            </Link>
            <Link className="transition-colors hover:text-[#F2F3FA]" to="/guides">
              Guides
            </Link>
            <Link className="transition-colors hover:text-[#F2F3FA]" to="/calculator">
              Cost Estimator
            </Link>
            <Link className="transition-colors hover:text-[#F2F3FA]" to="/submit">
              Contribute
            </Link>

            <div className="flex items-center gap-3 pl-1">
              <a
                aria-label="GitHub repository"
                className="text-[#9BA1BE] transition-colors hover:text-[#F2F3FA]"
                href="https://github.com/tonguesking/awesome-sandbox"
                rel="noopener noreferrer"
                target="_blank"
              >
                <GithubMark />
              </a>
              <a
                aria-label="Search mentions of awesome-sandbox on X"
                className="text-[#9BA1BE] transition-colors hover:text-[#F2F3FA]"
                href="https://x.com/search?q=awesome-sandbox&f=live"
                rel="noopener noreferrer"
                target="_blank"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
