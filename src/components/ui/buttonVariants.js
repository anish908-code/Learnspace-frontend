import { cn } from "../../utils/cn";

/*
|--------------------------------------------------------------------------
| Button recipe
|--------------------------------------------------------------------------
| Plain module (components nahi) — isliye Button.jsx sirf components export
| karta hai aur react-refresh rule khush rehta hai.
|
| BASE     — geometry, motion, focus ring
| VARIANTS — primary · secondary · ghost · outline · premium · destructive
|            · technical · link
| SIZES    — 32px dense toolbars se 48px hero actions tak
*/

export const BASE =
    "btn-base inline-flex select-none whitespace-nowrap font-display font-semibold " +
    "transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-out-expo " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 " +
    "focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-45 " +
    "[&_svg]:pointer-events-none [&_svg]:shrink-0";

export const VARIANTS = {
    /* Accent fill — the one dominant action per view */
    primary:
        "bg-accent text-white shadow-lift " +
        "hover:bg-accent-bright hover:shadow-glow",

    /* Surface + hairline — everything beside the primary */
    secondary:
        "border border-line-strong bg-surface/80 text-fg shadow-lift " +
        "hover:border-accent/45 hover:bg-surface hover:text-accent hover:shadow-lift-md",

    /* Borderless — dense rows, toolbars, tertiary */
    ghost: "text-muted hover:bg-surface-2 hover:text-fg",

    /* Transparent with visible frame — toolbar / icon actions */
    outline:
        "border border-line-strong bg-transparent text-fg " +
        "hover:border-accent/50 hover:bg-accent/5 hover:text-accent",

    /* Gold hairline — premium moments only (certificates, launch) */
    premium:
        "border border-gold/45 bg-gold/10 text-gold shadow-lift " +
        "hover:border-gold/70 hover:bg-gold/20",

    /* Destructive */
    destructive: "bg-danger text-white shadow-lift hover:brightness-110 hover:shadow-lift-md",

    /* Terminal-inspired: mono, inset surface, dashed frame */
    technical:
        "font-mono text-[0.75rem] uppercase tracking-[0.14em] text-muted " +
        "border border-dashed border-line-strong bg-bg-2/60 " +
        "hover:border-accent/45 hover:text-accent",

    /* Text only */
    link: "h-auto p-0 text-accent hover:text-accent-bright hover:underline underline-offset-4",
};

export const SIZES = {
    sm: "h-8 gap-1.5 rounded-[0.6rem] px-3 text-[0.8125rem]",
    md: "h-10 gap-2 rounded-xl px-4 text-sm",
    lg: "h-12 gap-2.5 rounded-xl px-6 text-[0.9375rem]",
    xl: "h-14 gap-3 rounded-2xl px-8 text-base",
    "icon-sm": "h-8 w-8 rounded-[0.6rem] p-0 [&_svg]:size-4",
    "icon-md": "h-10 w-10 rounded-xl p-0 [&_svg]:size-[1.125rem]",
    "icon-lg": "h-12 w-12 rounded-xl p-0 [&_svg]:size-5",
};

/** Button ke classes — <Link>/<a> ko button jaisa banane ke liye bhi yahi. */
export function buttonVariants({ variant = "primary", size = "md", className } = {}) {
    return cn(BASE, VARIANTS[variant] ?? VARIANTS.primary, SIZES[size] ?? SIZES.md, className);
}
