// Certificate design tokens — LearnSpace premium certificate
export const COLORS = {
    green: "#1A3B2E",
    darkGreen: "#123026",
    gold: "#B8860B",
    goldLight: "#D4A84B",
    goldSoft: "#E8CE9E",
    ivory: "#FBF8F1",
    sage: "#E9F0EA",
    sageLight: "#F3F7F3",
    charcoal: "#2B332D",
    white: "#FFFFFF",
    muted: "#7A837B",
    line: "#C9B27C",
};

// Certificate ke liye typography — certificate print hota hai, isliye
// fonts seedhe HTML se load hoti hain (index.html) aur container query units
// ke saath scale hoti hain. Display voice ab Fraunces (serif) hai —
// certificate par editorial serif premium feel deta hai.
export const FONTS = {
    display: '"Fraunces", "Inter", system-ui, sans-serif',
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
};

// Aspect ratio (16:9 landscape)
export const RATIO = 16 / 9;

export const BRAND = {
    name: "LearnSpace",
    tagline: "LEARN • BUILD • SUCCEED",
};
