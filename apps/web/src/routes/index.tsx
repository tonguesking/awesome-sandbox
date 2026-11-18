import { createFileRoute } from "@tanstack/react-router";
import { headForPath } from "../lib/seo";
import { HomePage } from "../pages/HomePage";

export const Route = createFileRoute("/")({
  head: () => headForPath("/"),
  component: HomePage,
});
