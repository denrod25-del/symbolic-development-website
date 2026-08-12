# Homepage Hero Responsive QA

## Source and target

- Source evidence: `audits/hero-responsive-2026-08-11/source-ultrawide.png`
- Updated implementation: `audits/hero-responsive-2026-08-11/implementation-2048x1120.png`
- Combined comparison: `audits/hero-responsive-2026-08-11/comparison-ultrawide.png`
- Tested routes/state: homepage, initial hero state
- Tested viewports: 2048 × 1120 desktop, 900 × 900 tablet, 390 × 844 mobile

## Pass 1 — responsive image defect

### P1 — Hero artwork was undersized on ultrawide displays

- Surface: imagery, layout, responsiveness
- Evidence: the source screenshot shows the square monolith constrained to roughly 520 px on the far right, leaving an excessive empty center and weakening the intended hero balance.
- Cause: `.hero-art` used `min(72vh, 640px)`, so its 640 px ceiling prevented the image from scaling with wide desktop viewports.
- Fix: changed the desktop size to a fluid width-and-height-aware clamp, moved the art inward with a bounded responsive offset, and switched to `object-fit: contain` so the full asset remains visible.

## Pass 2 — final verification

- Desktop (2048 × 1120): artwork renders at approximately 986 × 986 px, remains fully visible, and balances the copy without collision.
- Tablet (900 × 900): artwork renders at 640 × 640 px behind the content with reduced opacity; no horizontal overflow or clipped controls.
- Mobile (390 × 844): artwork renders at approximately 343 × 343 px as a supporting background element; headline, CTAs, and product signal remain readable and usable.
- Image fidelity: the original WebP asset is preserved without cropping or distortion.
- Typography and spacing: no new wrapping, overlap, or hierarchy regressions were observed.
- Accessibility and behavior: content order, semantic structure, focus behavior, and reduced-motion rules are unchanged.
- Final severity count: P0 0, P1 0, P2 0.

## Result

Passed. The homepage monolith now scales proportionally across ultrawide desktop, tablet, and mobile viewports while preserving the existing visual system.
