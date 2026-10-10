import { lazy, type ComponentType, type LazyExoticComponent } from "react";

const RELOAD_KEY = "pg:chunk-reload";

function isChunkLoadError(error: unknown): boolean {
  const msg = String((error as Error)?.message || error || "");
  return (
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg) ||
    /error loading dynamically imported module/i.test(msg) ||
    /Loading chunk [\d]+ failed/i.test(msg) ||
    /ChunkLoadError/i.test(msg)
  );
}

/**
 * Like React.lazy, but after a deploy the browser may still hold an old
 * entry bundle that points at removed hashed chunks. One automatic full
 * reload usually picks up the new index.html; if it still fails, the
 * route errorElement shows a friendly recovery UI.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
): LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      const mod = await factory();
      try {
        sessionStorage.removeItem(RELOAD_KEY);
      } catch {
        /* private mode */
      }
      return mod;
    } catch (error) {
      if (isChunkLoadError(error) && typeof window !== "undefined") {
        try {
          if (!sessionStorage.getItem(RELOAD_KEY)) {
            sessionStorage.setItem(RELOAD_KEY, "1");
            window.location.reload();
            // Keep suspense hanging until the reload lands.
            return new Promise(() => undefined) as Promise<{ default: T }>;
          }
          sessionStorage.removeItem(RELOAD_KEY);
        } catch {
          /* private mode — fall through to throw */
        }
      }
      throw error;
    }
  });
}

export { isChunkLoadError };
