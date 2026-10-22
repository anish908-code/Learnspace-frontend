import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Lock } from "lucide-react";

import { fetchCourseDetail, clearCurrentCourse, clearCourseError } from "../../features/student/courseSlice";
import { fetchEnrollments, startCourse, clearEnrollmentError } from "../../features/student/enrollmentSlice";
import { fetchCourseLessons, clearLessonError } from "../../features/student/lessonSlice";
import { SkeletonLine } from "../../components/common/Skeleton";
import { PageHeader, AlertBanner } from "../../components/common";
import Button, { ButtonLink } from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { ProgressBar } from "../../components/ui/Progress";
import { SectionMarker, CornerBrackets } from "../../components/ui/Deco";

const CourseDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseId } = useParams();

    const { currentCourse: course, loading, error } = useSelector((state) => state.studentCourses);
    const { enrollments, enrolling, error: enrollmentError } = useSelector((state) => state.studentEnrollments);

    useEffect(() => {
        dispatch(fetchCourseDetail(courseId));
        dispatch(fetchEnrollments());
        return () => { dispatch(clearCurrentCourse()); dispatch(clearCourseError()); dispatch(clearEnrollmentError()); dispatch(clearLessonError()); };
    }, [dispatch, courseId]);

    const enrollment = enrollments.find((item) => item.course_id === Number(courseId));

    useEffect(() => {
        if (enrollment) dispatch(fetchCourseLessons(courseId));
    }, [dispatch, courseId, enrollment]);

    if (loading && !course) {
        return (
            <div>
                <SkeletonLine className="mb-4 h-3 w-28" />
                <div className="card p-6">
                    <SkeletonLine className="h-5 w-20" />
                    <SkeletonLine className="mt-4 h-6 w-2/3" />
                    <div className="mt-3 space-y-2"><SkeletonLine className="w-full" /><SkeletonLine className="w-3/4" /></div>
                    <div className="mt-5 flex flex-wrap gap-4"><SkeletonLine className="h-3 w-24" /><SkeletonLine className="h-3 w-24" /><SkeletonLine className="h-3 w-24" /></div>
                </div>
                <div className="mt-8 card p-6"><SkeletonLine className="h-4 w-20" /><div className="mt-4 space-y-4">{[1,2,3,4].map((n) => (<div key={n} className="flex items-center justify-between px-1"><SkeletonLine className="h-3.5 w-1/2" /><SkeletonLine className="h-3 w-16" /></div>))}</div></div>
            </div>
        );
    }

    if (error) return <AlertBanner type="error" message={error} />;
    if (!course) return null;

    const quiz = course.quizzes?.[0];
    const projectCount = course.projects?.length || 0;
    const totalLessons = course.lessons?.length || 0;
    const allLessonsDone = enrollment && enrollment.lessons_completed >= totalLessons;

    return (
        <div>
            <Button
                type="button"
                onClick={() => navigate("/student/courses")}
                variant="link"
                className="mb-5"
            >
                &larr; Back to Courses
            </Button>

            <PageHeader
                eyebrow={course.category || "General"}
                title={course.title}
                subtitle={course.description || "No description."}
                action={
                    !enrollment ? (
                        <Button
                            type="button"
                            onClick={() => dispatch(startCourse(course.id))}
                            loading={enrolling}
                            size="lg"
                        >
                            Enroll Now
                        </Button>
                    ) : (
                        <Badge tone="accent" dot className="px-4 py-2 sm:w-48 sm:justify-center">
                            Enrolled
                        </Badge>
                    )
                }
            />

            {/* Course meta readout */}
            <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
                {[
                    { k: "Difficulty", v: course.difficulty || "-" },
                    { k: "Duration", v: course.duration || "-" },
                    { k: "Lessons", v: totalLessons },
                ].map((cell) => (
                    <div key={cell.k} className="bg-surface/80 px-4 py-4">
                        <dt className="technical-label">{cell.k}</dt>
                        <dd className="mt-1.5 font-display text-sm font-bold text-fg">
                            {cell.v}
                        </dd>
                    </div>
                ))}
            </dl>

            {enrollmentError && (
                <div className="mt-5">
                    <AlertBanner type="error" message={enrollmentError} />
                </div>
            )}

            {enrollment && (
                <div className="card mt-5 p-5 sm:p-6">
                    <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                        <span className="technical-label">Your progress</span>
                        <span className="numeric text-sm font-semibold text-fg">
                            {Number(enrollment.progress || 0)}%
                            {enrollment.completed && " - Completed"}
                        </span>
                    </div>

                    <ProgressBar value={Number(enrollment.progress || 0)} />
                </div>
            )}

            {/* Lessons */}
            <section className="mt-12">
                <SectionMarker index={1}>Lessons</SectionMarker>

                <div className="card mt-5 p-6 sm:p-7">
                    {!enrollment ? (
                        <p className="text-sm text-muted">
                            Enroll in this course first to access the lessons.
                        </p>
                    ) : course.lessons?.length === 0 ? (
                        <p className="text-sm text-muted">No lessons published yet.</p>
                    ) : (
                        <ul className="space-y-2.5">
                            {(course.lessons || []).map((lesson, index) => (
                                <li key={lesson.id}>
                                    <Link
                                        to={`/student/courses/${course.id}/lessons/${lesson.id}`}
                                        className="data-row justify-between gap-3"
                                    >
                                        <span className="flex min-w-0 items-center gap-3">
                                            <span className="numeric flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-2 text-xs font-semibold text-subtle">
                                                {index + 1}
                                            </span>
                                            <span className="min-w-0 truncate text-sm font-medium text-fg">
                                                {lesson.title}
                                            </span>
                                        </span>

                                        <span className="technical-label shrink-0 text-accent">
                                            Open &rarr;
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            {/* Final Quiz */}
            {quiz && (
                <section className="mt-12">
                    <SectionMarker index={2}>Final Quiz</SectionMarker>

                    <div className="card relative mt-5 overflow-hidden p-6 sm:p-7">
                        <CornerBrackets />

                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                                <h3 className="font-display text-lg font-bold text-fg">
                                    {quiz.title}
                                </h3>

                                <p className="mt-2 text-sm text-muted">
                                    Passing percentage: {Number(quiz.passing_percentage)}%
                                    {!allLessonsDone && " (complete all lessons first)"}
                                    {enrollment?.final_quiz_passed && (
                                        <span className="ml-2 font-semibold text-teal">
                                            &bull; Already Passed
                                        </span>
                                    )}
                                </p>
                            </div>

                            <div className="shrink-0">
                                {enrollment?.final_quiz_passed ? (
                                    <Badge tone="teal" dot className="px-4 py-2">
                                        Passed
                                    </Badge>
                                ) : allLessonsDone ? (
                                    <ButtonLink to={`/student/quizzes/${quiz.id}`} size="lg">
                                        Start Quiz
                                    </ButtonLink>
                                ) : (
                                    <Badge className="gap-1.5 px-4 py-2">
                                        <Lock size={12} aria-hidden="true" />
                                        Locked
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Projects */}
            <section className="mt-12">
                <SectionMarker index={3}>Projects</SectionMarker>

                <div className="card mt-5 p-6 sm:p-7">
                    <p className="text-sm text-muted">
                        {projectCount > 0
                            ? `${projectCount} project(s) available. Projects unlock when you complete the course and pass the quiz.`
                            : "No projects for this course."}
                    </p>
                </div>
            </section>
        </div>
    );
};

export default CourseDetail;
