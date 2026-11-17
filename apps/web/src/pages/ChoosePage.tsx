import { ArrowRight, Compass, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { SandboxCard } from "../components/sandbox/SandboxCard";
import { SEAT_NOTE } from "../lib/billing";
import {
  answersToExploreHref,
  type ChooserAnswers,
  type DeploymentPreference,
  rankSandboxes,
  type UseCase,
} from "../lib/choose";
import { Link } from "../lib/router";
import { useSandboxes } from "../lib/sandboxContext";
import type { IdleBilling, PauseStateRetention } from "../types/sandbox";

const USE_CASES: { id: UseCase; label: string; hint: string }[] = [
  {
    id: "code",
    label: "Code execution",
    hint: "Run untrusted Python, JS or shell from an agent",
  },
  {
    id: "browser",
    label: "Browser automation",
    hint: "Agents that click, scrape and test web apps",
  },
  {
    id: "desktop",
    label: "GUI / computer use",
    hint: "Models driving a real desktop over VNC or stream",
  },
  {
    id: "devenv",
    label: "Dev environment",
    hint: "A persistent machine for a coding agent or teammate",
  },
  {
    id: "gpu",
    label: "GPU workloads",
    hint: "Inference, training or CUDA inside the sandbox",
  },
];

const IDLE_CHOICES: {
  id: ChooserAnswers["idlePreference"];
  label: string;
  hint: string;
}[] = [
  {
    id: "idle_free",
    label: "Zero cost while idle",
    hint: "Agents wait on LLMs often — pause should be free",
  },
  {
    id: "usage_metered",
    label: "Usage-metered",
    hint: "Pay for active CPU or memory, not wall time",
  },
  {
    id: "wall_clock",
    label: "Wall-clock is fine",
    hint: "Simple per-hour billing, predictable for long jobs",
  },
  { id: "any", label: "No preference", hint: "" },
];

const PAUSE_CHOICES: {
  id: ChooserAnswers["pausePreference"];
  label: string;
  hint: string;
}[] = [
  {
    id: "memory",
    label: "Keep memory + processes",
    hint: "Resume mid-task without re-running setup",
  },
  {
    id: "disk",
    label: "Disk only is enough",
    hint: "Files survive; processes restart",
  },
  { id: "none", label: "Ephemeral is fine", hint: "Every task starts clean" },
  { id: "any", label: "No preference", hint: "" },
];

const DEPLOYMENT_CHOICES: {
  id: DeploymentPreference;
  label: string;
  hint: string;
}[] = [
  {
    id: "cloud",
    label: "Managed cloud",
    hint: "Someone else operates the fleet",
  },
  {
    id: "self_hosted",
    label: "Self-hosted",
    hint: "Runs on my own Kubernetes or bare metal",
  },
  { id: "either", label: "Either", hint: "" },
];

const LICENSE_CHOICES: {
  id: ChooserAnswers["licensePreference"];
  label: string;
  hint: string;
}[] = [
  {
    id: "permissive",
    label: "Permissive (MIT / Apache)",
    hint: "Ship it inside a product without opening your code",
  },
  {
    id: "open_source",
    label: "Any open source",
    hint: "Copyleft is fine; redistribution terms settled",
  },
  { id: "any", label: "No preference", hint: "" },
];

const DEFAULTS: ChooserAnswers = {
  useCase: "code",
  idlePreference: "any",
  pausePreference: "any",
  deployment: "either",
  licensePreference: "any",
};

interface OptionGroupProps<T extends string> {
  label: string;
  onChange: (value: T) => void;
  options: { id: T; label: string; hint: string }[];
  value: T;
}

function OptionGroup<T extends string>({ label, options, value, onChange }: OptionGroupProps<T>) {
  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 font-semibold text-[#F2F3FA] text-[13px]">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const active = option.id === value;
          return (
            <button
              aria-pressed={active}
              className={`cursor-pointer rounded-[12px] border p-3 text-left transition-colors ${
                active
                  ? "border-[#6D4DFF] bg-[#1E183E]"
                  : "border-[#262C4A] bg-[#131625] hover:border-[#3A4370] hover:bg-[#1A1E32]"
              }`}
              key={option.id}
              onClick={() => onChange(option.id)}
              type="button"
            >
              <span
                className={`block font-medium text-[12px] ${active ? "text-[#F2F3FA]" : "text-[#C7CCE2]"}`}
              >
                {option.label}
              </span>
              {option.hint && (
                <span className="mt-0.5 block text-[#8289AA] text-[11px] leading-[15px]">
                  {option.hint}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ChoosePage() {
  const { sandboxes } = useSandboxes();
  const [answers, setAnswers] = useState<ChooserAnswers>(DEFAULTS);

  const matches = useMemo(
    () => rankSandboxes(sandboxes, answers).slice(0, 6),
    [sandboxes, answers],
  );

  const set = <K extends keyof ChooserAnswers>(key: K, value: ChooserAnswers[K]) =>
    setAnswers((prev) => ({ ...prev, [key]: value }));

  const idle = answers.idlePreference as IdleBilling | "any";
  const pause = answers.pausePreference as PauseStateRetention | "any";

  return (
    <div className="space-y-8 pt-6 pb-8">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[#6D4DFF]/60 bg-[#1E183E] px-3 py-1.5 font-semibold text-[#A78BFA] text-[12px]">
          <Compass aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Decision guide</span>
        </div>
        <h1 className="font-extrabold text-2xl text-[#F2F3FA] tracking-tight md:text-3xl">
          Find the right sandbox in five questions
        </h1>
        <p className="max-w-2xl text-[#9BA1BE] text-sm">
          The catalog ranks every listing against what you actually need — including the two axes
          most comparison tables skip: what survives a pause, and whether idle time is billed.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <section className="space-y-5 rounded-[14px] border border-[#262C4A] bg-[#0F1324] p-5">
          <OptionGroup
            label="1. What will run inside the sandbox?"
            onChange={(value) => set("useCase", value)}
            options={USE_CASES}
            value={answers.useCase}
          />
          <OptionGroup
            label="2. How should idle time be billed?"
            onChange={(value) => set("idlePreference", value as ChooserAnswers["idlePreference"])}
            options={IDLE_CHOICES}
            value={idle}
          />
          <OptionGroup
            label="3. What must survive a pause?"
            onChange={(value) => set("pausePreference", value as ChooserAnswers["pausePreference"])}
            options={PAUSE_CHOICES}
            value={pause}
          />
          <OptionGroup
            label="4. Where should it run?"
            onChange={(value) => set("deployment", value)}
            options={DEPLOYMENT_CHOICES}
            value={answers.deployment}
          />
          <OptionGroup
            label="5. What license can you accept?"
            onChange={(value) => set("licensePreference", value)}
            options={LICENSE_CHOICES}
            value={answers.licensePreference}
          />

          <button
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#262C4A] bg-[#131625] px-3 py-1.5 text-[#9BA1BE] text-[12px] transition-colors hover:border-[#3A4370] hover:text-[#F2F3FA]"
            onClick={() => setAnswers(DEFAULTS)}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="h-3 w-3" />
            Reset answers
          </button>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-[#F2F3FA] text-[15px]">
              <Sparkles aria-hidden="true" className="h-4 w-4 text-[#FBBF24]" />
              Recommended for you
            </h2>
            <Link
              className="flex items-center gap-1 text-[#A78BFA] text-[12px] hover:text-[#C4B5FD]"
              to={answersToExploreHref(answers)}
            >
              Refine these filters in catalog
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {matches.map((match) => (
              <div className="space-y-1.5" key={match.sandbox.id}>
                <SandboxCard sandbox={match.sandbox} viewMode="list" />
                <p className="px-1 text-[#8289AA] text-[11px]">
                  Why: {match.reasons.slice(0, 3).join(" · ") || "matches the catalog baseline"}
                </p>
                {match.seatUnit && (
                  <p className="flex flex-wrap items-center gap-1.5 px-1 text-[#9BA1BE] text-[11px]">
                    <span className="rounded border border-[#3A4370] bg-[#151A35] px-1 py-0.5 text-[9px] uppercase tracking-[0.04em]">
                      {match.seatUnit}
                    </span>
                    {SEAT_NOTE}.
                  </p>
                )}
                {match.gaps.length > 0 && (
                  <p className="px-1 text-[#D9A44A] text-[11px]">
                    Trade-off: {match.gaps.slice(0, 2).join(" · ")}
                  </p>
                )}
              </div>
            ))}
            {matches.length === 0 && (
              <p className="rounded-[14px] border border-[#262C4A] bg-[#131625] p-6 text-center text-[#9BA1BE] text-xs">
                No listing satisfies every answer. Relax one constraint to see options.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
