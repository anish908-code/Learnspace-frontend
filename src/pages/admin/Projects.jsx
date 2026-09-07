import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Plus, Pencil, Trash2 } from "lucide-react";

import {
    fetchAdminProjects,
    addProject,
    editProject,
    removeProject,
    clearAdminProjectFeedback,
} from "../../features/admin/adminProjectSlice";
import { fetchAdminCourses } from "../../features/admin/adminCourseSlice";
import { SkeletonList } from "../../components/common/Skeleton";

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

const ProjectForm = ({ form, setters, courses, onSubmit, onCancel, saving, submitLabel }) => (
    <form
        className="card space-y-4 border-l-4 border-l-accent p-6"
        onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
        }}
    >
        <div className="grid gap-4 sm:grid-cols-2">
            <div>
                <label className="label-text">Course *</label>

                <select
                    required
                    value={form.course_id}
                    onChange={(e) => setters.setField("course_id", e.target.value)}
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
                <label className="label-text">Title *</label>

                <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setters.setField("title", e.target.value)}
                    className="input-field"
                    placeholder="Project ka naam"
                />
            </div>

            <div className="sm:col-span-2">
                <label className="label-text">Description</label>

                <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                        setters.setField("description", e.target.value)
                    }
                    className="input-field"
                />
            </div>

            <div>
                <label className="label-text">Required Skills</label>

                <input
                    type="text"
                    value={form.required_skills}
                    onChange={(e) =>
                        setters.setField("required_skills", e.target.value)
                    }
                    className="input-field"
                    placeholder="React, Laravel"
                />
            </div>

            <div>
                <label className="label-text">Difficulty</label>

                <select
                    value={form.difficulty}
                    onChange={(e) =>
                        setters.setField("difficulty", e.target.value)
                    }
                    className="input-field"
                >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                </select>
            </div>

            <div>
                <label className="label-text">Deadline</label>

                <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) =>
                        setters.setField("deadline", e.target.value)
                    }
                    className="input-field"
                />
            </div>

            <div>
                <label className="label-text">Status</label>

                <select
                    value={form.status}
                    onChange={(e) => setters.setField("status", e.target.value)}
                    className="input-field"
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>
            </div>

            <div className="sm:col-span-2">
                <label className="label-text">Requirements</label>

                <textarea
                    rows={2}
                    value={form.requirements}
                    onChange={(e) =>
                        setters.setField("requirements", e.target.value)
                    }
                    className="input-field"
                    placeholder="What needs to be delivered"
                />
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
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="page-title">Projects</h1>

                    <p className="-mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Manage all projects ({projects.length}).
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
                        Add Project
                    </button>
                )}
            </div>

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

            {/* Project list */}
            {loading && projects.length === 0 ? (
                <SkeletonList count={3} />
            ) : projects.length === 0 ? (
                <div className="card px-6 py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                    No projects yet. Create your first project.
                </div>
            ) : (
                <div className="space-y-4">
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
                                className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="font-semibold" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: "var(--foreground)" }}>
                                            {project.title}
                                        </h3>

                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                                                project.status === "published"
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-muted text-muted-foreground"
                                            }`}
                                        >
                                            {project.status}
                                        </span>
                                    </div>

                                    <p className="mt-1 line-clamp-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                                        {project.description ||
                                            "No description"}
                                    </p>

                                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                                        <span>
                                            {project.course?.title || "—"}
                                        </span>
                                        <span>•</span>
                                        <span>{project.difficulty}</span>
                                        {project.deadline && (
                                            <>
                                                <span>•</span>
                                                <span>
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
                                    <button
                                        type="button"
                                        onClick={() => startEdit(project)}
                                        title="Edit"
                                        className="rounded-lg p-2.5 transition hover:bg-accent-muted"
                                        style={{ color: "var(--muted-foreground)" }}
                                    >
                                        <Pencil size={17} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleDelete(project)}
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

export default Projects;
