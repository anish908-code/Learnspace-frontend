import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { Plus, Pencil, Trash2, ListVideo, Video, X, ChevronDown, ChevronUp } from "lucide-react";

import {
    fetchAdminCourses,
    addCourse,
    editCourse,
    removeCourse,
    clearAdminCourseFeedback,
} from "../../features/admin/adminCourseSlice";
import { createLesson, getCourseLessons } from "../../api/adminApi";
import { SkeletonList } from "../../components/common/Skeleton";

const isValidYouTubeUrl = (url) => {
    if (!url) return true;
    try {
        const parsed = new URL(url);
        return (
            parsed.hostname === "www.youtube.com" ||
            parsed.hostname === "youtube.com" ||
            parsed.hostname === "youtu.be" ||
            parsed.hostname === "m.youtube.com"
        );
    } catch {
        return false;
    }
};

const emptyCourseForm = {
    title: "",
    description: "",
    category: "",
    difficulty: "Beginner",
    status: "draft",
};

const emptyLessonForm = {
    title: "",
    video_url: "",
    notes: "",
    lesson_order: "1",
    status: "published",
};

const CourseForm = ({ initialData, onCancel, onSubmit, saving }) => {
    return (
    <form
        className="card space-y-4 border-t-2 border-t-[var(--accent)] p-6"
        onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
        }}
    >
        <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
                <label className="label-text">Title *</label>
                <input
                    type="text"
                    required
                    value={initialData.title}
                    onChange={(e) => initialData.setTitle(e.target.value)}
                    className="input-field"
                    placeholder="Course ka naam"
                />
            </div>

            <div className="sm:col-span-2">
                <label className="label-text">Description *</label>
                <textarea
                    required
                    rows={3}
                    value={initialData.description}
                    onChange={(e) => initialData.setDescription(e.target.value)}
                    className="input-field"
                    placeholder="What is this course about"
                />
            </div>

            <div>
                <label className="label-text">Category *</label>
                <input
                    type="text"
                    required
                    value={initialData.category}
                    onChange={(e) => initialData.setCategory(e.target.value)}
                    className="input-field"
                    placeholder="Web Development"
                />
            </div>

            <div>
                <label className="label-text">Difficulty</label>
                <select
                    value={initialData.difficulty}
                    onChange={(e) => initialData.setDifficulty(e.target.value)}
                    className="input-field"
                >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                </select>
            </div>

            <div>
                <label className="label-text">Status</label>
                <select
                    value={initialData.status}
                    onChange={(e) => initialData.setStatus(e.target.value)}
                    className="input-field"
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
            </div>

        </div>

        <div className="flex gap-3">
            <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save Course"}
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary">
                Cancel
            </button>
        </div>
    </form>
    );
};

const LessonInlineForm = ({ courseId, order, onCreated, onCancel }) => {
    const [form, setForm] = useState({ ...emptyLessonForm, lesson_order: String(order) });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.video_url && !isValidYouTubeUrl(form.video_url)) {
            toast.error("Please enter a valid YouTube URL (youtube.com or youtu.be)");
            return;
        }

        setSaving(true);

        try {
            await createLesson({
                course_id: courseId,
                title: form.title,
                video_url: form.video_url || null,
                notes: form.notes || null,
                lesson_order: Number(form.lesson_order),
                status: form.status,
            });
            toast.success("Lesson created successfully");
            onCreated();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create lesson");
        } finally {
            setSaving(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 p-4 space-y-3"
        >
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--accent)" }}>
                    <Video size={14} />
                    Add Lesson #{order}
                </h4>
                <button type="button" onClick={onCancel} style={{ color: "var(--muted-foreground)" }} className="hover:opacity-70">
                    <X size={16} />
                </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="label-text">Lesson Title *</label>
                    <input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        className="input-field"
                        placeholder="Introduction to React"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="label-text">YouTube Video URL</label>
                    <input
                        type="url"
                        value={form.video_url}
                        onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                        className="input-field"
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                    <p className="mt-1 text-[11px]" style={{ color: "var(--muted-foreground)" }}>Only YouTube links allowed</p>
                </div>

                <div>
                    <label className="label-text">Order</label>
                    <input
                        type="number"
                        min={1}
                        value={form.lesson_order}
                        onChange={(e) => setForm((f) => ({ ...f, lesson_order: e.target.value }))}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="label-text">Status</label>
                    <select
                        value={form.status}
                        onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                        className="input-field"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>

                <div className="sm:col-span-2">
                    <label className="label-text">Notes</label>
                    <textarea
                        rows={3}
                        value={form.notes}
                        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                        className="input-field"
                        placeholder="Lesson notes or description..."
                    />
                </div>
            </div>

            <div className="flex gap-3">
                <button type="submit" disabled={saving} className="btn-primary text-sm">
                    {saving ? "Adding..." : "Add Lesson"}
                </button>
                <button type="button" onClick={onCancel} className="btn-secondary text-sm">
                    Skip
                </button>
            </div>
        </form>
    );
};

