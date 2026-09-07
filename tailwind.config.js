/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory:        "#FAFAF8",
        "rich-black":  "#1A1A1A",
        "warm-gray":   "#6B6B6B",
        "warm-border": "#E8E4DF",
        accent:       "#B8860B",
        "accent-light":"#D4A84B",
        "accent-muted":"rgba(184,134,11,0.06)",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        sans:    ['"Source Sans 3"', "system-ui", "-apple-system", "sans-serif"],
        mono:    ['"IBM Plex Mono"', "monospace"],
      },
      boxShadow: {
        "card":      "0 1px 2px rgba(26,26,26,0.04)",
        "card-md":   "0 4px 12px rgba(26,26,26,0.06)",
        "card-lg":   "0 8px 24px rgba(26,26,26,0.08)",
        "accent":    "0 4px 14px rgba(184,134,11,0.25)",
      },
      borderRadius: {
        md:  "6px",
        lg:  "8px",
        xl:  "12px",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      transitionTimingFunction: {
        DEFAULT: "ease-out",
      },
    },
  },
  plugins: [],
};
