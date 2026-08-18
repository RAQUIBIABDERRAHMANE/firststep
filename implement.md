# Lumina System — Implementation Log

Executable translation of the approved design plan. One token layer, light everywhere,
two motion budgets (cinematic on marketing, quiet luxury in the app).

Source of truth for design decisions: the approved plan. This file tracks **what is done,
what deviates, and why**.

---

## Status

| Phase | Scope | State |
|---|---|---|
| 0 | Token foundation (`globals.css`, `layout.tsx`) | in progress |
| 1 | Primitives (`Button`, `Card`, `Input`, `Badge`) + radius sweep | in progress |
| 2 | App shell (Sidebar, Header, charts, tables, empty states, AI panel) | deferred |
| 3 | Marketing (Hero dark→light, 5 dark-native visuals, Spline, footer) | deferred |
| 4 | Tenant public sites (`app/[tenantSlug]/**`, `components/tenant/**`) | deferred |

Phases 0 and 1 land together — the primitives are meaningless without the tokens, and
the tokens are invisible without the primitives. Phases 2–4 are independent after that.

---

## Phase 0 — `app/globals.css`

Keep / replace / delete, by original line range:

| Lines | Content | Action |
|---|---|---|
| 1 | `@import "tailwindcss";` | keep |
| 3–4 | `@source` directives | keep |
| 6–156 | `@theme` (HSL triplets + keyframes) | **replace** with the Lumina token block |
| 158–244 | `@layer base { :root … .dark … }` | **delete** — one theme only |
| 251–255 | `body` with `background:` shorthand | rewrite → `background-color: var(--color-surface)` |
| 258–261 | `.glass` (did no real glass work) | **rewrite** to the Lumina recipe |
| 263–269 | `.glass-card` | **delete** — the name lied; call sites move to `<Card>` |
| 271–289 | `.gradient-bg`, `.gradient-text` | retune → now a real primary→secondary sweep |
| 291–307 | global `h1`–`h3` size rules | **replace** with a restrained default scale (see deviation D3) |
| 309–325 | `.btn-primary` | retune off tokens |
| 362–374 | `pulse-glow` (stray purple `139,92,246`) | retune → primary |
| 388–430 | duplicate `spin-slow` / `spin-reverse` / `pulse-slow` keyframes | **dedupe** |
| 432–439 | `.font-syne` / `.font-figtree` | **delete** |
| 455–465 | `spline-viewer::after` `background: #030712` | → `var(--color-surface)` |
| 481–486 | `body { --font-serif; --font-sans }` + recompile artifact | **delete** — it shadowed the new Inter token |
| 488–644 | `.spotlight-*` block | recolor to light + tokens |

Kept as-is: `.bg-noise`, `.no-scrollbar`, `.stagger-1…5`, `.scroll-reveal`,
`.animate-float`, `.animate-shake`, `.spline-watermark`.

### Two hidden dependencies handled in the same edit

1. **`--primary-rgb` orphaning.** The `glow` keyframe inside `@theme` referenced
   `rgba(var(--primary-rgb), …)`, defined only in the deleted `:root`. Rewritten to a
   literal primary rgb.
2. **`--font-sans` shadowing.** `body { --font-sans: var(--font-jakarta) }` at line 484
   would have overridden the new `@theme` Inter token on every element. Deleted.

---

## Phase 0 — `app/layout.tsx`

- Fonts 4 → 3: `Syne` + `Figtree` + `Playfair_Display` + `Plus_Jakarta_Sans` →
  **Hanken Grotesk** (`--font-hanken` → `--font-display`), **Inter** (`--font-inter` →
  `--font-sans`), **JetBrains Mono** (`--font-jetbrains` → `--font-mono`).
- Font variables move from `<body>` to `<html>` so `var(--font-display)` resolves
  everywhere, including on `html` itself.
- `body`: `bg-[#030712] font-figtree` → `bg-surface text-on-surface font-sans`.
- Metadata, the Spline `<Script>`, and `<Providers>` untouched.

Then repo-wide: `font-syne` → `font-display`, `font-figtree` → `font-sans`.

---

## Deviations from the plan (deliberate, with rationale)

**D1 — Radius scale mapped onto Tailwind's named namespace.**
The plan specified a bare `--radius: 0.5rem` for buttons/inputs and
`--radius-md: 0.75rem`. In Tailwind v4 the bare `rounded` utility does not read
`--radius`, so "8px buttons" would not have been expressible as a utility. The 8px step
is therefore `--radius-md`, and the unused 12px intermediate is dropped:

| Utility | Size | Use |
|---|---|---|
| `rounded-sm` | 4px | tags, tight chips |
| `rounded-md` | 8px | buttons, inputs, nav items |
| `rounded-lg` | 16px | cards |
| `rounded-xl` | 24px | layout pods |
| `rounded-2xl` | 32px | hero-scale cards |
| `rounded-full` | — | avatars, pills |

`--radius: 0.5rem` is still emitted for raw-CSS use. The plan's breaking change stands:
`rounded-lg` was 8px and is now 16px; `rounded-xl` was 12px and is now 24px.

**D2 — Legacy color aliases kept as a compatibility layer.**
`bg-background`, `text-muted-foreground`, `border-border`, `bg-card`, `text-destructive`
and friends are used across dozens of files outside Phases 0–1. Deleting those token
names would break pages this pass is not meant to touch. They are re-pointed at Lumina
values as **hex** (not HSL triplets), so the `hsl(var(--` regression grep still returns
zero and `--accent` becomes genuinely distinct from `--primary` — which is what made
every `from-primary to-accent` gradient a no-op. Retire the aliases in Phase 2–4 as each
surface migrates to semantic names.

