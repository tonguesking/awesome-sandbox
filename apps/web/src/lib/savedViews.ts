import type { FilterState } from "../types/sandbox";

export interface SavedView {
  filters: FilterState;
  id: string;
  name: string;
}

const STORAGE_KEY = "awesome-sandbox:saved-views";
const MAX_VIEWS = 8;

function isSavedView(value: unknown): value is SavedView {
  if (!value || typeof value !== "object") {
    return false;
  }
  const view = value as Partial<SavedView>;
  return (
    typeof view.id === "string" &&
    typeof view.name === "string" &&
    Boolean(view.filters) &&
    typeof view.filters === "object"
  );
}

/** Views live in this browser only; storage errors must never break filtering. */
export function loadSavedViews(): SavedView[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isSavedView).slice(0, MAX_VIEWS) : [];
  } catch {
    return [];
  }
}

export function persistSavedViews(views: SavedView[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(views.slice(0, MAX_VIEWS)));
  } catch {
    // Private mode or blocked storage: the current session still works.
  }
}

export function makeSavedView(name: string, filters: FilterState): SavedView {
  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim().slice(0, 40),
    filters,
  };
}
