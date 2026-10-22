import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { cn } from "../../utils/cn";
import SpotlightCard from "../ui/SpotlightCard";

/*
|--------------------------------------------------------------------------
| StatCard
|--------------------------------------------------------------------------
| Metric dominates, label is technical metadata. Icon sits in a tactile
| well; hover pe ek soft accent spotlight + lift.
*/

const TONE = {
    accent: { well: "text-accent", text: "text-accent" },
    teal: { well: "text-teal", text: "text-teal" },
    gold: { well: "text-gold", text: "text-gold" },
    danger: { well: "text-danger", text: "text-danger" },
};

/* Purane pages Tailwind palette classes bhejte hain — unhe tone me map karte
   hain taaki dashboard ek hi accent language me rahe. */
const LEGACY_TONE = {
    blue: "accent",
    indigo: "accent",
    emerald: "teal",
    teal: "teal",
    amber: "gold",
    yellow: "gold",
    rose: "danger",
    red: "danger",
};

const resolveTone = (tone, colorClass) => {
    if (TONE[tone]) return tone;
    if (!colorClass) return "accent";

    const match = Object.keys(LEGACY_TONE).find((key) => colorClass.includes(key));
    return match ? LEGACY_TONE[match] : "accent";
};

const StatCard = ({ to, icon: Icon, label, value, tone, colorClass, className, ...props }) => {
    const active = TONE[resolveTone(tone, colorClass)] ?? TONE.accent;

    const body = (
        <>
            <span className="flex items-start justify-between gap-3">
                {Icon && (
                    <span className={cn("icon-well h-11 w-11", active.well)}>
                        <Icon size={19} strokeWidth={2.1} />
                    </span>
                )}

                {to && (
                    <ArrowUpRight
                        size={16}
                        strokeWidth={2.2}
                        aria-hidden="true"
                        className="mt-1 text-subtle transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                    />
                )}
            </span>

            <span className={cn("numeric mt-5 block text-3xl font-bold leading-none", active.text)}>
                {value ?? 0}
            </span>

            <span className="technical-label mt-2.5 block">{label}</span>
        </>
    );

    const classes = cn("card-hover spotlight group flex flex-col p-5 sm:p-6", className);

    if (to) {
        return (
            <Link to={to} className={classes} {...props}>
                {body}
            </Link>
        );
    }

    return (
        <SpotlightCard className={classes} {...props}>
            {body}
        </SpotlightCard>
    );
};

export default StatCard;
