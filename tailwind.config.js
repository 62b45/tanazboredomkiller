/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lavender: 'rgb(var(--color-lavender) / <alpha-value>)',
        blush: 'rgb(var(--color-blush) / <alpha-value>)',
        mint: 'rgb(var(--color-mint) / <alpha-value>)',
        sand: 'rgb(var(--color-sand) / <alpha-value>)',
        dusk: 'rgb(var(--color-dusk) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        card: '0 24px 55px rgba(92, 68, 255, 0.15)',
      },
    },
  },
  plugins: [],
}
