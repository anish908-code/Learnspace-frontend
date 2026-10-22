import { cn } from "../../utils/cn";

/* ------------------------------------------------------------------
   Status / metadata badges — technical micro-labels
   ------------------------------------------------------------------ */

const TONES = {
    neutral: "border-line bg-surface-2/80 text-muted",
    accent: "border-accent/25 bg-accent/10 text-accent",
    gold: "border-gold/30 bg-gold/10 text-gold",
    teal: "border-teal/30 bg-teal/10 text-teal",
    danger: "border-danger/30 bg-danger/10 text-danger",
};

export const Badge = ({ tone = "neutral", dot = false, className, children, ...props }) => (
    <span className={cn("badge", TONES[tone] ?? TONES.neutral, className)} {...props}>
        {dot && <span className="status-dot" aria-hidden="true" />}
        {children}
    </span>
);

/* Terminal-style label: [ READY ] — design accent, sparingly */
export const StatusLabel = ({ status = "ready", className, children }) => (
    <span className={cn("technical-label inline-flex items-center gap-1.5", className)}>
        <span aria-hidden="true" className="text-accent">
            [
        </span>
        {children || status}
        <span aria-hidden="true" className="text-accent">
            ]
        </span>
    </span>
);

export default Badge;
