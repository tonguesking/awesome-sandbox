import { createFileRoute, notFound } from "@tanstack/react-router";
import { buildNotFoundHead } from "../lib/seo";

/**
 * Catch-all for unmatched paths. Always throws `notFound()` so the response
 * status is 404 and the shared NotFound UI (with noindex head) is rendered.
 */
export const Route = createFileRoute("/$")({
  beforeLoad: () => {
    throw notFound();
  },
  head: () => buildNotFoundHead(),
});
