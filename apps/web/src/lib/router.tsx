import { useNavigate, useRouterState } from "@tanstack/react-router";
import type React from "react";
import { useCallback, useMemo } from "react";

/**
 * Compatibility layer over TanStack Router.
 *
 * The app historically used a home-grown client router with this shape. Pages
 * and layout keep calling `useRouter` / `Link` here; the implementations now
 * read and write TanStack location state so routes can server-render.
 */

export interface RouteState {
  params: Record<string, string>;
  path: string;
  searchParams: URLSearchParams;
}

interface RouterContextType {
  navigate: (to: string, options?: { replace?: boolean; scrollToTop?: boolean }) => void;
  route: RouteState;
}

const SANDBOX_PATH = /^\/sandbox\/([^/]+)/;
const GUIDE_PATH = /^\/guides\/([^/]+)/;
const TRAILING_SLASHES = /\/+$/;

function parsePath(pathname: string): {
  path: string;
  params: Record<string, string>;
} {
  const sandboxMatch = pathname.match(SANDBOX_PATH);
  if (sandboxMatch) {
    return {
      path: "/sandbox/:slug",
      params: { slug: decodeURIComponent(sandboxMatch[1]) },
    };
  }

  const guideMatch = pathname.match(GUIDE_PATH);
  if (guideMatch) {
    return {
      path: "/guides/:slug",
      params: { slug: decodeURIComponent(guideMatch[1]) },
    };
  }

  const normalized =
    pathname === "" || pathname === "/" ? "/" : pathname.replace(TRAILING_SLASHES, "");
  return { path: normalized, params: {} };
}

export function useRouter(): RouterContextType {
  const navigateFn = useNavigate();
  const location = useRouterState({ select: (state) => state.location });

  const route = useMemo<RouteState>(() => {
    const { path, params } = parsePath(location.pathname);
    const searchStr = location.searchStr.startsWith("?")
      ? location.searchStr.slice(1)
      : location.searchStr;
    return {
      path,
      params,
      searchParams: new URLSearchParams(searchStr),
    };
  }, [location.pathname, location.searchStr]);

  const navigate = useCallback(
    (to: string, options?: { replace?: boolean; scrollToTop?: boolean }) => {
      navigateFn({ href: to, replace: options?.replace }).catch(() => {
        // Navigation errors are surfaced by the router; ignore the floating promise.
      });
      if (options?.scrollToTop !== false && typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [navigateFn],
  );

  return { route, navigate };
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
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const { route, navigate } = useRouter();
  const url = new URL(to, "http://localhost");
  const target = parsePath(url.pathname);
  const isActive =
    route.path === target.path || (target.path === "/guides" && route.path.startsWith("/guides"));

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (
        !event.defaultPrevented &&
        event.button === 0 &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.altKey
      ) {
        event.preventDefault();
        navigate(to);
      }
    },
    [navigate, onClick, to],
  );

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
