import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ff8800', // Main orange
        'primary-dark': '#d46d00', // Slightly darker for hover
        secondary: '#23201a', // Deep brown/gray for cards/surfaces
        background: '#181e29', // Deep blue-black for main background
        'background-gradient-from': '#232b3a', // Gradient start (matches home page)
        'background-gradient-to': '#181e29', // Gradient end (matches home page)
        surface: '#232b3a', // Slightly lighter than background for cards
        accent: '#ffb347', // Lighter orange for accents
        muted: '#bcbcbc', // Muted text
        success: '#22c55e',
        danger: '#ef4444',
        info: '#3b82f6',
        border: '#e5e7eb',
        white: '#fff',
        black: '#000',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        md: '0.75rem',
        lg: '1.25rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
  ],
};

export default config; 