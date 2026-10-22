import { cn } from "../../utils/cn";

/*
|--------------------------------------------------------------------------
| Geometry kit
|--------------------------------------------------------------------------
| Decorative elements sirf tab — hero, section markers, featured panels,
| empty states, stat zones. Har element compositional kaam karta hai.
*/

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];

/* Art Deco section marker — "IV — FEATURES" */
export const SectionMarker = ({ index, children, className, align = "left" }) => (
    <div
        className={cn(
            "flex items-center gap-3",
            align === "center" && "justify-center",
            className,
        )}
    >
        {index != null && (
            <span className="numeric text-xs font-semibold tracking-[0.2em] text-gold">
                {ROMAN[index] || index}
            </span>
        )}

        <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-transparent to-gold/50" />

        <span className="section-label">{children}</span>
    </div>
);

/* Concentric orbit — hero / featured panels */
export const OrbitRings = ({ className = "", rings = 3 }) => (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
        {Array.from({ length: rings }, (_, i) => (
            <span
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full border border-accent/12"
                style={{
                    width: `${(i + 1) * 22}%`,
                    aspectRatio: "1",
                    transform: "translate(-50%, -50%)",
                }}
            />
        ))}
    </div>
);

/* Slow-rotating sunburst — Art Deco, gold, very restrained */
export const Sunburst = ({ className = "", spokes = 24 }) => (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
        <svg viewBox="0 0 200 200" className="h-full w-full animate-spin-slower opacity-70">
            {Array.from({ length: spokes }, (_, i) => {
                const angle = (i / spokes) * 360;
                return (
                    <rect
                        key={i}
                        x="99.4"
                        y="8"
                        width="1.2"
                        height="30"
                        rx="0.6"
                        fill="rgb(var(--gold-rgb))"
                        opacity={i % 3 === 0 ? 0.5 : 0.16}
                        transform={`rotate(${angle} 100 100)`}
                    />
                );
            })}
        </svg>
    </div>
);

/* Single geometric accent — circle, diamond or square */
export const GeoMark = ({ shape = "circle", className = "", tone = "accent" }) => {
    const tones = {
        accent: "bg-accent/20 border-accent/40",
        gold: "bg-gold/25 border-gold/50",
        teal: "bg-teal/20 border-teal/40",
        fg: "bg-fg/10 border-fg/25",
    };

    return (
        <span
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute h-4 w-4 border",
                shape === "circle" && "rounded-full",
                shape === "diamond" && "rotate-45 rounded-[2px]",
                shape === "square" && "rounded-[3px]",
                tones[tone] ?? tones.accent,
                className,
            )}
        />
    );
};

/* Architectural corner brackets — technical panels */
export const CornerBrackets = ({ className = "" }) => (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
        {[
            "left-3 top-3 border-l border-t",
            "right-3 top-3 border-r border-t",
            "bottom-3 left-3 border-b border-l",
            "bottom-3 right-3 border-b border-r",
        ].map((position) => (
            <span key={position} className={cn("absolute h-4 w-4 border-line-strong", position)} />
        ))}
    </div>
);

/* Thin vertical rules — Art Deco rhythm inside split sections */
export const DecoDivider = ({ className = "" }) => (
    <div
        aria-hidden="true"
        className={cn("w-px bg-gradient-to-b from-transparent via-line-strong to-transparent", className)}
    />
);

export default SectionMarker;
