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
        secondary: '#23201a',
        background: '#18120b',
        surface: '#23201a',
        accent: '#ffb347',
        muted: '#bcbcbc',
        success: '#22c55e',
        danger: '#ef4444',
        info: '#3b82f6',
        border: '#e5e7eb',
        // Add more semantic colors as needed
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