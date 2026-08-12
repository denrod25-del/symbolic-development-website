# Symbolic Development

The production website and design-system implementation for Symbolic Development, an engineering company focused on elegant, reliable, scalable software.

## Live site

[symbolicdev.com](https://symbolicdev.com)

## Stack

- React
- Vite
- JavaScript
- Vercel

## Local development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run build
npm run test:sites
npm run test:contact
```

The production build prerenders route-specific metadata, generates the Sites-compatible output, and includes responsive product imagery, structured data, and accessible client-acquisition flows.

## Email delivery

Contact and booking requests use the server-side `/api/contact` route. Configure the variables listed in `.env.example` in Vercel for production email delivery. The endpoint remains intentionally unavailable when any required variable is missing.

Campaign parameters (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term`) are retained for the browser session and included with qualified inquiries so traffic sources can be evaluated without a CRM. Set the optional public `VITE_SCHEDULING_URL` to an HTTPS Calendly or equivalent booking page to expose live availability; when it is unset, the verified request-and-confirm flow remains active.
