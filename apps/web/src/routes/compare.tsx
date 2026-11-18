import { createFileRoute } from "@tanstack/react-router";
import { headForPath } from "../lib/seo";
import { ComparePage } from "../pages/ComparePage";

export const Route = createFileRoute("/compare")({
  head: () => headForPath("/compare"),
  component: ComparePage,
});
