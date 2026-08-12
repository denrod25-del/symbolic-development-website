#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientDir = path.join(root, "dist", "client");
const sourceHtml = readFileSync(path.join(clientDir, "index.html"), "utf8");
const base = "https://symbolicdev.com";

const routes = {
  "/": ["Symbolic Development — Software Built to Endure", "Elegant, reliable software and infrastructure engineered with purpose.", "/assets/og/home.webp"],
  "/work": ["Selected Work — Symbolic Development", "Eight live products with inspectable decisions, grounded proof, and public release evidence.", "/assets/og/auditscout.webp"],
  "/work/auditscout": ["AuditScout Case Study — Symbolic Development", "A public website-audit experience that turns a URL into a prioritized scorecard and practical next actions.", "/assets/og/auditscout.webp"],
  "/work/stormradar": ["StormRadar Case Study — Symbolic Development", "Job-site weather intelligence that helps contractors understand when conditions are workable.", "/assets/og/stormradar.webp"],
  "/work/wiyw": ["WIYW Case Study — Symbolic Development", "Plain-language Florida drinking-water reports searchable by city, ZIP code, or utility.", "/assets/og/wiyw.webp"],
  "/work/deedscout": ["DeedScout Case Study — Symbolic Development", "Florida tax-deed and public-record research organized county by county.", "/assets/og/deedscout.webp"],
  "/work/clawmonitor": ["ClawMonitor Case Study — Symbolic Development", "A slim Windows monitor for system performance and local developer-service health.", "/assets/og/clawmonitor.webp"],
  "/work/lava-leap": ["Lava Leap Case Study — Symbolic Development", "A free browser-and-Android arcade climber with layered movement and live competition.", "/assets/og/lava-leap.webp"],
  "/work/scamwatch": ["ScamWatch Case Study — Symbolic Development", "Calibrated scam intelligence for suspicious links, messages, phone numbers, and email.", "/assets/og/scamwatch.webp"],
  "/work/fl-plumbing-tools": ["FL Plumbing Tools Case Study — Symbolic Development", "Florida-focused plumbing calculators, permit guides, and homeowner planning tools.", "/assets/products/fl-plumbing-tools-1200.webp"],
  "/services": ["Engineering Services — Symbolic Development", "Custom software, AI, automation, mobile, cloud, integrations, and technical consulting.", "/assets/og/home.webp"],
  "/insights": ["Engineering Insights — Symbolic Development", "Engineering perspectives on software, AI, automation, security, architecture, and operations.", "/assets/og/home.webp"],
  "/insights/systems-that-endure": ["What Makes a Software System Endure? — Symbolic Development", "The architectural and product decisions that keep software useful long after its first release.", "/assets/og/home.webp", "article"],
  "/insights/ai-that-earns-trust": ["Building AI Features That Earn Operational Trust — Symbolic Development", "Move beyond impressive demos with bounded behavior, visible confidence, and accountable human decisions.", "/assets/og/home.webp", "article"],
  "/insights/automation-that-compounds": ["Automation Should Compound, Not Conceal — Symbolic Development", "A practical framework for removing repetitive work without burying the exceptions teams need to see.", "/assets/og/home.webp", "article"],
  "/insights/threat-modeling-as-design": ["Threat Modeling Is a Product Design Practice — Symbolic Development", "Security becomes more useful when risks are connected to users, workflows, and system behavior early.", "/assets/og/home.webp", "article"],
  "/insights/architecture-for-evolution": ["Architecture for Evolution, Not Ceremony — Symbolic Development", "Make consequential technical decisions without creating a process that slows delivery.", "/assets/og/home.webp", "article"],
  "/insights/water-operations-need-context": ["Water Operations Need Context — Symbolic Development", "Connect field signals, asset history, and response workflows into one useful operating picture.", "/assets/og/home.webp", "article"],
  "/insights/technology-due-diligence": ["A Practical Technology Due-Diligence Lens — Symbolic Development", "Evaluate software capability through business continuity, operating risk, and the ability to change.", "/assets/og/home.webp", "article"],
  "/insights/building-stormradar": ["Shaping StormRadar's Command Layer — Symbolic Development", "Inside the product decisions that turned high-volume environmental signals into calm operational guidance.", "/assets/og/stormradar.webp", "article"],
  "/booking": ["Book a Working Session — Symbolic Development", "Request a focused introductory working session with Symbolic Development.", "/assets/og/home.webp"],
  "/privacy": ["Privacy — Symbolic Development", "How Symbolic Development handles website and inquiry information.", "/assets/og/home.webp"],
  "/terms": ["Terms — Symbolic Development", "Terms governing use of the Symbolic Development website.", "/assets/og/home.webp"],
};

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function replaceOrInsert(html, matcher, tag) {
  return matcher.test(html) ? html.replace(matcher, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function render(route, data, noIndex = false) {
  const [title, description, imagePath, type = "website"] = data;
  const canonical = `${base}${route === "/" ? "/" : route}`;
  const image = `${base}${imagePath}`;
  let html = sourceHtml.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(title)}</title>`);
  if (route !== "/") {
    html = html.replace(/\s*<link\s+rel="preload"\s+as="image"[\s\S]*?fetchpriority="high"\s*\/>/i, "");
  }
  const tags = [
    [/\s*<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(description)}" />`],
    [/\s*<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`],
    [/\s*<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`],
    [/\s*<meta\s+property="og:url"[^>]*>/i, `<meta property="og:url" content="${canonical}" />`],
    [/\s*<meta\s+property="og:type"[^>]*>/i, `<meta property="og:type" content="${type}" />`],
    [/\s*<meta\s+property="og:image"[^>]*>/i, `<meta property="og:image" content="${image}" />`],
    [/\s*<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`],
    [/\s*<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`],
    [/\s*<meta\s+name="twitter:image"[^>]*>/i, `<meta name="twitter:image" content="${image}" />`],
    [/\s*<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonical}" />`],
  ];
  for (const [matcher, tag] of tags) html = replaceOrInsert(html, matcher, tag);
  if (noIndex) html = html.replace("</head>", '    <meta name="robots" content="noindex, nofollow" />\n  </head>');
  const structured = { "@context": "https://schema.org", "@type": type === "article" ? "BlogPosting" : "WebPage", name: title, headline: type === "article" ? title : undefined, description, url: canonical, image };
  html = html.replace("</head>", `    <script id="sdds-structured-data" type="application/ld+json">${JSON.stringify(structured)}</script>\n  </head>`);
  return html;
}

for (const [route, data] of Object.entries(routes)) {
  const target = route === "/" ? path.join(clientDir, "index.html") : path.join(clientDir, ...route.slice(1).split("/"), "index.html");
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, render(route, data));
}

const notFound = ["Page Not Found — Symbolic Development", "The requested page could not be found.", "/assets/og/home.webp"];
writeFileSync(path.join(clientDir, "404.html"), render("/404", notFound, true));
console.log(`Prepared route metadata for ${Object.keys(routes).length} indexable routes and a noindex 404.`);
