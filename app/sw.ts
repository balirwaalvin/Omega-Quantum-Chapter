import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { ExpirationPlugin, NetworkFirst, NetworkOnly, Serwist, StaleWhileRevalidate } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope & {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  skipWaiting: () => void;
  addEventListener: (type: string, listener: (event: Event) => void) => void;
};

/**
 * Caching strategy:
 * - Precache the build assets Serwist emits, plus /offline.
 * - NetworkFirst for navigations, falling back to the offline page.
 * - StaleWhileRevalidate for events, learn, and downloadable resources.
 * - NetworkOnly for Clerk and auth routes.
 */
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ url }) =>
        url.hostname.includes("clerk") ||
        url.pathname.startsWith("/login") ||
        url.pathname.startsWith("/signup") ||
        url.pathname.startsWith("/api/webhooks"),
      handler: new NetworkOnly(),
    },
    {
      matcher: ({ url, request }) =>
        request.destination === "document" &&
        (url.pathname.startsWith("/events") ||
          url.pathname.startsWith("/learn") ||
          url.pathname.startsWith("/resources")),
      handler: new StaleWhileRevalidate({
        cacheName: "omega-learning",
        plugins: [
          new ExpirationPlugin({
            maxEntries: 64,
            maxAgeSeconds: 7 * 24 * 60 * 60,
          }),
        ],
      }),
    },
    {
      matcher: ({ request }) => request.destination === "document",
      handler: new NetworkFirst({
        cacheName: "omega-pages",
        networkTimeoutSeconds: 3,
        plugins: [
          new ExpirationPlugin({
            maxEntries: 32,
            maxAgeSeconds: 24 * 60 * 60,
          }),
        ],
      }),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
