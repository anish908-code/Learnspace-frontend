import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Plus,
    Pencil,
    Trash2,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    ListChecks,
    ArrowRight,
} from "lucide-react";

import {
    fetchAdminQuizzes,
    addQuiz,
    editQuiz,
    removeQuiz,
    clearAdminQuizFeedback,
} from "../../features/admin/adminQuizSlice";
import { fetchAdminQuestions, clearAdminQuestionFeedback } from "../../features/admin/adminQuestionSlice";
import { fetchAdminCourses } from "../../features/admin/adminCourseSlice";
import { SkeletonList } from "../../components/common/Skeleton";
import { PageHeader, EmptyState } from "../../components/common";
import Button, { ButtonLink } from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Field, Input, Select } from "../../components/ui/Field";
import { SectionMarker } from "../../components/ui/Deco";

const emptyForm = {
    course_id: "",
    title: "",
    passing_percentage: "60",
    status: "draft",
};

const QuizForm = ({ form, setters, courses, onSubmit, onCancel, saving, submitLabel }) => (
    <form
        className="card-accent-top space-y-5 p-6 sm:p-7"
        onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
        }}
    >
        <div className="grid gap-5 sm:grid-cols-[1fr_160px]">
            <Field label="Course" required>
                <Select
                    required
                    value={form.course_id}
                    onChange={(e) => setters.setCourseId(e.target.value)}
                >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.title}
                        </option>
                    ))}
                </Select>
            </Field>

            <Field label="Pass %" required>
                <Input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={form.passing_percentage}
                    onChange={(e) => setters.setPassingPercentage(e.target.value)}
                />
            </Field>

            <Field label="Title" required className="sm:col-span-2">
                <Input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setters.setTitle(e.target.value)}
                    placeholder="Final Quiz - Web Development"
                />
            </Field>

            <Field label="Status">
                <Select
                    value={form.status}
                    onChange={(e) => setters.setStatus(e.target.value)}
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </Select>
            </Field>
        </div>

        <div className="flex flex-wrap gap-3">
            <Button
                type="submit"
                disabled={saving}
                loading={saving}
                loadingText="Saving…"
            >
                {submitLabel}
            </Button>

            <Button variant="secondary" type="button" onClick={onCancel}>
                Cancel
            </Button>
        </div>
    </form>
);

const QuestionsPreview = ({ quizId }) => {
    const dispatch = useDispatch();
    const { questions, loading } = useSelector((state) => state.adminQuestions);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            dispatch(fetchAdminQuestions(quizId)).then(() => setLoaded(true));
        }
    }, [dispatch, quizId, loaded]);

    useEffect(() => {
        return () => {
            dispatch(clearAdminQuestionFeedback());
        };
    }, [dispatch]);

    if (loading && !loaded) {
        return (
            <p className="flex items-center justify-center py-6 text-center">
                <span className="technical-label">Loading questions...</span>
            </p>
        );
    }

    if (questions.length === 0) {
        return (
            <p className="py-6 text-center text-sm text-muted">
                No questions yet.
            </p>
        );
    }

    return (
        <div className="space-y-2.5">
            {questions.map((q, idx) => (
                <div
                    key={q.id}
                    className="data-row block px-4 py-3.5"
                >
                    <p className="text-sm font-semibold text-fg">
                        {idx + 1}. {q.question}
                    </p>

                    <div className="mt-2 grid gap-1.5 text-xs sm:grid-cols-2">
                        {["a", "b", "c", "d"].map((key) => (
                            <p
                                key={key}
                                className={
                                    q.correct_answer === key
                                        ? "font-semibold text-teal"
                                        : "text-muted"
                                }
                            >
                                {key.toUpperCase()}. {q[`option_${key}`]}
                                {q.correct_answer === key && " ✓"}
                            </p>
                        ))}
                    </div>

                    <p className="numeric mt-2 text-[0.6875rem] text-subtle">
                        Marks: {q.marks}
                    </p>
                </div>
            ))}
        </div>
    );
};

