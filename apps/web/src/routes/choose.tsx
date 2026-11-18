import { createFileRoute } from "@tanstack/react-router";
import { headForPath } from "../lib/seo";
import { ChoosePage } from "../pages/ChoosePage";

export const Route = createFileRoute("/choose")({
  head: () => headForPath("/choose"),
  component: ChoosePage,
});
