import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";

import {
    fetchAdminLessons,
    addLesson,
    editLesson,
    removeLesson,
    clearAdminLessonFeedback,
} from "../../features/admin/adminLessonSlice";
import { fetchAdminCourseDetail } from "../../features/admin/adminCourseSlice";
import { SkeletonList } from "../../components/common/Skeleton";

const emptyForm = {
    title: "",
    video_url: "",
    lesson_order: "1",
    status: "draft",
    notes_file: null,
    notes_file_name: "",
    existing_notes_file: "",
};

const LessonForm = ({ form, setters, onSubmit, onCancel, saving, submitLabel }) => (
    <form
        className="card space-y-4 border-t-2 border-t-[var(--accent)] p-6"
        onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
        }}
    >
        <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
            <div>
                <label className="label-text">Title *</label>

                <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setters.setTitle(e.target.value)}
                    className="input-field"
                    placeholder="Lesson ka naam"
                />
            </div>

            <div>
                <label className="label-text">Order *</label>

                <input
                    type="number"
                    min={1}
                    required
                    value={form.lesson_order}
                    onChange={(e) => setters.setOrder(e.target.value)}
                    className="input-field"
                />
            </div>

            <div className="sm:col-span-2">
                <label className="label-text">Video URL</label>

                <input
                    type="url"
                    value={form.video_url}
                    onChange={(e) => setters.setVideoUrl(e.target.value)}
                    className="input-field"
                    placeholder="https://youtube.com/watch?v=..."
                />
            </div>

            <div className="sm:col-span-2">
                <label className="label-text">Notes File (.md)</label>

                <input
                    type="file"
                    accept=".md"
                    onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file && !file.name.endsWith(".md")) {
                            toast.error("Sirf .md file allow hai!");
                            e.target.value = "";
                            return;
                        }
                        setters.setNotesFile(file);
                    }}
                    className="input-field cursor-pointer file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm"
                />

                {form.notes_file_name && (
                    <p className="mt-1.5 text-xs" style={{ color: "var(--success)" }}>
                        Selected: {form.notes_file_name}
                    </p>
                )}

                {!form.notes_file_name && form.existing_notes_file && (
                    <p className="mt-1.5 truncate text-xs" style={{ color: "var(--muted-foreground)" }}>
                        Current file: {form.existing_notes_file}
                    </p>
                )}
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

const CourseLessons = () => {
    const dispatch = useDispatch();
    const { courseId } = useParams();

    const { currentCourse } = useSelector((state) => state.adminCourses);
    const {
        lessons,
        loading,
        saving,
    } = useSelector((state) => state.adminLessons);

    const [showCreate, setShowCreate] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState(emptyForm);

    const setters = {
        setTitle: (title) => setForm((f) => ({ ...f, title })),
        setVideoUrl: (video_url) => setForm((f) => ({ ...f, video_url })),
        setNotesFile: (file) =>
            setForm((f) => ({
                ...f,
                notes_file: file,
                notes_file_name: file ? file.name : "",
            })),
        setOrder: (lesson_order) => setForm((f) => ({ ...f, lesson_order })),
        setStatus: (status) => setForm((f) => ({ ...f, status })),
    };

    useEffect(() => {
        dispatch(fetchAdminCourseDetail(courseId));
        dispatch(fetchAdminLessons(courseId));
    }, [dispatch, courseId]);

    useEffect(() => {
        return () => {
            dispatch(clearAdminLessonFeedback());
        };
    }, [dispatch]);

    const startEdit = (lesson) => {
        setEditingId(lesson.id);
        setShowCreate(false);

        setForm({
            title: lesson.title || "",
            video_url: lesson.video_url || "",
            lesson_order: String(lesson.lesson_order || 1),
            status: lesson.status || "draft",
            notes_file: null,
            notes_file_name: "",
            existing_notes_file: lesson.notes_file || "",
        });
    };

    const resetFormState = () => {
        setShowCreate(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleCreate = () => {
        dispatch(
            addLesson({
                course_id: Number(courseId),
                title: form.title,
                video_url: form.video_url || null,
                notes_file: form.notes_file || null,
                lesson_order: Number(form.lesson_order),
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
            editLesson({
                id: editingId,
                data: {
                    title: form.title,
                    video_url: form.video_url || null,
                    notes_file: form.notes_file || null,
                    lesson_order: Number(form.lesson_order),
                    status: form.status,
                },
            })
        ).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                resetFormState();
            }
        });
    };

    const handleDelete = (lesson) => {
        if (!window.confirm(`Delete "${lesson.title}"?`)) {
            return;
        }

        dispatch(removeLesson({ id: lesson.id, courseId }));
    };

    return (
        <div>
            <Link
                to="/admin/courses"
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium transition hover:opacity-80"
                style={{ color: "var(--muted-foreground)" }}
            >
                <ArrowLeft size={16} />
                Back to courses
            </Link>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="page-title">
                        Lessons — {currentCourse?.title || "..."}
                    </h1>

                    <p className="-mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Manage the lessons of this course in order (
                        {lessons.length}).
                    </p>
                </div>

                {!showCreate && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            setForm({
                                ...emptyForm,
                                lesson_order: String(lessons.length + 1),
                            });
                            setShowCreate(true);
                        }}
                        className="btn-primary shrink-0"
                    >
                        <Plus size={16} />
                        Add Lesson
                    </button>
                )}
            </div>

            {/* Create form */}
            {showCreate && (
                <div className="mb-6">
                    <LessonForm
                        form={form}
                        setters={setters}
                        onSubmit={handleCreate}
                        onCancel={() => setShowCreate(false)}
                        saving={saving}
                        submitLabel="Add Lesson"
                    />
                </div>
            )}

            {/* Lessons list */}
            {loading && lessons.length === 0 ? (
                <SkeletonList count={3} />
            ) : lessons.length === 0 ? (
                <div className="card px-6 py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                    This course has no lessons yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {lessons.map((lesson) =>
                        editingId === lesson.id ? (
                            <LessonForm
                                key={lesson.id}
                                form={form}
                                setters={setters}
                                onSubmit={handleUpdate}
                                onCancel={() => setEditingId(null)}
                                saving={saving}
                                submitLabel="Save Changes"
                            />
                        ) : (
                            <div
                                key={lesson.id}
                                className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold" style={{ background: "var(--muted)", color: "var(--accent)" }}>
                                    {lesson.lesson_order}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="truncate font-semibold" style={{ color: "var(--foreground)" }}>
                                            {lesson.title}
                                        </h3>

                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                                lesson.status === "published"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-muted text-muted"
                                            }`}
                                        >
                                            {lesson.status}
                                        </span>
                                    </div>

                                    {lesson.video_url && (
                                        <p className="mt-0.5 truncate text-xs" style={{ color: "var(--muted-foreground)" }}>
                                            {lesson.video_url}
                                        </p>
                                    )}

                                    {lesson.notes_file && (
                                        <p className="mt-0.5 truncate text-xs" style={{ color: "var(--muted-foreground)" }}>
                                            📄 {lesson.notes_file.split("/").pop()}
                                        </p>
                                    )}
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => startEdit(lesson)}
                                        title="Edit"
                                        className="rounded-lg p-2.5 transition hover:bg-muted"
                                        style={{ color: "var(--muted-foreground)" }}
                                    >
                                        <Pencil size={17} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(lesson)}
                                        title="Delete"
                                        className="rounded-lg p-2.5 transition hover:bg-red-50 hover:text-red-600"
                                        style={{ color: "var(--muted-foreground)" }}
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseLessons;
