import { isIPv4, isIPv6 } from "node:net";
import { URL } from "node:url";

export const MAX_HTML_BYTES = 900_000;
export const FETCH_TIMEOUT_MS = 12_000;

function isBlockedHostname(hostname: string): boolean {
  // Node's WHATWG URL parser includes brackets in .hostname for IPv6 (e.g. "[::1]") — strip them.
  const h = hostname.replace(/^\[|\]$/g, "").toLowerCase();

  // Named special hosts
  if (h === "localhost" || h.endsWith(".localhost")) return true;

  // IPv4 address ranges
  if (isIPv4(h)) {
    const parts = h.split(".").map(Number);
    const [a, b] = parts;
    if (a === 0) return true;                               // 0.0.0.0/8
    if (a === 10) return true;                              // 10.0.0.0/8 private
    if (a === 100 && b >= 64 && b <= 127) return true;     // 100.64.0.0/10 CGNAT
    if (a === 127) return true;                             // 127.0.0.0/8 loopback
    if (a === 169 && b === 254) return true;                // 169.254.0.0/16 link-local / cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true;      // 172.16.0.0/12 private
    if (a === 192 && b === 168) return true;                // 192.168.0.0/16 private
    if (a === 198 && (b === 18 || b === 19)) return true;  // 198.18.0.0/15 benchmark
    if (a >= 240) return true;                              // 240.0.0.0/4 reserved + broadcast
    return false;
  }

  // IPv6 address ranges
  if (isIPv6(h)) {
    if (h === "::" || h === "::1") return true;   // unspecified / loopback
    // IPv4-mapped (::ffff:x.x.x.x or normalized hex ::ffff:xx:xx) and IPv4-compatible (::x.x.x.x)
    if (/^::f{4}:/i.test(h) || /^::(?:\d+\.){3}\d+$/.test(h)) return true;
    // Link-local fe80::/10 (fe80–febf)
    if (/^fe[89ab][0-9a-f]:/i.test(h)) return true;
    // Unique local fc00::/7 (fc__ and fd__)
    if (/^f[cd][0-9a-f]{2}:/i.test(h)) return true;
    // NAT64 well-known prefix 64:ff9b::/96 (RFC 6052) — maps IPv6 literals to IPv4 destinations
    // via a NAT64 gateway. On IPv6-only hosts (e.g. GCP Cloud Run) this can reach 169.254.169.254.
    // 64:ff9b:1::/48 is the local-use NAT64 prefix (RFC 8215).
    if (/^64:ff9b:/i.test(h)) return true;
    // 6to4 2002::/16 (RFC 3056) — embeds an IPv4 address directly in bits 16–47.
    if (/^2002:/i.test(h)) return true;
    return false;
  }

  return false;
}

/** True if the URL must not be fetched (SSRF guard). */
export function isUnsafeFetchUrl(href: string): boolean {
  try {
    const u = new URL(href);
    if (u.protocol !== "https:" && u.protocol !== "http:") return true;
    if (isBlockedHostname(u.hostname)) return true;
    return false;
  } catch {
    return true;
  }
}

export type FetchedHtml = { html: string; finalUrl: string };

/**
 * Fetches public HTML for a URL (same guardrails as recipe image discovery).
 */
export async function fetchPublicHtml(pageUrlRaw: string): Promise<FetchedHtml | null> {
  if (isUnsafeFetchUrl(pageUrlRaw)) return null;
  let pageUrl: URL;
  try {
    pageUrl = new URL(pageUrlRaw);
  } catch {
    return null;
  }

  const res = await fetch(pageUrl.href, {
    redirect: "follow",
    headers: {
      Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (compatible; BigBadMeals/1.0; +https://github.com/BigBadApps/BigBadMeals) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  // Post-redirect SSRF guard: re-validate the final URL after following any redirects.
  // An attacker can 301-redirect from a public domain to an internal IP (e.g. 169.254.169.254
  // cloud metadata), bypassing the pre-fetch check above. Checking res.url closes that bypass.
  if (res.url && isUnsafeFetchUrl(res.url)) return null;

  if (!res.ok) return null;
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (!ct.includes("text/html") && !ct.includes("application/xhtml")) {
    return null;
  }

  const buf = await res.arrayBuffer();
  const slice = buf.byteLength > MAX_HTML_BYTES ? buf.slice(0, MAX_HTML_BYTES) : buf;
  const html = new TextDecoder("utf-8", { fatal: false }).decode(slice);
  return { html, finalUrl: res.url || pageUrl.href };
}
