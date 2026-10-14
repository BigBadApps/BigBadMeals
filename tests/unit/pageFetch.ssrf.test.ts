import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isUnsafeFetchUrl } from "../../server/pageFetch.js";

describe("isUnsafeFetchUrl – SSRF guard", () => {
  // ── Blocked: protocol ────────────────────────────────────────────────
  it("blocks file:// protocol", () => assert.equal(isUnsafeFetchUrl("file:///etc/passwd"), true));
  it("blocks javascript: protocol", () => assert.equal(isUnsafeFetchUrl("javascript:alert(1)"), true));
  it("blocks ftp:// protocol", () => assert.equal(isUnsafeFetchUrl("ftp://example.com/"), true));

  // ── Blocked: localhost / loopback ─────────────────────────────────────
  it("blocks localhost", () => assert.equal(isUnsafeFetchUrl("http://localhost/"), true));
  it("blocks localhost subdomains", () => assert.equal(isUnsafeFetchUrl("http://foo.localhost/"), true));
  it("blocks 127.0.0.1", () => assert.equal(isUnsafeFetchUrl("http://127.0.0.1/"), true));
  it("blocks 127.x.x.x range", () => assert.equal(isUnsafeFetchUrl("http://127.255.255.255/"), true));
  it("blocks IPv6 loopback ::1", () => assert.equal(isUnsafeFetchUrl("http://[::1]/"), true));
  it("blocks IPv6 unspecified ::", () => assert.equal(isUnsafeFetchUrl("http://[::]/"), true));

  // ── Blocked: private / internal IPv4 ─────────────────────────────────
  it("blocks 10.x.x.x", () => assert.equal(isUnsafeFetchUrl("http://10.0.0.1/"), true));
  it("blocks 192.168.x.x", () => assert.equal(isUnsafeFetchUrl("http://192.168.1.1/"), true));
  it("blocks 172.16.x.x", () => assert.equal(isUnsafeFetchUrl("http://172.16.0.1/"), true));
  it("blocks 172.31.x.x", () => assert.equal(isUnsafeFetchUrl("http://172.31.255.255/"), true));

  // ── Blocked: cloud metadata ───────────────────────────────────────────
  it("blocks AWS metadata 169.254.169.254", () => assert.equal(isUnsafeFetchUrl("http://169.254.169.254/latest/meta-data/"), true));
  it("blocks 169.254.x.x range", () => assert.equal(isUnsafeFetchUrl("http://169.254.0.1/"), true));

  // ── Blocked: other reserved IPv4 ─────────────────────────────────────
  it("blocks 0.0.0.0", () => assert.equal(isUnsafeFetchUrl("http://0.0.0.0/"), true));
  it("blocks 0.x.x.x range", () => assert.equal(isUnsafeFetchUrl("http://0.1.2.3/"), true));
  it("blocks CGNAT 100.64.x.x", () => assert.equal(isUnsafeFetchUrl("http://100.64.0.1/"), true));
  it("blocks CGNAT 100.127.x.x", () => assert.equal(isUnsafeFetchUrl("http://100.127.255.255/"), true));
  it("blocks benchmark 198.18.x.x", () => assert.equal(isUnsafeFetchUrl("http://198.18.0.1/"), true));
  it("blocks reserved 240.0.0.1", () => assert.equal(isUnsafeFetchUrl("http://240.0.0.1/"), true));
  it("blocks broadcast 255.255.255.255", () => assert.equal(isUnsafeFetchUrl("http://255.255.255.255/"), true));

  // ── Blocked: IPv6 private ranges ─────────────────────────────────────
  it("blocks IPv6 link-local fe80::", () => assert.equal(isUnsafeFetchUrl("http://[fe80::1]/"), true));
  it("blocks IPv6 link-local fe80:: variant", () => assert.equal(isUnsafeFetchUrl("http://[fe80::cafe:babe]/"), true));
  it("blocks IPv6 unique local fc00::", () => assert.equal(isUnsafeFetchUrl("http://[fc00::1]/"), true));
  it("blocks IPv6 unique local fd00::", () => assert.equal(isUnsafeFetchUrl("http://[fd12:3456:789a::1]/"), true));
  it("blocks IPv4-mapped ::ffff:127.0.0.1", () => assert.equal(isUnsafeFetchUrl("http://[::ffff:127.0.0.1]/"), true));
  it("blocks IPv4-mapped ::ffff:10.0.0.1", () => assert.equal(isUnsafeFetchUrl("http://[::ffff:10.0.0.1]/"), true));

  // ── Blocked: NAT64 and 6to4 transition mechanisms ────────────────────
  it("blocks NAT64 prefix 64:ff9b:: (maps to 169.254.169.254 via gateway)", () => assert.equal(isUnsafeFetchUrl("http://[64:ff9b::a9fe:a9fe]/"), true));
  it("blocks NAT64 local-use prefix 64:ff9b:1::", () => assert.equal(isUnsafeFetchUrl("http://[64:ff9b:1::a9fe:a9fe]/"), true));
  it("blocks 6to4 2002:: (encodes IPv4 in address)", () => assert.equal(isUnsafeFetchUrl("http://[2002:a9fe:fefe::1]/"), true));
  it("blocks 6to4 loopback 2002:7f00:1::", () => assert.equal(isUnsafeFetchUrl("http://[2002:7f00:1::]/"), true));

  // ── Blocked: malformed ───────────────────────────────────────────────
  it("blocks empty string", () => assert.equal(isUnsafeFetchUrl(""), true));
  it("blocks non-URL string", () => assert.equal(isUnsafeFetchUrl("not a url"), true));

  // ── Allowed: legitimate public domains ───────────────────────────────
  it("allows https://example.com", () => assert.equal(isUnsafeFetchUrl("https://example.com/"), false));
  it("allows https://www.allrecipes.com", () => assert.equal(isUnsafeFetchUrl("https://www.allrecipes.com/recipe/123"), false));
  it("allows https://cooking.nytimes.com", () => assert.equal(isUnsafeFetchUrl("https://cooking.nytimes.com/recipe"), false));
  it("allows http:// public domain", () => assert.equal(isUnsafeFetchUrl("http://example.com/"), false));
  it("allows public IP 8.8.8.8", () => assert.equal(isUnsafeFetchUrl("https://8.8.8.8/"), false));
  it("does not block 172.15.x.x (just outside private range)", () => assert.equal(isUnsafeFetchUrl("http://172.15.255.255/"), false));
  it("does not block 172.32.x.x (just outside private range)", () => assert.equal(isUnsafeFetchUrl("http://172.32.0.0/"), false));
  it("does not block 100.63.x.x (just below CGNAT)", () => assert.equal(isUnsafeFetchUrl("http://100.63.255.255/"), false));
  it("does not block 100.128.x.x (just above CGNAT)", () => assert.equal(isUnsafeFetchUrl("http://100.128.0.0/"), false));
});
