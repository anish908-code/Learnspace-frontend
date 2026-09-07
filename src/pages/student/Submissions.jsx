import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchSubmissions, clearSubmissionError } from "../../features/student/submissionSlice";
import { formatDate } from "../../utils/date";
import { SkeletonList } from "../../components/common/Skeleton";

const statusStyles = {
    pending: { background: "#FEFCE8", color: "#92400E" },
    under_review: { background: "#EBF8FF", color: "#2B6CB0" },
    approved: { background: "var(--success-bg)", color: "var(--success)" },
    rejected: { background: "var(--error-bg)", color: "var(--error)" },
    changes_required: { background: "#FFF5F5", color: "#C53030" },
};

const Submissions = () => {
    const dispatch = useDispatch();
    const { submissions, loading, error } = useSelector((state) => state.studentSubmissions);

    useEffect(() => {
        dispatch(fetchSubmissions());
        return () => { dispatch(clearSubmissionError()); };
    }, [dispatch]);

    if (loading) {
        return (
            <div>
                <div className="mb-6"><h1 className="page-title">My Submissions</h1></div>
                <SkeletonList count={4} />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="page-title">My Submissions</h1>
                <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>Total {submissions.length} submission(s).</p>
            </div>

            {error && <div className="mb-5 rounded-md px-4 py-3 text-sm" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{error}</div>}

            {submissions.length === 0 ? (
                <div className="card p-8 text-center">
                    <p style={{ color: "var(--muted-foreground)" }}>No submissions yet.</p>
                    <Link to="/student/projects" className="btn-primary mt-4">Go to Projects</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {submissions.map((submission) => (
                        <div key={submission.id} className="card p-5 sm:p-6">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)" }}>
                                        {submission.project?.title || `Project #${submission.project_id}`}
                                    </h2>
                                    <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>Submitted on: {formatDate(submission.submitted_at)}</p>
                                </div>
                                <span className="rounded-md px-3 py-1 text-xs font-medium" style={statusStyles[submission.status] || { background: "var(--muted)", color: "var(--muted-foreground)" }}>
                                    {submission.status.replace("_", " ")}
                                </span>
                            </div>

                            <div className="mt-4 space-y-2 border-t pt-4 text-sm" style={{ borderColor: "var(--border)" }}>
                                <p className="flex items-center gap-1" style={{ color: "var(--foreground)" }}>
                                    <span className="shrink-0">GitHub:</span>
                                    <a href={submission.github_link} target="_blank" rel="noreferrer" className="min-w-0 truncate transition hover:underline" style={{ color: "var(--accent)" }}>{submission.github_link}</a>
                                </p>
                                {submission.live_demo && (
                                    <p className="flex items-center gap-1" style={{ color: "var(--foreground)" }}>
                                        <span className="shrink-0">Live Demo:</span>
                                        <a href={submission.live_demo} target="_blank" rel="noreferrer" className="min-w-0 truncate transition hover:underline" style={{ color: "var(--accent)" }}>{submission.live_demo}</a>
                                    </p>
                                )}
                                {submission.description && <p className="whitespace-pre-wrap" style={{ color: "var(--muted-foreground)" }}>{submission.description}</p>}
                            </div>

                            {submission.feedback && (
                                <div className="mt-4 rounded-md p-4" style={{ background: "var(--muted)" }}>
                                    <p className="section-label text-[10px]">Admin Feedback</p>
                                    <p className="mt-1 whitespace-pre-wrap text-sm" style={{ color: "var(--foreground)" }}>{submission.feedback}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Submissions;
