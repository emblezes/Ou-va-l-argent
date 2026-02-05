import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Deep backgrounds
        'bg-deep': '#06080c',
        'bg-surface': '#0a0e14',
        'bg-elevated': '#111820',
        'bg-card': '#0d1117',

        // Text colors
        'text-primary': '#f0f4f8',
        'text-secondary': '#8899a8',
        'text-muted': '#4a5a6a',

        // Accent colors
        'accent-electric': '#00d4ff',
        'accent-gold': '#ffd700',
        'accent-green': '#00ff88',
        'accent-red': '#ff4757',
        'accent-purple': '#a855f7',
        'accent-orange': '#ff9f43',
        'accent-pink': '#ff6b9d',

        // Glass effect
        'glass': 'rgba(17, 24, 32, 0.8)',
        'glass-border': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        'serif': ['var(--font-serif)', 'Instrument Serif', 'serif'],
        'sans': ['var(--font-syne)', 'Syne', 'sans-serif'],
        'mono': ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
      },
      backgroundImage: {
        'gradient-electric': 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
        'gradient-gold': 'linear-gradient(135deg, #ffd700 0%, #ffaa00 100%)',
        'gradient-red': 'linear-gradient(135deg, #ff4757 0%, #cc3344 100%)',
        'gradient-purple': 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
        'gradient-mesh': 'radial-gradient(ellipse at 20% 0%, rgba(0, 212, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scrollPulse: {
          '0%, 100%': { transform: 'scaleY(1)', opacity: '1' },
          '50%': { transform: 'scaleY(0.5)', opacity: '0.5' },
        },
        rotate: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        shake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-5deg)' },
          '75%': { transform: 'rotate(5deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 71, 87, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 71, 87, 0.5)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateY(-30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideOut: {
          from: { opacity: '1', transform: 'translateY(0)' },
          to: { opacity: '0', transform: 'translateY(30px)' },
        },
        loading: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease forwards',
        'scroll-pulse': 'scrollPulse 2s ease-in-out infinite',
        'rotate-slow': 'rotate 20s linear infinite',
        'blink': 'blink 1s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in': 'slideIn 0.6s ease forwards',
        'slide-out': 'slideOut 0.6s ease forwards',
        'loading': 'loading 2s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
