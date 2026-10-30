import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      fontSize: {
        'h1': ['32px', { lineHeight: 'normal', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: 'normal', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h3': ['20px', { lineHeight: 'normal', letterSpacing: '-0.005em', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: 'normal', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: 'normal', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: 'normal', fontWeight: '400' }],
        'label': ['12px', { lineHeight: 'normal', letterSpacing: '0.02em', fontWeight: '600' }],
        'tiny': ['11px', { lineHeight: 'normal', letterSpacing: '0.04em', fontWeight: '700' }],
      },
      colors: {
        primary: {
          DEFAULT: '#006C49',
          light: '#10B981',
          dark: '#00422B',
          container: '#DCFCE7',
        },
        surface: {
          DEFAULT: '#FAF8FF',
          low: '#F2F3FF',
          card: '#FFFFFF',
          border: '#E2E7FF',
        },
        text: {
          primary: '#131B2E',
          secondary: '#3C4A42',
          muted: '#6C7A71',
        },
        coin: '#F59E0B',
        xp: '#3B82F6',
        error: '#BA1A1A',
        success: '#10B981',
        warning: '#F59E0B',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'full': '9999px',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
      },
      boxShadow: {
        card: '0px 2px 12px rgba(0,0,0,0.06)',
        modal: '0px 8px 32px rgba(0,0,0,0.12)',
      },
      maxWidth: {
        'mobile': '430px',
      },
    },
  },
  plugins: [],
}

export default config
