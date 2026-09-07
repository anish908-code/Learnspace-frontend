import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { BookOpen, Trophy, Bell, ArrowRight } from "lucide-react";

import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell,
} from "recharts";

import { fetchStudentDashboard } from "../../features/student/studentSlice";
import Avatar from "../../components/common/Avatar";
import { SkeletonLine, SkeletonStatCards, SkeletonCardGrid } from "../../components/common/Skeleton";
import { AlertBanner, EmptyState } from "../../components/common";

const statsConfig = [
    { key: "enrolled", label: "Enrolled Courses", icon: BookOpen },
    { key: "completed", label: "Completed", icon: Trophy },
    { key: "unread", label: "Unread Alerts", icon: Bell },
];

const CHART_COLORS = ["#B8860B", "#D4A84B", "#8B7355", "#A0522D"];

const StudentDashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.studentProfile);
    const { enrollments, notifications, loading, error } = useSelector((state) => state.student);

    useEffect(() => {
        dispatch(fetchStudentDashboard());
    }, [dispatch]);

    if (loading && enrollments.length === 0 && !profile) {
        return (
            <div>
                <SkeletonStatCards count={3} />
                <section className="mt-12">
                    <SkeletonLine className="mb-4 h-5 w-32" />
                    <SkeletonCardGrid count={3} />
                </section>
            </div>
        );
    }

    if (error) {
        return <AlertBanner type="error" message={error} />;
    }

    const completedCourses = enrollments.filter((e) => e.completed).length;
    const unreadNotifications = notifications.filter((n) => !n.is_read).length;
    const stats = { enrolled: enrollments.length, completed: completedCourses, unread: unreadNotifications };

    const chartData = enrollments.slice(0, 6).map((enrollment) => ({
        name: (enrollment.course?.title || "Course").slice(0, 12),
        progress: Number(enrollment.progress || 0),
    }));

    return (
        <div>
            {/* Welcome banner */}
            <section className="overflow-hidden rounded-lg px-6 py-8 sm:px-8" style={{ background: "var(--foreground)" }}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar name={user?.name} src={profile?.profile_image} className="h-14 w-14 border-2 border-white/20 text-base" />
                        <div>
                            <h1
                                className="text-xl sm:text-2xl"
                                style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--background)", fontWeight: 600 }}
                            >
                                Welcome back, {(user?.name || "Student").split(" ")[0]}
                            </h1>
                            <p className="mt-1 text-sm" style={{ color: "#A0A0A0" }}>
                                Continue your learning journey.
                            </p>
                        </div>
                    </div>
                    <Link to="/student/courses" className="inline-flex items-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-semibold transition" style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}>
                        Browse Courses <ArrowRight size={15} />
                    </Link>
                </div>
            </section>

            {/* Stats */}
            <section className="mt-8 grid gap-8 sm:grid-cols-3">
                {statsConfig.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.key} className="card flex items-center gap-4 p-5">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                                <Icon size={22} />
                            </span>
                            <div>
                                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>{stat.label}</p>
                                <h2 className="mt-0.5 text-2xl font-bold" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)" }}>
                                    {stats[stat.key]}
                                </h2>
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* My Courses */}
            <section className="mt-12">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-lg" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: "var(--foreground)" }}>
                        My Courses
                    </h2>
                    <Link to="/student/courses" className="text-sm font-medium transition hover:underline" style={{ color: "var(--accent)" }}>
                        View all
                    </Link>
                </div>

                {enrollments.length === 0 ? (
                    <EmptyState
                        icon={BookOpen}
                        title="No courses yet"
                        message="You haven't enrolled in any course yet."
                        action={<Link to="/student/courses" className="btn-primary">Browse Courses</Link>}
                    />
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {enrollments.map((enrollment) => (
                            <Link
                                key={enrollment.id}
                                to={`/student/courses/${enrollment.course_id}`}
                                className="card-hover block p-5"
                            >
                                <span className="section-label text-[10px]">{enrollment.course?.category || "General"}</span>
                                <h3 className="mt-3 line-clamp-1 text-base font-semibold" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)" }}>
                                    {enrollment.course?.title}
                                </h3>
                                <div className="mt-5">
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span style={{ color: "var(--muted-foreground)" }}>Progress</span>
                                        <span className="font-semibold" style={{ color: "var(--foreground)" }}>{Number(enrollment.progress || 0)}%</span>
                                    </div>
                                    <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "var(--muted)" }}>
                                        <div className="h-full rounded-full transition-all" style={{ background: "var(--accent)", width: `${Number(enrollment.progress || 0)}%` }} />
                                    </div>
                                </div>
                                <div className="mt-4 text-sm" style={{ color: "var(--muted-foreground)" }}>
                                    Lessons completed: <span className="font-medium" style={{ color: "var(--foreground)" }}>{enrollment.lessons_completed}</span>
                                </div>
                                {enrollment.completed && (
                                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                                        <Trophy size={13} /> Course Completed
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            {/* Progress Chart */}
            {chartData.length > 0 && (
                <section className="card mt-12 p-6">
                    <h2 className="mb-4" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)" }}>
                        Course Progress
                    </h2>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 13, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
                                <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", fontSize: "13px" }}
                                    cursor={{ fill: "rgba(184,134,11,0.05)" }}
                                    formatter={(value) => [`${value}%`, "Progress"]}
                                />
                                <Bar dataKey="progress" radius={[4, 4, 0, 0]} barSize={48}>
                                    {chartData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>
            )}
        </div>
    );
};

export default StudentDashboard;
