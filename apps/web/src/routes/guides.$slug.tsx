import { createFileRoute, notFound } from "@tanstack/react-router";
import { GUIDES } from "../data/guides";
import { headForPath } from "../lib/seo";
import { GuidesPage } from "../pages/GuidesPage";

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const guide = GUIDES.find((entry) => entry.slug === params.slug || entry.id === params.slug);
    if (!guide) {
      throw notFound();
    }
    return { guide };
  },
  head: ({ params }) => headForPath(`/guides/${params.slug}`),
  component: GuidesPage,
});
