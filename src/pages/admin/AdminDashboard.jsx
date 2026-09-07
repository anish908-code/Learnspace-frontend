import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
    Users,
    BookOpen,
    FolderGit2,
    ClipboardCheck,
    Eye,
} from "lucide-react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

import { fetchAdminOverview } from "../../features/admin/adminOverviewSlice";
import { formatDate } from "../../utils/date";
import {
    Skeleton,
    SkeletonLine,
    SkeletonStatCards,
} from "../../components/common/Skeleton";
import { StatCard, AlertBanner } from "../../components/common";

const statCards = [
    {
        key: "totalStudents",
        label: "Students",
        icon: Users,
        color: "bg-blue-50 text-blue-600",
        to: "/admin/students",
    },
    {
        key: "totalCourses",
        label: "Total Courses",
        icon: BookOpen,
        color: "bg-accent-muted text-accent",
        to: "/admin/courses",
    },
    {
        key: "publishedCourses",
        label: "Published Courses",
        icon: Eye,
        color: "bg-emerald-50 text-emerald-600",
        to: "/admin/courses",
    },
    {
        key: "totalProjects",
        label: "Projects",
        icon: FolderGit2,
        color: "bg-amber-50 text-amber-600",
        to: "/admin/projects",
    },
    {
        key: "pendingSubmissions",
        label: "Pending Reviews",
        icon: ClipboardCheck,
        color: "bg-rose-50 text-rose-600",
        to: "/admin/submissions",
    },
];

const statusBadge = {
    pending: "bg-muted text-muted-foreground",
    under_review: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    changes_required: "bg-orange-100 text-orange-700",
};

const CHART_COLORS = ["#B8860B", "#06b6d4", "#D4A84B", "#f59e0b"];

const AdminDashboard = () => {
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { stats, recentStudents, recentSubmissions, loading, error } =
        useSelector((state) => state.adminOverview);

    useEffect(() => {
        dispatch(fetchAdminOverview());
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
                        <section key={n} className="card p-6">
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
        <div className="space-y-8">
            {/* Welcome banner */}
            <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-[#3D2B1F] p-8 text-white shadow-card">
                <h1 className="page-title text-white">
                    Welcome back, {(user?.name || "Admin").split(" ")[0]}!
                </h1>

                <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    An overview of your platform — students, courses and reviews.
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((card) => (
                    <StatCard
                        key={card.key}
                        to={card.to}
                        icon={card.icon}
                        label={card.label}
                        value={stats?.[card.key] ?? 0}
                        colorClass={card.color}
                    />
                ))}
            </div>

            {/* Overview Chart */}
            {stats && (
                <div className="card p-6">
                    <h2 className="mb-4 font-semibold" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: "var(--foreground)" }}>
                        Platform Overview
                    </h2>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={[
                    {
                        name: "Students",
                        value: stats.totalStudents || 0,
                    },
                    {
                        name: "Courses",
                        value: stats.totalCourses || 0,
                    },
                    {
                        name: "Projects",
                        value: stats.totalProjects || 0,
                    },
                ]}
                                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#E8E4DF"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 13, fill: "#6B6B6B" }}
                                    tickLine={false}
                                    axisLine={{ stroke: "#E8E4DF" }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: "#9B9B9B" }}
                                    tickLine={false}
                                    axisLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: "12px",
                                        border: "1px solid #E8E4DF",
                                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                                        fontSize: "13px",
                                    }}
                                    cursor={{ fill: "rgba(184,134,11,0.05)" }}
                                />
                                <Bar
                                    dataKey="value"
                                    radius={[8, 8, 0, 0]}
                                    barSize={56}
                                >
                                    {[
                                        "Students",
                                        "Courses",
                                        "Projects",
                                    ].map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={CHART_COLORS[index]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Recent students */}
                <section className="card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-semibold" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: "var(--foreground)" }}>
                            Recent Students
                        </h2>

                        <Link
                            to="/admin/students"
                            className="btn-ghost text-sm font-medium"
                        >
                            View all
                        </Link>
                    </div>

                    {recentStudents.length === 0 ? (
                        <p className="py-6 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                            No students registered yet.
                        </p>
                    ) : (
                        <ul className="divide-y divide-warm-border">
                            {recentStudents.map((student) => (
                                <li
                                    key={student.id}
                                    className="flex items-center gap-3 py-3"
                                >
                                    <span
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-muted text-sm font-semibold"
                                        style={{ color: "var(--accent)" }}
                                    >
                                        {(
                                            student.user?.name || "?"
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium" style={{ color: "var(--foreground)" }}>
                                            {student.user?.name || "-"}
                                        </p>

                                        <p className="truncate text-xs" style={{ color: "var(--muted-foreground)" }}>
                                            {student.user?.email || "-"}
                                        </p>
                                    </div>

                                    <span className="shrink-0 text-xs" style={{ color: "var(--muted-foreground)" }}>
                                        {formatDate(student.created_at)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Recent submissions */}
                <section className="card p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-semibold" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: "var(--foreground)" }}>
                            Recent Submissions
                        </h2>

                        <Link
                            to="/admin/submissions"
                            className="btn-ghost text-sm font-medium"
                        >
                            View all
                        </Link>
                    </div>

                    {recentSubmissions.length === 0 ? (
                        <p className="py-6 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                            No submissions received yet.
                        </p>
                    ) : (
                        <ul className="divide-y divide-warm-border">
                            {recentSubmissions.map((submission) => (
                                <li
                                    key={submission.id}
                                    className="flex items-center gap-3 py-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium" style={{ color: "var(--foreground)" }}>
                                            {submission.project?.title || "-"}
                                        </p>

                                        <p className="truncate text-xs" style={{ color: "var(--muted-foreground)" }}>
                                            {submission.student?.user?.name ||
                                                "-"}
                                        </p>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                                            statusBadge[
                                                submission.status
                                            ] || "bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {submission.status.replace("_", " ")}
                                    </span>
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
