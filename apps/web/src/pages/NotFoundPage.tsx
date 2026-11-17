import { ArrowLeft, Compass, Search } from "lucide-react";
import { Link } from "../lib/router";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6 py-24 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#262C4A] bg-[#1A1E32] text-[#A78BFA]">
        <Compass aria-hidden="true" className="h-5 w-5" />
      </div>

      <div className="space-y-2">
        <h1 className="font-extrabold text-2xl text-[#F2F3FA] tracking-tight">
          This page does not exist
        </h1>
        <p className="text-[#9BA1BE] text-sm leading-relaxed">
          The address may be mistyped, or the sandbox listing it pointed to has been renamed.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          className="inline-flex items-center gap-1.5 rounded-full border border-[#262C4A] bg-[#1A1E32] px-4 py-2 font-semibold text-[#F2F3FA] text-xs transition-colors hover:border-[#3A4370] hover:bg-[#222742]"
          to="/"
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Back home</span>
        </Link>
        <Link
          className="inline-flex items-center gap-1.5 rounded-full bg-[#6D4DFF] px-4 py-2 font-semibold text-white text-xs transition-colors hover:bg-[#7B5EFF]"
          to="/explore"
        >
          <Search aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Explore the catalog</span>
        </Link>
      </div>
    </div>
  );
}
