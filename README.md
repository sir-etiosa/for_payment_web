# FirstRound — Merchant Payments Revamp

A repositioning of FirstRound from a token-first crypto site into a
**merchant-first payment network**, where `$FOR` is demoted to the underlying
settlement rail.

Built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## Quick start

```bash
# 1. If a partial node_modules folder exists, remove it first:
rm -rf node_modules package-lock.json

# 2. Install and run:
npm install
npm run dev
```

Then open http://localhost:3000.

> A clean `npm install` takes a few seconds on a normal machine.

---

## Design direction — "the settlement ledger"

The old hero showed a token price chart. The new one shows **money clearing in
real time** (customer → network → settled), with fees and settlement times in
monospace, like a payment terminal. Money/settlement figures are always set in
mono — that's the visual signature of the brand.

**Tokens** (see `tailwind.config.ts`):

| Role | Hex | Use |
|------|-----|-----|
| `ink` | `#0E1530` | Deep navy / dark sections |
| `navy` | `#222A44` | Existing brand navy |
| `paper` | `#F7F8FB` | Page background |
| `settle` | `#16C98D` | "Cleared / settled" accent |
| `token` | `#E6B450` | `$FOR` — a *supporting* gold accent only |

**Type:** Space Grotesk (display) · IBM Plex Sans (body) · IBM Plex Mono (all
money/settlement data). Loaded via `next/font/google` in `app/layout.tsx`.

---

## What changed vs. the old site

- **Staking / rewards language** — removed from nav, footer, steps, and copy.
- **`$FOR`** — moved from the headline to a single lower-page section
  (`ForEcosystem.tsx`) in the gold supporting color, framed as a rail merchants
  never have to touch.
- **Audience** — merchants and finance teams, throughout.
- **Hero** — payments, settlement, and business adoption.
- **Security** — new compliance section: non-custodial architecture, merchant
  verification (KYC), privacy by design, ISO 20022 alignment.
- **Events** — replaced with payment use cases, settlement flow, and a
  dedicated merchants page.

---

## Project structure

```
app/
  layout.tsx                     Root layout, fonts, nav + footer
  page.tsx                       Homepage
  globals.css                    Tailwind layers + base styles
  merchants/page.tsx             Dedicated merchant page
  api/
    merchant-onboarding/route.ts POST — merchant application intake
    contact/route.ts             POST — contact form intake
components/
  Navbar.tsx  Footer.tsx
  Hero.tsx  SettlementVisual.tsx (signature live-settlement widget)
  TrustStrip.tsx  PaymentUseCases.tsx  HowSettlementWorks.tsx
  Compliance.tsx  ForEcosystem.tsx  MerchantCTA.tsx
  ContactForm.tsx  ContactSection.tsx
  MerchantBenefits.tsx  FeeSavings.tsx (interactive calculator)
  MerchantOnboardingSteps.tsx  OnboardingForm.tsx
  ui/Button.tsx  ui/Section.tsx
lib/
  constants.ts                   All copy + network figures (edit here)
```

---

## Before you ship

1. **Real numbers.** Settlement time, fees, uptime, and the fee-calculator
   baseline are placeholders in `lib/constants.ts`. Replace with your actuals.
2. **Wire the API routes.** `app/api/*/route.ts` validate input and `console.log`
   the payload. Each has a `// TODO` marking where to persist + notify (DB / CRM
   / Slack), or forward to your existing JotForm intake.
3. **Privacy policy.** The footer links to `/privacy-policy`, which exists on
   your live site but not in this project. Add the page or repoint the link.
4. **Images.** This build is image-light by design (the hero is a live widget,
   not a screenshot). Drop product/app imagery into `PaymentUseCases` or the
   merchant hero if you want it.

---

## API reference

**`POST /api/merchant-onboarding`**
```json
{ "contactName": "...", "company": "...", "email": "...",
  "website": "...", "volume": "...", "channels": ["In-store", "Online"] }
```
Returns `201 { ok: true }` or `400 { error }`.

**`POST /api/contact`**
```json
{ "firstName": "...", "lastName": "...", "email": "...",
  "company": "...", "message": "..." }
```
Returns `200 { ok: true }` or `400 { error }`.