const useCourseForm = () => {
    const [form, setForm] = useState(emptyCourseForm);

    const setters = {
        setTitle: (title) => setForm((f) => ({ ...f, title })),
        setDescription: (description) => setForm((f) => ({ ...f, description })),
        setCategory: (category) => setForm((f) => ({ ...f, category })),
        setDifficulty: (difficulty) => setForm((f) => ({ ...f, difficulty })),
        setStatus: (status) => setForm((f) => ({ ...f, status })),
    };

    return { form, setForm, setters };
};

const Courses = () => {
    const dispatch = useDispatch();

    const {
        courses,
        loading,
        saving,
    } = useSelector((state) => state.adminCourses);

    const [showCreate, setShowCreate] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [createdCourseId, setCreatedCourseId] = useState(null);
    const [lessonCount, setLessonCount] = useState(0);
    const [courseLessons, setCourseLessons] = useState({});

    const createForm = useCourseForm();
    const editForm = useCourseForm();

    useEffect(() => {
        dispatch(fetchAdminCourses());
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearAdminCourseFeedback());
        };
    }, [dispatch]);

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="page-title">Courses</h1>
                <SkeletonList count={4} />
            </div>
        );
    }

    const startEdit = (course) => {
        setEditingId(course.id);
        setShowCreate(false);

        editForm.setForm({
            title: course.title || "",
            description: course.description || "",
            category: course.category || "",
            difficulty: course.difficulty || "Beginner",
            status: course.status || "draft",
        });
    };

    const resetForms = () => {
        setShowCreate(false);
        setEditingId(null);
        setCreatedCourseId(null);
        setLessonCount(0);
        createForm.setForm(emptyCourseForm);
        editForm.setForm(emptyCourseForm);
    };

    const handleCreate = () => {
        dispatch(addCourse(createForm.form)).then((result) => {
            if (result.meta.requestStatus === "fulfilled" && result.payload?.course) {
                setCreatedCourseId(result.payload.course.id);
                setLessonCount(0);
            } else if (result.meta.requestStatus === "fulfilled") {
                dispatch(fetchAdminCourses()).then((res) => {
                    if (res.payload?.courses?.length > 0) {
                        const latest = res.payload.courses[0];
                        setCreatedCourseId(latest.id);
                        setLessonCount(0);
                    }
                });
            }
        });
    };

    const handleUpdate = () => {
        dispatch(editCourse({ id: editingId, data: editForm.form })).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                resetForms();
            }
        });
    };

    const handleDelete = (course) => {
        if (!window.confirm(`Delete "${course.title}"?`)) return;
        dispatch(removeCourse(course.id));
    };

    const handleLessonCreated = () => {
        setLessonCount((prev) => prev + 1);
    };

    const fetchLessonsForCourse = async (courseId) => {
        if (courseLessons[courseId]) {
            setCourseLessons((prev) => {
                const next = { ...prev };
                delete next[courseId];
                return next;
            });
            return;
        }

        try {
            const res = await getCourseLessons(courseId);
            setCourseLessons((prev) => ({ ...prev, [courseId]: res.data.lessons || [] }));
        } catch {
            setCourseLessons((prev) => ({ ...prev, [courseId]: [] }));
        }
    };

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="page-title">Courses</h1>
                    <p className="-mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Manage all courses ({courses.length}).
                    </p>
                </div>

                {!showCreate && !createdCourseId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            createForm.setForm(emptyCourseForm);
                            setShowCreate(true);
                        }}
                        className="btn-primary shrink-0"
                    >
                        <Plus size={16} />
                        Add Course
                    </button>
                )}
            </div>

            {showCreate && !createdCourseId && (
                <div className="mb-6">
                    <CourseForm
                        initialData={{ ...createForm.form, ...createForm.setters }}
                        onCancel={() => setShowCreate(false)}
                        onSubmit={handleCreate}
                        saving={saving}
                    />
                </div>
            )}

            {createdCourseId && (
                <div className="mb-6">
                    <div className="card border-l-4 border-l-emerald-500 p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                                    Course created! Now add lessons.
                                </h3>
                                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                                    {lessonCount > 0
                                        ? `${lessonCount} lesson(s) added so far.`
                                        : "Add your first lesson below."}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={resetForms}
                                className="btn-primary text-sm"
                            >
                                Done
                            </button>
                        </div>

                        <LessonInlineForm
                            courseId={createdCourseId}
                            order={lessonCount + 1}
                            onCreated={handleLessonCreated}
                            onCancel={resetForms}
                        />
                    </div>
                </div>
            )}

            {courses.length === 0 ? (
                <div className="card px-6 py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                    No courses yet. Create your first course using "Add Course".
                </div>
            ) : (
                <div className="space-y-4">
                    {courses.map((course) => (
                        <div key={course.id}>
                            {editingId === course.id ? (
                                <CourseForm
                                    initialData={{ ...editForm.form, ...editForm.setters }}
                                    onCancel={() => setEditingId(null)}
                                    onSubmit={handleUpdate}
                                    saving={saving}
                                />
                            ) : (
                                <div className="card p-5">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                                                    {course.title}
                                                </h3>
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                                        course.status === "published"
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : "bg-muted text-muted"
                                                    }`}
                                                >
                                                    {course.status}
                                                </span>
                                            </div>

                                            <p className="mt-1 line-clamp-2 max-w-3xl text-sm" style={{ color: "var(--muted-foreground)" }}>
                                                {course.description}
                                            </p>

                                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                                                <span>{course.category}</span>
                                                <span>-</span>
                                                <span>{course.difficulty}</span>
                                                {course.duration && (
                                                    <>
                                                        <span>-</span>
                                                        <span>{course.duration}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => fetchLessonsForCourse(course.id)}
                                                title="View Lessons"
                                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition"
                                                style={{ background: "var(--muted)", color: "var(--accent)" }}
                                            >
                                                <ListVideo size={14} />
                                                {courseLessons[course.id] ? (
                                                    <ChevronUp size={14} />
                                                ) : (
                                                    <ChevronDown size={14} />
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => startEdit(course)}
                                                title="Edit"
                                                className="rounded-lg p-2.5 transition hover:bg-muted"
                                                style={{ color: "var(--muted-foreground)" }}
                                            >
                                                <Pencil size={17} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(course)}
                                                title="Delete"
                                                className="rounded-lg p-2.5 transition hover:bg-red-50 hover:text-red-600"
                                                style={{ color: "var(--muted-foreground)" }}
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </div>

                                    {courseLessons[course.id] && (
                                        <div className="mt-4 border-t border-warm-border pt-4">
                                            {courseLessons[course.id].length === 0 ? (
                                                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                                                    No lessons yet.
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {courseLessons[course.id].map((lesson, idx) => (
                                                        <div
                                                            key={lesson.id}
                                                            className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2"
                                                        >
                                                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold" style={{ background: "var(--muted)", color: "var(--accent)" }}>
                                                                {lesson.lesson_order || idx + 1}
                                                            </span>
                                                            <span className="min-w-0 flex-1 truncate text-sm" style={{ color: "var(--foreground)" }}>
                                                                {lesson.title}
                                                            </span>
                                                            <span
                                                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                                                    lesson.status === "published"
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : "bg-muted text-muted"
                                                                }`}
                                                            >
                                                                {lesson.status}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <Link
                                                to={`/admin/courses/${course.id}`}
                                                className="mt-3 inline-flex items-center gap-1 text-xs font-medium transition hover:opacity-80"
                                                style={{ color: "var(--accent)" }}
                                            >
                                                Manage all lessons
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Courses;
