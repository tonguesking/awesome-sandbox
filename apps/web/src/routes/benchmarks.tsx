import { createFileRoute } from "@tanstack/react-router";
import { headForPath } from "../lib/seo";
import { BenchmarksPage } from "../pages/BenchmarksPage";

export const Route = createFileRoute("/benchmarks")({
  head: () => headForPath("/benchmarks"),
  component: BenchmarksPage,
});
