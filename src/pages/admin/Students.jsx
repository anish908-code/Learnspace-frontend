import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    BookOpen,
    Layers,
    Users,
    Award,
    CheckCircle2,
    CircleDashed,
    Search,
    ChevronDown,
} from "lucide-react";

import { fetchAdminStudents } from "../../features/admin/adminStudentSlice";
import { formatDate } from "../../utils/date";
import { SkeletonTableRows } from "../../components/common/Skeleton";
import { PageHeader, AlertBanner, EmptyState } from "../../components/common";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Field, Input } from "../../components/ui/Field";
import { ProgressBar } from "../../components/ui/Progress";

/* Overall student stage — backend ke `progress.stage.key` se match karta hai */
const STAGE_TONES = {
    not_enrolled: "neutral",
    enrolled: "neutral",
    learning: "gold",
    quiz_passed: "accent",
    project_review: "gold",
    project_approved: "teal",
    certified: "teal",
};

/* Per-course stage — backend ke `courses[].stage` se match karta hai */
const COURSE_STAGE_STYLES = {
    not_started: { label: "Not Started", tone: "neutral" },
    learning: { label: "Learning", tone: "gold" },
    quiz_pending: { label: "Quiz Pending", tone: "accent" },
    project_pending: { label: "Project Due", tone: "gold" },
    project_review: { label: "In Review", tone: "gold" },
    awaiting_certificate: { label: "Cert Pending", tone: "teal" },
    done: { label: "Completed", tone: "teal" },
};

/*
 * Course ki detail row — sirf tab dikhti hai jab student expand ho.
 * Stage + progress + "aage kya baki hai", yehi admin ke liye actionable part hai.
 */
const CourseRow = ({ course }) => {
    const style = COURSE_STAGE_STYLES[course.stage] || COURSE_STAGE_STYLES.not_started;
    const isDone = course.stage === "done";

    return (
        <div className="grid gap-x-4 gap-y-1 border-t border-line py-2.5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={style.tone}>{style.label}</Badge>

                    <span
                        className="min-w-0 truncate text-sm font-semibold text-fg"
                        title={course.course_title}
                    >
                        {course.course_title}
                    </span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                    {isDone ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-teal">
                            <CheckCircle2 size={12} className="shrink-0" />
                            All done — certificate issued
                        </span>
                    ) : (
                        course.remaining.map((item) => (
                            <span
                                key={item}
                                className="flex items-center gap-1 text-xs text-muted"
                            >
                                <CircleDashed size={11} className="shrink-0" />
                                {item}
                            </span>
                        ))
                    )}
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 sm:w-40 sm:justify-end">
                {course.total_lessons > 0 && (
                    <span className="numeric whitespace-nowrap text-xs text-muted">
                        {course.lessons_completed}/{course.total_lessons}
                    </span>
                )}

                <ProgressBar
                    value={Math.min(course.progress, 100)}
                    tone={isDone ? "teal" : "accent"}
                    showTicks={false}
                    className="w-14"
                />

                <span className="numeric w-10 shrink-0 text-right text-xs font-semibold text-fg">
                    {course.progress}%
                </span>
            </div>
        </div>
    );
};

