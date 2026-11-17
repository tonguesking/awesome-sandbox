export const DEFAULT_SECTION_STATE: Record<string, boolean> = {
  category: true,
  isolation: true,
  runtime: true,
  bootSpeed: true,
  resumeSpeed: false,
  operatingSystem: false,
  billingShape: false,
  pricing: false,
  lifecycle: false,
  status: false,
  productType: false,
  license: false,
  compliance: false,
  sdk: false,
  deployment: false,
  features: true,
};

const STORAGE_KEY = "awesome-sandbox:filter-sections";

/**
 * Which filter sections a visitor leaves open is a personal habit, so it lives
 * in this browser. A broken or blocked store must fall back to the defaults.
 */
export function loadSectionState(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    const state: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (key in DEFAULT_SECTION_STATE && typeof value === "boolean") {
        state[key] = value;
      }
    }
    return state;
  } catch {
    return {};
  }
}

export function persistSectionState(state: Record<string, boolean>): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode or blocked storage: sections still toggle for this session.
  }
}
