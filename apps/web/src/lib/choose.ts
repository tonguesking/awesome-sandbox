import type { FilterState, IdleBilling, PauseStateRetention, Sandbox } from "../types/sandbox";
import { licenseGroup } from "../data/licenses";
import { seatBillingUnit } from "./billing";

export type UseCase = "code" | "browser" | "desktop" | "devenv" | "gpu";
export type DeploymentPreference = "cloud" | "self_hosted" | "either";
export type LicensePreference = "any" | "open_source" | "permissive";

export interface ChooserAnswers {
  deployment: DeploymentPreference;
  idlePreference: IdleBilling | "any";
  licensePreference: LicensePreference;
  pausePreference: PauseStateRetention | "any";
  useCase: UseCase;
}

export interface ChooserMatch {
  /** Stated preferences this listing does not meet, phrased as a trade-off. */
  gaps: string[];
  reasons: string[];
  sandbox: Sandbox;
  score: number;
  /** Set for monthly seat plans, whose rate is not a per-hour equivalent. */
  seatUnit: string | null;
}

const IDLE_GAP: Record<IdleBilling, string> = {
  idle_free: "does not charge while idle, but you asked otherwise",
  usage_metered: "charges for active CPU or memory time",
  wall_clock: "bills wall-clock time while the agent waits",
};

const PAUSE_GAP: Record<PauseStateRetention, string> = {
  memory: "keeps memory, but you asked for a different pause state",
  disk: "keeps only disk on pause",
  none: "loses everything on pause",
};

const USE_CASE_WEIGHTS: Record<UseCase, (s: Sandbox) => number> = {
  code: (s) =>
    (s.categories.includes("Code Execution") ? 3 : 0) +
    (s.categories.includes("Code Sandbox") ? 2 : 0) +
    (s.categories.includes("AI Agent Sandbox") ? 2 : 0),
  browser: (s) =>
    (s.capabilities.browser ? 4 : 0) + (s.categories.includes("Browser Sandbox") ? 2 : 0),
  desktop: (s) =>
    (s.capabilities.desktop ? 4 : 0) + (s.categories.includes("Desktop Sandbox") ? 2 : 0),
  devenv: (s) =>
    (s.categories.includes("Cloud Computer") ? 3 : 0) +
    (s.categories.includes("Code Sandbox") ? 2 : 0) +
    (s.capabilities.persistent ? 1 : 0),
  gpu: (s) => (s.capabilities.gpu ? 5 : 0),
};

const USE_CASE_LABEL: Record<UseCase, string> = {
  code: "untrusted code execution",
  browser: "browser automation",
  desktop: "GUI / computer-use agents",
  devenv: "a full development environment",
  gpu: "GPU workloads",
};

/**
 * Rank the catalog against a small set of buying questions.
 * Deliberately transparent: every point added is explained in `reasons`
 * so the result reads as a recommendation, not a black box.
 */
