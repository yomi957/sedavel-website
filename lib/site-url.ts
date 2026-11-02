/** Public origins only; no request Host or unconfirmed production domain is trusted. */
export function siteConfiguration(env: Record<string, string | undefined> = process.env) {
  const production = env.NODE_ENV === "production";
  const mode = env.SITE_INDEXING || "disabled";
  if (!["enabled", "disabled"].includes(mode)) throw new Error("SITE_INDEXING must be enabled or disabled.");
  const raw = env.SITE_URL?.trim();
  if (production && !raw) throw new Error("SITE_URL is required for production builds and servers. Configure the deployment origin; no localhost SEO fallback is allowed.");
  let url: URL;
  try { url = new URL(raw || "http://localhost:3000"); } catch { throw new Error("SITE_URL must be an absolute origin."); }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== "/") throw new Error("SITE_URL must contain only an http(s) origin, without credentials, path, query or fragment.");
  if (production && (url.protocol !== "https:" || url.port || !url.hostname.includes('.') || /(^localhost$|\.localhost$|\.local$|\.internal$|^[\d.]+$|:)/i.test(url.hostname))) throw new Error("Production SITE_URL must be a public HTTPS hostname, not localhost, an IP or a private development origin.");
  if (production && mode === "enabled" && /\.(example|test|invalid)$/i.test(url.hostname)) throw new Error("Reserved test domains cannot enable search indexing.");
  return { origin: url.origin, indexable: production && mode === "enabled" };
}
export function absoluteSiteUrl(path: string, origin: string) {
  if (!path.startsWith('/') || path.startsWith('//') || /[\\?#\s]/.test(path) || path.split('/').some(s => s === '.' || s === '..')) throw new Error("SEO paths must be clean internal paths.");
  return new URL(path, origin).href;
}
export const indexablePages = ["/", "/features", "/pricing", "/blog"] as const;
