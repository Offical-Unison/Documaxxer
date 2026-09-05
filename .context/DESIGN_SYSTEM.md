# Documaxxer — Design System & UI Architecture

This document describes the dual design philosophy of Documaxxer, its Tailwind CSS v4 styling rules, the light/dark theme system, and the core UI primitive components.

---

## 1. Dual Design System Philosophy

Documaxxer is built around a deliberate separation between **Application Chrome** and **Document Output**:

```
┌────────────────────────────────────────────────────────────────────────┐
│  APP CHROME (Documaxxer Platform)                                      │
│  - Modern glassmorphism (backdrop-blur-xl, translucent backgrounds)    │
│  - Electric Blue / Indigo accents (#2563EB)                            │
│  - Smooth spring & ease animations (fadeInScale, floatSlow)           │
│  - Dynamic Dark / Light theme support                                  │
│  - Rounded interactive cards (rounded-2xl, rounded-3xl)                │
│                                                                        │
│    ┌──────────────────────────────────────────────────────────────┐    │
│    │  DOCUMENT CANVAS (Rendered Preview & Exports)                │    │
│    │  - Pure high-contrast black text (#000000)                   │    │
│    │  - Crisp paper white background (#FFFFFF)                    │    │
│    │  - Standard A4 sheet proportions (210 × 297 mm)              │    │
│    │  - Conservative, ATS-friendly typography tokens              │    │
│    │  - Zero glassmorphism, zero translucency, zero animations    │    │
│    └──────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Tailwind CSS v4 Configuration

The project uses modern Tailwind CSS v4, initialized in [`styles/globals.css`](file:///e:/Github/Documaxxer/styles/globals.css):

```css
@import "tailwindcss";

@source "../app";
@source "../components";
@source "../lib";

@custom-variant dark (&:where(.dark, .dark *));

@layer utilities {
  .section-shell {
    @apply mx-auto w-full max-w-7xl px-5 sm:px-8;
  }
  .eyebrow {
    @apply text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-500 dark:text-blue-400;
  }
}
```

### Color Tokens
- **Brand Primary**: Blue-600 (`#2563EB`) and Blue-500 (`#3B82F6`).
- **Dark Mode Background**: Dark navy-slate (`#0B0F19`).
- **Dark Mode Surface**: Rich slate-surface (`#121824` / `slate-900`).
- **Text (App Chrome)**: `text-slate-950` (light) / `text-slate-50` (dark).
- **Text (Document Canvas)**: Fixed `#000000` (always high-contrast black regardless of app theme).

### Animation Keyframes
Defined in `globals.css`:
- `fadeInUp`: Translates element `+20px` up while fading in (`0.6s cubic-bezier(0.16, 1, 0.3, 1)`).
- `fadeInScale`: Scales up from `0.96` with vertical translation (`0.7s`).
- `floatSlow`: Subtle vertical float looping infinitely (`7s ease-in-out`).

---

## 3. Light / Dark Theme Architecture

Theme management is encapsulated in [`context/theme-context.tsx`](file:///e:/Github/Documaxxer/context/theme-context.tsx) and controlled via [`components/theme/theme-toggle.tsx`](file:///e:/Github/Documaxxer/components/theme/theme-toggle.tsx):
- Persists theme selection (`"light"` | `"dark"`) in `localStorage.getItem("documaxxer:theme")`.
- Toggles the `.dark` class directly on the root `<html>` element.
- The document preview paper remains permanently white with black text to represent true physical paper.

---

## 4. UI Primitive Components

### Base Primitives (`components/ui/`)
- [`Button`](file:///e:/Github/Documaxxer/components/ui/button.tsx): Provides standardized button styles:
  - `default`: High-emphasis solid primary (`bg-blue-600 hover:bg-blue-700 text-white`).
  - `secondary`: Subdued background for utility actions (`bg-slate-100 dark:bg-slate-800`).
  - `outline`: Bordered button for secondary actions.
  - `ghost`: Transparent hover button for icon toggles and subtle links.
- [`Card`](file:///e:/Github/Documaxxer/components/ui/card.tsx): Base card container with glassmorphic styling (`bg-white/80 dark:bg-[#121824]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl`).

### Builder Form Controls (`components/builder/controls/`)
- [`Field`](file:///e:/Github/Documaxxer/components/builder/controls/form-controls.tsx): Accessible text input with label, optional badge, validation error messages, and helper text.
- [`Textarea`](file:///e:/Github/Documaxxer/components/builder/controls/form-controls.tsx): Auto-resizing or multiline text field for summaries and descriptions.
- [`EntryCard`](file:///e:/Github/Documaxxer/components/builder/controls/form-controls.tsx): Card container for repeatable entries (Experience, Education, Projects) featuring collapse/expand, title badges, and delete buttons.
- [`TagInput`](file:///e:/Github/Documaxxer/components/builder/controls/form-controls.tsx): Interactive chip creator for skills and keywords with Enter key triggers, duplicate checking, and removable badges.
- [`PartialDateField`](file:///e:/Github/Documaxxer/components/builder/controls/date-input.tsx): Month/Year dropdown selectors with "Currently working" toggle.
- [`PhoneField`](file:///e:/Github/Documaxxer/components/builder/controls/phone-input.tsx): Flag dropdown + dial code prefix + formatted mobile number input.
- [`BulletListInput`](file:///e:/Github/Documaxxer/components/builder/controls/bullet-list.tsx): Multi-row bullet manager with add/remove rows.