**D3 — Heading defaults reduced, not removed.**
The plan deletes the global `h1`/`h2`/`h3` size rules outright. Tailwind's preflight
already strips UA heading sizes, so a bare deletion would render every heading in the app
at body size until Phases 2–4 apply type roles. The documented harm was the *landing*
scale (`text-5xl lg:text-7xl`) leaking into dashboards, so headings instead get a
restrained default scale (2rem / 1.5rem / 1.25rem, display face, weight 600). Explicit
type-role utilities still win wherever they are applied.

**D4 — `--duration-*` used via `var()`, not as utilities.**
Tailwind v4 has no `duration` theme namespace, so `duration-app` would not generate.
The tokens are emitted as custom properties and consumed as
`duration-[var(--duration-app)]`.

---

## Phase 1 — Primitives (`components/ui/`)

Rule: **zero hardcoded `slate-*` / `blue-*`.** Every color comes from a token.

**`Button.tsx`**
- `h-11`, `rounded-md` (8px) — must match `Input` exactly. This is the alignment fix.
- `default`: vertical `primary-container → primary` gradient, `text-on-primary`, plus an
  `inset 0 1px 0 rgb(255 255 255 / 0.2)` inner top glow for depth.
- **`hover:scale-105` removed from all five variants.** Replaced with a brightness lift
  and `shadow-e1 → shadow-e2`; only `active:scale-[0.98]` remains, on press.
- The `::before` shine sweep survives on `default` only.
- The dead `asChild` prop is removed — it was declared and never implemented.

**`Card.tsx`**
- `rounded-lg` (16px), `bg-surface-container-lowest`, `border-hairline`, `shadow-e1`.
- **The unconditional `hover:shadow-md hover:-translate-y-1` is removed** and replaced by
  an opt-in `interactive` prop. Non-clickable cards no longer move.
- Padding `p-6` → `p-8` (32px card safe-area).
- `CardTitle` keeps its `<h3>` element but takes `text-title-lg`, so the global heading
  rule no longer decides how card titles look.
- New `GlassCard` export — the `.glass` recipe with the top/left shine.

**`Input.tsx`**
- `h-12` → `h-11`, `rounded-xl` → `rounded-md`.
- Focus: `border-primary` + `shadow-focus`; the hardcoded `ring-blue-500/20` is gone.

**`Badge.tsx`**
- `border` not `border-2`, `text-label-sm` (mono), no `font-bold`, no colored glow.
- All seven variants kept, including the domain-specific `comingSoon`.

**Radius sweep** — `rounded-lg` and `rounded-xl` change size under the new scale, so every
existing hit is reviewed in the same pass rather than discovered later.

---

## Verification

- [ ] `npx tsc --noEmit`
- [ ] `npm run lint`
- [ ] Walk `/` → `/login` → `/dashboard` → `/dashboard/services` → `/dashboard/payments`
- [ ] Regression greps return zero: `hsl(var(--` · `font-syne` · `font-figtree` ·
      `--font-playfair` · `--font-jakarta` · `slate-[0-9]`/`blue-[0-9]` in `components/ui/` ·
      `hover:scale-105` in `Button.tsx` · `.glass-card`
- [ ] Alignment proof: a `<Button>` beside an `<Input>` — identical height and radius
- [ ] Contrast: `on-surface #131b2e` on `surface #faf8ff` ≈ 15:1;
      `on-surface-variant #414755` ≈ 8.9:1; `on-primary` on `primary` ≈ 7:1

Deferred to their phases (they touch files this pass does not): `#030712` · `0066FF` ·
`0, 102, 255` in `HeroSection`/`page.tsx`, and the English strings in `Sidebar.tsx` /
`DashboardHeader.tsx`.

---

## Deferred — Phase 2 (app shell)

Sidebar active state → `bg-primary-fixed text-on-primary-fixed-variant`; DashboardHeader
→ `bg-surface/80 backdrop-blur-xl border-b border-hairline`; recharts themed off tokens
(series `primary → secondary → tertiary`, grid `--color-separator`, tooltips as
`GlassCard`); tables with thin separators and **no zebra striping**; a shared
`<EmptyState>` and skeletons; the AI Assistant panel at `/dashboard/ai`. Plus the French
fixes (`'My Services'`, `'Account'`, `'Sign out'`/`'Sign Out'`) and unifying `red-*` with
`rose-*` onto `error`.

## Deferred — Phase 3 (marketing)

`HeroSection` dark→light **preserving the choreography** (`hfu`, the 80/180/280/380/480ms
stagger, `ticker-scroll`, `shimmer-sweep`, `pulse-ring`); the five dark-native visuals
(`ElegantShape`, `spotlight-background`, `dotted-surface`, `spiral-animation`,
`CrystalScene`); the three `bg-white/3` + `border-white/8` + `focus:text-black` bugs; the
`text-black` CTA; the Spline recolor decision; footer tokens; rename
`/Untitled design (13).png`. Largest single chunk.

## Deferred — Phase 4 (tenant sites)

`app/[tenantSlug]/**` + `components/tenant/**`, motion budget switched on
`designTemplate`: `classic` quiet · `modern` cinematic · `minimal` quiet.

