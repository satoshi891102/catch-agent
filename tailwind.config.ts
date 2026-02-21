import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark warm palette
        background: {
          DEFAULT: '#0f0e0c',
          secondary: '#1a1814',
          tertiary: '#242018',
        },
        surface: {
          DEFAULT: '#1e1c18',
          elevated: '#272420',
          border: '#2e2b25',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e0c070',
          dark: '#9a7a32',
          muted: '#8a6f3c',
        },
        text: {
          primary: '#f0ebe0',
          secondary: '#b8a98a',
          muted: '#6e6050',
          inverse: '#0f0e0c',
        },
        status: {
          success: '#4ade80',
          warning: '#fbbf24',
          error: '#f87171',
          info: '#60a5fa',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in': 'slideIn 0.25s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typing': 'typing 1.4s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        typing: {
          '0%, 60%, 100%': { opacity: '0.3' },
          '30%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-warm': 'linear-gradient(135deg, #1a1814 0%, #0f0e0c 100%)',
        'gradient-gold': 'linear-gradient(135deg, #c9a84c 0%, #9a7a32 100%)',
        'gradient-hero': 'radial-gradient(ellipse at top, #272420 0%, #0f0e0c 70%)',
      },
      boxShadow: {
        'gold-sm': '0 0 10px rgba(201, 168, 76, 0.15)',
        'gold-md': '0 0 20px rgba(201, 168, 76, 0.2)',
        'gold-lg': '0 0 40px rgba(201, 168, 76, 0.25)',
        'inner-dark': 'inset 0 2px 4px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}

export default config
