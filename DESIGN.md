# FirstStep Platform — Comprehensive Design System & UI Specifications

Welcome to the official **FirstStep Design System Documentation**. This guide serves as the definitive reference for the design language, color tokens, typography scales, glassmorphism systems, animation guidelines, and component patterns across the FirstStep SaaS platform.

---

## 📄 1. Design Philosophy

FirstStep is designed as a **modern, editorial, high-performance SaaS platform** built specifically for businesses in Morocco (Cabinets, Restaurants, Retail, Professional Services).

### Core Pillars
1. **Editorial & Minimalist**: Generous whitespace, bold display typography, clean grid structures, and clear visual hierarchy.
2. **Elevated SaaS Aesthetics**: Off-white canvases, soft glassmorphism, subtle 3D card depths, and precision border styling.
3. **Live Product Proof**: Interactive visual demonstrations, live state changes, morphing data charts, and collaborative user cursor actions.
4. **Performance & Motion Accessibility**: GPU-accelerated CSS animations, Framer Motion transitions, and strict `prefers-reduced-motion` compliance.

---

## 🎨 2. Color Palette & Design Tokens

FirstStep relies on a curated light-mode palette centered around electric blue and emerald green accents over an airy off-white background.

### Brand Accent Colors
| Role | Color Name | Hex Code | RGB | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary Accent** | Electric Blue | `#0066FF` | `0, 102, 255` | `text-[#0066FF]`, `bg-[#0066FF]` | Primary CTAs, active states, key brand elements |
| **Secondary Accent** | Sky Blue | `#0284C7` | `2, 132, 199` | `text-sky-600`, `bg-sky-500` | Secondary gradients, chart curves, hover states |
| **Tertiary Accent** | Cyan | `#0EA5E9` | `14, 165, 233` | `text-cyan-600` | Shimmer text gradients, badge highlights |
| **Success & Growth** | Emerald Green | `#10B981` | `16, 185, 129` | `text-emerald-600`, `bg-emerald-500` | Available status badges, growth rates (+18.4%), EBITDA |
| **Warning / Alert** | Amber | `#F59E0B` | `245, 158, 11` | `text-amber-600`, `bg-amber-500` | Temporary warnings, maintenance notices |

### Backgrounds & Surfaces
| Surface Name | Hex / Value | Tailwind / CSS Class | Description |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#FAFBFD` | `bg-[#FAFBFD]` | Main page background canvas |
| **Alt Section Background** | `#F8FAFC` | `bg-[#F8FAFC]` | Sub-section container fill |
| **White Glass Surface** | `rgba(255, 255, 255, 0.95)` | `bg-white/95 backdrop-blur-2xl` | Form cards, visual analytics containers |
| **Pill Glass Surface** | `rgba(255, 255, 255, 0.85)` | `bg-white/85 backdrop-blur-xl` | Floating navbar, status badges |

### Neutral Typography Palette
| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| **Foreground Slate 900** | `#0F172A` | Main headings (H1, H2, H3), primary numbers |
| **Body Slate 700** | `#334155` | Card text, descriptions, form input values |
| **Muted Slate 500** | `#64748B` | Subheadings, dates, helper text, labels |
| **Subtle Slate 400** | `#94A3B8` | Grid lines, unselected tabs, secondary captions |

---

## ✍️ 3. Typography & Font Hierarchy

FirstStep combines **Syne** for bold, character-filled display headlines with **Figtree** for crisp, legible UI elements and body text. Both are loaded via `next/font/google`.

### Font Families
```css
/* Display Headings */
font-family: var(--font-syne), 'Syne', system-ui, sans-serif;

/* Body & Interface */
font-family: var(--font-figtree), 'Figtree', system-ui, sans-serif;
```

### Type Scale
| Level | Font Family | Size | Weight | Line Height | Case & Style |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Eyebrow Badge** | Figtree | `11px` | `700 (Bold)` | `1.0` | Uppercase, `tracking-[0.2em]` |
| **Hero H1** | Syne | `clamp(2.75rem, 5.2vw, 4.5rem)` | `900 (Black)` | `0.93` | Uppercase, `tracking-tight` |
| **Section H2** | Syne | `3xl` to `5xl` (`36px` - `48px`) | `900 (Black)` | `1.05` | Sentence case, `tracking-tight` |
| **Card H3** | Syne | `xl` (`20px`) | `800 (ExtraBold)` | `1.2` | Sentence case |
| **Subheadings** | Figtree | `15.5px` to `17px` | `400 / 500` | `1.6` | Normal case, leading relaxed |
| **Form Labels** | Figtree | `10px` - `11px` | `700 (Bold)` | `1.0` | Uppercase, `tracking-wider` |
| **Metrics / Prices** | Syne | `24px` - `32px` | `900 (Black)` | `1.0` | Bold digits |

