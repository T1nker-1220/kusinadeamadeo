/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        'brand-orange': 'var(--brand-orange)',
        'brand-orange-light': 'var(--brand-orange-light)',
        'brand-orange-dark': 'var(--brand-orange-dark)',
        'surface-primary': 'var(--surface-primary)',
        'surface-secondary': 'var(--surface-secondary)',
        'surface-elevated': 'var(--surface-elevated)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        accent: ['var(--font-accent)'],
      },
      fontSize: {
        'xs': ['var(--text-xs)', { lineHeight: '1.5' }],
        'sm': ['var(--text-sm)', { lineHeight: '1.5' }],
        'base': ['var(--text-base)', { lineHeight: '1.5' }],
        'lg': ['var(--text-lg)', { lineHeight: '1.5' }],
        'xl': ['var(--text-xl)', { lineHeight: '1.3' }],
        '2xl': ['var(--text-2xl)', { lineHeight: '1.3' }],
        '3xl': ['var(--text-3xl)', { lineHeight: '1.2' }],
        '4xl': ['var(--text-4xl)', { lineHeight: '1.2' }],
      },
      spacing: {
        'safe-bottom': 'var(--safe-area-inset-bottom)',
        'nav-height': 'var(--bottom-nav-height)',
      },
      minHeight: {
        'touch': 'var(--touch-target-min)',
      },
      minWidth: {
        'touch': 'var(--touch-target-min)',
      },
      transitionTimingFunction: {
        'ease-spring': 'var(--spring)',
        'ease-out-custom': 'var(--ease-out)',
        'ease-in-out-custom': 'var(--ease-in-out)',
      },
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'normal': 'var(--transition-normal)',
        'slow': 'var(--transition-slow)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s var(--ease-out) forwards',
        'slide-in': 'slideIn 0.3s var(--ease-out) forwards',
        'slide-up': 'slideUp 0.3s var(--ease-out) forwards',
        'scale-in': 'scaleIn 0.2s var(--spring) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 