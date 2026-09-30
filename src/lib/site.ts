/** Public URL of the site. Set NEXT_PUBLIC_SITE_URL once the client has a custom domain. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://laundry-house.vercel.app").replace(/\/$/, "");

/** Pages that should appear in search results. */
export const PUBLIC_PATHS = ["/", "/services", "/rates", "/stores", "/about", "/franchise", "/book", "/track"];
