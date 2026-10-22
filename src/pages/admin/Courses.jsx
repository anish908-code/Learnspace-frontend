import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
    Plus,
    Pencil,
    Trash2,
    ListVideo,
    Video,
    X,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    BookOpen,
} from "lucide-react";

import {
    fetchAdminCourses,
    addCourse,
    editCourse,
    removeCourse,
    clearAdminCourseFeedback,
} from "../../features/admin/adminCourseSlice";
import { createLesson, getCourseLessons } from "../../api/adminApi";
import { SkeletonList } from "../../components/common/Skeleton";
import { PageHeader, EmptyState } from "../../components/common";
import Button, { ButtonLink } from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Field, Input, Textarea, Select } from "../../components/ui/Field";

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
    lesson_order: "1",
    status: "published",
};

const CourseForm = ({ initialData, onCancel, onSubmit, saving }) => {
    return (
    <form
        className="card-accent-top space-y-5 p-6 sm:p-7"
        onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
        }}
    >
        <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Title" required className="sm:col-span-2">
                <Input
                    type="text"
                    required
                    value={initialData.title}
                    onChange={(e) => initialData.setTitle(e.target.value)}
                    placeholder="Course ka naam"
                />
            </Field>

            <Field label="Description" required className="sm:col-span-2">
                <Textarea
                    required
                    rows={3}
                    value={initialData.description}
                    onChange={(e) => initialData.setDescription(e.target.value)}
                    placeholder="What is this course about"
                />
            </Field>

            <Field label="Category" required>
                <Input
                    type="text"
                    required
                    value={initialData.category}
                    onChange={(e) => initialData.setCategory(e.target.value)}
                    placeholder="Web Development"
                />
            </Field>

            <Field label="Difficulty">
                <Select
                    value={initialData.difficulty}
                    onChange={(e) => initialData.setDifficulty(e.target.value)}
                >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                </Select>
            </Field>

            <Field label="Status">
                <Select
                    value={initialData.status}
                    onChange={(e) => initialData.setStatus(e.target.value)}
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
                Save Course
            </Button>
            <Button variant="secondary" type="button" onClick={onCancel}>
                Cancel
            </Button>
        </div>
    </form>
    );
};

