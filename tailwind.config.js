/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './templates/**/*.html',
    './craftify/**/*.html',
    './craftify/**/*.js',
    './craftify/**/*.jsx',
    // Add other paths as needed
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#93c5fd',
          DEFAULT: '#3b82f6',
          dark: '#1e3a8a',
        },
        secondary: {
          light: '#fbbf24',
          DEFAULT: '#f59e0b',
          dark: '#b45309',
        },
        neutral: {
          light: '#f3f4f6',
          DEFAULT: '#d1d5db',
          dark: '#4b5563',
        },
      },
    },
  },
  plugins: [],
}