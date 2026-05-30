# PRD — Sophia Valerio · Personal Website (Phase 1)

**Document type:** Product Requirements Document
**Owner:** Product / Design
**Status:** Draft v1
**Scope:** Phase 1 — Landing / Splash screen only
**Last updated:** 30 May 2026

---

## 1. Overview & Vision

Sophia Valerio's website is a minimalist, editorial personal-brand destination built around a single idea: **authorship**. The brand promise — *your content needs your signature* — translates into a digital presence that feels composed, intentional, and quiet. Nothing competes for attention. Every element earns its place.

Phase 1 establishes the brand's first impression: a splash screen that presents only the name and a single invitation to enter. It sets the tone (calm, refined, confident) before any content is shown, and acts as the architectural and visual foundation that every future page inherits.

**Vision statement:** A site where elegance comes from restraint — generous space, warm neutral tones, and one deliberate action at a time.

---

## 2. Goals & Non-Goals

### Goals (Phase 1)

- Deliver a polished, fully responsive landing screen presenting `Sophia Valerio` and a single **Start** action.
- Establish the design system (tokens, type, spacing, motion) that all future pages reuse.
- Route the user cleanly from landing → `/home` with a tasteful transition.
- Hit top-tier performance and accessibility from day one.

### Non-Goals (explicitly out of scope for now)

- The **home page** itself — `/home` is a placeholder route only. Its content, layout, and behavior are **future scope** (see §10).
- Any portfolio, about, contact, blog, or commerce functionality.
- CMS integration, authentication, analytics dashboards, or backend services.
- Localization (PT/EN toggle) — noted as a roadmap candidate, not built now.

---

## 3. Target Audience / Personas

| Persona | Who they are | What they need | Success looks like |
|---|---|---|---|
| **The Discoverer** | Found Sophia via Instagram or a referral; first contact with the brand. | An instant read on who this is and a frictionless way in. | Recognizes the aesthetic in <2s, clicks **Start**. |
| **The Collaborator / Brand** | Agency, brand, or partner evaluating Sophia for a project. | A signal of quality and professionalism before reviewing work. | Perceives the brand as premium and considered. |
| **The Returning Fan** | Existing follower checking for new work. | Fast, predictable entry — no obstacles. | Enters and proceeds in one tap. |

**Primary device:** Mobile (Instagram-driven traffic). Design and build **mobile-first**.

---

## 4. Design Principles & Visual Identity

### 4.1 Principles

1. **Restraint over decoration.** Elegance is achieved by removing, not adding. No gradients-as-ornament, no shadows-as-drama.
2. **Space is a feature.** Negative space carries the composition.
3. **One action at a time.** The interface never asks for two decisions at once.
4. **Quiet motion.** Animation is felt more than seen.
5. **Editorial, not corporate.** Warm, human, fashion-adjacent — never a SaaS dashboard.

### 4.2 Color tokens

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#F6F2EA` | Default page background (off-white) |
| `--color-surface` | `#EDE6D8` | Subtle surfaces, alt sections (cream / sand) |
| `--color-muted` | `#D4C7B0` | Dividers, low-emphasis fills (warm beige) |
| `--color-accent` | `#8E8468` | Secondary text, borders, accents (olive-taupe) |
| `--color-secondary` | `#6A5C4C` | Button fill, strong accents (soft brown) |
| `--color-text` | `#3E342B` | Primary text & wordmark (espresso) |

