import { cn } from "../../utils/cn";

/*
|--------------------------------------------------------------------------
| Brand mark
|--------------------------------------------------------------------------
| Architectural instrument: framed square + orbit ring + rotated diamond +
| gold arc. Technical, geometric, ek hi colour system me — koi generic
| graduation-cap placeholder nahi.
*/

const SIZES = {
    sm: { box: "h-8 w-8", text: "text-base" },
    md: { box: "h-10 w-10", text: "text-lg" },
    lg: { box: "h-12 w-12", text: "text-xl" },
};

export const BrandGlyph = ({ className = "", size = "md" }) => {
    const { box } = SIZES[size] ?? SIZES.md;

    return (
        <span
            className={cn(
                box,
                "icon-well relative shrink-0 overflow-hidden rounded-xl",
                className,
            )}
            aria-hidden="true"
        >
            <svg viewBox="0 0 40 40" className="h-full w-full" fill="none">
                {/* construction grid — barely there */}
                <path
                    d="M0 13.3h40M0 26.6h40M13.3 0v40M26.6 0v40"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    opacity="0.14"
                />
                {/* orbit ring */}
                <circle cx="20" cy="20" r="9.5" stroke="currentColor" strokeWidth="1.6" opacity="0.55" />
                {/* rotated square */}
                <path
                    d="M20 10.5 29.5 20 20 29.5 10.5 20Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                />
                {/* core */}
                <circle cx="20" cy="20" r="3.2" fill="currentColor" />
                {/* gold premium arc */}
                <path
                    d="M29.8 9.4A12 12 0 0 1 33.2 16"
                    stroke="rgb(var(--gold-rgb))"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
        </span>
    );
};

const BrandMark = ({ size = "md", className = "", showTagline = false, as: Tag = "div" }) => {
    const { text } = SIZES[size] ?? SIZES.md;

    return (
        <Tag className={cn("flex items-center gap-3", className)}>
            <BrandGlyph size={size} />

            <span className="flex flex-col leading-none">
                <span
                    className={cn(
                        "font-display font-extrabold tracking-[-0.03em]",
                        text,
                    )}
                >
                    <span className="text-fg">Learn</span>
                    <span className="text-accent">Space</span>
                </span>

                {showTagline && (
                    <span className="technical-label mt-1.5">Learning Instrument</span>
                )}
            </span>
        </Tag>
    );
};

export default BrandMark;
