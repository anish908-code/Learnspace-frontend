import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { BookOpen, Clock, Gauge, ArrowRight } from "lucide-react";

import { fetchCourses, clearCourseError } from "../../features/student/courseSlice";
import { fetchEnrollments, startCourse, clearEnrollmentError } from "../../features/student/enrollmentSlice";
import { SkeletonCardGrid } from "../../components/common/Skeleton";

const Courses = () => {
    const dispatch = useDispatch();
    const { courses, loading, error } = useSelector((state) => state.studentCourses);
    const { enrollments, enrolling, error: enrollmentError } = useSelector((state) => state.studentEnrollments);

    useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchEnrollments());
        return () => { dispatch(clearCourseError()); dispatch(clearEnrollmentError()); };
    }, [dispatch]);

    const enrolledCourseIds = new Set(enrollments.map((e) => e.course_id));

    if (loading) {
        return (
            <div>
                <div className="mb-6">
                    <h1 className="page-title">Browse Courses</h1>
                </div>
                <SkeletonCardGrid count={6} />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="page-title">Browse Courses</h1>
                <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    Total {courses.length} published courses available.
                </p>
            </div>

            {(error || enrollmentError) && (
                <div className="mb-5 rounded-md px-4 py-3 text-sm" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
                    {error || enrollmentError}
                </div>
            )}

            {courses.length === 0 ? (
                <div className="card p-10 text-center">
                    <BookOpen size={32} className="mx-auto" style={{ color: "var(--border)" }} />
                    <p className="mt-3" style={{ color: "var(--muted-foreground)" }}>No courses available yet.</p>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => {
                        const isEnrolled = enrolledCourseIds.has(course.id);
                        return (
                            <div key={course.id} className="card-hover flex flex-col p-5">
                                <div className="flex items-start justify-between gap-2">
                                    <span className="section-label text-[10px]">{course.category || "General"}</span>
                                    {course.difficulty && (
                                        <span className="rounded-md px-2 py-0.5 text-xs font-medium capitalize" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                                            {course.difficulty}
                                        </span>
                                    )}
                                </div>
                                <h2 className="mt-3 line-clamp-2 text-base font-semibold" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)" }}>
                                    {course.title}
                                </h2>
                                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                                    {course.description || "No description."}
                                </p>
                                <div className="mt-4 flex items-center gap-4 border-t pt-4 text-xs" style={{ borderColor: "var(--border)", color: "var(--muted-foreground)" }}>
                                    <span className="inline-flex items-center gap-1.5"><Clock size={14} />{course.duration || "-"}</span>
                                    <span className="inline-flex items-center gap-1.5"><Gauge size={14} />{course.difficulty || "-"}</span>
                                </div>
                                <div className="mt-5">
                                    {isEnrolled ? (
                                        <Link to={`/student/courses/${course.id}`} className="btn-primary w-full">
                                            Go to Course <ArrowRight size={15} />
                                        </Link>
                                    ) : (
                                        <button type="button" disabled={enrolling} onClick={() => dispatch(startCourse(course.id))} className="btn-secondary w-full">
                                            {enrolling ? "Enrolling..." : "Enroll Now"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Courses;
