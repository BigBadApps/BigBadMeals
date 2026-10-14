import { lookup as dnsLookup } from "node:dns/promises";
import { request as httpRequest, type IncomingMessage } from "node:http";
import { request as httpsRequest } from "node:https";
import { isIPv4, isIPv6, type LookupFunction } from "node:net";
import type { Readable } from "node:stream";
import { URL } from "node:url";
import { createBrotliDecompress, createGunzip, createInflate } from "node:zlib";

// SSRF guard for server-side fetches. Follows standards/SECURITY.md (SSRF section):
// string checks on every URL, address checks on the connect path, manual redirects.

export const MAX_HTML_BYTES = 900_000;
export const FETCH_TIMEOUT_MS = 12_000;
export const MAX_REDIRECTS = 5;

const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

function isBlockedHostname(hostname: string): boolean {
  // Node's WHATWG URL parser includes brackets in .hostname for IPv6 (e.g. "[::1]") — strip them.
  const h = hostname.replace(/^\[|\]$/g, "").replace(/\.$/, "").toLowerCase();

  // Named special hosts
  if (h === "localhost" || h.endsWith(".localhost")) return true;

  // IPv4 address ranges
  if (isIPv4(h)) {
    const parts = h.split(".").map(Number);
    const [a, b, c] = parts;
    if (a === 0) return true;                               // 0.0.0.0/8
    if (a === 10) return true;                              // 10.0.0.0/8 private
    if (a === 100 && b >= 64 && b <= 127) return true;     // 100.64.0.0/10 CGNAT (incl. Alibaba metadata)
    if (a === 127) return true;                             // 127.0.0.0/8 loopback
    if (a === 168 && b === 63 && c === 129 && parts[3] === 16) return true; // Azure WireServer
    if (a === 169 && b === 254) return true;                // 169.254.0.0/16 link-local / cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true;      // 172.16.0.0/12 private
    if (a === 192 && b === 0 && (c === 0 || c === 2)) return true; // 192.0.0.0/24 IETF, 192.0.2.0/24 docs
    if (a === 192 && b === 168) return true;                // 192.168.0.0/16 private
    if (a === 198 && (b === 18 || b === 19)) return true;  // 198.18.0.0/15 benchmark
    if (a === 198 && b === 51 && c === 100) return true;    // 198.51.100.0/24 docs
    if (a === 203 && b === 0 && c === 113) return true;     // 203.0.113.0/24 docs
    if (a >= 224) return true;                              // 224.0.0.0/4 multicast, 240.0.0.0/4 reserved
    return false;
  }

  // IPv6 address ranges
  if (isIPv6(h)) {
    // ::/96 — unspecified, loopback, and IPv4-compatible forms all start with "::"; IPv4-mapped
    // (::ffff:0:0/96) does too, in both dotted and normalized hex form.
    if (h.startsWith("::")) return true;
    // Link-local fe80::/10 and deprecated site-local fec0::/10 (fe80–feff)
    if (/^fe[89a-f][0-9a-f]:/i.test(h)) return true;
    // Unique local fc00::/7 (fc__ and fd__), incl. AWS IMDS over IPv6 fd00:ec2::254
    if (/^f[cd][0-9a-f]{2}:/i.test(h)) return true;
    // Multicast ff00::/8
    if (/^ff[0-9a-f]{2}:/i.test(h)) return true;
    // NAT64 64:ff9b::/96 (RFC 6052) and local-use 64:ff9b:1::/48 (RFC 8215) embed an IPv4
    // address that some NAT64 gateways translate, e.g. 64:ff9b::a9fe:a9fe = 169.254.169.254.
    if (/^64:ff9b:/i.test(h)) return true;
    // 6to4 2002::/16 (RFC 3056) embeds an IPv4 address in bits 16–47.
    if (/^2002:/i.test(h)) return true;
    // Teredo 2001::/32 and documentation 2001:db8::/32
    if (/^2001:(0{0,4}:|db8:)/i.test(h)) return true;
    return false;
  }

  return false;
}

/** True if a resolved IP address must not be connected to. Fails closed on non-IP input. */
export function isBlockedAddress(ip: string): boolean {
  const h = ip.replace(/^\[|\]$/g, "").replace(/%.*$/, "");
  if (!isIPv4(h) && !isIPv6(h)) return true;
  return isBlockedHostname(h);
}

/** True if the URL must not be fetched (SSRF guard, string-level checks). */
export function isUnsafeFetchUrl(href: string): boolean {
  try {
    const u = new URL(href);
    if (u.protocol !== "https:" && u.protocol !== "http:") return true;
    if (u.username || u.password) return true;
    if (isBlockedHostname(u.hostname)) return true;
    return false;
  } catch {
    return true;
  }
}

