import { defu } from "defu";
import type { RouteLocationRaw } from "vue-router";

type MiddlewareOptions =
  | boolean
  | {
      /**
       * Only apply auth middleware to guest or user
       */
      only?: "guest" | "user";
      /**
       * Redirect authenticated user to this route
       */
      redirectUserTo?: RouteLocationRaw;
      /**
       * Redirect guest to this route
       */
      redirectGuestTo?: RouteLocationRaw;
    };

declare module "vue-router" {
  interface RouteMeta {
    auth?: MiddlewareOptions;
  }
}

export default defineNuxtRouteMiddleware(async (to) => {
  // If auth is disabled, skip middleware
  if (!to.meta?.auth) return;

  const { loggedIn, fetchSession } = useAuth();
  const redirectOptions = {
    redirectUserTo: "/",
    redirectGuestTo: "/login",
  };
  const { only, redirectUserTo, redirectGuestTo } = defu(to.meta?.auth, redirectOptions);

  await fetchSession();

  // If guest mode, redirect if authenticated
  if (only === "guest") {
    if (loggedIn.value) {
      // Avoid infinite redirect
      if (to.path === redirectUserTo) return;

      return navigateTo(redirectUserTo);
    }
    return;
  }

  // If not authenticated, redirect to login
  if (!loggedIn.value) {
    const redirectTo =
      typeof redirectGuestTo === "string"
        ? { path: redirectGuestTo, query: { redirect: to.path } }
        : { ...redirectGuestTo, query: { ...redirectGuestTo.query, redirect: to.path } };

    // Avoid infinite redirect
    if (to.path === redirectTo.path) {
      return;
    }
    return navigateTo(redirectTo);
  }
});
