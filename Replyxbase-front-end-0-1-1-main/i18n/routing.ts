import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

// Define your route structure here if you want to use strongly-typed Pathnames
export const routing = defineRouting({
  locales: ["ar", "en", "fr", "es"] as const,
  defaultLocale: "ar",
  // To enable Pathnames typings, define pathnames here, e.g.:
  /*
  pathnames: {
    "/": "/",
    "/dashboard": {
      en: "/dashboard",
      ar: "/لوحة-التحكم"
    },
    // add other routes as needed
  }
  */
});

export type Locale = (typeof routing.locales)[number];
// If pathnames is not defined, remove Pathnames type to fix lint error
// export type Pathnames = keyof typeof routing["pathnames"];

// ✅ wrappers بتاعت Next-intl Navigation
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
