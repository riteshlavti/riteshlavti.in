/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
        },
        accent: {
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        darkBg: '#0F172A',
        darkSurface: '#1E293B',
        darkTextPrimary: '#F8FAFC',
        darkTextSecondary: '#CBD5E1',
        darkPrimaryAccent: '#38BDF8',
        darkPrimaryHover: '#0EA5E9',
        darkSecondaryAccent: '#A78BFA',
        darkBorder: '#334155',
        darkError: '#F87171',
      },
    },
  },
  plugins: [],
} 