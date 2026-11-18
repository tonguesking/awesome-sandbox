import { createFileRoute } from "@tanstack/react-router";
import { headForPath } from "../lib/seo";
import { MatrixPage } from "../pages/MatrixPage";

export const Route = createFileRoute("/matrix")({
  head: () => headForPath("/matrix"),
  component: MatrixPage,
});
