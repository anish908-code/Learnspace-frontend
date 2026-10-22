import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, Clock, FileText } from "lucide-react";

import { fetchProjectDetail, clearCurrentProject, clearProjectError } from "../../features/student/projectSlice";
import { fetchSubmissions, submitProject, clearSubmissionError } from "../../features/student/submissionSlice";
import { formatDate } from "../../utils/date";
import { Skeleton, SkeletonLine } from "../../components/common/Skeleton";
import { PageHeader, AlertBanner } from "../../components/common";
import Button from "../../components/ui/Button";
import { Field, Input, Textarea } from "../../components/ui/Field";
import { SectionMarker } from "../../components/ui/Deco";

const ProjectDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { projectId } = useParams();

    const { currentProject: project, loading, error } = useSelector((state) => state.studentProjects);
    const { submissions, submitting, error: submissionError, validationErrors } = useSelector((state) => state.studentSubmissions);

    useEffect(() => {
        dispatch(fetchProjectDetail(projectId));
        dispatch(fetchSubmissions());
        return () => { dispatch(clearCurrentProject()); dispatch(clearProjectError()); dispatch(clearSubmissionError()); };
    }, [dispatch, projectId]);

    const mySubmissionsForProject = submissions.filter((s) => s.project_id === Number(projectId));
    const activeSubmission = mySubmissionsForProject.find((s) => ["pending", "under_review"].includes(s.status));
    const approvedSubmission = mySubmissionsForProject.find((s) => s.status === "approved");

    const [formData, setFormData] = useState({ github_link: "", live_demo: "", documentation: "", description: "" });

    if (loading && !project) {
        return (
            <div>
                <SkeletonLine className="mb-8 h-8 w-64" />

                <div className="card p-6 sm:p-7">
                    <SkeletonLine className="h-3 w-28" />
                    <SkeletonLine className="mt-4 h-7 w-1/2" />
                    <SkeletonLine className="mt-3 h-3 w-40" />
                    <div className="mt-5 space-y-2">
                        <SkeletonLine className="w-full" />
                        <SkeletonLine className="w-full" />
                        <SkeletonLine className="w-2/3" />
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <SkeletonLine className="h-6 w-24" />
                        <SkeletonLine className="h-6 w-24" />
                        <SkeletonLine className="h-6 w-24" />
                    </div>
                </div>

                <div className="card mt-6 p-6 sm:p-7">
                    <SkeletonLine className="h-4 w-40" />
                    <div className="mt-5 space-y-5">
                        {[1, 2].map((n) => (
                            <div key={n}>
                                <SkeletonLine className="h-3 w-28" />
                                <Skeleton className="mt-2 h-11 w-full rounded-md" />
                            </div>
                        ))}
                        <div>
                            <SkeletonLine className="h-3 w-24" />
                            <Skeleton className="mt-2 h-24 w-full rounded-md" />
                        </div>
                        <Skeleton className="h-10 w-36 rounded-md" />
                    </div>
                </div>
            </div>
        );
    }

    if (error && !project) {
        return (
            <div>
                <AlertBanner type="error" message={error} />

                <Button
                    type="button"
                    onClick={() => navigate("/student/projects")}
                    variant="ghost"
                    size="sm"
                    className="-ml-3"
                >
                    <ArrowLeft size={15} />
                    Back to Projects
                </Button>
            </div>
        );
    }

    if (!project) return null;

    const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = async (e) => { e.preventDefault(); await dispatch(submitProject({ project_id: project.id, ...formData })); };

    return (
        <div>
            <Button
                type="button"
                onClick={() => navigate("/student/projects")}
                variant="ghost"
                size="sm"
                className="-ml-3 mb-6"
            >
                <ArrowLeft size={15} />
                Back to Projects
            </Button>

            <PageHeader
                eyebrow="project brief"
                title={project.title}
                subtitle={`Course: ${project.course?.title || "-"}`}
            />

            <section className="surface-a rounded-2xl p-6 sm:p-7">
                <div className="flex items-center gap-2.5">
                    <span className="icon-well h-9 w-9 shrink-0">
                        <FileText size={17} strokeWidth={2.1} />
                    </span>
                    <span className="technical-label">Overview</span>
                </div>

                <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-muted">
                    {project.description || "No description."}
                </p>

                <div className="rule-line my-6" />

                <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { label: "Difficulty", value: project.difficulty || "-" },
                        { label: "Deadline", value: formatDate(project.deadline) },
                        { label: "Required Skills", value: project.required_skills || "-" },
                        { label: "Requirements", value: project.requirements || "-" },
                    ].map((field) => (
                        <div key={field.label} className="min-w-0">
                            <dt className="technical-label">{field.label}</dt>
                            <dd className="mt-1.5 break-words text-sm font-medium leading-relaxed text-fg">
                                {field.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>

            {approvedSubmission && (
                <AlertBanner
                    type="success"
                    className="mt-6"
                    message={
                        <>
                            Project Completed
                            <span className="mt-1 block text-[0.8125rem] font-normal opacity-85">
                                Your submission has been approved by the admin. This project is complete.
                            </span>
                        </>
                    }
                />
            )}

            {activeSubmission && !approvedSubmission && (
                <div className="surface-technical mt-6 flex items-start gap-3.5 rounded-2xl p-4 sm:p-5">
                    <span className="icon-well h-9 w-9 shrink-0 text-gold">
                        <Clock size={17} strokeWidth={2.1} />
                    </span>

                    <div className="min-w-0">
                        <p className="font-display text-sm font-bold text-fg">Under Review</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                            Your submission is currently{" "}
                            {activeSubmission.status.replace("_", " ")}. You cannot submit again
                            until a decision is made.
                        </p>
                    </div>
                </div>
            )}

            {!activeSubmission && !approvedSubmission && (
                <section className="card mt-8 p-6 sm:p-7">
                    <SectionMarker index={1}>Submission</SectionMarker>
                    <h2 className="mt-3 font-display text-xl font-bold text-fg">
                        Submit Your Work
                    </h2>

                    {(submissionError || error) && (
                        <AlertBanner
                            type="error"
                            className="mt-5"
                            message={submissionError || error}
                        />
                    )}

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        {[
                            { id: "github_link", label: "GitHub Link *", type: "url", required: true, placeholder: "https://github.com/username/repo" },
                            { id: "live_demo", label: "Live Demo Link", type: "url", placeholder: "https://your-demo-link.com" },
                        ].map((field) => (
                            <Field
                                key={field.id}
                                label={field.label}
                                htmlFor={field.id}
                                error={validationErrors?.[field.id] && validationErrors[field.id][0]}
                            >
                                <Input
                                    id={field.id}
                                    name={field.id}
                                    type={field.type}
                                    value={formData[field.id]}
                                    onChange={handleChange}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                    invalid={Boolean(validationErrors?.[field.id])}
                                />
                            </Field>
                        ))}

                        {[
                            { id: "documentation", label: "Documentation", rows: 3, placeholder: "Documentation link or notes..." },
                            { id: "description", label: "Description", rows: 4, placeholder: "Describe your project..." },
                        ].map((field) => (
                            <Field
                                key={field.id}
                                label={field.label}
                                htmlFor={field.id}
                                error={validationErrors?.[field.id] && validationErrors[field.id][0]}
                            >
                                <Textarea
                                    id={field.id}
                                    name={field.id}
                                    rows={field.rows}
                                    value={formData[field.id]}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className="resize-none"
                                    invalid={Boolean(validationErrors?.[field.id])}
                                />
                            </Field>
                        ))}

                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button type="submit" loading={submitting} loadingText="Submitting...">
                                Submit Project
                            </Button>
                        </div>
                    </form>
                </section>
            )}
        </div>
    );
};

export default ProjectDetail;
