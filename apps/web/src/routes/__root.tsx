import { Toaster } from "@awesome-sandbox/ui/components/sonner";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Footer } from "../components/layout/Footer";
import { Navbar } from "../components/layout/Navbar";
import { CompareFloatingBar } from "../components/sandbox/CompareFloatingBar";
import appCss from "../index.css?url";
import { useRouter } from "../lib/router";
import { SandboxProvider, useSandboxes } from "../lib/sandboxContext";
import { NotFoundPage } from "../pages/NotFoundPage";

export type RouterAppContext = Record<string, never>;

/**
 * Document shell plus the shared chrome (navbar, footer, compare dock).
 * Page metadata comes from each route's `head()`; the shell only declares
 * tags that are identical on every page.
 */
export const Route = createRootRouteWithContext<RouterAppContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "color-scheme", content: "dark" },
      { name: "theme-color", content: "#080B1A" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),
  notFoundComponent: NotFoundPage,
  component: RootDocument,
});

function RootDocument() {
  return (
    <html className="dark" lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <SandboxProvider>
          <AppShell />
        </SandboxProvider>
        <Toaster richColors />
        <Scripts />
      </body>
    </html>
  );
}

function AppShell() {
  const { compareList } = useSandboxes();
  const { route } = useRouter();
  const compareDockVisible = compareList.length > 0 && route.path !== "/compare";

  return (
    <div className="flex min-h-screen flex-col bg-[#080B1A] text-[#F2F3FA] antialiased selection:bg-[#6D4DFF]/30 selection:text-[#A78BFA]">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-[#6D4DFF] focus:px-4 focus:py-2 focus:font-semibold focus:text-[#F2F3FA] focus:text-xs"
        href="#content"
      >
        Skip to content
      </a>

      <Navbar />

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 sm:px-6 lg:px-9" id="content">
        <Outlet />
      </main>

      <CompareFloatingBar />

      <Footer />

      {compareDockVisible ? <div aria-hidden="true" className="h-20" /> : null}
    </div>
  );
}
