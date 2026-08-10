import {
  checkRateLimit,
  configureRateLimitStore,
  createMemoryStore,
} from "./lib/rate-limit.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const memoryFallback = createMemoryStore();
const clean = (value) => String(value || "").trim();
const escapeHtml = (value) =>
  clean(value).replace(
    /[&<>'"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char],
  );
const clientIp = (request) =>
  clean(request.headers["x-forwarded-for"]).split(",")[0] ||
  clean(request.headers["x-real-ip"]) ||
  "unknown";

async function enforceLimit(response, key, options) {
  let result;
  try {
    result = await checkRateLimit(key, options);
  } catch {
    result = await checkRateLimit(key, { ...options, store: memoryFallback });
  }
  if (result.ok) return true;
  response.setHeader("Retry-After", String(result.retryAfterSec));
  response.status(429).json({
    message: "Too many requests. Please wait a few minutes and try again.",
  });
  return false;
}

export { configureRateLimitStore };

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed." });
  }

  const ip = clientIp(request);
  const now = Date.now();
  if (
    !(await enforceLimit(response, `ip:${ip}`, {
      limit: 5,
      windowMs: 15 * 60 * 1000,
      now,
    }))
  ) {
    return response;
  }

  let body;
  try {
    body =
      typeof request.body === "string"
        ? JSON.parse(request.body)
        : request.body || {};
  } catch {
    return response.status(400).json({ message: "Invalid request." });
  }

  if (clean(body.website)) return response.status(200).json({ ok: true });

  const startedAt = Number(body.startedAt);
  if (!startedAt || now - startedAt < 800 || now - startedAt > 2 * 60 * 60 * 1000) {
    return response.status(400).json({ message: "Please refresh the page and try again." });
  }

  const name = clean(body.name);
  const email = clean(body.email).toLowerCase();
  const company = clean(body.company);
  const message = clean(body.message);
  const kind = body.kind === "booking" ? "booking" : "contact";

  if (
    name.length < 2 ||
    name.length > 80 ||
    !emailPattern.test(email) ||
    email.length > 160 ||
    message.length < 20 ||
    message.length > 4000 ||
    company.length > 120
  ) {
    return response.status(400).json({
      message: "Please check the highlighted information and try again.",
    });
  }

  const preferredDate = clean(body.preferredDate);
  const preferredWindow = clean(body.preferredWindow);
  if (
    kind === "booking" &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) || !preferredWindow)
  ) {
    return response
      .status(400)
      .json({ message: "Choose a preferred date and time window." });
  }

  if (
    !(await enforceLimit(response, `email:${email}`, {
      limit: 3,
      windowMs: 60 * 60 * 1000,
      now,
    }))
  ) {
    return response;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return response.status(503).json({
      message:
        "Secure email delivery is being connected. Please email us directly for now.",
    });
  }

  const details =
    kind === "booking"
      ? `<p><strong>Preferred date:</strong> ${escapeHtml(preferredDate)}<br><strong>Preferred window:</strong> ${escapeHtml(preferredWindow)}</p>`
      : "";
  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject:
        kind === "booking"
          ? `Working session request — ${name}`
          : `New project inquiry — ${name}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:640px"><h1>${
        kind === "booking" ? "Working session request" : "Project inquiry"
      }</h1><p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(
        email,
      )}<br><strong>Company:</strong> ${escapeHtml(company) || "Not provided"}</p>${details}<p><strong>Context</strong></p><p style="white-space:pre-wrap">${escapeHtml(
        message,
      )}</p></div>`,
    }),
  });
  const data = await result.json().catch(() => ({}));
  if (!result.ok) {
    return response.status(502).json({
      message: "Email delivery failed. Please email us directly.",
      detail: data.message,
    });
  }
  return response.status(200).json({ ok: true, id: data.id });
}
