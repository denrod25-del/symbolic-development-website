# Lighthouse homepage audit

Date: 2026-08-08  
Lighthouse: 13.4.1  
Target: local production build, mobile/default Lighthouse configuration

## Scores

| Category | Score |
|---|---:|
| Performance | 67 |
| Accessibility | 100 |
| Best Practices | 96 |
| SEO | 92 |

## Core measurements

| Metric | Result |
|---|---:|
| First Contentful Paint | 3.3 s |
| Largest Contentful Paint | 9.8 s |
| Total Blocking Time | 0 ms |
| Cumulative Layout Shift | 0 |
| Speed Index | 4.4 s |
| Time to Interactive | 9.8 s |

## Main findings

1. **Hero image is the LCP bottleneck.** `hero-monolith.png` is the LCP element and transfers roughly 1.24 MB. Lighthouse estimates about 1.02 MB of avoidable image weight.
2. **The LCP request is discovered late.** The hero image is introduced by the client-rendered React tree instead of being discoverable from the initial document. It is not preload-hinted.
3. **Remote font CSS blocks rendering.** Google Fonts plus the application stylesheet account for an estimated 1.74 s of render-blocking delay in the simulated mobile run.
4. **The JavaScript bundle contains unused code on the homepage.** Lighthouse estimates roughly 57 KiB of unused compressed JavaScript, mainly because all routes and product experiences ship in one bundle.
5. **Missing favicon lowers Best Practices.** `/favicon.ico` returns 404 and is logged as a browser console error.
6. **Three service links use generic text.** The repeated “Learn more” labels lower the SEO score; their accessible text should name the associated service.

## Recommended order

1. Convert and resize the hero image to AVIF/WebP, add explicit dimensions, `fetchpriority="high"`, and preload it from the document head.
2. Self-host and preload only the required font subsets, or otherwise remove Google Fonts CSS from the critical rendering path.
3. Add a real favicon and explicit icon metadata.
4. Replace generic service-link labels with descriptive names.
5. Split route-level JavaScript and lazy-load non-homepage case studies and article content.

The HTML and JSON reports in this folder contain the complete Lighthouse evidence.

## Optimized result

After implementation, the final mobile Lighthouse run reached:

| Category | Before | After |
|---|---:|---:|
| Performance | 67 | **95** |
| Accessibility | 100 | **100** |
| Best Practices | 96 | **100** |
| SEO | 92 | **100** |

| Metric | Before | After |
|---|---:|---:|
| First Contentful Paint | 3.3 s | **2.0 s** |
| Largest Contentful Paint | 9.8 s | **2.6 s** |
| Total Blocking Time | 0 ms | **10 ms** |
| Cumulative Layout Shift | 0 | **0.007** |
| Speed Index | 4.4 s | **2.0 s** |

Implemented changes:

- Replaced the 1.24 MB hero PNG request with responsive 6–28 KB WebP sources.
- Preloaded and prioritized the correct responsive hero request.
- Self-hosted the three brand typefaces and removed render-blocking Google Fonts CSS.
- Added a favicon and descriptive service links.
- Lazy-loaded below-fold product screenshots.
- Replaced the Framer Motion runtime with lightweight CSS motion, reducing the entry bundle from 139.4 KB to 98.5 KB gzip.

Final evidence: `homepage-95.report.html` and `homepage-95.report.json`.
