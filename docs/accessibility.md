# Accessibility

## Target

WCAG 2.2 AA.

## Status: implemented practices, not yet a certified audit

The items below were built into the frontend and spot-checked manually during development. **No formal, independent WCAG 2.2 AA audit (automated + assistive-technology testing) has been performed as part of this engagement.** Treat this page as a list of implemented practices, not a compliance certification.

## Implemented practices

- Semantic HTML: `<nav>`, `<main>`, `<header>`, `<footer>`, heading hierarchy (`h1`-`h3`) on every page.
- Skip-navigation link (`.skip-link` in `styles/globals.css`, first focusable element in `app/layout.tsx`).
- Visible focus indicators via Tailwind `focus-visible:outline` utilities on all interactive nav/button elements.
- Descriptive, unique page titles via Next.js `Metadata` exports on every route (e.g., "Analyze a Case | FinGuard-AI").
- Screen-reader labels: `aria-label`, `aria-expanded`, `aria-controls` on the mobile nav toggle; `sr-only` table captions on every data table (Rule Explorer, dashboard high-risk queue, score-contribution tables); `role="alert"` on urgency/conflict warnings.
- Accessible form structure: `<label>` wraps every input; `<fieldset>`/`<legend>` group the urgency-screening yes/no/unknown controls.
- No color-only meaning: every `SeverityBadge` pairs a color with an icon glyph (●/▲/■/★) and the text label ("Low"/"Moderate"/"High"/"Critical"); score bars are always paired with the numeric score and an `aria-label` description.
- Reduced-motion support: a global `@media (prefers-reduced-motion: reduce)` rule in `styles/globals.css` collapses all animation/transition durations.
- Mobile-friendly tap targets: nav links and buttons use Tailwind spacing (`px-4 py-2`/`py-3`) sized well above the 44x44px guideline.
- Every chart in the dashboard is accompanied by a text description of what it shows (`ChartCard` description prop) and the underlying data is also available in the high-risk case table (a real `<table>`, not canvas-only).

## Known gaps / roadmap

- No automated accessibility test run (e.g., `axe-core`, Lighthouse CI) is wired into `.github/workflows/` yet -- this is a placeholder for a follow-up PR.
- No assistive-technology (screen reader) manual pass has been recorded.
- Text-scaling behavior at 200% zoom has not been systematically verified across every page.
- Full keyboard-only navigation of the multi-step Analyze wizard (including the dynamic redaction-preview step) has been spot-checked but not exhaustively tested.

## How to verify locally

```bash
cd frontend
npm run build && npm run start
# then run axe DevTools or Lighthouse against http://localhost:3000
```
