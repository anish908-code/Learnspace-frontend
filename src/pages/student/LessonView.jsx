import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";

import { fetchCourseLessons, fetchLesson, completeLesson, clearCurrentLesson, clearLessonError } from "../../features/student/lessonSlice";
import { refreshEnrollmentProgress, fetchEnrollments } from "../../features/student/enrollmentSlice";
import { fetchCourseDetail } from "../../features/student/courseSlice";
import { Skeleton, SkeletonLine } from "../../components/common/Skeleton";
import { PageHeader, AlertBanner } from "../../components/common";
import Button, { ButtonLink } from "../../components/ui/Button";
import { SectionMarker } from "../../components/ui/Deco";
import { cn } from "../../utils/cn";
import ReactMarkdown from "react-markdown";

/*
|--------------------------------------------------------------------------
| Markdown renderer
|--------------------------------------------------------------------------
| Lesson notes ko project typography me map karta hai: display headings,
| hairline-ruled code blocks, one accent for links + quotes. Sirf classes,
| koi inline CSS nahi.
*/

const MD_HEADINGS = {
    1: "mt-5 mb-2.5 text-2xl",
    2: "mt-4 mb-2 text-xl",
    3: "mt-4 mb-2 text-lg",
    4: "mt-3.5 mb-1.5 text-base",
    5: "mt-3.5 mb-1.5 text-[0.95rem]",
    6: "mt-3.5 mb-1.5 text-sm",
};

const headingClass = (level) =>
    `font-display font-bold leading-snug text-fg ${MD_HEADINGS[level] || MD_HEADINGS[6]}`;

const mdComponents = {
    h1: ({ children }) => <h1 className={headingClass(1)}>{children}</h1>,
    h2: ({ children }) => <h2 className={headingClass(2)}>{children}</h2>,
    h3: ({ children }) => <h3 className={headingClass(3)}>{children}</h3>,
    h4: ({ children }) => <h4 className={headingClass(4)}>{children}</h4>,
    h5: ({ children }) => <h5 className={headingClass(5)}>{children}</h5>,
    h6: ({ children }) => <h6 className={headingClass(6)}>{children}</h6>,
    p: ({ children }) => (
        <p className="my-2 leading-relaxed text-muted">{children}</p>
    ),
    strong: ({ children }) => (
        <strong className="font-bold text-fg">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    a: ({ href, children }) => (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-accent underline underline-offset-4 transition-colors hover:text-accent-bright"
        >
            {children}
        </a>
    ),
    ul: ({ children }) => (
        <ul className="my-2 list-disc space-y-1 pl-6 leading-relaxed text-muted">{children}</ul>
    ),
    ol: ({ children }) => (
        <ol className="my-2 list-decimal space-y-1 pl-6 leading-relaxed text-muted">{children}</ol>
    ),
    li: ({ children }) => <li className="my-1">{children}</li>,
    blockquote: ({ children }) => (
        <blockquote className="my-3 border-l-2 border-accent pl-4 italic text-muted">
            {children}
        </blockquote>
    ),
    /* Fenced code blocks already sit inside a styled <pre> — inline code gets
       the tactile chip treatment, block code stays bare. */
    code: ({ children, className }) => {
        const isBlock = typeof className === "string" && className.startsWith("language-");

        return (
            <code
                className={cn(
                    "font-mono text-[0.85em]",
                    isBlock
                        ? "text-fg"
                        : "break-words rounded-md border border-line bg-surface-2 px-1.5 py-0.5 text-accent",
                )}
            >
                {children}
            </code>
        );
    },
    pre: ({ children }) => (
        <pre className="my-3 overflow-x-auto rounded-xl border border-line bg-surface-2 p-3.5 font-mono text-[0.85em] leading-relaxed text-fg">
            {children}
        </pre>
    ),
    hr: () => <hr className="my-5 border-0 border-t border-line" />,
    input: ({ type }) =>
        type === "checkbox" ? (
            <input type="checkbox" disabled className="mr-2 accent-accent" />
        ) : null,
    table: ({ children }) => (
        <div className="my-3 overflow-x-auto">
            <table className="w-full border-collapse text-[0.9rem]">{children}</table>
        </div>
    ),
    th: ({ children }) => (
        <th className="border border-line bg-surface-2 px-3 py-2 text-left font-semibold text-fg">
            {children}
        </th>
    ),
    td: ({ children }) => (
        <td className="border border-line px-3 py-2 align-top text-muted">{children}</td>
    ),
    img: ({ src, alt }) => src ? (
        <img
            src={src}
            alt={alt || ""}
            className="my-3 max-w-full rounded-xl border border-line"
        />
    ) : null,
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
                <AlertBanner type="error" message={error} />

                <Button
                    type="button"
                    onClick={() => navigate(`/student/courses/${courseId}`)}
                    variant="link"
                    className="mt-2"
                >
                    &larr; Back to Course
                </Button>
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
            <Button
                type="button"
                onClick={() => navigate(`/student/courses/${courseId}`)}
                variant="link"
                className="mb-5"
            >
                &larr; Back to Course
            </Button>

            <PageHeader
                eyebrow={`Lesson ${currentIndex + 1} of ${lessons.length}`}
                title={lesson.title}
            />

            {lesson.video_url && (() => {
                const videoId = lesson.video_url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([^&?#]+)/)?.[1];
                return videoId ? (
                    <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-line shadow-lift-md">
                        <iframe src={`https://www.youtube.com/embed/${videoId}`} title={lesson.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                ) : (
                    <a
                        href={lesson.video_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-colors hover:text-accent-bright hover:underline"
                    >
                        <PlayCircle size={16} aria-hidden="true" />
                        Watch Video
                    </a>
                );
            })()}

            <section className="mt-12">
                <SectionMarker index={1}>Notes</SectionMarker>

                <div className="card mt-5 p-6 sm:p-7">
                    {lesson.notes_content ? (
                        <div className="overflow-x-auto">
                            <ReactMarkdown components={mdComponents}>{lesson.notes_content}</ReactMarkdown>
                        </div>
                    ) : (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed text-fg">
                            {lesson.notes || "No notes for this lesson."}
                        </div>
                    )}

                    {error && (
                        <div className="mt-5">
                            <AlertBanner type="error" message={error} className="mb-0" />
                        </div>
                    )}

                    <Button
                        type="button"
                        onClick={handleComplete}
                        loading={completing}
                        loadingText="Marking..."
                        className="mt-6"
                    >
                        Mark as Complete
                    </Button>
                </div>
            </section>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {previousLesson ? (
                    <ButtonLink
                        to={`/student/courses/${courseId}/lessons/${previousLesson.id}`}
                        variant="secondary"
                    >
                        <ChevronLeft size={16} aria-hidden="true" />
                        Previous
                    </ButtonLink>
                ) : <span />}
                {nextLesson ? (
                    <ButtonLink
                        to={`/student/courses/${courseId}/lessons/${nextLesson.id}`}
                        variant="secondary"
                    >
                        Next Lesson
                        <ChevronRight size={16} aria-hidden="true" />
                    </ButtonLink>
                ) : course?.quizzes?.[0] ? (
                    <ButtonLink to={`/student/quizzes/${course.quizzes[0].id}`}>
                        Take Final Quiz
                        <ChevronRight size={16} aria-hidden="true" />
                    </ButtonLink>
                ) : <span />}
            </div>
        </div>
    );
};

export default LessonView;
