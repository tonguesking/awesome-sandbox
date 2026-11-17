import {
  AlertCircle,
  Calculator,
  CheckCircle,
  ChevronDown,
  Coins,
  Cpu,
  HardDrive,
  Layers,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import { type ComponentType, useState } from "react";
import {
  calculateCost,
  DEFAULT_RAM_GB_HOURLY_RATE,
  DEFAULT_STORAGE_GB_MONTHLY_RATE,
  DEFAULT_VCPU_HOURLY_RATE,
} from "../lib/calculator";
import { Link } from "../lib/router";
import type { CostCalculatorInput } from "../types/sandbox";

const DEFAULTS: CostCalculatorInput = {
  vCpu: 2,
  memoryGb: 4,
  sandboxesCount: 5,
  activeHoursPerDay: 8,
  activeDaysPerMonth: 22,
  storageGb: 10,
  enableIdleSuspend: true,
  idleSuspendPercentage: 50,
  customVcpuHourlyRate: DEFAULT_VCPU_HOURLY_RATE,
  customRamGbHourlyRate: DEFAULT_RAM_GB_HOURLY_RATE,
  customStorageGbMonthlyRate: DEFAULT_STORAGE_GB_MONTHLY_RATE,
};

const usd = (value: number) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

interface RangeFieldProps {
  icon?: ComponentType<{
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  id: string;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  readout: string;
  scale: [string, string, string];
  step?: number;
  value: number;
}

function RangeField({
  id,
  label,
  icon: Icon,
  value,
  min,
  max,
  step = 1,
  readout,
  scale,
  onChange,
}: RangeFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-xs">
        <label className="flex items-center gap-1.5 font-semibold text-[#F2F3FA]" htmlFor={id}>
          {Icon ? <Icon aria-hidden="true" className="h-3.5 w-3.5 text-[#A78BFA]" /> : null}
          <span>{label}</span>
        </label>
        <span className="rounded border border-[#262C4A] bg-[#1A1E32] px-2 py-0.5 font-bold font-mono text-[#C7CCE2] tabular-nums">
          {readout}
        </span>
      </div>
      <input
        aria-valuetext={readout}
        className="w-full"
        id={id}
        max={max}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
        step={step}
        type="range"
        value={value}
      />
      <div aria-hidden="true" className="flex justify-between text-[#8289AA] text-[11px]">
        <span>{scale[0]}</span>
        <span>{scale[1]}</span>
        <span>{scale[2]}</span>
      </div>
    </div>
  );
}

export function CalculatorPage() {
  const [params, setParams] = useState<CostCalculatorInput>(DEFAULTS);
  const [showAdvancedRates, setShowAdvancedRates] = useState(false);
  const [phoneMinutes, setPhoneMinutes] = useState(1000);

  const phoneRates = [
    {
      name: "Mobilebox (Android)",
      cost: phoneMinutes * 0.01,
      basis: "$0.01/min, billed by the second",
    },
    {
      name: "Genymotion (Android)",
      cost: phoneMinutes * 0.06,
      basis: "$0.06/min pay as you go",
    },
    {
      name: "MobileRun (Developer)",
      cost: 20 + Math.max(0, phoneMinutes - 600) * 0.03,
      basis: "$20/mo includes 600 min, then $0.03/min",
    },
    {
      name: "Mobile Next (Starter)",
      cost: 29 + Math.max(0, phoneMinutes - 200) * 0.15,
      basis: "$29/mo includes 200 min, then $0.15/min",
    },
  ];

  const result = calculateCost(params);
  const set = <K extends keyof CostCalculatorInput>(key: K, value: CostCalculatorInput[K]) =>
    setParams((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="space-y-8 pt-6 pb-20">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-[#262C4A] border-b pb-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 font-semibold text-[#A78BFA] text-xs uppercase tracking-wider">
            <Calculator aria-hidden="true" className="h-4 w-4" />
            <span>Interactive simulator</span>
          </div>
          <h1 className="font-extrabold text-2xl text-[#F2F3FA] tracking-tight md:text-3xl">
            Sandbox cost estimator
          </h1>
          <p className="mt-1 max-w-2xl text-[#9BA1BE] text-sm">
            Simulate monthly infrastructure spend from concurrency, vCPU, memory, and automated idle
            sleep.
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <Link
              className="text-[#A78BFA] transition-colors hover:text-[#C4B5FD]"
              to="/guides/idle-billing-what-a-paused-agent-costs"
            >
              Why idle time dominates the bill
            </Link>
            <span aria-hidden="true" className="text-[#3A4370]">
              ·
            </span>
            <Link className="text-[#9BA1BE] transition-colors hover:text-[#A78BFA]" to="/matrix">
              Compare published idle rules
            </Link>
          </p>
        </div>

        <button
          className="flex cursor-pointer items-center gap-1.5 self-start rounded-lg border border-[#262C4A] bg-[#131625] px-3 py-1.5 font-medium text-[#C7CCE2] text-xs transition-colors hover:border-[#3A4370] hover:bg-[#1A1E32] hover:text-[#F2F3FA] md:self-auto"
          onClick={() => setParams(DEFAULTS)}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Reset defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Inputs */}
        <div className="lg:col-span-7">
          <div className="space-y-6 rounded-[14px] border border-[#262C4A] bg-[#131625] p-5">
            <h2 className="flex items-center gap-2 border-[#262C4A] border-b pb-3 font-bold text-[#F2F3FA] text-sm tracking-tight">
              <Layers aria-hidden="true" className="h-4 w-4 text-[#A78BFA]" />
              <span>Fleet sizing</span>
            </h2>

            <RangeField
              id="sandbox-count"
              label="Concurrent sandboxes"
              max={50}
              min={1}
              onChange={(value) => set("sandboxesCount", value)}
              readout={`${params.sandboxesCount} sandboxes`}
              scale={["1", "25", "50"]}
              value={params.sandboxesCount}
            />

            <div className="grid grid-cols-1 gap-x-5 gap-y-6 pt-1 sm:grid-cols-2">
              <RangeField
                icon={Cpu}
                id="vcpu"
                label="vCPU per sandbox"
                max={16}
                min={1}
                onChange={(value) => set("vCpu", value)}
                readout={`${params.vCpu} vCPU`}
                scale={["1 core", "8 cores", "16 cores"]}
                value={params.vCpu}
              />

              <RangeField
                icon={Zap}
                id="memory"
                label="Memory per sandbox"
                max={32}
                min={1}
                onChange={(value) => set("memoryGb", value)}
                readout={`${params.memoryGb} GB`}
                scale={["1 GB", "16 GB", "32 GB"]}
                value={params.memoryGb}
              />
            </div>

            <RangeField
              icon={HardDrive}
              id="storage"
              label="Storage per sandbox"
              max={100}
              min={0}
              onChange={(value) => set("storageGb", value)}
              readout={`${params.storageGb} GB NVMe`}
              scale={["0 GB (ephemeral)", "50 GB", "100 GB"]}
              step={5}
              value={params.storageGb}
            />

            <div className="grid grid-cols-1 gap-x-5 gap-y-6 border-[#262C4A] border-t pt-5 sm:grid-cols-2">
              <RangeField
                id="hours-per-day"
                label="Active hours per day"
                max={24}
                min={1}
                onChange={(value) => set("activeHoursPerDay", value)}
                readout={`${params.activeHoursPerDay} hrs/day`}
                scale={["1 hr (burst)", "8 hrs (workday)", "24 hrs (24/7)"]}
                value={params.activeHoursPerDay}
              />

              <RangeField
                id="days-per-month"
                label="Active days per month"
                max={31}
                min={1}
                onChange={(value) => set("activeDaysPerMonth", value)}
                readout={`${params.activeDaysPerMonth} days/mo`}
                scale={["10 days", "22 days (business)", "30 days (full)"]}
                value={params.activeDaysPerMonth}
              />
            </div>

            {/* Idle suspend */}
            <div className="space-y-3 rounded-[12px] border border-[#262C4A] bg-[#171B2E] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <label
                    className="flex cursor-pointer items-center gap-1.5 font-bold text-[#F2F3FA] text-xs"
                    htmlFor="idle-suspend"
                  >
                    <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-[#FBBF24]" />
                    <span>Automated idle suspend</span>
                  </label>
                  <p className="mt-1 text-[#9BA1BE] text-[11px] leading-relaxed">
                    MicroVMs suspend to disk after 60s of inactivity, removing idle compute billing.
                  </p>
                </div>
                <input
                  checked={params.enableIdleSuspend}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer"
                  id="idle-suspend"
                  onChange={(event) => set("enableIdleSuspend", event.target.checked)}
                  type="checkbox"
                />
              </div>

              {params.enableIdleSuspend && (
                <div className="pt-1">
                  <RangeField
                    id="idle-ratio"
                    label="Estimated inactivity ratio"
                    max={90}
                    min={10}
                    onChange={(value) => set("idleSuspendPercentage", value)}
                    readout={`${params.idleSuspendPercentage}% idle`}
                    scale={["10%", "50%", "90%"]}
                    step={5}
                    value={params.idleSuspendPercentage}
                  />
                </div>
              )}
            </div>

            {/* Rate overrides */}
            <div className="border-[#262C4A] border-t pt-4">
              <button
                aria-controls="advanced-rates"
                aria-expanded={showAdvancedRates}
                className="flex cursor-pointer items-center gap-1 font-semibold text-[#A78BFA] text-xs hover:text-[#C4B5FD]"
                onClick={() => setShowAdvancedRates(!showAdvancedRates)}
                type="button"
              >
                {showAdvancedRates ? "Hide" : "Customize"} base unit rates
                <ChevronDown
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 transition-transform ${showAdvancedRates ? "rotate-180" : ""}`}
                />
              </button>

              {showAdvancedRates && (
                <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3" id="advanced-rates">
                  <div>
                    <label className="mb-1 block text-[#9BA1BE] text-[11px]" htmlFor="rate-vcpu">
                      vCPU rate ($/hr)
                    </label>
                    <input
                      className="w-full rounded-lg border border-[#262C4A] bg-[#080B1A] px-2 py-1.5 font-mono text-[#F2F3FA] text-xs focus:border-[#6D4DFF] focus:outline-none"
                      id="rate-vcpu"
                      min="0"
                      onChange={(event) => set("customVcpuHourlyRate", Number(event.target.value))}
                      step="0.005"
                      type="number"
                      value={params.customVcpuHourlyRate}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[#9BA1BE] text-[11px]" htmlFor="rate-ram">
                      RAM rate ($/GB-hr)
                    </label>
                    <input
                      className="w-full rounded-lg border border-[#262C4A] bg-[#080B1A] px-2 py-1.5 font-mono text-[#F2F3FA] text-xs focus:border-[#6D4DFF] focus:outline-none"
                      id="rate-ram"
                      min="0"
                      onChange={(event) => set("customRamGbHourlyRate", Number(event.target.value))}
                      step="0.001"
                      type="number"
                      value={params.customRamGbHourlyRate}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[#9BA1BE] text-[11px]" htmlFor="rate-disk">
                      Disk rate ($/GB-mo)
                    </label>
                    <input
                      className="w-full rounded-lg border border-[#262C4A] bg-[#080B1A] px-2 py-1.5 font-mono text-[#F2F3FA] text-xs focus:border-[#6D4DFF] focus:outline-none"
                      id="rate-disk"
                      min="0"
                      onChange={(event) =>
                        set("customStorageGbMonthlyRate", Number(event.target.value))
                      }
                      step="0.01"
                      type="number"
                      value={params.customStorageGbMonthlyRate}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4 lg:sticky lg:top-[84px] lg:col-span-5">
          <div className="space-y-5 rounded-[14px] border border-[#6D4DFF]/45 bg-linear-to-b from-[#151A35] to-[#131625] p-5">
            <div className="space-y-1">
              <div className="font-semibold text-[#A78BFA] text-[11px] uppercase tracking-wider">
                Estimated monthly compute
              </div>
              <div
                aria-live="polite"
                className="flex items-baseline gap-2 font-extrabold font-mono text-4xl text-[#F2F3FA] tracking-tight"
              >
                <span>${usd(result.estimatedCostUsd)}</span>
                <span className="font-normal font-sans text-[#9BA1BE] text-sm">/ month</span>
              </div>
              <div className="font-mono text-[#9BA1BE] text-xs tabular-nums">
                ${usd(result.hourlyTotalUsd)} per active hour across {params.sandboxesCount}{" "}
                sandboxes
              </div>
            </div>

            {result.savingsFromSuspendUsd > 0 && (
              <div className="flex items-center justify-between gap-3 rounded-[12px] border border-[#4ADE80]/25 bg-[#123524] p-3 text-[#86EFAC] text-xs">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle aria-hidden="true" className="h-4 w-4 shrink-0 text-[#4ADE80]" />
                  <span>Idle suspend savings</span>
                </span>
                <span className="font-bold font-mono text-[#F2F3FA] tabular-nums">
                  −${usd(result.savingsFromSuspendUsd)} / mo
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2.5 border-[#262C4A] border-t pt-3 text-xs">
              {[
                {
                  label: "Monthly CPU hours",
                  value: `${Math.round(result.monthlyCpuHours)} hrs`,
                },
                {
                  label: "Monthly RAM hours",
                  value: `${Math.round(result.monthlyRamGbHours)} GB-hrs`,
                },
                {
                  label: "Effective active hours",
                  value: `${Math.round(result.monthlyEffectiveHours)} hrs`,
                },
                {
                  label: "Total storage",
                  value: `${result.monthlyStorageGbTotal} GB`,
                },
              ].map((metric) => (
                <div
                  className="rounded-[12px] border border-[#262C4A] bg-[#080B1A]/80 p-3"
                  key={metric.label}
                >
                  <div className="text-[#9BA1BE] text-[11px]">{metric.label}</div>
                  <div className="mt-0.5 font-bold font-mono text-[#F2F3FA] text-sm tabular-nums">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-[14px] border border-[#262C4A] bg-[#131625] p-5">
            <div className="flex items-center justify-between gap-3 border-[#262C4A] border-b pb-3">
              <h2 className="flex items-center gap-1.5 font-bold text-[#F2F3FA] text-sm">
                <Coins aria-hidden="true" className="h-4 w-4 text-[#A78BFA]" />
                <span>Provider benchmarks</span>
              </h2>
              <span className="font-mono text-[#8289AA] text-[11px] tabular-nums">
                {params.sandboxesCount} × {params.vCpu}C / {params.memoryGb}G
              </span>
            </div>

            <div className="space-y-2.5">
              {result.providerComparisons.map((item) => (
                <div
                  className="rounded-[12px] border border-[#262C4A] bg-[#171B2E] p-3 text-xs"
                  key={item.providerName}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-[#F2F3FA]">{item.providerName}</span>
                    <span className="shrink-0 font-bold font-mono text-[#F2F3FA] tabular-nums">
                      {item.estimatedCostUsd === null
                        ? "Quote only"
                        : `$${usd(item.estimatedCostUsd)} / mo`}
                    </span>
                  </div>
                  <p className="mt-1 text-[#9BA1BE] text-[11px] leading-normal">{item.notes}</p>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 rounded-[12px] border border-[#262C4A] bg-[#080B1A] p-3 text-[#9BA1BE] text-[11px] leading-normal">
              <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#8289AA]" />
              <span>
                Estimates exclude egress and platform base fees. Check official provider pricing
                before deploying production fleets.
              </span>
            </div>
          </div>

          <div className="space-y-3 rounded-[14px] border border-[#262C4A] bg-[#131625] p-5">
            <div className="flex items-center justify-between gap-3 border-[#262C4A] border-b pb-3">
              <h2 className="flex items-center gap-1.5 font-bold text-[#F2F3FA] text-sm">
                <Sparkles aria-hidden="true" className="h-4 w-4 text-[#A78BFA]" />
                <span>Phones use a different meter</span>
              </h2>
              <span className="font-mono text-[#8289AA] text-[11px] tabular-nums">
                {phoneMinutes.toLocaleString()} device-min
              </span>
            </div>
            <p className="text-[#9BA1BE] text-[11px] leading-normal">
              A cloud phone bills per powered-on device-minute, not per vCPU-hour, so the fields
              above do not apply. Set your monthly minutes; rates were read on 15 Nov 2026.
            </p>
            <RangeField
              id="phone-minutes"
              label="Device minutes per month"
              max={5000}
              min={100}
              onChange={setPhoneMinutes}
              readout={`${phoneMinutes.toLocaleString()} min`}
              scale={["100", "2,500", "5,000"]}
              step={100}
              value={phoneMinutes}
            />
            <ul className="space-y-1.5 text-[11px]">
              {phoneRates.map((item) => (
                <li
                  className="flex items-baseline justify-between gap-3 rounded-[10px] border border-[#262C4A] bg-[#171B2E] px-3 py-2"
                  key={item.name}
                >
                  <span className="min-w-0">
                    <span className="block font-semibold text-[#F2F3FA]">{item.name}</span>
                    <span className="block text-[#8289AA]">{item.basis}</span>
                  </span>
                  <span className="shrink-0 font-bold font-mono text-[#F2F3FA] tabular-nums">
                    {`$${usd(item.cost)}`}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-[#8289AA] text-[11px] leading-normal">
              Plan minimums and included minutes are applied; overage is assumed at the published
              rate. Rented iPhones are quote-only and excluded.{" "}
              <Link
                className="text-[#A78BFA] hover:text-[#C4B5FD]"
                to="/guides/cloud-phones-for-agents"
              >
                Read the cloud-phone guide
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
