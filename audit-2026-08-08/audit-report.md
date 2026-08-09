# Symbolic Development Website Audit — August 8, 2026

## Audit scope

Combined UX, responsive, interaction, accessibility, route-health, dependency, and deployment-readiness review of the SDDS marketing site. The audited user goal was to understand the company, evaluate its work, read technical material, and start a conversation.

## Flow steps and health

1. **Homepage entry — healthy after repair.** The local preview was initially stale because its server had stopped, which left the hero image unavailable. The preview was restarted and the hero asset now loads at its native 1254 × 1254 resolution. Evidence: `11-fixed-home-desktop.png`.
2. **Selected work — healthy.** Six product cards, six internal case studies, and six distinct external product destinations render without horizontal overflow. Evidence: `02-work.png`.
3. **Case-study evaluation — healthy after repair.** Dashboard navigation now has accessible names and pressed states, decorative filters no longer masquerade as working controls, and headings follow H1 → H2 → H3 order. Evidence: `10-fixed-case-study.png`.
4. **Mobile navigation — healthy after repair.** The menu and wordmark now provide 44 px targets, opening locks background scroll, Escape closes the menu, focus remains on the trigger, and the page has no horizontal overflow at 390 × 844. Evidence: `12-fixed-mobile-menu.png`.
5. **Featured-product comparison — healthy after repair.** The tab list now uses a roving tab stop, connects each tab to its panel, and supports Arrow Left/Right, Home, and End keyboard behavior.
6. **Inquiry flow — healthy.** Required-field validation focuses the first invalid field; a valid local submission produces a semantic status message. The reserved 555 placeholder number was removed while email and booking remain available. Evidence: `13-fixed-contact.png` and `07-contact-success.png`.
7. **Insights discovery — healthy.** Category buttons expose pressed state, filtering updates the live result count, and the AI filter reduces the list from eight articles to one without overflow. Evidence: `08-insights-filtered.png`.
8. **Supporting routes — healthy.** Services, booking, article, privacy, terms, and not-found screens each render a unique title, H1, main landmark, navigation, footer, and contained desktop layout.

## Confirmed strengths

- The Option 1 composition, restrained metallic palette, typography, hero artwork, and responsive hierarchy remain intact.
- Primary acquisition paths are clear: work, services, insights, inquiry, and booking.
- Forms use visible labels, autocomplete hints, required constraints, semantic status/alert regions, and keyboard-visible focus.
- External product links are separated from internal case-study links and open in new tabs with safe rel attributes.
- Reduced-motion handling, semantic landmarks, responsive reflow, and route-specific metadata are present.

## Bugs fixed

- **P1 — unnamed mobile dashboard buttons:** labels were visually hidden on small screens without replacement accessible names. Added `aria-label`, `aria-pressed`, titles, and explicit button types.
- **P1 — incomplete tab keyboard model:** added roving `tabIndex`, tab/panel relationships, arrow-key navigation, Home, and End behavior.
- **P2 — false button affordances:** converted nonfunctional dashboard filter/activity buttons into descriptive status text.
- **P2 — heading-level skips:** promoted dashboard section structure to H2/H3 semantics while retaining existing visuals.
- **P2 — mobile menu behavior:** increased targets to 44 px, connected the trigger to its navigation, locked background scroll, and added Escape handling.
- **P2 — missing current-page context:** added `aria-current` across the primary navigation and homepage wordmark.
- **P2 — invalid project fragment ID:** replaced the space-containing Lava Leap card ID with its route slug.
- **P2 — placeholder contact data:** removed the reserved 555 phone number until a verified number is provided.
- **Security — vulnerable build chain:** upgraded Vite to 6.4.3 and updated Nano ID/PostCSS transitive dependencies. `npm audit --omit=dev` now reports zero vulnerabilities.

## Verification

- Production build: passed.
- Contact API tests: 4/4 passed.
- Sites worker/package tests: 4/4 passed.
- Dependency audit: 0 vulnerabilities.
- Browser console on fresh final homepage and contact sessions: no errors or warnings.
- Desktop and 390 × 844 mobile overflow checks: passed.

## Evidence limits

- This is not a claim of full WCAG conformance. A real screen-reader pass, 200% zoom review, and automated contrast/accessibility scanner would still be appropriate before a formal accessibility certification.
- Local inquiry completion uses the intentional preview response; real outbound delivery remains gated by production Resend configuration.
- External product websites were treated as destinations and were not individually audited in this pass.
- No synthetic Lighthouse performance run was included; build size and rendered behavior were checked, but lab performance scores were not reproduced.
