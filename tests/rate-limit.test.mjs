import test from "node:test";
import assert from "node:assert/strict";
import {
  checkRateLimit,
  createMemoryStore,
  createUpstashStore,
  resolveRateLimitStore,
} from "../api/lib/rate-limit.js";

test("memory store allows traffic under the limit and blocks after", async () => {
  const store = createMemoryStore();
  const options = { limit: 2, windowMs: 60_000, store, now: 1_000 };

  const first = await checkRateLimit("ip:203.0.113.1", options);
  const second = await checkRateLimit("ip:203.0.113.1", options);
  const third = await checkRateLimit("ip:203.0.113.1", options);

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(third.ok, false);
  assert.equal(third.retryAfterSec > 0, true);
});

test("memory store is shared across callers, simulating multiple serverless isolates", async () => {
  const shared = createMemoryStore(new Map());
  const options = { limit: 1, windowMs: 60_000, store: shared, now: 5_000 };

  const a = await checkRateLimit("ip:198.51.100.9", options);
  const b = await checkRateLimit("ip:198.51.100.9", { ...options, now: 5_100 });

  assert.equal(a.ok, true);
  assert.equal(b.ok, false);
  assert.equal(b.backend, "memory");
});

test("memory store resets after the window elapses", async () => {
  const store = createMemoryStore();
  const blocked = await checkRateLimit("ip:192.0.2.55", {
    limit: 1,
    windowMs: 1_000,
    store,
    now: 10_000,
  });
  const allowed = await checkRateLimit("ip:192.0.2.55", {
    limit: 1,
    windowMs: 1_000,
    store,
    now: 11_001,
  });

  assert.equal(blocked.ok, true);
  assert.equal(allowed.ok, true);
});

test("resolveRateLimitStore prefers Upstash when credentials exist", () => {
  const store = resolveRateLimitStore({
    UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
    UPSTASH_REDIS_REST_TOKEN: "token",
  });
  assert.equal(store.backend, "upstash");
});

test("resolveRateLimitStore falls back to memory without credentials", () => {
  const store = resolveRateLimitStore({});
  assert.equal(store.backend, "memory");
});

test("Upstash store increments via REST pipeline and reports retry timing", async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    return {
      ok: true,
      async json() {
        return [{ result: 3 }, { result: 1 }, { result: 45_000 }];
      },
    };
  };

  const store = createUpstashStore({
    url: "https://example.upstash.io",
    token: "secret",
    fetchImpl,
  });

  const result = await checkRateLimit("ip:203.0.113.8", {
    limit: 2,
    windowMs: 60_000,
    store,
  });

  assert.equal(result.ok, false);
  assert.equal(result.retryAfterSec, 45);
  assert.equal(result.backend, "upstash");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].body[0][0], "INCR");
  assert.equal(calls[0].body[1][0], "EXPIRE");
});
