/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forestGreen': '#285640',
        'primaryGreen': '#527C61',
        'sage': {
          50: '#f0f4f0',
          100: '#e0eae0',
          200: '#c1d5c1',
          300: '#a2bfa2',
          400: '#83a983',
          500: '#649364',
          600: '#527852',
          700: '#415e41',
          800: '#2f442f',
          900: '#1d2b1d',
        },
        'mint': '#E7EEDB',
        'cream': '#F7F6F0',
        'softYellow': '#F3D77B',
        'mainText': '#26332B',
        'secondaryText': '#69766D',
        'outerBackground': '#F7F6F0',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(40, 86, 64, 0.08)',
        'card-hover': '0 4px 16px rgba(40, 86, 64, 0.12)',
        'dashboard': '0 8px 32px rgba(40, 86, 64, 0.16)',
        'sidebar': '4px 0 16px rgba(40, 86, 64, 0.08)',
      },
    },
  },
  plugins: [],
}