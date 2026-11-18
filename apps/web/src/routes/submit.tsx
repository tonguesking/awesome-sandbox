import { createFileRoute } from "@tanstack/react-router";
import { headForPath } from "../lib/seo";
import { SubmitPage } from "../pages/SubmitPage";

export const Route = createFileRoute("/submit")({
  head: () => headForPath("/submit"),
  component: SubmitPage,
});
