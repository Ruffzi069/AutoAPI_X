/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dashboard: '#0F0F14',
        panel: '#1A1A24',
        'primary-purple': '#6D28D9',
        'accent-purple': '#A855F7',
        success: '#10B981',
        warning: '#F59E0B',
        critical: '#EF4444',
        info: '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
