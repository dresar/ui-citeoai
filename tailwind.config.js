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
        dark: {
          bg: '#0b0b0e',
          base: '#121215',
          card: '#18181c',
          cardHover: '#1e1e24',
          border: '#27272a',
          text: '#f4f4f5',
          muted: '#a1a1aa',
          dim: '#71717a',
        },
      },
      borderRadius: {
        DEFAULT: '4px',
        card: '4px',
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif"
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "'Liberation Mono'",
          "monospace"
        ],
      },
    },
  },
  plugins: [],
}
