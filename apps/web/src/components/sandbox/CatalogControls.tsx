import { Grid, List } from "lucide-react";
import type { FilterState } from "../../types/sandbox";

const SORT_OPTIONS: { value: FilterState["sortBy"]; label: string }[] = [
  { value: "popularity", label: "Popularity" },
  { value: "stars", label: "GitHub Stars" },
  { value: "boot_speed", label: "Fastest Cold Start" },
  { value: "resume_speed", label: "Fastest Resume" },
  { value: "name", label: "Alphabetical" },
  { value: "recently_added", label: "Recently Added" },
  { value: "recently_updated", label: "Recently Updated" },
  { value: "rating", label: "Highest rated" },
  { value: "open_source", label: "Open Source First" },
  { value: "documented", label: "Most documented" },
];

interface CatalogControlsProps {
  idPrefix: string;
  onSortChange: (sortBy: FilterState["sortBy"]) => void;
  onViewModeChange: (viewMode: FilterState["viewMode"]) => void;
  sortBy: FilterState["sortBy"];
  viewMode: FilterState["viewMode"];
}

export function CatalogControls({
  idPrefix,
  sortBy,
  viewMode,
  onSortChange,
  onViewModeChange,
}: CatalogControlsProps) {
  const sortId = `${idPrefix}-sort`;

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-center gap-2 text-[#9BA1BE] text-[12px]">
        <label className="hidden whitespace-nowrap sm:inline" htmlFor={sortId}>
          Sort by:
        </label>
        <select
          aria-label="Sort by"
          className="cursor-pointer rounded-lg border border-[#262C4A] bg-[#131625] px-2.5 py-1.5 text-[#F2F3FA] text-[12px] hover:border-[#3A4370] focus:border-[#6D4DFF] focus:outline-none"
          id={sortId}
          onChange={(event) => onSortChange(event.target.value as FilterState["sortBy"])}
          value={sortBy}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div
        aria-label="Result layout"
        className="flex items-center rounded-lg border border-[#262C4A] bg-[#131625] p-0.5"
        role="group"
      >
        <button
          aria-label="Grid view"
          aria-pressed={viewMode === "grid"}
          className={`cursor-pointer rounded-md p-1.5 transition-colors ${
            viewMode === "grid" ? "bg-[#6D4DFF] text-white" : "text-[#9BA1BE] hover:text-[#F2F3FA]"
          }`}
          onClick={() => onViewModeChange("grid")}
          type="button"
        >
          <Grid aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
        <button
          aria-label="List view"
          aria-pressed={viewMode === "list"}
          className={`cursor-pointer rounded-md p-1.5 transition-colors ${
            viewMode === "list" ? "bg-[#6D4DFF] text-white" : "text-[#9BA1BE] hover:text-[#F2F3FA]"
          }`}
          onClick={() => onViewModeChange("list")}
          type="button"
        >
          <List aria-hidden="true" className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