---

## ✨ 4. Glassmorphism & Special Effects

FirstStep uses custom CSS utilities for high-end glass cards, rotating gradient borders, and shimmer effects.

### A. Spinning Gradient Border Badge
A continuous conic-gradient rotation wrapping eyebrow badges.
```css
@keyframes spin-gradient {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.rotating-border-wrapper {
    position: relative;
    border-radius: 9999px;
    padding: 1.5px;
    overflow: hidden;
    display: inline-flex;
}

.rotating-border-wrapper::before {
    content: '';
    position: absolute;
    inset: -150%;
    background: conic-gradient(from 0deg, #0066FF 0%, #10B981 33%, #0EA5E9 66%, #0066FF 100%);
    animation: spin-gradient 3.5s linear infinite;
    z-index: 0;
}

.rotating-border-inner {
    position: relative;
    z-index: 1;
    border-radius: 9999px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
}
```

### B. Shimmer Text Sweep
Animated text gradient applied to key hero words like `VOTRE`.
```css
.shimmer-word {
    background: linear-gradient(105deg, #0066FF 0%, #0284C7 30%, #0EA5E9 50%, #0066FF 70%, #0044CC 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer-sweep 6s linear infinite;
}
```

---

## 🎬 5. Animation & Motion Architecture

### Floating Keyframes (Multi-Duration)
To avoid uniform bouncing, visual elements float at asynchronous intervals:
- `animate-float-a`: 4.5s duration (`translateY(0px)` → `translateY(-8px)`)
- `animate-float-b`: 5.5s duration (`translateY(0px)` → `translateY(8px)`)
- `animate-float-c`: 6.5s duration (`translateY(0px)` → `translateY(-5px)`)

### Collaborative Live Cursor Sequence
Real-time state machine in `HeroSection.tsx` simulating multi-user collaboration:
1. **Directeur Cursor** (`#0066FF`): Moves to filter, clicks `'90d'` tab -> revenue updates to `485 200 MAD`, chart morphs.
2. **Responsable Ventes Cursor** (`#0284C7`): Drags the `Module IA` into card -> drops with success notification badge.
3. **CFO Cursor** (`#10B981`): Moves to Donut chart -> selects `EBITDA` segment -> Donut highlights `26% EBITDA`.

### Accessibility (Reduced Motion)
Wrapped inside CSS media queries:
```css
@media (prefers-reduced-motion: reduce) {
  .animate-float-a, .animate-float-b, .animate-float-c, .ticker-track {
    animation: none !important;
  }
}
```

---

## 🧩 6. Core Component Guidelines

### 1. Floating Pill Navbar (`Navbar.tsx`)
- **Container**: `fixed top-0 left-0 right-0 z-50 px-4 pt-3 pointer-events-none`
- **Inner Pill**: `max-w-6xl mx-auto h-[64px] rounded-2xl bg-white/85 backdrop-blur-2xl border border-slate-200/80 shadow-lg pointer-events-auto`
- **CTA**: Electric blue button (`#0066FF`) with shadow lift.

### 2. Solutions Cards (`ServicesOverview.tsx`)
- **Card**: `rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white/95 to-slate-50/60 shadow-md hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all`
- **Badges**: Emerald green `Disponible` status pill with pulsing indicator dot.
- **Price Format**: `1 500 MAD/mois` or custom website request routing.

### 3. Timeline Sequence (`HowItWorks.tsx`)
- **Structure**: Connected step cards with top horizontal gradient connector line.
- **Numbers**: Large watermark step digits (`01`, `02`, `03`) floating in background.

### 4. Forms & Input Fields (`SignupSection.tsx`, `app/login/page.tsx`)
- **Input Height**: `h-11` or `h-14` rounded-xl with light slate background (`bg-slate-50/80`).
- **Focus State**: `focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20 border-slate-200`.
- **Password Field**: Includes absolute-positioned `Eye` / `EyeOff` toggle button.

---

## 🖼️ 7. Brand Assets & Logos

- **Primary Logo**: `/Untitled design (13).png`
- **Favicon**: `/logo.ico`
- **OG Sharing Card**: `/og-image.png`
