import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { fetchProjectDetail, clearCurrentProject, clearProjectError } from "../../features/student/projectSlice";
import { fetchSubmissions, submitProject, clearSubmissionError } from "../../features/student/submissionSlice";
import { formatDate } from "../../utils/date";
import { Skeleton, SkeletonLine } from "../../components/common/Skeleton";

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
                <SkeletonLine className="mb-4 h-3 w-32" />
                <div className="card p-6">
                    <SkeletonLine className="h-6 w-1/2" />
                    <div className="mt-4 space-y-2"><SkeletonLine className="w-full" /><SkeletonLine className="w-full" /><SkeletonLine className="w-2/3" /></div>
                    <div className="mt-5 flex flex-wrap gap-3"><SkeletonLine className="h-6 w-24" /><SkeletonLine className="h-6 w-24" /><SkeletonLine className="h-6 w-24" /></div>
                </div>
                <div className="mt-5 card p-6">
                    <SkeletonLine className="h-4 w-40" />
                    <div className="mt-5 space-y-5">
                        {[1,2].map((n) => (<div key={n}><SkeletonLine className="h-3 w-28" /><Skeleton className="mt-2 h-11 w-full rounded-md" /></div>))}
                        <div><SkeletonLine className="h-3 w-24" /><Skeleton className="mt-2 h-24 w-full rounded-md" /></div>
                        <Skeleton className="h-10 w-36 rounded-md" />
                    </div>
                </div>
            </div>
        );
    }

    if (error && !project) {
        return (
            <div>
                <div className="rounded-md px-4 py-3 text-sm" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{error}</div>
                <button type="button" onClick={() => navigate("/student/projects")} className="mt-4 text-sm font-medium transition hover:underline" style={{ color: "var(--muted-foreground)" }}>&larr; Back to Projects</button>
            </div>
        );
    }

    if (!project) return null;

    const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = async (e) => { e.preventDefault(); await dispatch(submitProject({ project_id: project.id, ...formData })); };

    return (
        <div>
            <button type="button" onClick={() => navigate("/student/projects")} className="mb-4 text-sm font-medium transition hover:underline" style={{ color: "var(--muted-foreground)" }}>&larr; Back to Projects</button>

            <div className="card p-6">
                <h1 className="text-2xl" style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: "var(--foreground)" }}>{project.title}</h1>
                <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>Course: {project.course?.title || "-"}</p>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--foreground)", lineHeight: 1.75 }}>{project.description || "No description."}</p>

                <div className="mt-5 grid gap-4 border-t pt-4 sm:grid-cols-2 lg:grid-cols-4" style={{ borderColor: "var(--border)" }}>
                    {[
                        { label: "Difficulty", value: project.difficulty || "-" },
                        { label: "Deadline", value: formatDate(project.deadline) },
                        { label: "Required Skills", value: project.required_skills || "-" },
                        { label: "Requirements", value: project.requirements || "-" },
                    ].map((field) => (
                        <div key={field.label}>
                            <p className="section-label text-[10px]">{field.label}</p>
                            <p className="mt-1 text-sm font-medium" style={{ color: "var(--foreground)" }}>{field.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {approvedSubmission && (
                <div className="mt-5 flex items-start gap-3 rounded-md border px-4 py-3 text-sm" style={{ borderColor: "#C6F6D5", background: "var(--success-bg)", color: "var(--success)" }}>
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    <div>
                        <p className="font-medium">Project Completed</p>
                        <p className="mt-0.5 opacity-80">Your submission has been approved by the admin. This project is complete.</p>
                    </div>
                </div>
            )}

            {activeSubmission && !approvedSubmission && (
                <div className="mt-5 flex items-start gap-3 rounded-md border px-4 py-3 text-sm" style={{ borderColor: "#FEFCBF", background: "#FEFCE8", color: "#92400E" }}>
                    <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    <div>
                        <p className="font-medium">Under Review</p>
                        <p className="mt-0.5 opacity-80">Your submission is currently {activeSubmission.status.replace("_", " ")}. You cannot submit again until a decision is made.</p>
                    </div>
                </div>
            )}

            {!activeSubmission && !approvedSubmission && (
                <div className="mt-8 card p-6">
                    <h2 className="text-lg font-semibold" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)" }}>Submit Your Work</h2>
                    {(submissionError || error) && <div className="mb-5 mt-4 rounded-md px-4 py-3 text-sm" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{submissionError || error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {[
                            { id: "github_link", label: "GitHub Link *", type: "url", required: true, placeholder: "https://github.com/username/repo" },
                            { id: "live_demo", label: "Live Demo Link", type: "url", placeholder: "https://your-demo.vercel.app" },
                        ].map((field) => (
                            <div key={field.id}>
                                <label htmlFor={field.id} className="label-text">{field.label}</label>
                                <input id={field.id} name={field.id} type={field.type} value={formData[field.id]} onChange={handleChange} required={field.required} placeholder={field.placeholder} className="input-field" />
                                {validationErrors?.[field.id] && <p className="mt-1 text-sm" style={{ color: "var(--error)" }}>{validationErrors[field.id][0]}</p>}
                            </div>
                        ))}
                        {[
                            { id: "documentation", label: "Documentation", rows: 3, placeholder: "Documentation link or notes..." },
                            { id: "description", label: "Description", rows: 4, placeholder: "Describe your project..." },
                        ].map((field) => (
                            <div key={field.id}>
                                <label htmlFor={field.id} className="label-text">{field.label}</label>
                                <textarea id={field.id} name={field.id} rows={field.rows} value={formData[field.id]} onChange={handleChange} placeholder={field.placeholder} className="input-field resize-none" />
                            </div>
                        ))}
                        <button type="submit" disabled={submitting} className="btn-primary">{submitting ? "Submitting..." : "Submit Project"}</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProjectDetail;
