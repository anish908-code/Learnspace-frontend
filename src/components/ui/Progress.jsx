import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------
   Progress — technical bar + tabular value
   ------------------------------------------------------------------ */

export const ProgressBar = ({
    value = 0,
    className,
    trackClassName,
    tone = "accent",
    showTicks = true,
}) => {
    const clamped = Math.max(0, Math.min(100, Number(value) || 0));

    const tones = {
        accent: "from-accent to-accent-bright",
        teal: "from-teal to-teal",
        gold: "from-gold to-gold",
    };

    return (
        <div
            className={cn("progress-track", trackClassName, className)}
            role="progressbar"
            aria-valuenow={Math.round(clamped)}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <div
                className={cn("progress-fill bg-gradient-to-r", tones[tone] ?? tones.accent)}
                style={{ width: `${clamped}%` }}
            />

            {/* Faint quarter ticks — architectural detail, not noise */}
            {showTicks && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex justify-between">
                    {[25, 50, 75].map((tick) => (
                        <span key={tick} className="h-full w-px bg-fg/12" />
                    ))}
                </div>
            )}
        </div>
    );
};

/* Metric block — number dominates, label is technical metadata */
export const Metric = ({ label, value, suffix, hint, tone = "default", className, icon: Icon }) => (
    <div className={cn("space-y-2", className)}>
        {Icon && (
            <span className="icon-well h-10 w-10" aria-hidden="true">
                <Icon size={17} strokeWidth={2.1} />
            </span>
        )}

        <p
            className={cn(
                "numeric text-3xl font-bold leading-none sm:text-[2.1rem]",
                tone === "accent" && "text-accent",
                tone === "gold" && "text-gold",
                tone === "teal" && "text-teal",
                tone === "danger" && "text-danger",
            )}
        >
            {value}
            {suffix && <span className="ml-0.5 text-lg text-subtle">{suffix}</span>}
        </p>

        <p className="technical-label">{label}</p>

        {hint && <p className="text-xs text-subtle">{hint}</p>}
    </div>
);

export default ProgressBar;
