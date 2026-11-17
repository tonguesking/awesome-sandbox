import { createFileRoute } from "@tanstack/react-router";
import App from "../App";
import { headForPath } from "../lib/seo";

/**
 * Every path that is not `/` or `/sitemap.xml` is handled by this route; the
 * app's own router picks the page to render on the client.
 *
 * `head()` still executes during SSR even though `ssr` is false, so the server
 * HTML carries the real page title, description, canonical and JSON-LD for
 * static pages, sandbox listings and guides. Unknown paths deliberately get
 * no canonical, only `noindex`.
 */
export const Route = createFileRoute("/$")({
  ssr: false,
  head: ({ params }) => {
    const splat = (params as { _splat?: string })._splat ?? "";
    return headForPath(`/${splat}`);
  },
  component: HomeComponent,
});

function HomeComponent() {
  return <App />;
}
