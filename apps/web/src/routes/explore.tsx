import { createFileRoute } from "@tanstack/react-router";
import { headForPath } from "../lib/seo";
import { ExplorePage } from "../pages/ExplorePage";

export const Route = createFileRoute("/explore")({
  head: () => headForPath("/explore"),
  component: ExplorePage,
});
