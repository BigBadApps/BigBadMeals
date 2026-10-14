import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { gzipSync } from "node:zlib";
import {
  MAX_HTML_BYTES,
  MAX_REDIRECTS,
  createSafeLookup,
  fetchPublicHtml,
  isBlockedAddress,
} from "../../server/pageFetch.js";

// The test server listens on 127.0.0.1. The fake resolver maps test hostnames onto it, and
// the address check treats 127.0.0.1 as public so the real network path can be exercised.
const SERVER_IP = "127.0.0.1";
const treatServerAsPublic = (ip: string) => ip !== SERVER_IP && isBlockedAddress(ip);

const hits: string[] = [];
let server: Server;
let port: number;

function url(host: string, path: string): string {
  return `http://${host}:${port}${path}`;
}

before(async () => {
  server = createServer((req, res) => {
    hits.push(req.url ?? "");
    const html = (body: string) => {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(body);
    };
    switch (req.url) {
      case "/ok":
        return html("<h1>ok</h1>");
      case "/to-metadata":
        res.writeHead(302, { location: "http://169.254.169.254/latest/meta-data/" });
        return res.end();
      case "/to-internal-name":
        res.writeHead(302, { location: url("internal.test", "/ok") });
        return res.end();
      case "/to-file":
        res.writeHead(302, { location: "file:///etc/passwd" });
        return res.end();
      case "/relative":
        res.writeHead(301, { location: "/ok" });
        return res.end();
      case "/loop":
        res.writeHead(302, { location: "/loop" });
        return res.end();
      case "/json":
        res.writeHead(200, { "content-type": "application/json" });
        return res.end("{}");
      case "/big": {
        res.writeHead(200, { "content-type": "text/html" });
        const chunk = "a".repeat(64 * 1024);
        let sent = 0;
        const write = () => {
          while (sent < MAX_HTML_BYTES * 3) {
            sent += chunk.length;
            if (!res.write(chunk)) return res.once("drain", write);
          }
          res.end();
        };
        return write();
      }
      case "/gzip":
        res.writeHead(200, { "content-type": "text/html", "content-encoding": "gzip" });
        return res.end(gzipSync("<h1>zipped</h1>"));
      case "/gzip-bomb":
        res.writeHead(200, { "content-type": "text/html", "content-encoding": "gzip" });
        return res.end(gzipSync(Buffer.alloc(MAX_HTML_BYTES * 20, "a")));
      case "/hang":
        return; // never responds
      default:
        res.writeHead(404);
        return res.end();
    }
  });
  await new Promise<void>((resolve) => server.listen(0, SERVER_IP, resolve));
  port = (server.address() as AddressInfo).port;
});

after(() => {
  server.closeAllConnections();
  server.close();
});

const resolver = (map: Record<string, string[]>) => async (host: string) => {
  const addresses = map[host];
  if (!addresses) throw new Error(`ENOTFOUND ${host}`);
  return addresses;
};

const publicLookup = createSafeLookup(
  resolver({ "public.test": [SERVER_IP], "internal.test": ["10.0.0.1"] }),
  treatServerAsPublic,
);

describe("fetchPublicHtml – network path", () => {
  it("fetches HTML from a public host", async () => {
    const doc = await fetchPublicHtml(url("public.test", "/ok"), { lookup: publicLookup });
    assert.equal(doc?.html, "<h1>ok</h1>");
    assert.equal(doc?.finalUrl, url("public.test", "/ok"));
  });

  it("checks the resolved address on the connect path (real address check)", async () => {
    hits.length = 0;
    const lookup = createSafeLookup(resolver({ "public.test": [SERVER_IP] }));
    assert.equal(await fetchPublicHtml(url("public.test", "/ok"), { lookup }), null);
    assert.deepEqual(hits, [], "the blocked address must never be contacted");
  });

  it("rejects a hostname whose answer mixes public and private addresses", async () => {
    const lookup = createSafeLookup(resolver({ "mixed.test": [SERVER_IP, "10.0.0.1"] }), treatServerAsPublic);
    assert.equal(await fetchPublicHtml(url("mixed.test", "/ok"), { lookup }), null);
  });

  it("checks every connection, so a rebinding answer on a later lookup is rejected", async () => {
    let calls = 0;
    const lookup = createSafeLookup(async () => (++calls === 1 ? [SERVER_IP] : ["10.0.0.1"]), treatServerAsPublic);
    assert.equal(await fetchPublicHtml(url("rebind.test", "/relative"), { lookup }), null);
    assert.equal(calls, 2, "each hop resolves and checks again");
  });

  it("does not follow a redirect to a metadata address", async () => {
    hits.length = 0;
    assert.equal(await fetchPublicHtml(url("public.test", "/to-metadata"), { lookup: publicLookup }), null);
    assert.deepEqual(hits, ["/to-metadata"]);
  });

  it("does not follow a redirect to a name that resolves to a private address", async () => {
    hits.length = 0;
    assert.equal(await fetchPublicHtml(url("public.test", "/to-internal-name"), { lookup: publicLookup }), null);
    assert.deepEqual(hits, ["/to-internal-name"]);
  });

  it("does not follow a redirect to a non-http scheme", async () => {
    assert.equal(await fetchPublicHtml(url("public.test", "/to-file"), { lookup: publicLookup }), null);
  });

  it("follows a relative redirect and reports the final URL", async () => {
    const doc = await fetchPublicHtml(url("public.test", "/relative"), { lookup: publicLookup });
    assert.equal(doc?.html, "<h1>ok</h1>");
    assert.equal(doc?.finalUrl, url("public.test", "/ok"));
  });

  it("stops after the redirect cap", async () => {
    hits.length = 0;
    assert.equal(await fetchPublicHtml(url("public.test", "/loop"), { lookup: publicLookup }), null);
    assert.equal(hits.length, MAX_REDIRECTS + 1);
  });

  it("returns null for non-HTML content", async () => {
    assert.equal(await fetchPublicHtml(url("public.test", "/json"), { lookup: publicLookup }), null);
  });

  it("caps the body size while streaming", async () => {
    const doc = await fetchPublicHtml(url("public.test", "/big"), { lookup: publicLookup });
    assert.ok(doc, "expected a truncated document");
    assert.ok(doc.html.length <= MAX_HTML_BYTES, `got ${doc.html.length} bytes`);
  });

  it("decompresses gzip responses", async () => {
    const doc = await fetchPublicHtml(url("public.test", "/gzip"), { lookup: publicLookup });
    assert.equal(doc?.html, "<h1>zipped</h1>");
  });

  it("caps the decompressed size of a gzip response", async () => {
    const doc = await fetchPublicHtml(url("public.test", "/gzip-bomb"), { lookup: publicLookup });
    assert.ok(doc, "expected a truncated document");
    assert.ok(doc.html.length <= MAX_HTML_BYTES, `got ${doc.html.length} bytes`);
  });

  it("returns null on timeout", async () => {
    const doc = await fetchPublicHtml(url("public.test", "/hang"), { lookup: publicLookup, timeoutMs: 300 });
    assert.equal(doc, null);
  });
});
