import { cn } from "../../utils/cn";

/*
|--------------------------------------------------------------------------
| PageHeader
|--------------------------------------------------------------------------
| Technical eyebrow label + display title + optional action slot.
| Hamesha ek dominant hierarchy banata hai, competition nahi.
*/

const PageHeader = ({ eyebrow, title, subtitle, action, className, children }) => (
    <div
        className={cn(
            "mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4",
            className,
        )}
    >
        <div className="min-w-0">
            {eyebrow && <span className="technical-label">{eyebrow}</span>}

            <h1 className={cn("page-title", eyebrow && "mt-2.5")}>{title}</h1>

            {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted">{subtitle}</p>}

            {children}
        </div>

        {action && <div className="flex flex-wrap items-center gap-3">{action}</div>}
    </div>
);

export default PageHeader;
