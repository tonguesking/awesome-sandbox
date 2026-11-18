import { createFileRoute, notFound } from "@tanstack/react-router";
import { headForPath, sandboxBySlug } from "../lib/seo";
import { SandboxDetailPage } from "../pages/SandboxDetailPage";

export const Route = createFileRoute("/sandbox/$slug")({
  loader: ({ params }) => {
    const sandbox = sandboxBySlug(params.slug);
    if (!sandbox) {
      throw notFound();
    }
    return { sandbox };
  },
  head: ({ params }) => headForPath(`/sandbox/${params.slug}`),
  component: SandboxDetailPage,
});
