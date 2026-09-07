import { GraduationCap } from "lucide-react";

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
        <Skeleton className="mt-6 h-9 w-full rounded-md" />
    </div>
);

export const SkeletonCardGrid = ({
    count = 6,
    className = "md:grid-cols-2 lg:grid-cols-3",
}) => (
    <div className={`grid gap-8 ${className}`}>
        {Array.from({ length: count }, (_, index) => (
            <SkeletonGridCard key={index} />
        ))}
    </div>
);

export const SkeletonListItem = ({ className = "" }) => (
    <div className={`card flex items-center justify-between gap-4 p-6 ${className}`}>
        <div className="min-w-0 flex-1">
            <SkeletonLine className="h-4 w-1/3" />
            <SkeletonLine className="mt-2.5 h-3 w-1/2" />
        </div>
        <SkeletonLine className="h-6 w-24 shrink-0" />
    </div>
);

export const SkeletonList = ({ count = 4 }) => (
    <div className="space-y-4">
        {Array.from({ length: count }, (_, index) => (
            <SkeletonListItem key={index} />
        ))}
    </div>
);

export const SkeletonStatCards = ({
    count = 4,
    className = "sm:grid-cols-2 lg:grid-cols-4",
}) => (
    <div className={`grid gap-8 ${className}`}>
        {Array.from({ length: count }, (_, index) => (
            <div key={index} className="card flex items-center gap-4 p-5">
                <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
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
        <div className="divide-y divide-warm-border">
            {Array.from({ length: count }, (_, index) => (
                <div key={index} className="flex items-center gap-3 px-6 py-4">
                    <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
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

export const FullScreenLoader = () => (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5" style={{ background: "var(--background)" }}>
        <Skeleton className="flex h-14 w-14 items-center justify-center rounded-xl">
            <GraduationCap size={26} className="text-warm-gray" />
        </Skeleton>
        <SkeletonLine className="w-40" />
        <span className="sr-only">Loading...</span>
    </div>
);
