import { Toaster } from "@awesome-sandbox/ui/components/sonner";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";

import appCss from "../index.css?url";

export type RouterAppContext = {};

const SITE_NAME = "awesome-sandbox.dex";
const SITE_DESCRIPTION =
  "Discover and compare cloud sandboxes, AI agent execution environments, browser sandboxes, microVM infrastructure, and self-hosted runtimes.";
const DEFAULT_TITLE = "Awesome Sandbox — Discover the Best Cloud Sandboxes for AI Agents";

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
      {
        title: DEFAULT_TITLE,
      },
      {
        name: "description",
        content: SITE_DESCRIPTION,
      },
      {
        property: "og:site_name",
        content: SITE_NAME,
      },
      {
        property: "og:title",
        content: DEFAULT_TITLE,
      },
      {
        property: "og:description",
        content: SITE_DESCRIPTION,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:image",
        content: "/og.png",
      },
      {
        property: "og:image:width",
        content: "1200",
      },
      {
        property: "og:image:height",
        content: "630",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:image",
        content: "/og.png",
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
