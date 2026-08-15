import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        hoardy: {
          navy: '#1B2B5E',
          'navy-deep': '#14214A',
          'blue-light': '#7BB8E8',
          'blue-mid': '#4A82C4',
          'near-white': '#EEF2FF',
          surface: '#F0F5FF',
          'surface-dark': '#E2E9F5',
          border: '#C8D6E5',
          text: '#1A2332',
          'text-secondary': '#5A6B82',
        },
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 44s linear infinite',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'pulse-ring': 'pulseRing 2.6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.8s linear infinite',
        'spin-slow': 'spin 22s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        conicSpin: {
          '0%': { '--angle': '0deg' },
          '100%': { '--angle': '360deg' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '70%, 100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      letterSpacing: {
        'widest-2': '0.2em',
      },
    },
  },
  plugins: [],
}
export default config
