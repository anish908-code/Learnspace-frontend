import { BrandGlyph } from "../ui/BrandMark";

/*
|--------------------------------------------------------------------------
| Skeletons
|--------------------------------------------------------------------------
| Loading states bhi design system ki language me — shimmer sweep + tinted
| surfaces, na ki grey blocks.
*/

export const Skeleton = ({ className = "", children }) => (
    <div className={`skeleton ${className}`} aria-hidden="true">
        {children}
    </div>
);

export default Skeleton;

export const SkeletonLine = ({ className = "" }) => (
    <Skeleton className={`h-3 rounded-full ${className}`} />
);

const SkeletonGridCard = () => (
    <div className="card flex flex-col p-5">
        <div className="flex items-center justify-between">
            <SkeletonLine className="h-5 w-20" />
            <SkeletonLine className="h-5 w-16" />
        </div>
        <SkeletonLine className="mt-4 h-4 w-3/4" />
        <div className="mt-3 flex-1 space-y-2">
            <SkeletonLine className="w-full" />
            <SkeletonLine className="w-2/3" />
        </div>
        <Skeleton className="mt-6 h-10 w-full rounded-xl" />
    </div>
);

export const SkeletonCardGrid = ({
    count = 6,
    className = "md:grid-cols-2 lg:grid-cols-3",
}) => (
    <div className={`grid gap-5 ${className}`}>
        {Array.from({ length: count }, (_, index) => (
            <SkeletonGridCard key={index} />
        ))}
    </div>
);

const SkeletonListItem = ({ className = "" }) => (
    <div className={`data-row flex-col items-start sm:flex-row sm:items-center ${className}`}>
        <div className="min-w-0 flex-1">
            <SkeletonLine className="h-4 w-1/3" />
            <SkeletonLine className="mt-2.5 h-3 w-1/2" />
        </div>
        <SkeletonLine className="h-6 w-24 shrink-0" />
    </div>
);

export const SkeletonList = ({ count = 4 }) => (
    <div className="space-y-3">
        {Array.from({ length: count }, (_, index) => (
            <SkeletonListItem key={index} />
        ))}
    </div>
);

export const SkeletonStatCards = ({
    count = 4,
    className = "sm:grid-cols-2 lg:grid-cols-4",
}) => (
    <div className={`grid gap-4 ${className}`}>
        {Array.from({ length: count }, (_, index) => (
            <div key={index} className="card flex items-center gap-4 p-5">
                <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />
                <div className="min-w-0">
                    <SkeletonLine className="h-3 w-24" />
                    <SkeletonLine className="mt-2 h-6 w-12" />
                </div>
            </div>
        ))}
    </div>
);

export const SkeletonTableRows = ({ count = 5 }) => (
    <div className="card overflow-hidden">
        <div className="divide-y divide-line">
            {Array.from({ length: count }, (_, index) => (
                <div key={index} className="flex items-center gap-3 px-5 py-4">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1">
                        <SkeletonLine className="h-3.5 w-36" />
                        <SkeletonLine className="mt-2 h-3 w-48" />
                    </div>
                    <SkeletonLine className="hidden h-3 w-24 md:block" />
                    <SkeletonLine className="hidden h-3 w-20 lg:block" />
                </div>
            ))}
        </div>
    </div>
);

export const FullScreenLoader = ({ message = "Loading" }) => (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-5">
        <div className="relative">
            <span
                aria-hidden="true"
                className="absolute inset-0 animate-pulse-ring rounded-2xl bg-accent/25"
            />
            <BrandGlyph size="lg" className="relative" />
        </div>

        <div className="flex items-center gap-2">
            <span className="technical-label">{message}</span>
            <span
                aria-hidden="true"
                className="h-3 w-[2px] animate-caret-blink bg-accent"
            />
        </div>

        <span className="sr-only">Loading…</span>
    </div>
);
