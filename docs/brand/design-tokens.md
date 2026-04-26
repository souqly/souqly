# Souqly — Design Tokens

> Direction retenue : **Minimalisme Premium** (Indigo + Ambre + Slate)
> Format compatible `tailwind.config.ts` — dernière mise à jour : 2026-04-25

---

## tailwind.config.ts (extrait theme.extend)

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // === PRIMARY — Indigo ===
        primary: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // ← brand primary
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },

        // === ACCENT — Ambre ===
        accent: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B', // ← brand accent
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
          950: '#451A03',
        },

        // === NEUTRAL — Slate ===
        neutral: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B', // ← dark surface
          900: '#0F172A', // ← dark background
          950: '#020617',
        },

        // === SEMANTIC ===
        success: {
          DEFAULT: '#10B981',
          light:   '#D1FAE5',
          dark:    '#065F46',
        },
        error: {
          DEFAULT: '#EF4444',
          light:   '#FEE2E2',
          dark:    '#991B1B',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light:   '#FEF3C7',
          dark:    '#92400E',
        },
        info: {
          DEFAULT: '#3B82F6',
          light:   '#DBEAFE',
          dark:    '#1E40AF',
        },
      },

      // === TYPOGRAPHIE ===
      fontFamily: {
        heading: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem',  { lineHeight: '0.875rem' }], // 10px
        xs:    ['0.75rem',   { lineHeight: '1rem' }],     // 12px
        sm:    ['0.875rem',  { lineHeight: '1.25rem' }],  // 14px
        base:  ['1rem',      { lineHeight: '1.5rem' }],   // 16px
        lg:    ['1.125rem',  { lineHeight: '1.75rem' }],  // 18px
        xl:    ['1.25rem',   { lineHeight: '1.75rem' }],  // 20px
        '2xl': ['1.5rem',    { lineHeight: '2rem' }],     // 24px
        '3xl': ['1.875rem',  { lineHeight: '2.25rem' }],  // 30px
        '4xl': ['2.25rem',   { lineHeight: '2.5rem' }],   // 36px
        '5xl': ['3rem',      { lineHeight: '1.1' }],      // 48px
        '6xl': ['3.75rem',   { lineHeight: '1' }],        // 60px
      },
      fontWeight: {
        normal:   '400',
        medium:   '500',
        semibold: '600',
        bold:     '700',
        extrabold:'800',
      },

      // === SPACING (base 4px) ===
      spacing: {
        px:   '1px',
        0:    '0px',
        0.5:  '2px',
        1:    '4px',
        1.5:  '6px',
        2:    '8px',
        2.5:  '10px',
        3:    '12px',
        3.5:  '14px',
        4:    '16px',
        5:    '20px',
        6:    '24px',
        7:    '28px',
        8:    '32px',
        9:    '36px',
        10:   '40px',
        11:   '44px',
        12:   '48px',
        14:   '56px',
        16:   '64px',
        20:   '80px',
        24:   '96px',
        28:   '112px',
        32:   '128px',
        36:   '144px',
        40:   '160px',
        44:   '176px',
        48:   '192px',
        52:   '208px',
        56:   '224px',
        60:   '240px',
        64:   '256px',
        72:   '288px',
        80:   '320px',
        96:   '384px',
      },

      // === BORDER RADIUS ===
      borderRadius: {
        none: '0px',
        sm:   '4px',
        DEFAULT: '6px',
        md:   '8px',
        lg:   '12px',
        xl:   '16px',
        '2xl':'24px',
        '3xl':'32px',
        full: '9999px',
      },

      // === SHADOWS ===
      boxShadow: {
        xs:   '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        sm:   '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        DEFAULT:'0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        md:   '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg:   '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl:   '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl':'0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner:'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        // Dark mode specific
        'dark-sm':  '0 1px 3px 0 rgb(0 0 0 / 0.4)',
        'dark-md':  '0 4px 6px -1px rgb(0 0 0 / 0.4)',
        'dark-lg':  '0 10px 15px -3px rgb(0 0 0 / 0.5)',
        // Glow effects
        'glow-primary': '0 0 20px rgb(79 70 229 / 0.3)',
        'glow-accent':  '0 0 20px rgb(245 158 11 / 0.3)',
        none: 'none',
      },

      // === BREAKPOINTS ===
      screens: {
        xs:  '375px',  // mobile S
        sm:  '640px',  // mobile L
        md:  '768px',  // tablet
        lg:  '1024px', // laptop
        xl:  '1280px', // desktop
        '2xl':'1536px', // wide
      },

      // === ANIMATIONS ===
      transitionDuration: {
        75:  '75ms',
        100: '100ms',
        150: '150ms',
        200: '200ms', // ← standard UI
        300: '300ms', // ← modals / drawers
        500: '500ms',
        700: '700ms',
      },
      transitionTimingFunction: {
        DEFAULT:   'cubic-bezier(0.4, 0, 0.2, 1)',
        linear:    'linear',
        in:        'cubic-bezier(0.4, 0, 1, 1)',
        out:       'cubic-bezier(0, 0, 0.2, 1)',
        'in-out':  'cubic-bezier(0.4, 0, 0.2, 1)',
        spring:    'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in':        'fade-in 200ms ease-out',
        'fade-up':        'fade-up 200ms ease-out',
        'slide-in-right': 'slide-in-right 300ms ease-out',
        'scale-in':       'scale-in 150ms ease-out',
        shimmer:          'shimmer 2s infinite linear',
      },

      // === Z-INDEX ===
      zIndex: {
        auto:     'auto',
        0:        '0',
        10:       '10',   // éléments normaux surélevés
        20:       '20',   // dropdowns
        30:       '30',   // sticky headers
        40:       '40',   // drawers / sidebars
        50:       '50',   // modals backdrop
        60:       '60',   // modals content
        70:       '70',   // tooltips
        80:       '80',   // toasts / notifications
        90:       '90',   // overlays globaux
        100:      '100',  // réservé
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Variables CSS (Dark mode)

```css
/* globals.css */
:root {
  --background: 248 250 252;      /* neutral-50 */
  --foreground: 15 23 42;         /* neutral-900 */
  --surface: 255 255 255;
  --surface-elevated: 241 245 249;
  --border: 226 232 240;          /* neutral-200 */
  --border-strong: 148 163 184;   /* neutral-400 */
  --muted: 100 116 139;           /* neutral-500 */
  --primary: 79 70 229;           /* primary-600 */
  --primary-foreground: 255 255 255;
  --accent: 245 158 11;           /* accent-500 */
  --accent-foreground: 15 23 42;
}

.dark {
  --background: 15 23 42;         /* neutral-900 */
  --foreground: 248 250 252;      /* neutral-50 */
  --surface: 30 41 59;            /* neutral-800 */
  --surface-elevated: 51 65 85;   /* neutral-700 */
  --border: 51 65 85;             /* neutral-700 */
  --border-strong: 100 116 139;   /* neutral-500 */
  --muted: 100 116 139;           /* neutral-500 */
  --primary: 99 102 241;          /* primary-500 (légèrement plus clair en dark) */
  --primary-foreground: 255 255 255;
  --accent: 245 158 11;           /* accent-500 */
  --accent-foreground: 15 23 42;
}
```

---

## Fonts — next/font setup

```typescript
// src/app/layout.tsx
import { Inter, Bricolage_Grotesque } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})
```
