import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Users,
    BookOpen,
    FolderGit2,
    ClipboardCheck,
    Eye,
    Inbox,
} from "lucide-react";

import { fetchAdminOverview } from "../../features/admin/adminOverviewSlice";
import { fetchAdminAnalytics } from "../../features/admin/adminAnalyticsSlice";
import { formatDate } from "../../utils/date";
import {
    Skeleton,
    SkeletonLine,
    SkeletonStatCards,
} from "../../components/common/Skeleton";
import {
    PageHeader,
    StatCard,
    AlertBanner,
    EmptyState,
} from "../../components/common";
import { ButtonLink } from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { SectionMarker, CornerBrackets } from "../../components/ui/Deco";
import { GrowthChart, ChartSkeleton, ChartPlaceholder } from "../../components/charts/AdminCharts";

const statCards = [
    {
        key: "totalStudents",
        label: "Students",
        icon: Users,
        tone: "accent",
        to: "/admin/students",
    },
    {
        key: "totalCourses",
        label: "Total Courses",
        icon: BookOpen,
        tone: "accent",
        to: "/admin/courses",
    },
    {
        key: "publishedCourses",
        label: "Published Courses",
        icon: Eye,
        tone: "teal",
        to: "/admin/courses",
    },
    {
        key: "totalProjects",
        label: "Projects",
        icon: FolderGit2,
        tone: "gold",
        to: "/admin/projects",
    },
    {
        key: "pendingSubmissions",
        label: "Pending Reviews",
        icon: ClipboardCheck,
        tone: "danger",
        to: "/admin/submissions",
    },
];

/* Same status vocabulary as before — sirf ab semantic tones me hai */
const statusTone = {
    pending: "neutral",
    under_review: "gold",
    approved: "teal",
    rejected: "danger",
    changes_required: "gold",
};

const AdminDashboard = () => {
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { stats, recentStudents, recentSubmissions, loading, error } =
        useSelector((state) => state.adminOverview);

    const { growth, loading: analyticsLoading } = useSelector(
        (state) => state.adminAnalytics
    );

    // Backend July se current month tak bhejta hai, isliye range bhi wahi dikhao
    const rangeLabel = growth.length
        ? `${growth[0].label_full} — ${growth[growth.length - 1].label_full}`
        : "";

    useEffect(() => {
        dispatch(fetchAdminOverview());
        dispatch(fetchAdminAnalytics(6));
    }, [dispatch]);

    if (loading && !stats) {
        return (
            <div className="space-y-8">
                <SkeletonStatCards
                    count={4}
                    className="gap-4 sm:grid-cols-2 lg:grid-cols-3"
                />

                <div className="grid gap-8 lg:grid-cols-2">
                    {[1, 2].map((n) => (
                        <section key={n} className="card p-6 sm:p-7">
                            <SkeletonLine className="h-4 w-36" />

                            <div className="mt-5 space-y-4">
                                {[1, 2, 3].map((row) => (
                                    <div
                                        key={row}
                                        className="flex items-center gap-3"
                                    >
                                        <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

                                        <div className="min-w-0 flex-1">
                                            <SkeletonLine className="h-3.5 w-32" />
                                            <SkeletonLine className="mt-2 h-3 w-44" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        );
    }

    if (error && !stats) {
        return <AlertBanner type="error" message={error} />;
    }

    return (
        <div>
            <PageHeader
                eyebrow="control room"
                title={`Welcome back, ${(user?.name || "Admin").split(" ")[0]}!`}
                subtitle="An overview of your platform — students, courses and reviews."
            />

            {/* Stat cards */}
            <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((card) => (
                    <StatCard
                        key={card.key}
                        to={card.to}
                        icon={card.icon}
                        label={card.label}
                        value={stats?.[card.key] ?? 0}
                        tone={card.tone}
                    />
                ))}
            </div>

            {/* Growth trend — full width */}
            <section className="mt-12">
                <div className="card relative overflow-hidden p-6 sm:p-7">
                    <CornerBrackets />

                    <div className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                        <h2 className="m-0 font-normal">
                            <SectionMarker index={1}>Growth Overview</SectionMarker>
                        </h2>

                        <span className="technical-label">{rangeLabel}</span>
                    </div>

                    <p className="relative mb-2 mt-3 text-sm text-muted">
                        New students, enrollments and project submissions over time.
                    </p>

                    <div className="relative mt-5 h-72">
                        {analyticsLoading && growth.length === 0 ? (
                            <ChartSkeleton bars={6} />
                        ) : growth.length === 0 ? (
                            <ChartPlaceholder message="No activity in this period." />
                        ) : (
                            <GrowthChart data={growth} showLegend />
                        )}
                    </div>
                </div>
            </section>

            <div className="mt-12 grid gap-8 lg:grid-cols-2">
                {/* Recent students */}
                <section className="card p-6 sm:p-7">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                        <h2 className="m-0 font-normal">
                            <SectionMarker index={2}>Recent Students</SectionMarker>
                        </h2>

                        <ButtonLink
                            to="/admin/students"
                            variant="ghost"
                            size="sm"
                            className="shrink-0"
                        >
                            View all
                        </ButtonLink>
                    </div>

                    {recentStudents.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            title="No students registered yet."
                            padded={false}
                            className="border-0 bg-transparent shadow-none backdrop-blur-none"
                        />
                    ) : (
                        <ul className="divide-y divide-line">
                            {recentStudents.map((student) => (
                                <li
                                    key={student.id}
                                    className="flex items-center gap-3 py-3"
                                >
                                    <span className="icon-well icon-well-round h-9 w-9 shrink-0 text-sm font-bold text-accent">
                                        {(
                                            student.user?.name || "?"
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-fg">
                                            {student.user?.name || "-"}
                                        </p>

                                        <p className="truncate text-xs text-muted">
                                            {student.user?.email || "-"}
                                        </p>
                                    </div>

                                    <span className="numeric shrink-0 text-xs text-subtle">
                                        {formatDate(student.created_at)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Recent submissions */}
                <section className="card p-6 sm:p-7">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                        <h2 className="m-0 font-normal">
                            <SectionMarker index={3}>Recent Submissions</SectionMarker>
                        </h2>

                        <ButtonLink
                            to="/admin/submissions"
                            variant="ghost"
                            size="sm"
                            className="shrink-0"
                        >
                            View all
                        </ButtonLink>
                    </div>

                    {recentSubmissions.length === 0 ? (
                        <EmptyState
                            icon={Inbox}
                            title="No submissions received yet."
                            padded={false}
                            className="border-0 bg-transparent shadow-none backdrop-blur-none"
                        />
                    ) : (
                        <ul className="divide-y divide-line">
                            {recentSubmissions.map((submission) => (
                                <li
                                    key={submission.id}
                                    className="flex items-center gap-3 py-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-fg">
                                            {submission.project?.title || "-"}
                                        </p>

                                        <p className="truncate text-xs text-muted">
                                            {submission.student?.user?.name ||
                                                "-"}
                                        </p>
                                    </div>

                                    <Badge
                                        tone={statusTone[submission.status] || "neutral"}
                                        className="shrink-0"
                                    >
                                        {submission.status.replace("_", " ")}
                                    </Badge>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
