import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import { fetchCourseLessons, fetchLesson, completeLesson, clearCurrentLesson, clearLessonError } from "../../features/student/lessonSlice";
import { refreshEnrollmentProgress, fetchEnrollments } from "../../features/student/enrollmentSlice";
import { fetchCourseDetail } from "../../features/student/courseSlice";
import { Skeleton, SkeletonLine } from "../../components/common/Skeleton";
import ReactMarkdown from "react-markdown";

const foreColor = "var(--foreground)";
const mutedColor = "var(--muted-foreground)";
const accentColor = "var(--accent)";
const borderColor = "var(--border)";

const headingStyle = (level) => ({
    fontFamily: '"Playfair Display", Georgia, serif',
    fontWeight: 600,
    color: foreColor,
    lineHeight: 1.3,
    margin: level === 1 ? "1.25rem 0 0.5rem" : "1rem 0 0.5rem",
    fontSize: ["1.5rem", "1.3rem", "1.15rem", "1.05rem", "1rem", "0.95rem"][level - 1] || "1rem",
});

const mdComponents = {
    h1: ({ children }) => <h1 style={headingStyle(1)}>{children}</h1>,
    h2: ({ children }) => <h2 style={headingStyle(2)}>{children}</h2>,
    h3: ({ children }) => <h3 style={headingStyle(3)}>{children}</h3>,
    h4: ({ children }) => <h4 style={headingStyle(4)}>{children}</h4>,
    h5: ({ children }) => <h5 style={headingStyle(5)}>{children}</h5>,
    h6: ({ children }) => <h6 style={headingStyle(6)}>{children}</h6>,
    p: ({ children }) => (
        <p style={{ color: mutedColor, lineHeight: 1.75, margin: "0.5rem 0" }}>{children}</p>
    ),
    strong: ({ children }) => (
        <strong style={{ color: foreColor, fontWeight: 700 }}>{children}</strong>
    ),
    em: ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
    a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noreferrer" style={{ color: accentColor, textDecoration: "underline" }}>
            {children}
        </a>
    ),
    ul: ({ children }) => (
        <ul style={{ color: mutedColor, listStyle: "disc", paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.75 }}>{children}</ul>
    ),
    ol: ({ children }) => (
        <ol style={{ color: mutedColor, listStyle: "decimal", paddingLeft: "1.5rem", margin: "0.5rem 0", lineHeight: 1.75 }}>{children}</ol>
    ),
    li: ({ children }) => <li style={{ margin: "0.25rem 0" }}>{children}</li>,
    blockquote: ({ children }) => (
        <blockquote style={{ borderLeft: `3px solid ${accentColor}`, paddingLeft: "1rem", margin: "0.75rem 0", color: mutedColor, fontStyle: "italic" }}>{children}</blockquote>
    ),
    code: ({ children }) => (
        <code style={{ background: "var(--muted)", borderRadius: 4, padding: "0.1rem 0.35rem", fontFamily: '"IBM Plex Mono", monospace', fontSize: "0.85em", color: accentColor, overflowWrap: "anywhere" }}>{children}</code>
    ),
    pre: ({ children }) => (
        <pre style={{ background: "var(--muted)", borderRadius: 6, padding: "0.75rem", overflowX: "auto", fontFamily: '"IBM Plex Mono", monospace', fontSize: "0.85em", color: foreColor }}>{children}</pre>
    ),
    hr: () => <hr style={{ border: "none", borderTop: `1px solid ${borderColor}`, margin: "1.25rem 0" }} />,
    input: ({ type }) =>
        type === "checkbox" ? (
            <input type="checkbox" disabled style={{ marginRight: "0.5rem" }} />
        ) : null,
    table: ({ children }) => <table style={{ width: "100%", borderCollapse: "collapse", margin: "0.75rem 0", fontSize: "0.9rem" }}>{children}</table>,
    th: ({ children }) => <th style={{ border: `1px solid ${borderColor}`, padding: "0.4rem 0.6rem", textAlign: "left", color: foreColor, background: "var(--muted)" }}>{children}</th>,
    td: ({ children }) => <td style={{ border: `1px solid ${borderColor}`, padding: "0.4rem 0.6rem", color: mutedColor }}>{children}</td>,
    img: ({ src, alt }) => src ? <img src={src} alt={alt || ""} style={{ maxWidth: "100%", borderRadius: 8, margin: "0.75rem 0" }} /> : null,
};

