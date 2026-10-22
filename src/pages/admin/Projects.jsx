import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Plus, Pencil, Trash2, FolderGit2 } from "lucide-react";

import {
    fetchAdminProjects,
    addProject,
    editProject,
    removeProject,
    clearAdminProjectFeedback,
} from "../../features/admin/adminProjectSlice";
import { fetchAdminCourses } from "../../features/admin/adminCourseSlice";
import { SkeletonList } from "../../components/common/Skeleton";
import { PageHeader, EmptyState } from "../../components/common";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { Field, Input, Textarea, Select } from "../../components/ui/Field";
import { SectionMarker } from "../../components/ui/Deco";

const emptyForm = {
    course_id: "",
    title: "",
    description: "",
    required_skills: "",
    difficulty: "Beginner",
    deadline: "",
    requirements: "",
    status: "draft",
};

/* Difficulty ka emphasis ek hi accent rakhta hai — beginner quiet, advanced loud */
const DIFFICULTY_TONE = {
    Beginner: "neutral",
    Intermediate: "accent",
    Advanced: "gold",
};

const ProjectForm = ({ form, setters, courses, onSubmit, onCancel, saving, submitLabel }) => (
    <form
        className="card-accent-top space-y-5 p-6 sm:p-7"
        onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
        }}
    >
        <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Course" required>
                <Select
                    required
                    value={form.course_id}
                    onChange={(e) => setters.setField("course_id", e.target.value)}
                >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.title}
                        </option>
                    ))}
                </Select>
            </Field>

            <Field label="Title" required>
                <Input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setters.setField("title", e.target.value)}
                    placeholder="Project ka naam"
                />
            </Field>

            <Field label="Description" className="sm:col-span-2">
                <Textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                        setters.setField("description", e.target.value)
                    }
                />
            </Field>

            <Field label="Required Skills">
                <Input
                    type="text"
                    value={form.required_skills}
                    onChange={(e) =>
                        setters.setField("required_skills", e.target.value)
                    }
                    placeholder="React, Laravel"
                />
            </Field>

            <Field label="Difficulty">
                <Select
                    value={form.difficulty}
                    onChange={(e) =>
                        setters.setField("difficulty", e.target.value)
                    }
                >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                </Select>
            </Field>

            <Field label="Deadline">
                <Input
                    type="date"
                    value={form.deadline}
                    onChange={(e) =>
                        setters.setField("deadline", e.target.value)
                    }
                />
            </Field>

            <Field label="Status">
                <Select
                    value={form.status}
                    onChange={(e) => setters.setField("status", e.target.value)}
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </Select>
            </Field>

            <Field label="Requirements" className="sm:col-span-2">
                <Textarea
                    rows={2}
                    value={form.requirements}
                    onChange={(e) =>
                        setters.setField("requirements", e.target.value)
                    }
                    placeholder="What needs to be delivered"
                />
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

const Projects = () => {
    const dispatch = useDispatch();

    const {
        projects,
        loading,
        saving,
    } = useSelector((state) => state.adminProjects);

    const { courses } = useSelector((state) => state.adminCourses);

    const [showCreate, setShowCreate] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState(emptyForm);

    const setters = {
        setField: (field, value) => setForm((f) => ({ ...f, [field]: value })),
    };

    useEffect(() => {
        dispatch(fetchAdminProjects());
        dispatch(fetchAdminCourses());
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearAdminProjectFeedback());
        };
    }, [dispatch]);

    const startEdit = (project) => {
        setEditingId(project.id);
        setShowCreate(false);

        setForm({
            course_id: String(project.course_id || ""),
            title: project.title || "",
            description: project.description || "",
            required_skills: project.required_skills || "",
            difficulty: project.difficulty || "Beginner",
            deadline: project.deadline ? project.deadline.slice(0, 10) : "",
            requirements: project.requirements || "",
            status: project.status || "draft",
        });
    };

    const resetFormState = () => {
        setShowCreate(false);
        setEditingId(null);
        setForm(emptyForm);
    };

    const handleCreate = () => {
        dispatch(
            addProject({
                course_id: Number(form.course_id),
                title: form.title,
                description: form.description || null,
                required_skills: form.required_skills || null,
                difficulty: form.difficulty || null,
                deadline: form.deadline || null,
                requirements: form.requirements || null,
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
            editProject({
                id: editingId,
                data: {
                    course_id: Number(form.course_id),
                    title: form.title,
                    description: form.description || null,
                    required_skills: form.required_skills || null,
                    difficulty: form.difficulty || null,
                    deadline: form.deadline || null,
                    requirements: form.requirements || null,
                    status: form.status,
                },
            })
        ).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                resetFormState();
            }
        });
    };

    const handleDelete = (project) => {
        if (!window.confirm(`Delete "${project.title}"?`)) {
            return;
        }

        dispatch(removeProject(project.id));
    };

    return (
        <div>
            <PageHeader
                eyebrow="project register"
                title="Projects"
                subtitle={`Manage all projects (${projects.length}).`}
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
                            Add Project
                        </Button>
                    )
                }
            />

            {/* Create form */}
            {showCreate && (
                <div className="mb-6">
                    <ProjectForm
                        form={form}
                        setters={setters}
                        courses={courses}
                        onSubmit={handleCreate}
                        onCancel={() => setShowCreate(false)}
                        saving={saving}
                        submitLabel="Add Project"
                    />
                </div>
            )}

            <div className="mb-5">
                <SectionMarker index={1}>Project register</SectionMarker>
            </div>

            {/* Project list */}
            {loading && projects.length === 0 ? (
                <SkeletonList count={3} />
            ) : projects.length === 0 ? (
                <EmptyState
                    icon={FolderGit2}
                    title="No projects yet."
                    message="Create your first project."
                />
            ) : (
                <div className="stagger space-y-3">
                    {projects.map((project) =>
                        editingId === project.id ? (
                            <ProjectForm
                                key={project.id}
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
                                key={project.id}
                                className="data-row flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4"
                            >
                                <span className="icon-well hidden h-9 w-9 shrink-0 text-accent sm:inline-flex">
                                    <FolderGit2 size={16} strokeWidth={2.1} />
                                </span>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <h3 className="truncate font-display text-sm font-bold text-fg">
                                            {project.title}
                                        </h3>

                                        <Badge
                                            tone={DIFFICULTY_TONE[project.difficulty] || "neutral"}
                                        >
                                            {project.difficulty}
                                        </Badge>

                                        <Badge
                                            tone={project.status === "published" ? "gold" : "neutral"}
                                            dot
                                        >
                                            {project.status}
                                        </Badge>
                                    </div>

                                    <p className="mt-1.5 line-clamp-1 text-sm text-muted">
                                        {project.description ||
                                            "No description"}
                                    </p>

                                    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <span className="technical-label">
                                            {project.course?.title || "—"}
                                        </span>

                                        {project.deadline && (
                                            <>
                                                <span
                                                    aria-hidden="true"
                                                    className="text-subtle"
                                                >
                                                    ·
                                                </span>

                                                <span className="technical-label">
                                                    Deadline{" "}
                                                    {project.deadline.slice(
                                                        0,
                                                        10
                                                    )}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        type="button"
                                        onClick={() => startEdit(project)}
                                        title="Edit"
                                        aria-label="Edit"
                                    >
                                        <Pencil size={17} />
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        size="icon-sm"
                                        type="button"
                                        onClick={() => handleDelete(project)}
                                        title="Delete"
                                        aria-label="Delete"
                                    >
                                        <Trash2 size={17} />
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

export default Projects;
