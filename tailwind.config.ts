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
        background: {
          DEFAULT: '#09090b',
          secondary: '#111113',
          tertiary: '#18181b',
        },
        surface: {
          DEFAULT: '#18181b',
          elevated: '#27272a',
          border: '#27272a',
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#dbb863',
          dark: '#9a7a32',
          muted: '#8a6f3c',
        },
        text: {
          primary: '#fafafa',
          secondary: '#a1a1aa',
          muted: '#52525b',
          inverse: '#09090b',
        },
        status: {
          success: '#4ade80',
          warning: '#fbbf24',
          error: '#f87171',
          info: '#60a5fa',
        },
      },
      fontFamily: {
        display: ['var(--font-dm-serif-display)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      borderRadius: {
        xs: '6px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
      boxShadow: {
        'card': '0 1px 2px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)',
        'card-hover': '0 2px 4px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.25), 0 0 20px rgba(201,168,76,0.06)',
        'elevated': '0 4px 24px rgba(0,0,0,0.4)',
        'glow': '0 0 30px rgba(201,168,76,0.15)',
        'glow-lg': '0 0 60px rgba(201,168,76,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typing': 'typing 1.4s infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-12px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(12px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        typing: {
          '0%, 60%, 100%': { opacity: '0.3' },
          '30%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
