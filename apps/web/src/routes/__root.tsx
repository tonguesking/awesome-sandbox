import { Toaster } from "@awesome-sandbox/ui/components/sonner";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";

import appCss from "../index.css?url";

export type RouterAppContext = {};

/**
 * The document shell. Page metadata lives in each route's `head()` (built from
 * `src/lib/seo.ts`), so the shell only declares tags that are identical on
 * every page: character set, viewport, theme and the stylesheet.
 */
export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        name: "color-scheme",
        content: "dark",
      },
      {
        name: "theme-color",
        content: "#080B1A",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.svg",
      },
    ],
  }),

  component: RootDocument,
});

function RootDocument() {
  return (
    <html className="dark" lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Toaster richColors />
        <Scripts />
      </body>
    </html>
  );
}
