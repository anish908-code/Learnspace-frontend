import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { ArrowLeft, Plus, Pencil, Trash2, FileText, ListVideo } from "lucide-react";

import {
    fetchAdminLessons,
    addLesson,
    editLesson,
    removeLesson,
    clearAdminLessonFeedback,
} from "../../features/admin/adminLessonSlice";
import { fetchAdminCourseDetail } from "../../features/admin/adminCourseSlice";
import { SkeletonList } from "../../components/common/Skeleton";
import { PageHeader, EmptyState } from "../../components/common";
import Button, { ButtonLink } from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Field, Input, Select } from "../../components/ui/Field";

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
        className="card-accent-top space-y-5 p-6 sm:p-7"
        onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
        }}
    >
        <div className="grid gap-5 sm:grid-cols-[1fr_120px]">
            <Field label="Title" required>
                <Input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setters.setTitle(e.target.value)}
                    placeholder="Lesson ka naam"
                />
            </Field>

            <Field label="Order" required>
                <Input
                    type="number"
                    min={1}
                    required
                    value={form.lesson_order}
                    onChange={(e) => setters.setOrder(e.target.value)}
                />
            </Field>

            <Field label="Video URL" className="sm:col-span-2">
                <Input
                    type="url"
                    value={form.video_url}
                    onChange={(e) => setters.setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                />
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
                        setters.setNotesFile(file);
                    }}
                    className="cursor-pointer file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm"
                />

                {form.notes_file_name && (
                    <p className="mt-1.5 text-xs font-medium text-teal">
                        Selected: {form.notes_file_name}
                    </p>
                )}

                {!form.notes_file_name && form.existing_notes_file && (
                    <p className="mt-1.5 truncate text-xs text-muted">
                        Current file: {form.existing_notes_file}
                    </p>
                )}
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
            <ButtonLink
                to="/admin/courses"
                variant="ghost"
                size="sm"
                className="mb-4"
            >
                <ArrowLeft size={16} />
                Back to courses
            </ButtonLink>

            <PageHeader
                eyebrow="lesson sequence"
                title={`Lessons — ${currentCourse?.title || "..."}`}
                subtitle={`Manage the lessons of this course in order (${lessons.length}).`}
                action={
                    !showCreate && (
                        <Button
                            type="button"
                            onClick={() => {
                                setEditingId(null);
                                setForm({
                                    ...emptyForm,
                                    lesson_order: String(lessons.length + 1),
                                });
                                setShowCreate(true);
                            }}
                            className="shrink-0"
                        >
                            <Plus size={16} />
                            Add Lesson
                        </Button>
                    )
                }
            />

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
                <EmptyState
                    icon={ListVideo}
                    title="This course has no lessons yet."
                />
            ) : (
                <div className="stagger space-y-3">
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
                                className="data-row flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4"
                            >
                                <span className="icon-well numeric h-9 w-9 shrink-0 text-sm font-bold text-accent">
                                    {lesson.lesson_order}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <h3 className="truncate font-display text-sm font-bold text-fg">
                                            {lesson.title}
                                        </h3>

                                        <Badge
                                            tone={lesson.status === "published" ? "gold" : "neutral"}
                                        >
                                            {lesson.status}
                                        </Badge>
                                    </div>

                                    {lesson.video_url && (
                                        <p className="numeric mt-1 truncate text-xs text-subtle">
                                            {lesson.video_url}
                                        </p>
                                    )}

                                    {lesson.notes_file && (
                                        <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted">
                                            <FileText
                                                size={12}
                                                aria-hidden="true"
                                                className="shrink-0 text-subtle"
                                            />
                                            {lesson.notes_file.split("/").pop()}
                                        </p>
                                    )}
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        type="button"
                                        onClick={() => startEdit(lesson)}
                                        title="Edit"
                                        aria-label="Edit"
                                    >
                                        <Pencil size={16} />
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        size="icon-sm"
                                        type="button"
                                        onClick={() => handleDelete(lesson)}
                                        title="Delete"
                                        aria-label="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
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
