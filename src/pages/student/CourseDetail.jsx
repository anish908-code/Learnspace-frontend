import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { fetchCourseDetail, clearCurrentCourse, clearCourseError } from "../../features/student/courseSlice";
import { fetchEnrollments, startCourse, clearEnrollmentError } from "../../features/student/enrollmentSlice";
import { fetchCourseLessons, clearLessonError } from "../../features/student/lessonSlice";
import { SkeletonLine } from "../../components/common/Skeleton";

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

    if (error) return <div className="rounded-md px-4 py-3 text-sm" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{error}</div>;
    if (!course) return null;

    const quiz = course.quizzes?.[0];
    const projectCount = course.projects?.length || 0;
    const totalLessons = course.lessons?.length || 0;
    const allLessonsDone = enrollment && enrollment.lessons_completed >= totalLessons;

    return (
        <div>
            <button type="button" onClick={() => navigate("/student/courses")} className="mb-4 text-sm font-medium transition hover:underline" style={{ color: "var(--muted-foreground)" }}>
                &larr; Back to Courses
            </button>

            <div className="card p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                        <span className="section-label text-[10px]">{course.category || "General"}</span>
                        <h1 className="mt-3 text-xl sm:text-2xl" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: "var(--foreground)" }}>
                            {course.title}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm" style={{ color: "var(--muted-foreground)" }}>
                            {course.description || "No description."}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
                            <span>Difficulty: {course.difficulty || "-"}</span>
                            <span>Duration: {course.duration || "-"}</span>
                            <span>Lessons: {totalLessons}</span>
                        </div>
                    </div>
                    <div className="w-full shrink-0 sm:w-48">
                        {!enrollment ? (
                            <button type="button" disabled={enrolling} onClick={() => dispatch(startCourse(course.id))} className="btn-primary w-full">
                                {enrolling ? "Enrolling..." : "Enroll Now"}
                            </button>
                        ) : (
                            <div className="rounded-md px-4 py-2 text-center text-sm font-medium" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
                                Enrolled
                            </div>
                        )}
                    </div>
                </div>

                {enrollment && (
                    <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--border)" }}>
                        <div className="mb-2 flex justify-between text-sm">
                            <span style={{ color: "var(--muted-foreground)" }}>Your progress</span>
                            <span className="font-medium">{Number(enrollment.progress || 0)}%{enrollment.completed && " - Completed"}</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "var(--muted)" }}>
                            <div className="h-full rounded-full transition-all" style={{ background: "var(--accent)", width: `${Number(enrollment.progress || 0)}%` }} />
                        </div>
                    </div>
                )}
            </div>

            {enrollmentError && <div className="mt-5 rounded-md px-4 py-3 text-sm" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{enrollmentError}</div>}

            <div className="mt-8 card p-6">
                <h2 style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)" }}>Lessons</h2>
                {!enrollment ? (
                    <p className="mt-3 text-sm" style={{ color: "var(--muted-foreground)" }}>Enroll in this course first to access the lessons.</p>
                ) : course.lessons?.length === 0 ? (
                    <p className="mt-3 text-sm" style={{ color: "var(--muted-foreground)" }}>No lessons published yet.</p>
                ) : (
                    <ul className="mt-4 divide-y" style={{ borderColor: "var(--border)" }}>
                        {(course.lessons || []).map((lesson, index) => (
                            <li key={lesson.id}>
                                <Link to={`/student/courses/${course.id}/lessons/${lesson.id}`} className="flex items-center justify-between gap-2 px-1 py-3 transition hover:bg-muted rounded-md" style={{ color: "var(--foreground)" }}>
                                    <span className="min-w-0 truncate text-sm font-medium">{index + 1}. {lesson.title}</span>
                                    <span className="shrink-0 text-sm" style={{ color: "var(--muted-foreground)" }}>Open &rarr;</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {quiz && (
                <div className="mt-6 card p-6">
                    <h2 style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)" }}>Final Quiz</h2>
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)" }}>{quiz.title}</h3>
                            <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                                Passing percentage: {Number(quiz.passing_percentage)}%{!allLessonsDone && " (complete all lessons first)"}
                                {enrollment?.final_quiz_passed && (
                                    <span className="ml-2 font-medium" style={{ color: "var(--success)" }}>• Already Passed</span>
                                )}
                            </p>
                        </div>
                        {enrollment?.final_quiz_passed ? (
                            <span className="rounded-md px-4 py-2 text-sm font-medium" style={{ background: "var(--success-bg)", color: "var(--success)" }}>Passed</span>
                        ) : allLessonsDone ? (
                            <Link to={`/student/quizzes/${quiz.id}`} className="btn-primary">Start Quiz</Link>
                        ) : (
                            <span className="rounded-md px-4 py-2 text-sm" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>Locked</span>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-6 card p-6">
                <h2 style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)" }}>Projects</h2>
                <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {projectCount > 0 ? `${projectCount} project(s) available. Projects unlock when you complete the course and pass the quiz.` : "No projects for this course."}
                </p>
            </div>
        </div>
    );
};

export default CourseDetail;
