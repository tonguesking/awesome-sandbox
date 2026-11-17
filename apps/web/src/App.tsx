import { type ReactElement, useEffect } from "react";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { CompareFloatingBar } from "./components/sandbox/CompareFloatingBar";
import { RouterProvider, useRouter } from "./lib/router";
import { SandboxProvider, useSandboxes } from "./lib/sandboxContext";
import { applyHeadToDocument, headForPath } from "./lib/seo";
import { AboutPage } from "./pages/AboutPage";
import { BenchmarksPage } from "./pages/BenchmarksPage";
import { CalculatorPage } from "./pages/CalculatorPage";
import { ChoosePage } from "./pages/ChoosePage";
import { ComparePage } from "./pages/ComparePage";
import { ExplorePage } from "./pages/ExplorePage";
import { GuidesPage } from "./pages/GuidesPage";
import { HomePage } from "./pages/HomePage";
import { MatrixPage } from "./pages/MatrixPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SandboxDetailPage } from "./pages/SandboxDetailPage";
import { SubmitPage } from "./pages/SubmitPage";

const ROUTES: Record<string, () => ReactElement> = {
  "/": () => <HomePage />,
  "/explore": () => <ExplorePage />,
  "/sandbox/:slug": () => <SandboxDetailPage />,
  "/choose": () => <ChoosePage />,
  "/compare": () => <ComparePage />,
  "/calculator": () => <CalculatorPage />,
  "/matrix": () => <MatrixPage />,
  "/benchmarks": () => <BenchmarksPage />,
  "/guides": () => <GuidesPage />,
  "/guides/:slug": () => <GuidesPage />,
  "/submit": () => <SubmitPage />,
  "/about": () => <AboutPage />,
};

function AppContent() {
  const { route } = useRouter();
  const { compareList } = useSandboxes();
  const compareDockVisible = compareList.length > 0 && route.path !== "/compare";

  // In-app navigation goes through this router, not TanStack Router, so the
  // route head() functions do not re-run. The same builders are applied to the
  // live document here, which keeps the head correct without a reload.
  // Reading `route.params` keeps this effect subscribed to slug changes too.
  useEffect(() => {
    const { slug } = route.params;
    const pathname = slug ? `${route.path.replace("/:slug", "")}/${slug}` : route.path;
    applyHeadToDocument(headForPath(pathname));
  }, [route.path, route.params]);

  const renderCurrentPage = ROUTES[route.path] ?? (() => <NotFoundPage />);

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
        {renderCurrentPage()}
      </main>

      <CompareFloatingBar />

      <Footer />

      {/* Reserve scroll room after the footer so the fixed comparison dock
          never sits on top of the last row of links. */}
      {compareDockVisible && <div aria-hidden="true" className="h-20" />}
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <SandboxProvider>
        <AppContent />
      </SandboxProvider>
    </RouterProvider>
  );
}
