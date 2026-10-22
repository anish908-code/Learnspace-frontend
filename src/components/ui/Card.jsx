import { forwardRef } from "react";

import { cn } from "../../utils/cn";

/*
|--------------------------------------------------------------------------
| Surface primitives
|--------------------------------------------------------------------------
| .card / .card-glass / .card-tactile / .card-featured / .card-luxury
| index.css me defined hain (tokens ke saath). Yahan sirf composition
| helpers hain — variant chunne ka decision content ke hisaab se hota hai.
*/

export const Card = forwardRef(function Card(
    { variant = "default", as: Tag = "div", glow = false, className, children, ...props },
    ref,
) {
    const variants = {
        default: "card",
        glass: "card-glass",
        tactile: "card-tactile",
        featured: "card-featured",
        luxury: "card-luxury",
        technical: "surface-technical rounded-3xl",
    };

    return (
        <Tag
            ref={ref}
            className={cn(
                variants[variant] ?? variants.default,
                glow && "shadow-glow",
                "transition-shadow duration-300 ease-out-expo",
                className,
            )}
            {...props}
        >
            {children}
        </Tag>
    );
});

export const CardHeader = ({ className, children, ...props }) => (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)} {...props}>
        {children}
    </div>
);

export const CardTitle = ({ as: Tag = "h3", className, children, ...props }) => (
    <Tag className={cn("font-display text-lg font-bold tracking-tight text-fg", className)} {...props}>
        {children}
    </Tag>
);

export const CardDescription = ({ className, children, ...props }) => (
    <p className={cn("text-sm leading-relaxed text-muted", className)} {...props}>
        {children}
    </p>
);

export const CardFooter = ({ className, children, ...props }) => (
    <div className={cn("flex flex-wrap items-center gap-3", className)} {...props}>
        {children}
    </div>
);

/* Section wrapper — consistent vertical rhythm across pages */
export const Section = ({ className, children, ...props }) => (
    <section className={cn("py-16 sm:py-20 lg:py-24", className)} {...props}>
        {children}
    </section>
);

export default Card;
