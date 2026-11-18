import { createFileRoute } from "@tanstack/react-router";
import { headForPath } from "../lib/seo";
import { AboutPage } from "../pages/AboutPage";

export const Route = createFileRoute("/about")({
  head: () => headForPath("/about"),
  component: AboutPage,
});
