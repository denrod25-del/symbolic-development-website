import test from "node:test";
import assert from "node:assert/strict";
import handler, { configureRateLimitStore } from "../api/contact.js";
import { createMemoryStore } from "../api/lib/rate-limit.js";

function responseMock() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(value) {
      this.body = value;
      return this;
    },
  };
}

const validBody = {
  startedAt: Date.now() - 2000,
  name: "Alex Morgan",
  email: "alex@example.com",
  company: "Meridian",
  message:
    "We need help replacing a brittle operational workflow with dependable software.",
};

test.beforeEach(() => {
  configureRateLimitStore(createMemoryStore());
});

test("rejects non-POST requests", async () => {
  const response = responseMock();
  await handler({ method: "GET", headers: {} }, response);
  assert.equal(response.statusCode, 405);
});

test("silently accepts honeypot submissions", async () => {
  const response = responseMock();
  await handler(
    {
      method: "POST",
      headers: { "x-forwarded-for": "192.0.2.1" },
      body: { website: "bot-field" },
    },
    response,
  );
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.ok, true);
});

test("validates inquiry fields", async () => {
  const response = responseMock();
  await handler(
    {
      method: "POST",
      headers: { "x-forwarded-for": "192.0.2.2" },
      body: {
        startedAt: Date.now() - 2000,
        name: "A",
        email: "invalid",
        message: "short",
      },
    },
    response,
  );
  assert.equal(response.statusCode, 400);
});

test("keeps valid requests gated until delivery is configured", async () => {
  const response = responseMock();
  await handler(
    {
      method: "POST",
      headers: { "x-forwarded-for": "192.0.2.3" },
      body: validBody,
    },
    response,
  );
  assert.equal(response.statusCode, 503);
  assert.match(response.body.message, /delivery is being connected/i);
});

test("rate limits repeated posts from the same IP across shared store", async () => {
  const shared = createMemoryStore();
  configureRateLimitStore(shared);
  const ip = "198.51.100.40";

  for (let index = 0; index < 5; index += 1) {
    const response = responseMock();
    await handler(
      {
        method: "POST",
        headers: { "x-forwarded-for": ip },
        body: { ...validBody, email: `user${index}@example.com` },
      },
      response,
    );
    assert.equal(response.statusCode, 503);
  }

  const blocked = responseMock();
  await handler(
    {
      method: "POST",
      headers: { "x-forwarded-for": ip },
      body: { ...validBody, email: "blocked@example.com" },
    },
    blocked,
  );
  assert.equal(blocked.statusCode, 429);
  assert.equal(Boolean(blocked.headers["Retry-After"]), true);
});

test("rate limits repeated posts from the same email address", async () => {
  const shared = createMemoryStore();
  configureRateLimitStore(shared);
  const email = "repeat@example.com";

  for (let index = 0; index < 3; index += 1) {
    const response = responseMock();
    await handler(
      {
        method: "POST",
        headers: { "x-forwarded-for": `203.0.113.${10 + index}` },
        body: { ...validBody, email },
      },
      response,
    );
    assert.equal(response.statusCode, 503);
  }

  const blocked = responseMock();
  await handler(
    {
      method: "POST",
      headers: { "x-forwarded-for": "203.0.113.99" },
      body: { ...validBody, email },
    },
    blocked,
  );
  assert.equal(blocked.statusCode, 429);
  assert.match(String(blocked.headers["Retry-After"]), /^\d+$/);
});
