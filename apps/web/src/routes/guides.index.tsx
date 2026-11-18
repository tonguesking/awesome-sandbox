import { createFileRoute } from "@tanstack/react-router";
import { headForPath } from "../lib/seo";
import { GuidesPage } from "../pages/GuidesPage";

export const Route = createFileRoute("/guides/")({
  head: () => headForPath("/guides"),
  component: GuidesPage,
});
