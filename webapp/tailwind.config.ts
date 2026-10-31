import type { Config } from 'tailwindcss'

/**
 * HDP Academy Math — design tokens
 * Palette: deep emerald brand identity (#006C49 lineage) carried on an
 * airy sage canvas with a lime growth ramp for CTAs and progress.
 */
const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display':  ['34px', { lineHeight: '1.06', letterSpacing: '-0.035em', fontWeight: '800' }],
        'h1':       ['27px', { lineHeight: '1.15', letterSpacing: '-0.028em', fontWeight: '800' }],
        'h2':       ['21px', { lineHeight: '1.2',  letterSpacing: '-0.02em',  fontWeight: '800' }],
        'h3':       ['17px', { lineHeight: '1.3',  letterSpacing: '-0.012em', fontWeight: '700' }],
        'body-lg':  ['16px', { lineHeight: '1.5',  fontWeight: '500' }],
        'body-md':  ['14.5px', { lineHeight: '1.55', fontWeight: '500' }],
        'body-sm':  ['13px', { lineHeight: '1.5',  fontWeight: '500' }],
        'label':    ['12px', { lineHeight: '1.35', letterSpacing: '0.01em', fontWeight: '700' }],
        'tiny':     ['10.5px', { lineHeight: '1.3', letterSpacing: '0.07em', fontWeight: '800' }],
      },
      colors: {
        // Canvas & surfaces — sage-tinted neutrals, never pure gray
        canvas:      '#F1F4EE',
        'canvas-deep': '#E6EBE2',
        surface:     '#FFFFFF',
        'surface-2': '#F6F8F3',
        line:        '#E3E8DE',
        'line-soft': '#EDF1E9',

        // Ink — green-black for warmth against the sage canvas
        ink:        '#0E1A12',
        'ink-2':    '#33452F',
        'ink-3':    '#6B7C66',
        'ink-4':    '#9AA995',

        // Brand: emerald depth → lime growth
        brand:      '#0B6E4F',
        'brand-deep': '#063F2E',
        'brand-mid': '#1B9A6B',
        leaf:       '#4CC16F',
        'leaf-bright': '#8CE86A',
        'leaf-soft': '#DDF3DC',
        'leaf-tint': '#EFF8EC',

        // Soft mint canvas + bright lime action (splash / hero surfaces)
        mint:       '#CDE9AE',
        'mint-soft': '#E6F5D2',
        lime:       '#7ED321',
        'lime-deep': '#5FAF22',
        'ink-on-lime': '#1C3214',

        // Reward & signal
        coin:       '#E8A33D',
        'coin-soft': '#FCF1DC',
        xp:         '#4C7DF0',
        'xp-soft':  '#E5ECFE',
        danger:     '#D9483B',
        'danger-soft': '#FBE9E7',
        violet:     '#7C5CE0',
        'violet-soft': '#EDE7FC',
      },
      borderRadius: {
        'sm':   '10px',
        'md':   '14px',
        'lg':   '18px',
        'xl':   '22px',
        '2xl':  '28px',
        '3xl':  '34px',
        'full': '9999px',
      },
      spacing: {
        '1.5': '6px',
        '2.5': '10px',
        '18':  '72px',
      },
      boxShadow: {
        // Diffuse, green-tinted — matches the sage canvas (never flat gray)
        card:   '0 1px 2px rgba(14,26,18,0.03), 0 6px 18px rgba(14,26,18,0.045)',
        lifted: '0 2px 6px rgba(14,26,18,0.04), 0 18px 44px rgba(14,26,18,0.09)',
        float:  '0 6px 24px rgba(14,26,18,0.10), 0 2px 6px rgba(14,26,18,0.05)',
        glow:   '0 10px 28px rgba(27,154,107,0.32)',
        'glow-leaf': '0 10px 26px rgba(76,193,111,0.38)',
        'glow-coin': '0 10px 26px rgba(232,163,61,0.32)',
        inset:  'inset 0 1px 0 rgba(255,255,255,0.9)',
      },
      maxWidth: {
        mobile: '430px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}

export default config
