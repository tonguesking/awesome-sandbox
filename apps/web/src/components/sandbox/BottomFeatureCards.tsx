import { ArrowRight, BookOpen, Calculator, Check, Scale } from "lucide-react";
import { Link } from "../../lib/router";

export function BottomFeatureCards() {
  return (
    <section className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-3">
      {/* 1. Compare Sandboxes Card */}
      <div className="flex flex-col justify-between gap-4 rounded-[14px] border border-[#2E3560] bg-[#151A35] p-[18px] transition-colors duration-150 hover:border-[#444E8C]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#F2F3FA] text-[15px]">
              <Scale className="h-4 w-4 text-[#A78BFA]" />
              <span>Compare Sandboxes</span>
            </div>
            <p className="text-[#9BA1BE] text-[12px] leading-[18px]">
              Side-by-side comparison of features, pricing and technical differences.
            </p>
          </div>

          {/* Crisp Visual Preview */}
          <div className="hidden shrink-0 items-center gap-1 rounded-[12px] border border-[#262C4A] bg-[#0D1126] p-2 sm:flex">
            <div className="flex h-12 w-10 flex-col justify-between rounded-md border border-[#262C4A] bg-[#1A1E32] p-1.5">
              <Check className="h-2.5 w-2.5 text-[#A78BFA]" />
              <div className="h-1 w-full rounded bg-[#6D4DFF]/50" />
              <div className="h-1 w-3/4 rounded bg-[#6D4DFF]/30" />
            </div>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6D4DFF] font-bold text-[#F2F3FA] text-[8px]">
              VS
            </span>
            <div className="flex h-12 w-10 flex-col justify-between rounded-md border border-[#262C4A] bg-[#1A1E32] p-1.5">
              <Check className="h-2.5 w-2.5 text-[#4ADE80]" />
              <div className="h-1 w-full rounded bg-[#A78BFA]/50" />
              <div className="h-1 w-2/3 rounded bg-[#A78BFA]/30" />
            </div>
          </div>
        </div>

        <div>
          <Link
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#6D4DFF] px-3.5 py-2 font-semibold text-[#F2F3FA] text-[12px] transition-colors hover:bg-[#7B5EFF]"
            to="/compare"
          >
            <span>Start Comparing</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Sandbox Cost Estimator Card */}
      <div className="flex flex-col justify-between gap-4 rounded-[14px] border border-[#2E3560] bg-[#151A35] p-[18px] transition-colors duration-150 hover:border-[#444E8C]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#F2F3FA] text-[15px]">
              <Calculator className="h-4 w-4 text-[#A78BFA]" />
              <span>Sandbox Cost Estimator</span>
            </div>
            <p className="text-[#9BA1BE] text-[12px] leading-[18px]">
              Estimate your monthly cost based on your usage requirements.
            </p>
          </div>

          <div className="hidden shrink-0 flex-col items-end gap-1.5 rounded-[12px] border border-[#262C4A] bg-[#0D1126] p-2 sm:flex">
            <span className="font-mono font-semibold text-[#F2F3FA] text-[10px] tabular-nums">
              $428 / mo
            </span>
            <div className="flex h-7 items-end gap-1">
              <div className="h-2.5 w-2.5 rounded-t bg-[#2E3560]" />
              <div className="h-4 w-2.5 rounded-t bg-[#4B3FA3]" />
              <div className="h-6 w-2.5 rounded-t bg-[#6D4DFF]" />
              <div className="h-7 w-2.5 rounded-t bg-[#A78BFA]" />
            </div>
          </div>
        </div>

        <div>
          <Link
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#6D4DFF] px-3.5 py-2 font-semibold text-[#F2F3FA] text-[12px] transition-colors hover:bg-[#7B5EFF]"
            to="/calculator"
          >
            <span>Try Estimator</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. Learn & Explore Card */}
      <div className="flex flex-col justify-between gap-4 rounded-[14px] border border-[#2E3560] bg-[#151A35] p-[18px] transition-colors duration-150 hover:border-[#444E8C]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#F2F3FA] text-[15px]">
              <BookOpen className="h-4 w-4 text-[#A78BFA]" />
              <span>Learn &amp; Explore</span>
            </div>
            <p className="text-[#9BA1BE] text-[12px] leading-[18px]">
              In-depth guides, tutorials and technical insights.
            </p>
          </div>

          <div className="hidden shrink-0 items-center justify-center rounded-[12px] border border-[#262C4A] bg-[#0D1126] p-2 sm:flex">
            <div className="flex h-12 w-16 flex-col justify-between rounded-md border border-[#262C4A] bg-[#1A1E32] p-2">
              <div className="h-1 w-full rounded bg-[#6D4DFF]/80" />
              <div className="h-1 w-4/5 rounded bg-[#9BA1BE]/40" />
              <div className="h-1 w-2/3 rounded bg-[#A78BFA]/60" />
            </div>
          </div>
        </div>

        <div>
          <Link
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#6D4DFF] px-3.5 py-2 font-semibold text-[#F2F3FA] text-[12px] transition-colors hover:bg-[#7B5EFF]"
            to="/guides"
          >
            <span>Browse Guides</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