const Students = () => {
    const dispatch = useDispatch();

    const { students, loading, error } = useSelector(
        (state) => state.adminStudents
    );

    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState(() => new Set());

    useEffect(() => {
        dispatch(fetchAdminStudents());
    }, [dispatch]);

    const toggleStudent = (id) => {
        setExpanded((prev) => {
            const next = new Set(prev);

            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }

            return next;
        });
    };

    // Sirf naam/email/college search
    const visibleStudents = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return students;

        return students.filter((student) =>
            (
                (student.user?.name || "") +
                " " +
                (student.user?.email || "") +
                " " +
                (student.college || "")
            )
                .toLowerCase()
                .includes(term)
        );
    }, [students, search]);

    if (loading) {
        return (
            <div>
                <PageHeader eyebrow="cohort register" title="Students" />
                <SkeletonTableRows count={5} />
            </div>
        );
    }

    if (error) {
        return (
            <>
                <PageHeader eyebrow="cohort register" title="Students" />
                <AlertBanner type="error" message={error} />
            </>
        );
    }

    return (
        <div>
            <PageHeader
                eyebrow="cohort register"
                title="Students"
                subtitle="Click any student to see course-wise progress and what is still pending."
            />

            {/* Search */}
            <div className="mb-5 max-w-md">
                <Field label="Search">
                    <div className="relative">
                        <Search
                            size={16}
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle"
                        />

                        <Input
                            type="search"
                            aria-label="Search students"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email or college..."
                            className="py-2 pl-10 text-sm"
                        />
                    </div>
                </Field>
            </div>

            {visibleStudents.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title={
                        students.length === 0
                            ? "No students registered yet."
                            : "No students match this filter."
                    }
                    action={
                        search ? (
                            <Button
                                variant="secondary"
                                type="button"
                                onClick={() => setSearch("")}
                            >
                                Clear search
                            </Button>
                        ) : null
                    }
                />
            ) : (
                <div className="card overflow-hidden p-0">
                    {/* Column captions — desktop only */}
                    <div className="hidden items-center gap-4 border-b border-line px-4 py-3 sm:grid sm:grid-cols-[auto_1fr_auto]">
                        <span aria-hidden="true" className="w-[15px] shrink-0" />

                        <span className="technical-label">Student</span>

                        <span className="flex items-center gap-3 lg:gap-5">
                            <span className="technical-label">Stage</span>
                            <span className="technical-label hidden md:block">
                                Activity
                            </span>
                            <span className="technical-label">Avg Progress</span>
                        </span>
                    </div>

                    <div className="stagger">
                        {visibleStudents.map((student, index) => {
                            const progress = student.progress || {};
                            const courses = progress.courses || [];
                            const avgProgress = progress.avg_progress ?? 0;
                            const stageKey = progress.stage?.key || "not_enrolled";
                            const stageTone = STAGE_TONES[stageKey] || STAGE_TONES.not_enrolled;
                            const isOpen = expanded.has(student.id);

                            const totalLessons = courses.reduce(
                                (sum, course) => sum + course.total_lessons,
                                0
                            );
                            const doneLessons = courses.reduce(
                                (sum, course) => sum + course.lessons_completed,
                                0
                            );

                            return (
                                <div
                                    key={student.id}
                                    className={
                                        index > 0 ? "border-t border-line" : undefined
                                    }
                                >
                                    {/* Compact one-line row */}
                                    <button
                                        type="button"
                                        onClick={() => toggleStudent(student.id)}
                                        aria-expanded={isOpen}
                                        className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-surface-2/70 sm:gap-4"
                                    >
                                        <ChevronDown
                                            size={15}
                                            className="shrink-0 text-subtle transition-transform duration-200"
                                            style={{
                                                transform: isOpen
                                                    ? "rotate(0deg)"
                                                    : "rotate(-90deg)",
                                            }}
                                        />

                                        {/* Identity */}
                                        <div className="flex min-w-0 items-center gap-3">
                                            {student.user?.profile_image ? (
                                                <img
                                                    src={student.user.profile_image}
                                                    alt=""
                                                    className="hidden h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-inset ring-line-strong sm:block"
                                                />
                                            ) : (
                                                <span className="icon-well icon-well-round hidden h-8 w-8 text-xs font-bold text-accent sm:inline-flex">
                                                    {(student.user?.name || "?")
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </span>
                                            )}

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-fg">
                                                    {student.user?.name || "-"}
                                                </p>
                                                <p className="truncate text-xs text-muted">
                                                    {student.user?.email || "-"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right: stage + progress + numbers */}
                                        <div className="flex shrink-0 items-center gap-3 lg:gap-5">
                                            <Badge
                                                tone={stageTone}
                                                className="hidden sm:inline-flex"
                                            >
                                                {progress.stage?.label || "Not Enrolled"}
                                            </Badge>

                                            <span className="hidden items-center gap-1 whitespace-nowrap text-xs text-muted md:flex">
                                                <BookOpen size={12} />
                                                <span className="numeric">
                                                    {progress.enrolled || 0}
                                                </span>
                                                <Layers size={12} className="ml-1" />
                                                <span className="numeric">
                                                    {doneLessons}/{totalLessons}
                                                </span>
                                            </span>

                                            <div className="flex items-center gap-1.5">
                                                <ProgressBar
                                                    value={Math.min(avgProgress, 100)}
                                                    tone={avgProgress >= 100 ? "teal" : "accent"}
                                                    showTicks={false}
                                                    className="hidden w-16 sm:block lg:w-24"
                                                />

                                                <span className="numeric w-9 text-right text-xs font-semibold text-fg">
                                                    {avgProgress}%
                                                </span>
                                            </div>

                                            {progress.certificates > 0 && (
                                                <span
                                                    className="flex items-center gap-0.5 whitespace-nowrap text-xs font-semibold text-teal"
                                                    title={`${progress.certificates} certificate(s)`}
                                                >
                                                    <Award size={13} />
                                                    {progress.certificates}
                                                </span>
                                            )}
                                        </div>
                                    </button>

                                    {/* Expanded detail */}
                                    {isOpen && (
                                        <div className="bg-bg-2/50 px-4 pb-4">
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-3 text-xs text-muted">
                                                <span>
                                                    Joined{" "}
                                                    <span className="numeric">
                                                        {formatDate(student.created_at)}
                                                    </span>
                                                </span>
                                                {student.college && <span>{student.college}</span>}
                                                {student.course && (
                                                    <span>
                                                        {student.course}
                                                        {student.semester
                                                            ? ` · Sem ${student.semester}`
                                                            : ""}
                                                    </span>
                                                )}
                                                {progress.pending_submissions > 0 && (
                                                    <span className="font-semibold text-gold">
                                                        {progress.pending_submissions} project(s) awaiting review
                                                    </span>
                                                )}
                                            </div>

                                            {courses.length === 0 ? (
                                                <p className="flex items-center gap-1.5 py-2.5 text-sm text-muted">
                                                    <CircleDashed size={14} className="shrink-0" />
                                                    Not enrolled in any course yet
                                                </p>
                                            ) : (
                                                <div className="mt-2">
                                                    {courses.map((course) => (
                                                        <CourseRow
                                                            key={course.course_id}
                                                            course={course}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Students;
