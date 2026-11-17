import { Gauge, Timer } from "lucide-react";
import { useMemo, useState } from "react";
import { BrandLogo } from "../components/sandbox/BrandLogo";
import { parseBootTimeMs } from "../lib/filter";
import { Link } from "../lib/router";
import { useSandboxes } from "../lib/sandboxContext";
import type { Sandbox } from "../types/sandbox";

interface BenchRow {
  ms: number;
  sandbox: Sandbox;
  /** The other axis, shown as a hint so one row answers both questions. */
  secondaryMs: number;
}

function formatMs(ms: number): string {
  if (ms < 1) {
    return "<1ms";
  }
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  return `${(ms / 1000).toFixed(ms < 10_000 ? 1 : 0)}s`;
}

function bandColor(ms: number): string {
  if (ms <= 200) {
    return "bg-[#22C55E]";
  }
  if (ms <= 1000) {
    return "bg-[#6D4DFF]";
  }
  return "bg-[#F59E0B]";
}

function runtimeLabel(sandbox: Sandbox): string {
  if (sandbox.runtime.firecracker) {
    return "Firecracker";
  }
  if (sandbox.runtime.gvisor) {
    return "gVisor";
  }
  if (sandbox.runtime.docker) {
    return "Docker / VM";
  }
  return sandbox.runtime.other?.[0] ?? "—";
}

const BANDS = [
  { id: "all", label: "All" },
  { id: "instant", label: "< 200ms" },
  { id: "subsecond", label: "< 1s" },
  { id: "standard", label: "1s +" },
] as const;

type BandId = (typeof BANDS)[number]["id"];

const METRICS = [
  { id: "boot", label: "Cold start", hint: "Request to ready" },
  { id: "resume", label: "Wake from pause", hint: "Paused to working" },
] as const;

type MetricId = (typeof METRICS)[number]["id"];

function inBand(ms: number, band: BandId): boolean {
  switch (band) {
    case "instant":
      return ms <= 200;
    case "subsecond":
      return ms <= 1000;
    case "standard":
      return ms > 1000;
    default:
      return true;
  }
}