export function rankSandboxes(sandboxes: Sandbox[], answers: ChooserAnswers): ChooserMatch[] {
  return (
    sandboxes
      .map((sandbox) => {
        let score = 0;
        const reasons: string[] = [];
        const gaps: string[] = [];

        const useCaseScore = USE_CASE_WEIGHTS[answers.useCase](sandbox);
        if (useCaseScore > 0) {
          score += useCaseScore;
          reasons.push(`fits ${USE_CASE_LABEL[answers.useCase]}`);
        }

        if (answers.idlePreference !== "any") {
          const actualIdle = sandbox.lifecycle?.idleBilling;
          if (actualIdle === answers.idlePreference) {
            score += 3;
            reasons.push(
              answers.idlePreference === "idle_free"
                ? "no bill while idle"
                : "billing matches your preference",
            );
          } else if (actualIdle) {
            gaps.push(IDLE_GAP[actualIdle]);
          } else {
            gaps.push("idle billing is not published");
          }
        }

        if (answers.pausePreference !== "any") {
          const actualPause = sandbox.lifecycle?.pauseRetains;
          if (actualPause === answers.pausePreference) {
            score += 3;
            reasons.push(
              answers.pausePreference === "memory"
                ? "keeps memory + processes on pause"
                : "pause state matches your preference",
            );
          } else if (actualPause) {
            gaps.push(PAUSE_GAP[actualPause]);
          } else {
            gaps.push("pause retention is not published");
          }
        }

        if (answers.licensePreference !== "any") {
          const group = licenseGroup(sandbox.slug);
          if (answers.licensePreference === "permissive") {
            if (group && group !== "copyleft") {
              score += 2;
              reasons.push("permissive license");
            } else if (group === "copyleft") {
              gaps.push("copyleft license, which you excluded");
            } else {
              gaps.push("no public repository, license unknown");
            }
          } else if (group) {
            score += 2;
            reasons.push("open-source license");
          } else {
            gaps.push("no public repository, license unknown");
          }
        }

        if (answers.deployment === "cloud") {
          if (sandbox.deployment.cloud) {
            score += 2;
            reasons.push("managed cloud");
          } else {
            gaps.push("self-hosted only");
          }
        }
        if (answers.deployment === "self_hosted") {
          if (sandbox.deployment.selfHosted) {
            score += 2;
            reasons.push("self-hostable");
          } else {
            gaps.push("managed cloud only");
          }
        }

        if (sandbox.featured) {
          score += 1;
        }
        score += (sandbox.rating ?? 0) / 5;
        // A listing that misses a stated preference can still be worth showing,
        // but it must not outrank one that meets every answer.
        score -= gaps.length * 2;

        return {
          sandbox,
          score,
          reasons,
          gaps,
          seatUnit: seatBillingUnit(sandbox),
        };
      })
      // Relevance is about what the listing matches; the gap penalty only
      // reorders, so a relevant listing with trade-offs still shows up.
      .filter((match) => match.reasons.length > 0)
      .sort(
        (a, b) => b.score - a.score || (b.sandbox.githubStars ?? 0) - (a.sandbox.githubStars ?? 0),
      )
  );
}

/** Convert a chooser result into the explore catalog so users can keep refining. */
export function answersToFilters(answers: ChooserAnswers): Partial<FilterState> {
  return {
    capabilities:
      answers.useCase === "browser"
        ? ["Browser"]
        : answers.useCase === "desktop"
          ? ["Desktop"]
          : answers.useCase === "gpu"
            ? ["GPU"]
            : [],
    idleBilling: answers.idlePreference === "any" ? [] : [answers.idlePreference],
    pauseStates: answers.pausePreference === "any" ? [] : [answers.pausePreference],
    licenses:
      answers.licensePreference === "permissive"
        ? ["mit", "apache", "bsd", "other"]
        : answers.licensePreference === "open_source"
          ? ["mit", "apache", "bsd", "copyleft", "other"]
          : [],
    deployment:
      answers.deployment === "cloud"
        ? ["Cloud"]
        : answers.deployment === "self_hosted"
          ? ["Self-hosted"]
          : [],
  };
}

/**
 * Deep link that carries the chooser answers into /explore as query params,
 * so "refine in catalog" lands on exactly the shortlist the answers describe.
 */
export function answersToExploreHref(answers: ChooserAnswers): string {
  const filters = answersToFilters(answers);
  const params = new URLSearchParams();
  if (filters.capabilities?.length) {
    params.set("capabilities", filters.capabilities.join(","));
  }
  if (filters.idleBilling?.length) {
    params.set("idle", filters.idleBilling.join(","));
  }
  if (filters.pauseStates?.length) {
    params.set("pause", filters.pauseStates.join(","));
  }
  if (filters.licenses?.length) {
    params.set("license", filters.licenses.join(","));
  }
  if (filters.deployment?.length) {
    params.set("deployment", filters.deployment[0]);
  }
  const query = params.toString();
  return query ? `/explore?${query}` : "/explore";
}
