import { cn } from "../../utils/cn";
import { OrbitRings } from "../ui/Deco";

/*
|--------------------------------------------------------------------------
| EmptyState
|--------------------------------------------------------------------------
| Distinctive on purpose: concentric geometry + technical "[ NO DATA ]"
| marker instead of a bare grey icon on a white box.
*/

const EmptyState = ({
    icon: Icon = null,
    title,
    message,
    action,
    className,
    padded = true,
    ...props
}) => (
    <div
        className={cn(
            "card relative overflow-hidden text-center",
            padded ? "p-10 sm:p-14" : "p-6",
            className,
        )}
        {...props}
    >
        <OrbitRings className="opacity-70" rings={2} />

        <div className="relative">
            <span className="icon-well mx-auto h-16 w-16">
                {Icon ? <Icon size={26} strokeWidth={1.9} /> : <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
            </span>

            <p className="technical-label mt-6">No data</p>

            {title && <h3 className="mt-2 font-display text-lg font-bold text-fg">{title}</h3>}

            {message && (
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">{message}</p>
            )}

            {action && <div className="mt-6 flex justify-center">{action}</div>}
        </div>
    </div>
);

export default EmptyState;