const LessonInlineForm = ({ courseId, order, onCreated, onCancel }) => {
    const [form, setForm] = useState({
        ...emptyLessonForm,
        lesson_order: String(order),
        notes_file: null,
        notes_file_name: "",
    });
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
                notes_file: form.notes_file || null,
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
            className="surface-technical mt-4 space-y-4 rounded-2xl p-5"
        >
            <div className="flex items-center justify-between gap-3">
                <h4 className="flex items-center gap-2 font-display text-sm font-semibold text-accent">
                    <Video size={14} />
                    Add Lesson #{order}
                </h4>

                <Button
                    variant="ghost"
                    size="icon-sm"
                    type="button"
                    onClick={onCancel}
                    aria-label="Skip"
                >
                    <X size={16} />
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Lesson Title" required className="sm:col-span-2">
                    <Input
                        type="text"
                        required
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="Introduction to React"
                    />
                </Field>

                <Field
                    label="YouTube Video URL"
                    hint="Only YouTube links allowed"
                    className="sm:col-span-2"
                >
                    <Input
                        type="url"
                        value={form.video_url}
                        onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                        placeholder="https://www.youtube.com/watch?v=..."
                    />
                </Field>

                <Field label="Order">
                    <Input
                        type="number"
                        min={1}
                        value={form.lesson_order}
                        onChange={(e) => setForm((f) => ({ ...f, lesson_order: e.target.value }))}
                    />
                </Field>

                <Field label="Status">
                    <Select
                        value={form.status}
                        onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </Select>
                </Field>

                <Field label="Notes File (.md)" className="sm:col-span-2">
                    <Input
                        type="file"
                        accept=".md"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            if (file && !file.name.endsWith(".md")) {
                                toast.error("Sirf .md file allow hai!");
                                e.target.value = "";
                                return;
                            }
                            setForm((f) => ({
                                ...f,
                                notes_file: file,
                                notes_file_name: file ? file.name : "",
                            }));
                        }}
                        className="cursor-pointer file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm"
                    />

                    {form.notes_file_name && (
                        <p className="mt-1.5 text-xs font-medium text-teal">
                            Selected: {form.notes_file_name}
                        </p>
                    )}
                </Field>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button
                    type="submit"
                    disabled={saving}
                    loading={saving}
                    loadingText="Adding…"
                >
                    Add Lesson
                </Button>
                <Button variant="secondary" type="button" onClick={onCancel}>
                    Skip
                </Button>
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
            <div>
                <PageHeader eyebrow="course registry" title="Courses" />
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
            <PageHeader
                eyebrow="course registry"
                title="Courses"
                subtitle={`Manage all courses (${courses.length}).`}
                action={
                    !showCreate && !createdCourseId && (
                        <Button
                            type="button"
                            onClick={() => {
                                setEditingId(null);
                                createForm.setForm(emptyCourseForm);
                                setShowCreate(true);
                            }}
                            className="shrink-0"
                        >
                            <Plus size={16} />
                            Add Course
                        </Button>
                    )
                }
            />

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
                    <div className="card border-l-4 border-l-teal p-5 sm:p-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="min-w-0">
                                <h3 className="font-display text-base font-bold text-fg">
                                    Course created! Now add lessons.
                                </h3>
                                <p className="mt-1 text-sm text-muted">
                                    {lessonCount > 0
                                        ? `${lessonCount} lesson(s) added so far.`
                                        : "Add your first lesson below."}
                                </p>
                            </div>

                            <Button
                                type="button"
                                onClick={resetForms}
                                className="shrink-0"
                            >
                                Done
                            </Button>
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
                <EmptyState
                    icon={BookOpen}
                    title="No courses yet."
                    message={'Create your first course using "Add Course".'}
                />
            ) : (
                <div className="stagger space-y-4">
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
                                <div className="card p-5 sm:p-6">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2.5">
                                                <h3 className="font-display text-base font-bold text-fg">
                                                    {course.title}
                                                </h3>

                                                <Badge
                                                    tone={course.status === "published" ? "gold" : "neutral"}
                                                    dot
                                                >
                                                    {course.status}
                                                </Badge>
                                            </div>

                                            <p className="mt-2 line-clamp-2 max-w-3xl text-sm text-muted">
                                                {course.description}
                                            </p>

                                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
                                                <span className="technical-label">
                                                    {course.category}
                                                </span>
                                                <span aria-hidden="true" className="text-subtle">
                                                    -
                                                </span>
                                                <span className="technical-label">
                                                    {course.difficulty}
                                                </span>
                                                {course.duration && (
                                                    <>
                                                        <span aria-hidden="true" className="text-subtle">
                                                            -
                                                        </span>
                                                        <span className="technical-label">
                                                            {course.duration}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                type="button"
                                                onClick={() => fetchLessonsForCourse(course.id)}
                                                title="View Lessons"
                                                aria-expanded={Boolean(
                                                    courseLessons[course.id]
                                                )}
                                            >
                                                <ListVideo size={14} />
                                                {courseLessons[course.id] ? (
                                                    <ChevronUp size={14} />
                                                ) : (
                                                    <ChevronDown size={14} />
                                                )}
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                type="button"
                                                onClick={() => startEdit(course)}
                                                title="Edit"
                                                aria-label="Edit"
                                            >
                                                <Pencil size={17} />
                                            </Button>

                                            <Button
                                                variant="destructive"
                                                size="icon-sm"
                                                type="button"
                                                onClick={() => handleDelete(course)}
                                                title="Delete"
                                                aria-label="Delete"
                                            >
                                                <Trash2 size={17} />
                                            </Button>
                                        </div>
                                    </div>

                                    {courseLessons[course.id] && (
                                        <div className="mt-4 border-t border-line pt-4">
                                            {courseLessons[course.id].length === 0 ? (
                                                <p className="text-sm text-muted">
                                                    No lessons yet.
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {courseLessons[course.id].map((lesson, idx) => (
                                                        <div
                                                            key={lesson.id}
                                                            className="data-row gap-3 py-2.5"
                                                        >
                                                            <span className="icon-well icon-well-round h-6 w-6 shrink-0 text-[0.65rem] font-bold text-accent">
                                                                {lesson.lesson_order || idx + 1}
                                                            </span>

                                                            <span className="min-w-0 flex-1 truncate text-sm font-medium text-fg">
                                                                {lesson.title}
                                                            </span>

                                                            <Badge
                                                                tone={lesson.status === "published" ? "gold" : "neutral"}
                                                            >
                                                                {lesson.status}
                                                            </Badge>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <ButtonLink
                                                to={`/admin/courses/${course.id}`}
                                                variant="ghost"
                                                size="sm"
                                                className="mt-3"
                                            >
                                                Manage all lessons
                                                <ArrowRight size={15} />
                                            </ButtonLink>
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
