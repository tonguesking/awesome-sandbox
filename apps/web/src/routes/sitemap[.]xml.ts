import { createFileRoute } from "@tanstack/react-router";
import { generateSitemap } from "../lib/sitemap";

/**
 * `/sitemap.xml` as a TanStack Start server route.
 *
 * The client-side catch-all route is registered for every path, so the
 * sitemap has to be handled by the server before the app shell is rendered.
 * A route with only `server.handlers` and no component never renders HTML:
 * the handler returns the XML document with an XML content type.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () =>
        new Response(generateSitemap(), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
