/** CMS selects a route key, never an arbitrary URL. Keep the default order here. */
export const publicNavigation = [
  { key: "home", href: "/" }, { key: "features", href: "/features" },
  { key: "pricing", href: "/pricing" }, { key: "download", href: "/download" },
  { key: "referral", href: "/referral" }, { key: "help", href: "/help" },
  { key: "blog", href: "/blog" }, { key: "contact", href: "/contact" },
] as const;
export type NavigationKey = typeof publicNavigation[number]["key"];
export const footerPages = [...publicNavigation, { key: "register", href: "/register" }, { key: "privacy", href: "/privacy" }, { key: "terms", href: "/terms" }] as const;
export type FooterPageKey = typeof footerPages[number]["key"];
