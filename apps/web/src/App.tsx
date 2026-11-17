import { type ReactElement, useEffect } from "react";
import { Footer } from "./components/layout/Footer";
import { Navbar } from "./components/layout/Navbar";
import { CompareFloatingBar } from "./components/sandbox/CompareFloatingBar";
import { RouterProvider, useRouter } from "./lib/router";
import { SandboxProvider, useSandboxes } from "./lib/sandboxContext";
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

const BRAND = "awesome-sandbox.dex";

const PAGE_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Discover the Best Cloud Sandboxes for AI Agents",
    description:
      "Explore and compare cloud sandboxes, AI agent execution environments, browser sandboxes, microVM infrastructure, and self-hosted solutions.",
  },
  "/explore": {
    title: "Explore Sandboxes & Infrastructure Directory",
    description:
      "Browse the complete catalog of cloud sandboxes, MicroVM runtimes, and developer environments with technical specs and pricing.",
  },
  "/choose": {
    title: "Find the Right Sandbox — Decision Guide",
    description:
      "Answer five questions about isolation, idle billing, pause state, deployment and license to get a ranked sandbox shortlist.",
  },
  "/compare": {
    title: "Compare Cloud Sandboxes Side-by-Side",
    description:
      "Evaluate architectural specs, microVM runtimes, desktop capabilities, and pricing models side by side.",
  },
  "/calculator": {
    title: "Sandbox Cost Estimator & Compute Calculator",
    description:
      "Simulate monthly infrastructure spend for sandbox fleets by concurrency, vCPU, memory, and idle sleep.",
  },
  "/matrix": {
    title: "Pricing & Lifecycle Matrix — Idle Cost and Pause State",
    description:
      "Every sandbox compared on idle billing, state kept on pause and resume latency — the axes that decide the bill.",
  },
  "/benchmarks": {
    title: "Cold Start Benchmarks — Sandbox Boot Times Ranked",
    description:
      "Every sandbox ranked by published cold start, from V8 isolates at a few milliseconds to full VMs in seconds, with resume latency for each.",
  },
  "/guides": {
    title: "Technical Architecture & Isolation Guides",
    description:
      "In-depth guides on Firecracker virtualization, gVisor isolation, agent execution architecture, and cost optimization.",
  },
  "/submit": {
    title: "Submit a Sandbox Infrastructure",
    description: "Propose a sandbox runtime, microVM system, or cloud computer for the directory.",
  },
  "/about": {
    title: "About the Sandbox Infrastructure Ecosystem",
    description:
      "How awesome-sandbox.dex reviews, categorizes, and verifies sandbox infrastructure listings.",
  },
};

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

  // Document metadata follows the route; detail and guide pages own their own titles.
  useEffect(() => {
    // One canonical URL per page, without filter query strings.
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    const pathname = window.location.pathname;
    canonical.setAttribute("href", `${window.location.origin}${pathname === "/" ? "" : pathname}`);
    // Reading the params keeps this effect subscribed to slug changes too.

    if (route.path.startsWith("/guides/") || route.path.startsWith("/sandbox/")) {
      return;
    }

    // Detail pages add their own JSON-LD; remove it once we leave that route.
    document.getElementById("sandbox-structured-data")?.remove();

    const meta = PAGE_META[route.path];

    if (!meta) {
      if (ROUTES[route.path]) {
        return;
      }

      document.title = `Page not found | ${BRAND}`;
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute(
          "content",
          "The page you requested is not part of the Awesome Sandbox directory.",
        );
      return;
    }

    document.title = `${meta.title} | ${BRAND}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
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
