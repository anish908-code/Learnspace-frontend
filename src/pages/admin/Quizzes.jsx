import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Plus, Pencil, Trash2, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

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

const emptyForm = {
    course_id: "",
    title: "",
    passing_percentage: "60",
    status: "draft",
};

const QuizForm = ({ form, setters, courses, onSubmit, onCancel, saving, submitLabel }) => (
    <form
        className="card space-y-4 border-l-4 border-l-accent p-6"
        onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
        }}
    >
        <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
            <div>
                <label className="label-text">Course *</label>
                <select
                    required
                    value={form.course_id}
                    onChange={(e) => setters.setCourseId(e.target.value)}
                    className="input-field"
                >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.title}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="label-text">Pass % *</label>
                <input
                    type="number"
                    min={0}
                    max={100}
                    required
                    value={form.passing_percentage}
                    onChange={(e) => setters.setPassingPercentage(e.target.value)}
                    className="input-field"
                />
            </div>

            <div className="sm:col-span-2">
                <label className="label-text">Title *</label>
                <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setters.setTitle(e.target.value)}
                    className="input-field"
                    placeholder="Final Quiz - Web Development"
                />
            </div>

            <div>
                <label className="label-text">Status</label>
                <select
                    value={form.status}
                    onChange={(e) => setters.setStatus(e.target.value)}
                    className="input-field"
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
            </div>
        </div>

        <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : submitLabel}
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
                Cancel
            </button>
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
            <div className="py-4 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                Loading questions...
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="py-4 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                No questions yet.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {questions.map((q, idx) => (
                <div
                    key={q.id}
                    className="rounded-lg border border-warm-border bg-white px-4 py-3"
                >
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
                        {idx + 1}. {q.question}
                    </p>
                    <div className="mt-1.5 grid gap-1 text-xs sm:grid-cols-2">
                        {["a", "b", "c", "d"].map((key) => (
                            <p
                                key={key}
                                className={
                                    q.correct_answer === key
                                        ? "font-semibold text-emerald-700"
                                        : ""
                                }
                                style={q.correct_answer !== key ? { color: "var(--muted-foreground)" } : undefined}
                            >
                                {key.toUpperCase()}. {q[`option_${key}`]}
                                {q.correct_answer === key && " ✓"}
                            </p>
                        ))}
                    </div>
                    <p className="mt-1 text-[11px]" style={{ color: "var(--muted-foreground)" }}>
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
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="page-title">Quizzes</h1>
                    <p className="-mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Manage final quizzes ({quizzes.length}).
                    </p>
                </div>

                {!showCreate && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            setForm(emptyForm);
                            setShowCreate(true);
                        }}
                        className="btn-primary shrink-0"
                    >
                        <Plus size={16} />
                        Add Quiz
                    </button>
                )}
            </div>

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

            {loading && quizzes.length === 0 ? (
                <SkeletonList count={3} />
            ) : quizzes.length === 0 ? (
                <div className="card px-6 py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                    No quizzes yet. Create your first quiz.
                </div>
            ) : (
                <div className="space-y-4">
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
                            <div key={quiz.id} className="card overflow-hidden">
                                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: "var(--foreground)" }}>
                                                {quiz.title}
                                            </h3>
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                                    quiz.status === "published"
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-muted text-muted-foreground"
                                                }`}
                                            >
                                                {quiz.status}
                                            </span>
                                        </div>

                                        <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                                            {quiz.course?.title || "-"} - Pass{" "}
                                            {quiz.passing_percentage}%
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleQuestions(quiz.id)}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-accent-muted px-3 py-2 text-xs font-semibold transition hover:opacity-80"
                                            style={{ color: "var(--accent)" }}
                                        >
                                            <HelpCircle size={14} />
                                            Questions ({quiz.questions_count ?? "?"})
                                            {expandedQuizId === quiz.id ? (
                                                <ChevronUp size={14} />
                                            ) : (
                                                <ChevronDown size={14} />
                                            )}
                                        </button>

                                        <Link
                                            to={`/admin/quizzes/${quiz.id}`}
                                            className="rounded-lg px-3 py-2 text-xs font-medium transition hover:bg-muted"
                                            style={{ color: "var(--muted-foreground)" }}
                                        >
                                            Manage
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={() => startEdit(quiz)}
                                            title="Edit"
                                            className="rounded-lg p-2.5 transition hover:bg-accent-muted"
                                            style={{ color: "var(--muted-foreground)" }}
                                        >
                                            <Pencil size={17} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(quiz)}
                                            title="Delete"
                                            className="rounded-lg p-2.5 transition hover:bg-red-50 hover:text-red-600"
                                            style={{ color: "var(--muted-foreground)" }}
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </div>

                                {expandedQuizId === quiz.id && (
                                    <div className="border-t border-warm-border bg-muted/50 px-5 py-4">
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