const LessonView = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseId, lessonId } = useParams();

    const { lessons, currentLesson: lesson, loading, completing, error } = useSelector((state) => state.studentLessons);
    const { currentCourse: course } = useSelector((state) => state.studentCourses);

    useEffect(() => {
        dispatch(fetchLesson(lessonId));
        dispatch(fetchCourseLessons(courseId));
        dispatch(fetchCourseDetail(courseId));
        return () => { dispatch(clearCurrentLesson()); dispatch(clearLessonError()); };
    }, [dispatch, courseId, lessonId]);

    if (loading && !lesson) {
        return (
            <div>
                <SkeletonLine className="mb-4 h-3 w-28" />
                <div className="card p-6">
                    <SkeletonLine className="h-3 w-24" />
                    <SkeletonLine className="mt-3 h-6 w-2/3" />
                    <SkeletonLine className="mt-4 h-3 w-24" />
                    <div className="mt-6 space-y-2.5"><SkeletonLine className="w-full" /><SkeletonLine className="w-full" /><SkeletonLine className="w-5/6" /><SkeletonLine className="w-2/3" /></div>
                    <Skeleton className="mt-8 h-9 w-40 rounded-md" />
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Skeleton className="h-10 w-28 rounded-md" />
                    <Skeleton className="h-10 w-24 rounded-md" />
                </div>
            </div>
        );
    }

    if (error && !lesson) {
        return (
            <div>
                <div className="rounded-md px-4 py-3 text-sm" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{error}</div>
                <button type="button" onClick={() => navigate(`/student/courses/${courseId}`)} className="mt-4 text-sm font-medium transition hover:underline" style={{ color: "var(--muted-foreground)" }}>&larr; Back to Course</button>
            </div>
        );
    }

    if (!lesson) return null;

    const currentIndex = lessons.findIndex((item) => item.id === lesson.id);
    const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
    const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

    const handleComplete = async () => {
        const result = await dispatch(completeLesson(lesson.id));
        if (completeLesson.fulfilled.match(result)) {
            const enrollmentId = result.payload.enrollment?.id;
            if (enrollmentId) dispatch(refreshEnrollmentProgress(enrollmentId));
            dispatch(fetchEnrollments());
        }
    };

    return (
        <div>
            <button type="button" onClick={() => navigate(`/student/courses/${courseId}`)} className="mb-4 text-sm font-medium transition hover:underline" style={{ color: "var(--muted-foreground)" }}>
                &larr; Back to Course
            </button>

            <div className="card p-6">
                <span className="section-label text-[10px]">Lesson {currentIndex + 1} of {lessons.length}</span>

                <h1 className="mt-2 text-xl sm:text-2xl" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: "var(--foreground)" }}>
                    {lesson.title}
                </h1>

                {lesson.video_url && (() => {
                    const videoId = lesson.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^&?#]+)/)?.[1];
                    return videoId ? (
                        <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg">
                            <iframe src={`https://www.youtube.com/embed/${videoId}`} title={lesson.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        </div>
                    ) : (
                        <a href={lesson.video_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium transition hover:underline" style={{ color: "var(--accent)" }}>Watch Video</a>
                    );
                })()}

                <div className="mt-6">
                    <h2 style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--accent)" }}>Notes</h2>
                    {lesson.notes_content ? (
                        <div className="mt-3 overflow-x-auto rounded-lg border p-5" style={{ borderColor: "var(--border)" }}>
                            <ReactMarkdown components={mdComponents}>{lesson.notes_content}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--foreground)", lineHeight: 1.75 }}>
                            {lesson.notes || "No notes for this lesson."}
                        </div>
                    )}
                </div>

                {error && <div className="mt-5 rounded-md px-4 py-3 text-sm" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{error}</div>}

                <button type="button" onClick={handleComplete} disabled={completing} className="btn-primary mt-6">
                    {completing ? "Marking..." : "Mark as Complete"}
                </button>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {previousLesson ? (
                    <Link to={`/student/courses/${courseId}/lessons/${previousLesson.id}`} className="btn-secondary">&larr; Previous</Link>
                ) : <span />}
                {nextLesson ? (
                    <Link to={`/student/courses/${courseId}/lessons/${nextLesson.id}`} className="btn-secondary">Next Lesson &rarr;</Link>
                ) : course?.quizzes?.[0] ? (
                    <Link to={`/student/quizzes/${course.quizzes[0].id}`} className="btn-primary">Take Final Quiz &rarr;</Link>
                ) : <span />}
            </div>
        </div>
    );
};

export default LessonView;
