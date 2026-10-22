import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { cn } from "../../utils/cn";

/*
|--------------------------------------------------------------------------
| AlertBanner
|--------------------------------------------------------------------------
| Colour + icon + text — meaning kabhi sirf colour pe depend nahi karta.
*/

const VARIANTS = {
    error: {
        icon: AlertTriangle,
        wrap: "border-danger/30 bg-danger/8 text-danger",
        iconWrap: "bg-danger/12 text-danger",
    },
    success: {
        icon: CheckCircle2,
        wrap: "border-teal/30 bg-teal/8 text-teal",
        iconWrap: "bg-teal/12 text-teal",
    },
};

const AlertBanner = ({ type = "error", message, errors, className, ...props }) => {
    if (!message && !errors) return null;

    const variant = VARIANTS[type] ?? VARIANTS.error;
    const Icon = variant.icon;

    const errorItems = errors ? Object.values(errors).flat().filter(Boolean) : [];

    return (
        <div
            role={type === "error" ? "alert" : "status"}
            className={cn(
                "mb-5 flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm",
                variant.wrap,
                className,
            )}
            {...props}
        >
            <span
                className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                    variant.iconWrap,
                )}
            >
                <Icon size={15} strokeWidth={2.3} />
            </span>

            <div className="min-w-0 flex-1 leading-relaxed">
                {message && <p className="font-medium">{message}</p>}

                {errorItems.length > 0 && (
                    <ul className="mt-1.5 space-y-1">
                        {errorItems.map((item, index) => (
                            <li key={index} className="flex gap-2 text-[0.8125rem]">
                                <span aria-hidden="true">—</span>
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AlertBanner;
