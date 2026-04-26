/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'slate-950': '#0f172a',
        'surface-container-lowest': '#0f1115',
        'surface-container-low': '#1c1f26',
        'surface-container': '#1e2128',
        'surface-container-high': '#23272f',
        'surface-container-highest': '#2d3139',
        'primary': '#4f46e5',
        'primary-container': '#4f46e5',
        'on-primary': '#ffffff',
        'on-surface': '#f1f5f9',
        'on-surface-variant': '#a1a1aa',
        'outline-variant': '#3f3f46',
        'tertiary': '#ff8c42',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem'
      }
    },
  },
  plugins: [],
}