export type Resolve = (hostname: string) => Promise<string[]>;

const defaultResolve: Resolve = async (hostname) =>
  (await dnsLookup(hostname, { all: true, verbatim: true })).map((a) => a.address);

/**
 * A socket `lookup` that resolves the hostname and rejects the connection if any resolved
 * address is blocked. Because the check runs inside the lookup the socket uses, a second
 * DNS answer (DNS rebinding) cannot swap in an internal address.
 */
export function createSafeLookup(
  resolve: Resolve = defaultResolve,
  isBlocked: (ip: string) => boolean = isBlockedAddress,
): LookupFunction {
  return (hostname, options, callback) => {
    resolve(hostname).then(
      (addresses) => {
        if (addresses.length === 0 || addresses.some(isBlocked)) {
          return callback(new Error(`SSRF guard: blocked address for ${hostname}`), "", 0);
        }
        const entries = addresses.map((address) => ({ address, family: isIPv6(address) ? 6 : 4 }));
        if (options.all) return callback(null, entries);
        return callback(null, entries[0].address, entries[0].family);
      },
      (err: NodeJS.ErrnoException) => callback(err, "", 0),
    );
  };
}

const safeLookup = createSafeLookup();

export type FetchDeps = { lookup?: LookupFunction; timeoutMs?: number };
export type FetchedHtml = { html: string; finalUrl: string };

const REQUEST_HEADERS = {
  Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "User-Agent":
    "Mozilla/5.0 (compatible; BigBadMeals/1.0; +https://github.com/BigBadApps/BigBadMeals) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

function get(url: URL, lookup: LookupFunction, signal: AbortSignal): Promise<IncomingMessage> {
  const request = url.protocol === "https:" ? httpsRequest : httpRequest;
  return new Promise((resolve, reject) => {
    // agent: false gives each request its own socket, so the guarded lookup runs every time.
    const req = request(url, { headers: REQUEST_HEADERS, lookup, signal, agent: false }, resolve);
    req.on("error", reject);
    req.end();
  });
}

/** The response body, decompressed. Null for an encoding we don't support. */
function decodedBody(res: IncomingMessage): Readable | null {
  const encoding = (res.headers["content-encoding"] || "identity").toLowerCase().trim();
  if (encoding === "identity") return res;
  if (encoding === "gzip" || encoding === "x-gzip") return res.pipe(createGunzip());
  if (encoding === "deflate") return res.pipe(createInflate());
  if (encoding === "br") return res.pipe(createBrotliDecompress());
  return null;
}

/** Reads at most maxBytes of decompressed body, so a compression bomb is capped too. */
async function readCapped(body: Readable, res: IncomingMessage, maxBytes: number): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let total = 0;
  for await (const chunk of body) {
    const buf = chunk as Buffer;
    const room = maxBytes - total;
    chunks.push(buf.length > room ? buf.subarray(0, room) : buf);
    total += Math.min(buf.length, room);
    if (total >= maxBytes) break;
  }
  body.destroy();
  res.destroy();
  return Buffer.concat(chunks);
}

/**
 * Fetches public HTML for a URL. Returns null for anything blocked, failed, timed out, or
 * not HTML, so callers cannot tell those cases apart.
 */
export async function fetchPublicHtml(pageUrlRaw: string, deps: FetchDeps = {}): Promise<FetchedHtml | null> {
  const lookup = deps.lookup ?? safeLookup;
  const signal = AbortSignal.timeout(deps.timeoutMs ?? FETCH_TIMEOUT_MS);
  try {
    let url = new URL(pageUrlRaw);
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      if (isUnsafeFetchUrl(url.href)) return null;
      const res = await get(url, lookup, signal);
      const status = res.statusCode ?? 0;
      if (REDIRECT_STATUSES.has(status)) {
        res.resume();
        if (!res.headers.location) return null;
        url = new URL(res.headers.location, url);
        continue;
      }
      if (status < 200 || status >= 300) {
        res.resume();
        return null;
      }
      const ct = (res.headers["content-type"] || "").toLowerCase();
      if (!ct.includes("text/html") && !ct.includes("application/xhtml")) {
        res.resume();
        return null;
      }
      const decoded = decodedBody(res);
      if (!decoded) {
        res.resume();
        return null;
      }
      const body = await readCapped(decoded, res, MAX_HTML_BYTES);
      const html = new TextDecoder("utf-8", { fatal: false }).decode(body);
      return { html, finalUrl: url.href };
    }
    return null;
  } catch {
    return null;
  }
}
