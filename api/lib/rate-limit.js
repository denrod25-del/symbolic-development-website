const DEFAULT_LIMIT = 5;
const DEFAULT_WINDOW_MS = 15 * 60 * 1000;

function asPositiveInt(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : fallback;
}

export function createMemoryStore(map = new Map()) {
  return {
    backend: "memory",
    async increment(key, windowMs, now = Date.now()) {
      const existing = map.get(key);
      if (!existing || existing.resetAt <= now) {
        const resetAt = now + windowMs;
        map.set(key, { count: 1, resetAt });
        return { count: 1, resetAt };
      }
      existing.count += 1;
      map.set(key, existing);
      return { count: existing.count, resetAt: existing.resetAt };
    },
  };
}

export function createUpstashStore({ url, token, fetchImpl = fetch }) {
  const endpoint = String(url || "").replace(/\/$/, "");
  return {
    backend: "upstash",
    async increment(key, windowMs) {
      const seconds = Math.max(1, Math.ceil(windowMs / 1000));
      const response = await fetchImpl(`${endpoint}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, seconds, "NX"],
          ["PTTL", key],
        ]),
      });
      if (!response.ok) {
        throw new Error(`Upstash rate-limit request failed with ${response.status}`);
      }
      const payload = await response.json();
      const count = asPositiveInt(payload?.[0]?.result, 1);
      const pttl = Number(payload?.[2]?.result);
      const resetAt = Date.now() + (Number.isFinite(pttl) && pttl > 0 ? pttl : windowMs);
      return { count, resetAt };
    },
  };
}

const defaultMemoryStore = createMemoryStore();

export function resolveRateLimitStore(env = process.env, memoryStore = defaultMemoryStore) {
  const url = String(env.UPSTASH_REDIS_REST_URL || "").trim();
  const token = String(env.UPSTASH_REDIS_REST_TOKEN || "").trim();
  if (url && token) return createUpstashStore({ url, token });
  return memoryStore;
}

let activeStore = null;

export function configureRateLimitStore(store) {
  activeStore = store || null;
}

export function getRateLimitStore() {
  return activeStore || resolveRateLimitStore();
}

export async function checkRateLimit(key, {
  limit = DEFAULT_LIMIT,
  windowMs = DEFAULT_WINDOW_MS,
  store = getRateLimitStore(),
  now = Date.now(),
} = {}) {
  const safeLimit = asPositiveInt(limit, DEFAULT_LIMIT);
  const safeWindow = asPositiveInt(windowMs, DEFAULT_WINDOW_MS);
  const namespacedKey = `rl:contact:${key}`;
  const { count, resetAt } = await store.increment(namespacedKey, safeWindow, now);
  const retryAfterSec = Math.max(1, Math.ceil((resetAt - now) / 1000));
  const ok = count <= safeLimit;
  return {
    ok,
    count,
    remaining: Math.max(0, safeLimit - count),
    retryAfterSec,
    resetAt,
    backend: store.backend || "memory",
  };
}
