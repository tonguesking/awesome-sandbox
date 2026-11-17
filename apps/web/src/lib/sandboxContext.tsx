import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { INITIAL_SANDBOXES } from "../data/sandboxes";
import type { Sandbox } from "../types/sandbox";

interface SandboxContextType {
  addSandbox: (
    newSandbox: Partial<Sandbox> & {
      name: string;
      description: string;
      website: string;
    },
  ) => Sandbox;
  clearCompare: () => void;
  compareList: string[];
  favorites: string[];
  getSandboxBySlug: (slug: string) => Sandbox | undefined;
  isFavorite: (slug: string) => boolean;
  isInCompare: (slug: string) => boolean;
  removeFromCompare: (slug: string) => void;
  replaceCompare: (slugs: string[]) => void;
  sandboxes: Sandbox[];
  toggleCompare: (slug: string) => void;
  toggleFavorite: (slug: string) => void;
}

const SandboxContext = createContext<SandboxContextType | null>(null);

const STORAGE_KEY_SUBMITTED = "awesome_sandbox_dex_submitted_v2";
const STORAGE_KEY_COMPARE = "awesome_sandbox_dex_compare_v2";

export function SandboxProvider({ children }: { children: React.ReactNode }) {
  const [sandboxes, setSandboxes] = useState<Sandbox[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUBMITTED);
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...parsed, ...INITIAL_SANDBOXES];
      }
    } catch {
      // Fallback
    }
    return INITIAL_SANDBOXES;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("awesome_sandbox_dex_favorites_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem("awesome_sandbox_dex_favorites_v1", JSON.stringify(favorites));
    } catch {
      // Ignore
    }
  }, [favorites]);

  const [compareList, setCompareList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPARE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    // Default empty so screen is clean on initial load
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPARE, JSON.stringify(compareList));
    } catch {
      // Ignore
    }
  }, [compareList]);

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

  const toggleCompare = (slug: string) => {
    setCompareList((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= 4) {
        // limit to 4 sandboxes for optimal side-by-side comparison
        return [...prev.slice(1), slug];
      }
      return [...prev, slug];
    });
  };

  const removeFromCompare = (slug: string) => {
    setCompareList((prev) => prev.filter((s) => s !== slug));
  };

  /** Replace the tray wholesale, used when a shared /compare?items= URL is the
   *  thing on screen. Without this the header badge counts a stale local tray. */
  const replaceCompare = useCallback((slugs: string[]) => {
    setCompareList(slugs.slice(0, 4));
  }, []);

  const isInCompare = (slug: string) => compareList.includes(slug);

  const clearCompare = () => setCompareList([]);

  // Curated `builtOn` values are written as product names as often as slugs
  // ("Firecracker", "Shuru"), so resolve either form; otherwise the card and
  // compare page silently drop the dependency chip.
  const getSandboxBySlug = (slug: string) => {
    const normalized = slug.trim().toLowerCase();
    return sandboxes.find(
      (sandbox) =>
        sandbox.slug === slug ||
        sandbox.slug === normalized ||
        sandbox.id === slug ||
        sandbox.name.toLowerCase() === normalized,
    );
  };

  const addSandbox = (
    data: Partial<Sandbox> & {
      name: string;
      description: string;
      website: string;
    },
  ): Sandbox => {
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    const newSandbox: Sandbox = {
      id: slug,
      slug,
      name: data.name,
      description: data.description,
      logo: data.logo || data.name.slice(0, 2).toUpperCase(),
      logoBg: data.logoBg || "#374151",
      logoTextColor: "#FFFFFF",
      website: data.website,
      documentation: data.documentation || "",
      github: data.github || "",
      productType: data.productType || "commercial_saas",
      categories:
        data.categories && data.categories.length > 0 ? data.categories : ["Code Sandbox"],
      runtime: data.runtime || { docker: true },
      deployment: data.deployment || { cloud: true },
      capabilities: data.capabilities || { api: true, sdk: true },
      pricing: data.pricing || {
        model: ["Free Tier"],
        freeTier: true,
        transparency: "unverified",
      },
      openSource: data.openSource ?? false,
      githubStars: data.githubStars || 0,
      submittedBy: data.submittedBy,
      status: "active",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      keyFeatures: data.keyFeatures || ["Custom sandbox environment", "API access"],
      overview: data.overview || data.description,
    };

    setSandboxes((prev) => [newSandbox, ...prev]);

    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUBMITTED);
      const existing = saved ? JSON.parse(saved) : [];
      localStorage.setItem(STORAGE_KEY_SUBMITTED, JSON.stringify([newSandbox, ...existing]));
    } catch {
      // Ignore
    }

    return newSandbox;
  };

  return (
    <SandboxContext.Provider
      value={{
        sandboxes,
        addSandbox,
        compareList,
        favorites,
        toggleFavorite,
        isFavorite,
        toggleCompare,
        isInCompare,
        removeFromCompare,
        replaceCompare,
        clearCompare,
        getSandboxBySlug,
      }}
    >
      {children}
    </SandboxContext.Provider>
  );
}

export function useSandboxes() {
  const context = useContext(SandboxContext);
  if (!context) {
    throw new Error("useSandboxes must be used within a SandboxProvider");
  }
  return context;
}