**Contrast check:** `--color-text` (#3E342B) on `--color-bg` (#F6F2EA) ≈ 10.6:1 — passes WCAG AAA. Button: `--color-bg` text on `--color-secondary` (#6A5C4C) fill ≈ 6.3:1 — passes AA for normal text and AAA for large text.

### 4.3 Typography

| Role | Recommended | Fallback | Notes |
|---|---|---|---|
| **Wordmark (signature)** | A refined script/handwritten face (e.g. *Tan Mon Cheri*, *Reckless*, or a custom logotype) | `cursive` | Reserved **only** for "Sophia Valerio". Conveys the *assinatura* idea. |
| **Display / UI** | A refined neo-grotesque (e.g. *Neue Montreal*, *Söhne*, *Inter*) | system sans | Used for the button and all future body/UI text. |

**Type scale (modular, ratio ~1.25, 16px base):**

| Step | Size (rem) | Use |
|---|---|---|
| `text-xs` | 0.8 | Fine print (future) |
| `text-base` | 1.0 | Body (future) |
| `text-lg` | 1.25 | Button label |
| `text-2xl` | 2.0 | — |
| `text-4xl` | 3.0 | Wordmark (mobile) |
| `text-6xl` | 4.5 | Wordmark (desktop) |

Letter-spacing on the button label: slightly open (`+0.04em`, uppercase optional). Wordmark: natural tracking from the script face.

### 4.4 Spacing & layout

- **Base grid:** 8px. All spacing in multiples (4, 8, 16, 24, 32, 48, 64, 96).
- **Composition:** single full-viewport screen, vertically and horizontally centered.
- **Max content width:** content stays within a comfortable optical center; ample margins on all sides (min 24px mobile, 64px+ desktop).

### 4.5 Motion

- **Entrance:** wordmark fades + rises 8px over 600–800ms (`ease-out`); button follows with a 150ms stagger.
- **Button hover (desktop):** subtle fill darken (~6%) and/or 1px lift; 200ms ease.
- **Button focus:** visible focus ring using `--color-accent`.
- **Transition to /home:** brief cross-fade / dim (≤400ms) so navigation feels composed, not abrupt.
- **`prefers-reduced-motion`:** all entrance and transition animation reduces to a simple opacity change or none.

---

## 5. Information Architecture & Routing

```
/                → Landing / Splash (Phase 1 — this PRD)
/home            → Home (placeholder route; content = future scope, §10)
```

**Future routes (not built):** `/work`, `/about`, `/contact`, `/journal`.

- The **Start** button navigates to `/home`.
- `/home` should resolve to a minimal placeholder (e.g. blank styled page or "coming soon" using the same tokens) so the route never 404s during Phase 1.
- Browser back from `/home` returns to `/` cleanly.

---

## 6. Landing Page — Detailed Spec

### 6.1 Layout

A single, non-scrolling, full-viewport (100dvh) screen. Background `--color-bg`. Two elements, vertically stacked and centered:

```
            ┌───────────────────────────┐
            │                           │
            │                           │
            │      Sophia Valerio       │   ← wordmark (script)
            │                           │
            │        [ Start ]          │   ← single button
            │                           │
            │                           │
            └───────────────────────────┘
```

- Vertical rhythm between wordmark and button: 32px (mobile) → 48px (desktop).
- No header, no footer, no nav, no scroll in Phase 1.

### 6.2 Components

**Wordmark**

- Text: `Sophia Valerio`.
- Rendered in the signature/script face, `--color-text`.
- Treated as the page's primary heading (`<h1>`) for semantics/SEO, even if visually a logotype.

**Start button**

- Label: `Start`.
- Style: filled `--color-secondary` with `--color-bg` text, **or** outline (1px `--color-text`) — pick one in design QA; default recommendation is **outline** for maximum restraint, filled as the hover-affordance variant.
- Generous padding (≈16px vertical / 40px horizontal), gently rounded (4–8px radius) or pill — align with final aesthetic.
- Min touch target 44×44px.

### 6.3 States

| Element | State | Behavior |
|---|---|---|
| Page | Initial load | Background paints instantly; wordmark + button run entrance animation. |
| Page | Reduced-motion | Elements appear with opacity only / no movement. |
| Button | Default | Resting style. |
| Button | Hover (pointer) | Subtle fill/contrast shift + optional 1px lift, 200ms. |
| Button | Focus (keyboard) | Visible focus ring (`--color-accent`), never removed. |
| Button | Active / pressed | Slight scale down (0.98) or fill darken. |
| Button | Navigating | Triggers transition to `/home`; optional brief disabled/loading affordance to prevent double-tap. |

### 6.4 Copy

- Wordmark: **Sophia Valerio**
- Button: **Start**
- `<title>`: `Sophia Valerio`
- Meta description: a single refined line (e.g. *Sophia Valerio — content with a signature.*).

### 6.5 Responsive behavior

| Breakpoint | Wordmark | Spacing | Notes |
|---|---|---|---|
| Mobile (≤480px) | `text-4xl` | 24px margins, 32px gap | Default target. Centered, full-height. |
| Tablet (481–1024px) | `text-5xl` | 48px margins | Scale up proportionally. |
| Desktop (≥1025px) | `text-6xl` | 64px+ margins, 48px gap | Maximize negative space. |

Use `100dvh` (not `100vh`) to avoid mobile browser chrome cropping.

---

## 7. Functional & Non-Functional Requirements

### 7.1 Functional

- **FR1.** Render the landing screen with wordmark and Start button.
- **FR2.** Start button navigates to `/home`.
- **FR3.** `/home` exists as a styled placeholder (no 404).
- **FR4.** Entrance and transition animations play (respecting reduced-motion).

### 7.2 Non-functional

| Area | Requirement |
|---|---|
| **Performance** | Lighthouse Performance ≥ 95 (mobile). LCP < 1.5s on 4G. Total JS for Phase 1 kept minimal (target < 80KB gz). Self-host fonts; preload the wordmark font; `font-display: swap`. |
| **Accessibility** | WCAG 2.1 **AA**. Keyboard operable, visible focus, semantic `<h1>` + `<button>`/`<a>`, contrast ratios per §4.2, full `prefers-reduced-motion` support. |
| **SEO** | Meaningful `<title>`, meta description, Open Graph tags + share image, favicon. Crawlable. |
| **Browser support** | Last 2 versions of Chrome, Safari, Firefox, Edge; iOS Safari & Chrome Android. |
| **Responsiveness** | Mobile-first; flawless from 320px to large desktop. |
| **Maintainability** | Design tokens centralized (CSS variables / Tailwind theme) so future pages inherit them. |

---

## 8. Suggested Tech Stack

**Recommended: Next.js (App Router) + Tailwind CSS + Framer Motion**

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js (App Router)** | File-based routing makes `/` → `/home` and future pages trivial; SSG keeps the splash instant; scales cleanly as the site grows. |
| Styling | **Tailwind CSS** | Tokens map directly to the design system in §4; enforces spacing/scale discipline. |
| Motion | **Framer Motion** | Declarative, respects `prefers-reduced-motion`, ideal for the subtle entrance/transition. |
| Fonts | **Self-hosted (next/font)** | Performance + privacy; preloads the wordmark face. |
| Hosting | **Vercel** | Zero-config for Next.js, edge delivery, preview deployments. |

**Lighter alternative:** a single static HTML/CSS page (+ a few lines of JS) if the team wants the absolute minimum footprint for Phase 1. Trade-off: less ergonomic when the home page and other routes arrive — so Next.js is preferred for forward compatibility.

---

## 9. Success Metrics (Phase 1)

| Metric | Target |
|---|---|
| **Start click-through rate** | ≥ 80% of sessions click Start |
| **LCP (mobile, 4G)** | < 1.5s |
| **Lighthouse (Perf / A11y / SEO)** | ≥ 95 / 100 / 100 |
| **Time-to-interactive** | < 2s |
| **Cross-device QA** | Pass on iOS Safari, Chrome Android, desktop Chrome/Safari/Firefox |

---

## 10. Future Scope / Roadmap

| Phase | Scope |
|---|---|
| **Phase 1 (now)** | Landing screen + routing scaffold + design system. |
| **Phase 2** | **Home page** — hero, navigation pattern, featured work/content modules (defined in a dedicated PRD). |
| **Phase 3** | `/work` (portfolio), `/about`, `/contact`. |
| **Phase 4** | `/journal`, PT/EN localization, analytics, CMS for self-serve content. |

**Open questions to resolve before Phase 2:**

- What does Sophia want a visitor to *do* on the home page (view work, book, follow)?
- Is content English-first, Portuguese-first, or bilingual?
- Will photography/video be central, requiring an asset pipeline and CDN?

---

*End of document.*