export function BenchmarksPage() {
  const { sandboxes } = useSandboxes();
  const [band, setBand] = useState<BandId>("all");
  const [metric, setMetric] = useState<MetricId>("boot");

  const rows = useMemo<BenchRow[]>(
    () =>
      sandboxes
        .map((sandbox) => ({
          sandbox,
          ms: parseBootTimeMs(
            metric === "boot" ? sandbox.techSpecs?.bootTime : sandbox.lifecycle?.resumeTime,
          ),
          secondaryMs: parseBootTimeMs(
            metric === "boot" ? sandbox.lifecycle?.resumeTime : sandbox.techSpecs?.bootTime,
          ),
        }))
        .filter((row) => Number.isFinite(row.ms))
        .sort((a, b) => a.ms - b.ms),
    [sandboxes, metric],
  );

  const visible = rows.filter((row) => inBand(row.ms, band));
  const slowest = rows.at(-1)?.ms ?? 1;
  // True median: average the two middle rows for an even count, so an 86-row
  // set reports between row 43 and 44 rather than the 44th value alone.
  const median =
    rows.length === 0
      ? 0
      : rows.length % 2 === 1
        ? rows[Math.floor(rows.length / 2)].ms
        : (rows[rows.length / 2 - 1].ms + rows[rows.length / 2].ms) / 2;
  // Bars scale within the current band: comparing 5ms isolates to each other
  // is more useful than flattening them against an 8-second VM.
  const bandMax = visible.at(-1)?.ms ?? 1;
  const barWidth = (ms: number) =>
    Math.max(4, (Math.log10(ms + 1) / Math.log10(bandMax + 1)) * 100);

  return (
    <div className="space-y-6 pt-6 pb-8">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6D4DFF]/60 bg-[#1E183E] px-3 py-1.5 font-semibold text-[#A78BFA] text-[12px]">
          <Gauge aria-hidden="true" className="h-3.5 w-3.5" />
          <span>{metric === "boot" ? "Cold start benchmarks" : "Wake-up benchmarks"}</span>
        </div>
        <h1 className="font-extrabold text-2xl text-[#F2F3FA] tracking-tight md:text-3xl">
          How fast each sandbox is ready for work
        </h1>
        <p className="max-w-3xl text-[#9BA1BE] text-sm">
          {metric === "boot"
            ? "Boot time decides how many agent steps fit in a minute."
            : "Wake time decides whether a paused agent is cheap or painful to resume."}{" "}
          Bars use a log scale so a 1ms fork and a 12s VM can share one chart. Numbers are the
          vendors&apos; own published figures — {rows.length} of {sandboxes.length} listings publish
          one, the rest are excluded rather than estimated.
        </p>
      </header>

      <p className="max-w-3xl rounded-[12px] border border-[#262C4A] bg-[#131625] px-3.5 py-2.5 text-[#9BA1BE] text-[11px] leading-[17px]">
        <span className="font-semibold text-[#C7CCE2]">What the number covers:</span>{" "}
        {metric === "boot"
          ? "a warm-pool hit, a cold microVM boot and a snapshot restore all get published as “boot time”. A pool hit is faster because the machine already exists; a restore is faster because the memory image already exists. Check which one the vendor measured before ranking them against each other."
          : "wake figures split between pausing in place and restoring from a checkpoint. A very fast wake can mean less state survived, so read it next to the kept-on-pause column on the "}
        {metric === "resume" && (
          <Link className="text-[#A78BFA] hover:text-[#C4B5FD]" to="/matrix">
            pricing matrix
          </Link>
        )}
        {metric === "resume" ? ", not on its own." : null}
      </p>

      <div className="inline-flex rounded-[10px] border border-[#262C4A] bg-[#0F1324] p-1">
        {METRICS.map((option) => {
          const active = metric === option.id;
          return (
            <button
              aria-pressed={active}
              className={`cursor-pointer rounded-[7px] px-3 py-1.5 text-left transition-colors ${
                active ? "bg-[#1E183E] text-[#C4B5FD]" : "text-[#9BA1BE] hover:text-[#F2F3FA]"
              }`}
              key={option.id}
              onClick={() => setMetric(option.id)}
              type="button"
            >
              <span className="block font-semibold text-[12px]">{option.label}</span>
              <span className="block text-[10px] opacity-70">{option.hint}</span>
            </button>
          );
        })}
      </div>

      <dl className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Fastest published",
            value: formatMs(rows[0]?.ms ?? 0),
            sub: rows[0]?.sandbox.name ?? "—",
          },
          {
            label: metric === "boot" ? "Median boot time" : "Median wake time",
            value: formatMs(median),
            sub: `across ${rows.length} listings`,
          },
          {
            label: "Slowest published",
            value: formatMs(slowest),
            sub: rows.at(-1)?.sandbox.name ?? "—",
          },
        ].map((stat) => (
          <div className="rounded-[14px] border border-[#262C4A] bg-[#0F1324] p-4" key={stat.label}>
            <dt className="text-[#8289AA] text-[11px] uppercase tracking-[0.06em]">{stat.label}</dt>
            <dd className="mt-1 font-extrabold font-mono text-[#F2F3FA] text-xl tabular-nums">
              {stat.value}
            </dd>
            <dd className="mt-0.5 truncate text-[#8289AA] text-[11px]">{stat.sub}</dd>
          </div>
        ))}
      </dl>

      <div className="rounded-[14px] border border-[#262C4A] bg-[#0F1324]">
        <div className="flex items-center justify-between border-[#262C4A] border-b px-4 py-3">
          <h2 className="flex items-center gap-2 font-bold text-[#F2F3FA] text-sm">
            <Timer aria-hidden="true" className="h-4 w-4 text-[#A78BFA]" />
            {metric === "boot" ? "Ranked by published cold start" : "Ranked by published wake time"}
          </h2>
          <span className="hidden text-[#8289AA] text-[11px] sm:inline">
            log scale · fastest first
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 border-[#262C4A] border-b px-4 py-2.5">
          {BANDS.map((option) => {
            const count = rows.filter((row) => inBand(row.ms, option.id)).length;
            const active = band === option.id;
            return (
              <button
                aria-pressed={active}
                className={`cursor-pointer rounded-full border px-2.5 py-1 font-medium text-[11px] transition-colors ${
                  active
                    ? "border-[#6D4DFF] bg-[#1E183E] text-[#C4B5FD]"
                    : "border-[#262C4A] bg-[#0F1324] text-[#9BA1BE] hover:border-[#3A4370] hover:text-[#F2F3FA]"
                }`}
                key={option.id}
                onClick={() => setBand(option.id)}
                type="button"
              >
                {option.label}
                <span className="ml-1 font-mono text-[10px] tabular-nums opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {visible.length === 0 && (
          <p className="px-4 py-8 text-center text-[#9BA1BE] text-xs">
            No listing in this band publishes a number. Pick another band.
          </p>
        )}

        <ol>
          {visible.map((row, index) => (
            <li
              className="border-[#262C4A]/60 border-b px-4 py-2.5 last:border-b-0 hover:bg-[#151A35]/40"
              key={row.sandbox.id}
            >
              <div className="flex items-center gap-3">
                <span className="w-6 shrink-0 font-mono text-[#5F6788] text-[11px] tabular-nums">
                  {index + 1}
                </span>
                <Link
                  className="flex min-w-0 shrink-0 items-center gap-2 text-[#F2F3FA] text-xs hover:text-[#A78BFA]"
                  to={`/sandbox/${row.sandbox.slug}`}
                >
                  <BrandLogo
                    logoBg={row.sandbox.logoBg}
                    logoTextColor={row.sandbox.logoTextColor}
                    name={row.sandbox.name}
                    size="sm"
                    slug={row.sandbox.slug}
                  />
                  <span className="w-[150px] truncate font-semibold sm:w-[170px]">
                    {row.sandbox.name}
                  </span>
                </Link>

                <div aria-hidden="true" className="hidden min-w-0 flex-1 sm:block">
                  <div
                    className={`h-1.5 rounded-full ${bandColor(row.ms)}`}
                    style={{ width: `${barWidth(row.ms)}%` }}
                  />
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-3 text-right">
                  <span className="hidden w-24 truncate text-[#8289AA] text-[11px] md:block">
                    {runtimeLabel(row.sandbox)}
                  </span>
                  <span className="w-[68px] text-right">
                    <span className="block font-mono font-semibold text-[#F2F3FA] text-xs tabular-nums">
                      {formatMs(row.ms)}
                    </span>
                    {Number.isFinite(row.secondaryMs) && (
                      <span className="block font-mono text-[#5F6788] text-[10px] tabular-nums">
                        {metric === "boot" ? "wake " : "boot "}
                        {formatMs(row.secondaryMs)}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-[#8289AA] text-[11px]">
        {metric === "resume"
          ? "Wake times are parsed from each vendor's published resume figure; vague answers like Milliseconds are excluded."
          : "Green: ready in under 200ms. Purple: under one second. Amber: second and above."}{" "}
        Bars compare vendors&apos; own claims, measured on different hardware — use them to judge
        order of magnitude, not to split hairs.{" "}
        <Link className="text-[#A78BFA] hover:text-[#C4B5FD]" to="/matrix">
          See what each one costs while it waits
        </Link>{" "}
        ·{" "}
        <Link className="text-[#A78BFA] hover:text-[#C4B5FD]" to="/about#data-policy">
          How we source this data
        </Link>
      </p>
    </div>
  );
}
