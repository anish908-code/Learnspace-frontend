import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { BookOpen, Clock, Gauge, ArrowRight } from "lucide-react";

import { fetchCourses, clearCourseError } from "../../features/student/courseSlice";
import { fetchEnrollments, startCourse, clearEnrollmentError } from "../../features/student/enrollmentSlice";
import { SkeletonCardGrid, SkeletonLine } from "../../components/common/Skeleton";
import { PageHeader, AlertBanner, EmptyState } from "../../components/common";
import Button, { ButtonLink } from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

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
                <SkeletonLine className="mb-8 h-8 w-64" />

                <SkeletonCardGrid count={6} />
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                eyebrow="course catalogue"
                title="Browse Courses"
                subtitle={`Total ${courses.length} published courses available.`}
            />

            {(error || enrollmentError) && (
                <AlertBanner type="error" message={error || enrollmentError} />
            )}

            {courses.length === 0 ? (
                <EmptyState icon={BookOpen} title="No courses available yet." />
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => {
                        const isEnrolled = enrolledCourseIds.has(course.id);
                        return (
                            <article
                                key={course.id}
                                className="card-hover spotlight flex h-full flex-col p-5 sm:p-6"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span className="technical-label line-clamp-1 min-w-0 flex-1">
                                        {course.category || "General"}
                                    </span>

                                    {course.difficulty && (
                                        <Badge tone="accent" className="shrink-0 capitalize">
                                            {course.difficulty}
                                        </Badge>
                                    )}
                                </div>

                                <h2 className="mt-4 line-clamp-2 font-display text-base font-bold text-fg">
                                    {course.title}
                                </h2>

                                <p className="mt-2.5 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
                                    {course.description || "No description."}
                                </p>

                                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-xs text-muted">
                                    <span className="inline-flex items-center gap-1.5">
                                        <Clock size={14} className="text-subtle" />
                                        {course.duration || "-"}
                                    </span>

                                    <span className="inline-flex items-center gap-1.5">
                                        <Gauge size={14} className="text-subtle" />
                                        {course.difficulty || "-"}
                                    </span>
                                </div>

                                <div className="mt-5">
                                    {isEnrolled ? (
                                        <ButtonLink
                                            to={`/student/courses/${course.id}`}
                                            fullWidth
                                        >
                                            Go to Course
                                            <ArrowRight size={15} />
                                        </ButtonLink>
                                    ) : (
                                        <Button
                                            type="button"
                                            onClick={() => dispatch(startCourse(course.id))}
                                            variant="secondary"
                                            loading={enrolling}
                                            fullWidth
                                        >
                                            Enroll Now
                                        </Button>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Courses;
