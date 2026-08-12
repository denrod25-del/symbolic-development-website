# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Durable Project Decisions

- Homepage redesign source of truth: `denrod25-del/test-snake` PR #6 `symbolic-redesign/` (ported into `src/`). Anatomy: fading monolith hero with one primary CTA + text link + live-status line; carbon hairline stats band with count-up; numbered product rail + preview shell (status pills, facts, crossfade; mobile chip row with edge fade); situation hairline rows; connected approach timeline; sticky engagement intro; “Built with” mono strip; `--ink-2: #b4b4b4` for AA small text; blue reserved for interactive accents; green/amber for live/beta status; staggered reveal-on-scroll. Keep all seven live products even though the prototype rail omitted Lava Leap. Featured screenshots stay `object-fit: contain` (no cover crop).
- `symbolicdev.com` is the purchased final production domain. Use the apex domain as canonical and redirect `www` to the apex.
- Phase 2 extends the selected Option 1 visual system into a multi-page client-acquisition flow while preserving the homepage as the visual source of truth.
- Phase 3 completes the portfolio with dedicated StormRadar, WIYW, and DeedScout case studies and product-specific dashboard states.
- Lava Leap is the sixth official product at https://lava-leap-landing.vercel.app. Position it as a free browser-and-Android arcade climber with ten gameplay systems, four climbers, live global and daily leaderboards, no required account, and public source. Preserve the selected Option 1 visual system when presenting it inside SDDS.
- Phase 4 adds a filterable Insights index and full engineering article routes, extending the Option 1 system into a technical thought-leadership and client-acquisition flow.
- Phase 5 prepares launch operations with secure inquiry and booking-request flows, route metadata, structured data, analytics hooks, legal pages, sitemap/robots files, and a branded 404. Outbound email remains gated by Resend environment configuration; final-domain activation uses `symbolicdev.com`.
- The verified production deployment remains available at `https://symbolic-development-design-system.vercel.app`, but `https://symbolicdev.com` is the canonical public URL.
- Official live product destinations: AuditScout at `https://auditscout.vercel.app`, WIYW at `https://floridawiyw.com`, StormRadar at `https://stormradar.vercel.app`, and DeedScout at `https://deedscout.netlify.app`. Preserve internal case studies while exposing these as distinct external product links.
- ClawMonitor is the fifth official product, available at `https://denrod25-del.github.io/ClawMonitor/index.html`. Its SDDS positioning is developer tooling and system observability; grounded proof points are Windows 10/11 support, 35 automated tests, three selectable palettes, and an MIT license.
- The client-acquisition framework leads with demonstrable product proof: use grounded public facts only, never placeholder or fabricated testimonials, connect capabilities to buyer situations, show real product screenshots without cropping, explain engagement models clearly, and qualify inquiries by stage, timing, engagement, and investment range.
- Featured-product website screenshots must remain fully visible at every viewport; scale them proportionally inside the showcase rather than cropping them with a cover treatment.
- ScamWatch is the seventh official product at `https://scamwatch-seven.vercel.app`. Position it as public-benefit consumer protection intelligence for suspicious links, messages, phone numbers, and email. Ground claims in its calibrated risk explanations, Florida threat alerts, privacy commitments, recovery guidance, and official FTC/FBI IC3/state routing; clearly preserve its beta/demo-data caveats.
- Do not publish placeholder contact data. The reserved 555 phone number was removed during the August 2026 audit; keep phone contact omitted until the user supplies a verified number.
- Client-acquisition attribution persists standard UTM parameters for the browser session and includes them with qualified inquiry emails. Live calendar availability is optional and must be activated only with a user-owned HTTPS scheduling URL through `VITE_SCHEDULING_URL`; until then, preserve the verified request-and-confirm booking flow.
- The homepage monolith must scale fluidly with both viewport width and height: it should remain a dominant right-side hero element on ultrawide monitors, stay contained without cropping on standard desktops, and recede behind content on tablet and mobile layouts.
