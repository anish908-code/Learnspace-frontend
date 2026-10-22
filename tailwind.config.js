/** @type {import('tailwindcss').Config} */

/*
|--------------------------------------------------------------------------
| LearnSpace — "Architectural Instrument"
|--------------------------------------------------------------------------
| Ek design language, do lighting environments (day / night).
|
| Colors `rgb(var(--*-rgb) / <alpha-value>)` se aate hain, isliye har
| utility class theme-aware hai: `bg-accent/10`, `text-muted`, `border-line`
| — light me bhi sahi, dark me bhi sahi. Hex kabhi hardcode nahi karta.
*/

const rgb = (name) => `rgb(var(${name}-rgb) / <alpha-value>)`;

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                /* Surfaces */
                bg: rgb("--bg"),
                "bg-2": rgb("--bg-2"),
                surface: rgb("--surface"),
                "surface-2": rgb("--surface-2"),
                glass: "var(--glass)",

                /* Text */
                fg: rgb("--fg"),
                muted: rgb("--fg-muted"),
                subtle: rgb("--fg-subtle"),

                /* Lines — alpha baked in, so `border-line` alone is enough */
                line: "rgb(var(--border-rgb) / 0.10)",
                "line-strong": "rgb(var(--border-strong-rgb) / 0.17)",

                /* Accent family */
                accent: rgb("--accent"),
                "accent-bright": rgb("--accent-bright"),
                "accent-deep": rgb("--accent-deep"),
                gold: rgb("--gold"),
                teal: rgb("--teal"),
                danger: rgb("--danger"),
                "success": rgb("--teal"),

                /* Legacy names — purane markup abhi bhi inhe use karta hai,
                   inhe naye tokens pe map kar diya gaya hai */
                ivory: rgb("--surface"),
                "rich-black": rgb("--fg"),
                "warm-gray": rgb("--fg-subtle"),
                "warm-border": "rgb(var(--border-rgb) / 0.10)",
                "accent-light": rgb("--accent-bright"),
                "accent-muted": "var(--accent-soft)",
            },
            fontFamily: {
                  sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
                  /* Editorial Luxury — display voice Fraunces (variable serif) */
                  display: ['"Fraunces"', '"Inter"', "system-ui", "sans-serif"],
                  mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
                  /* Purane tokens - ab naye display/mono pe map */
                  serif: ['"Fraunces"', '"Inter"', "system-ui", "sans-serif"],
            },
            borderRadius: {
                "4xl": "2rem",
                "5xl": "2.5rem",
            },
            boxShadow: {
                /* Architectural — soft, layered */
                lift: "var(--shadow-lift)",
                "lift-md": "var(--shadow-lift-md)",
                float: "var(--shadow-float)",
                /* Bauhaus signature — hard offset, featured elements only */
                hard: "var(--shadow-hard)",
                "hard-lg": "var(--shadow-hard-lg)",
                /* Cinematic — night glow */
                glow: "var(--shadow-glow)",
                "glow-lg": "var(--shadow-glow-lg)",
                /* Neumorphic */
                tactile: "var(--shadow-tactile)",
                "tactile-in": "var(--shadow-tactile-in)",
                inset: "var(--shadow-inset)",
            },
            maxWidth: {
                shell: "88rem",
            },
            /* Poore 0–100 scale: design me 8/12/15 jaise fractions bahut
               use hote hain, aur Tailwind ka default scale sirf
               0/5/10/20/... rakhta hai — iske bina `bg-accent/15` chup-chaap
               generate hi nahi hota. */
            opacity: Object.fromEntries(
                Array.from({ length: 101 }, (_, step) => [step, String(step / 100)]),
            ),
            transitionTimingFunction: {
                "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
            },
            keyframes: {
                "rise-in": {
                    "0%": { opacity: "0", transform: "translateY(18px) scale(0.985)" },
                    "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "drift-a": {
                    "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
                    "50%": { transform: "translate3d(3%, -4%, 0) scale(1.08)" },
                },
                "drift-b": {
                    "0%, 100%": { transform: "translate3d(0,0,0) scale(1.05)" },
                    "50%": { transform: "translate3d(-4%, 3%, 0) scale(0.95)" },
                },
                "spin-slow": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                },
                "pulse-ring": {
                    "0%": { opacity: "0.55", transform: "scale(0.82)" },
                    "70%": { opacity: "0", transform: "scale(1.5)" },
                    "100%": { opacity: "0", transform: "scale(1.5)" },
                },
                shimmer: {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" },
                },
                "ticker-scroll": {
                    "0%": { transform: "translate3d(0,0,0)" },
                    "100%": { transform: "translate3d(-50%,0,0)" },
                },
                "caret-blink": {
                    "0%, 45%": { opacity: "1" },
                    "55%, 100%": { opacity: "0" },
                },
                "bar-grow": {
                    "0%": { transform: "scaleX(0)" },
                    "100%": { transform: "scaleX(1)" },
                },
            },
            animation: {
                "rise-in": "rise-in 0.62s cubic-bezier(0.16, 1, 0.3, 1) both",
                "fade-in": "fade-in 0.5s ease-out both",
                "drift-a": "drift-a 22s ease-in-out infinite",
                "drift-b": "drift-b 28s ease-in-out infinite",
                "spin-slow": "spin-slow 26s linear infinite",
                "spin-slower": "spin-slow 44s linear infinite reverse",
                "pulse-ring": "pulse-ring 2.6s ease-out infinite",
                "ticker-scroll": "ticker-scroll var(--ticker-duration, 64s) linear infinite",
                "caret-blink": "caret-blink 1.1s steps(1) infinite",
                "bar-grow": "bar-grow 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
            },
        },
    },
    plugins: [],
};
