import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const vercel = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));

test("vercel.json defines global security headers", () => {
  const global = vercel.headers?.find((entry) => entry.source === "/(.*)");
  assert.ok(global, "expected a global headers entry");

  const map = Object.fromEntries(
    global.headers.map((header) => [header.key, header.value]),
  );

  assert.match(map["Content-Security-Policy"], /default-src 'self'/);
  assert.match(map["Content-Security-Policy"], /frame-ancestors 'none'/);
  assert.equal(map["X-Frame-Options"], "DENY");
  assert.equal(map["X-Content-Type-Options"], "nosniff");
  assert.equal(map["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.match(map["Permissions-Policy"], /camera=\(\)/);
  assert.equal(map["Cross-Origin-Opener-Policy"], "same-origin");
  assert.match(map["Strict-Transport-Security"], /max-age=63072000/);
});

test("vercel.json tightens CSP for API responses", () => {
  const api = vercel.headers?.find((entry) => entry.source === "/api/(.*)");
  assert.ok(api, "expected an API headers entry");
  const csp = api.headers.find((header) => header.key === "Content-Security-Policy");
  assert.match(csp.value, /default-src 'none'/);
});
