import type React from "react";
import { createContext, useContext, useEffect, useState, useTransition } from "react";

export interface RouteState {
  params: Record<string, string>;
  path: string;
  searchParams: URLSearchParams;
}

interface RouterContextType {
  navigate: (to: string, options?: { replace?: boolean; scrollToTop?: boolean }) => void;
  route: RouteState;
}

const RouterContext = createContext<RouterContextType | null>(null);

function parsePath(pathname: string): {
  path: string;
  params: Record<string, string>;
} {
  // Check for /sandbox/:slug
  const sandboxMatch = pathname.match(/^\/sandbox\/([^/]+)/);
  if (sandboxMatch) {
    return { path: "/sandbox/:slug", params: { slug: sandboxMatch[1] } };
  }

  // Check for /guides/:slug
  const guideMatch = pathname.match(/^\/guides\/([^/]+)/);
  if (guideMatch) {
    return { path: "/guides/:slug", params: { slug: guideMatch[1] } };
  }

  // Base normalization
  const normalized = pathname === "" || pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  return { path: normalized, params: {} };
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [, startTransition] = useTransition();
  const [route, setRoute] = useState<RouteState>(() => {
    const { path, params } = parsePath(window.location.pathname);
    return {
      path,
      params,
      searchParams: new URLSearchParams(window.location.search),
    };
  });

  useEffect(() => {
    const handlePopState = () => {
      const { path, params } = parsePath(window.location.pathname);
      startTransition(() => {
        setRoute({
          path,
          params,
          searchParams: new URLSearchParams(window.location.search),
        });
      });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to: string, options?: { replace?: boolean; scrollToTop?: boolean }) => {
    const url = new URL(to, window.location.origin);
    const { path, params } = parsePath(url.pathname);

    if (options?.replace) {
      window.history.replaceState({}, "", to);
    } else {
      window.history.pushState({}, "", to);
    }

    startTransition(() => {
      setRoute({
        path,
        params,
        searchParams: new URLSearchParams(url.search),
      });
    });

    if (options?.scrollToTop !== false) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
}

export function Link({
  to,
  children,
  className = "",
  activeClassName = "",
  onClick,
  ...props
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { route, navigate } = useRouter();
  const url = new URL(to, "http://localhost");
  const isActive = route.path === url.pathname;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !e.altKey
    ) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <a
      className={`${className} ${isActive ? activeClassName : ""}`.trim()}
      href={to}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
}
