import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: { 950: '#082817', 900: '#0E3B1F', 800: '#14502B', 700: '#1B6B38' },
        leaf: { 600: '#2F9A3F', 500: '#3FB04D', 400: '#7CC94B', 100: '#E6F4DA' },
        cream: { DEFAULT: '#FAF8F1', 200: '#F1EEE2' },
        ink: '#14231A',
        gold: '#C8A24A',
        chili: '#C2411F',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: { soft: '0 10px 30px -12px rgba(14,59,31,.35)' },
      borderRadius: { xl2: '1.25rem' },
    },
  },
  plugins: [],
};
export default config;