const Quizzes = () => {
    const dispatch = useDispatch();

    const {
        quizzes,
        loading,
        saving,
    } = useSelector((state) => state.adminQuizzes);

    const { courses } = useSelector((state) => state.adminCourses);

    const [showCreate, setShowCreate] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [expandedQuizId, setExpandedQuizId] = useState(null);

    const [form, setForm] = useState(emptyForm);

    const setters = {
        setCourseId: (course_id) => setForm((f) => ({ ...f, course_id })),
        setTitle: (title) => setForm((f) => ({ ...f, title })),
        setPassingPercentage: (passing_percentage) =>
            setForm((f) => ({ ...f, passing_percentage })),
        setStatus: (status) => setForm((f) => ({ ...f, status })),
    };

    useEffect(() => {
        dispatch(fetchAdminQuizzes());
        dispatch(fetchAdminCourses());
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearAdminQuizFeedback());
        };
    }, [dispatch]);

    const startEdit = (quiz) => {
        setEditingId(quiz.id);
        setShowCreate(false);
        setExpandedQuizId(null);

        setForm({
            course_id: String(quiz.course_id || ""),
            title: quiz.title || "",
            passing_percentage: String(quiz.passing_percentage ?? 60),
            status: quiz.status || "draft",
        });
    };

    const resetFormState = () => {
        setShowCreate(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleCreate = () => {
        dispatch(
            addQuiz({
                course_id: Number(form.course_id),
                title: form.title,
                passing_percentage: Number(form.passing_percentage),
                status: form.status,
            })
        ).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                resetFormState();
            }
        });
    };

    const handleUpdate = () => {
        dispatch(
            editQuiz({
                id: editingId,
                data: {
                    course_id: Number(form.course_id),
                    title: form.title,
                    passing_percentage: Number(form.passing_percentage),
                    status: form.status,
                },
            })
        ).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                resetFormState();
            }
        });
    };

    const handleDelete = (quiz) => {
        if (!window.confirm(`Delete "${quiz.title}"?`)) return;
        dispatch(removeQuiz(quiz.id));
    };

    const toggleQuestions = (quizId) => {
        setExpandedQuizId((prev) => (prev === quizId ? null : quizId));
    };

    return (
        <div>
            <PageHeader
                eyebrow="assessment bank"
                title="Quizzes"
                subtitle={`Manage final quizzes (${quizzes.length}).`}
                action={
                    !showCreate && (
                        <Button
                            type="button"
                            onClick={() => {
                                setEditingId(null);
                                setForm(emptyForm);
                                setShowCreate(true);
                            }}
                            className="shrink-0"
                        >
                            <Plus size={16} />
                            Add Quiz
                        </Button>
                    )
                }
            />

            {showCreate && (
                <div className="mb-6">
                    <QuizForm
                        form={form}
                        setters={setters}
                        courses={courses}
                        onSubmit={handleCreate}
                        onCancel={() => setShowCreate(false)}
                        saving={saving}
                        submitLabel="Add Quiz"
                    />
                </div>
            )}

            <div className="mb-5">
                <SectionMarker index={1}>Quiz bank</SectionMarker>
            </div>

            {loading && quizzes.length === 0 ? (
                <SkeletonList count={3} />
            ) : quizzes.length === 0 ? (
                <EmptyState
                    icon={ListChecks}
                    title="No quizzes yet."
                    message="Create your first quiz."
                />
            ) : (
                <div className="stagger space-y-3">
                    {quizzes.map((quiz) =>
                        editingId === quiz.id ? (
                            <QuizForm
                                key={quiz.id}
                                form={form}
                                setters={setters}
                                courses={courses}
                                onSubmit={handleUpdate}
                                onCancel={() => setEditingId(null)}
                                saving={saving}
                                submitLabel="Save Changes"
                            />
                        ) : (
                            <div
                                key={quiz.id}
                                className="card p-5 sm:p-6"
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2.5">
                                            <h3 className="truncate font-display text-base font-bold text-fg">
                                                {quiz.title}
                                            </h3>

                                            <Badge
                                                tone={quiz.status === "published" ? "gold" : "neutral"}
                                                dot
                                            >
                                                {quiz.status}
                                            </Badge>
                                        </div>

                                        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                                            <span className="technical-label">
                                                {quiz.course?.title || "-"}
                                            </span>

                                            <span
                                                aria-hidden="true"
                                                className="text-subtle"
                                            >
                                                -
                                            </span>

                                            <span className="technical-label">
                                                Pass {quiz.passing_percentage}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            type="button"
                                            onClick={() => toggleQuestions(quiz.id)}
                                            aria-expanded={expandedQuizId === quiz.id}
                                        >
                                            <HelpCircle size={14} />
                                            Questions ({quiz.questions_count ?? "?"})
                                            {expandedQuizId === quiz.id ? (
                                                <ChevronUp size={14} />
                                            ) : (
                                                <ChevronDown size={14} />
                                            )}
                                        </Button>

                                        <ButtonLink
                                            to={`/admin/quizzes/${quiz.id}`}
                                            variant="ghost"
                                            size="sm"
                                        >
                                            Manage
                                            <ArrowRight size={14} />
                                        </ButtonLink>

                                        <Button
                                            variant="ghost"
                                            size="icon-sm"
                                            type="button"
                                            onClick={() => startEdit(quiz)}
                                            title="Edit"
                                            aria-label="Edit"
                                        >
                                            <Pencil size={17} />
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            size="icon-sm"
                                            type="button"
                                            onClick={() => handleDelete(quiz)}
                                            title="Delete"
                                            aria-label="Delete"
                                        >
                                            <Trash2 size={17} />
                                        </Button>
                                    </div>
                                </div>

                                {expandedQuizId === quiz.id && (
                                    <div className="mt-5 border-t border-line pt-5">
                                        <QuestionsPreview quizId={quiz.id} />
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default Quizzes;
