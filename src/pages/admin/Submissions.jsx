import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ClipboardCheck } from "lucide-react";

import {
    fetchAdminSubmissions,
    submitReview,
    clearAdminSubmissionFeedback,
} from "../../features/admin/adminSubmissionSlice";
import { formatDate } from "../../utils/date";
import { SkeletonList } from "../../components/common/Skeleton";

const filterTabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "rejected", label: "Rejected" },
    { key: "approved", label: "Approved" },
];

const reviewStatusOptions = [
    "pending",
    "approved",
    "rejected",
];

const statusBadge = {
    pending: "bg-muted text-muted",
    under_review: "bg-amber-100 text-amber-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-red-100 text-red-700",
    changes_required: "bg-orange-100 text-orange-700",
};

/*
 * Har submission ka apna review form state — ek card pe
 * likha hua doosre ko affect na kare.
 */
const ReviewCard = ({ submission }) => {
    const dispatch = useDispatch();

    const { saving } = useSelector((state) => state.adminSubmissions);

    const [status, setStatus] = useState(submission.status);
    const [feedback, setFeedback] = useState(submission.feedback || "");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setStatus(submission.status);
        setFeedback(submission.feedback || "");
    }, [submission.status, submission.feedback]);

    const handleReview = () => {
        dispatch(
            submitReview({
                id: submission.id,
                data: { status, feedback: feedback || null },
            })
        ).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                setOpen(false);
            }
        });
    };

    return (
        <div
            className="card cursor-pointer select-none p-5"
            style={{ transition: "box-shadow 0.2s" }}
            onClick={() => setOpen((prev) => !prev)}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold" style={{ color: "var(--foreground)" }}>
                            {submission.project?.title || "-"}
                        </h3>

                        <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                                statusBadge[submission.status] ||
                                "bg-muted text-muted"
                            }`}
                        >
                            {submission.status.replace("_", " ")}
                        </span>
                    </div>

                    <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                        {submission.student?.user?.name || "-"} ·{" "}
                        {submission.student?.college || "—"}
                    </p>

                    <div className="mt-2 space-y-1.5">
                        {submission.github_link && (
                            <a
                                href={submission.github_link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-xs font-medium transition hover:opacity-80"
                                style={{ color: "var(--accent)" }}
                            >
                                <span className="shrink-0 text-muted">GitHub:</span>
                                <span className="break-all">{submission.github_link}</span>
                            </a>
                        )}

                        {submission.live_demo && (
                            <a
                                href={submission.live_demo}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-xs font-medium transition hover:opacity-80"
                                style={{ color: "var(--accent)" }}
                            >
                                <span className="shrink-0 text-muted">Live Demo:</span>
                                <span className="break-all">{submission.live_demo}</span>
                            </a>
                        )}

                        {submission.documentation && (
                            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                <span className="font-medium" style={{ color: "var(--foreground)" }}>Documentation:</span>
                                <p className="mt-0.5 whitespace-pre-wrap break-words">{submission.documentation}</p>
                            </div>
                        )}

                        {submission.description && (
                            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                                <span className="font-medium" style={{ color: "var(--foreground)" }}>Description:</span>
                                <p className="mt-0.5 whitespace-pre-wrap break-words">{submission.description}</p>
                            </div>
                        )}
                    </div>

                    <p className="mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                        Submitted {formatDate(submission.created_at)}
                        {submission.reviewed_at &&
                            ` · Reviewed ${formatDate(
                                submission.reviewed_at
                            )}`}
                    </p>

                    {submission.feedback && !open && (
                        <p className="mt-2 rounded-lg bg-muted px-3 py-2 text-sm ring-1 ring-inset ring-warm-border" style={{ color: "var(--foreground)" }}>
                            <span className="font-medium">Feedback:</span>{" "}
                            {submission.feedback}
                        </p>
                    )}
                </div>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen((prev) => !prev);
                    }}
                    className="btn-secondary shrink-0"
                >
                    <ClipboardCheck size={15} />
                    {open
                        ? "Close"
                        : submission.status.replace("_", " ").charAt(0).toUpperCase() +
                          submission.status.replace("_", " ").slice(1)}
                </button>
            </div>

            {/* Review form */}
            {open && (
                <div
                    className="mt-4 space-y-4 border-t border-warm-border pt-4"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div>
                        <label className="label-text">Status</label>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="input-field capitalize"
                        >
                            {reviewStatusOptions.map((option) => (
                                <option
                                    key={option}
                                    value={option}
                                    className="capitalize"
                                >
                                    {option.replace("_", " ")}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="label-text">Feedback</label>

                        <textarea
                            rows={3}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            className="input-field"
                            placeholder="Feedback for the student (optional)"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleReview}
                        disabled={saving}
                        className="btn-primary"
                    >
                        {saving ? "Saving..." : "Save Review"}
                    </button>
                </div>
            )}
        </div>
    );
};

const Submissions = () => {
    const dispatch = useDispatch();

    const {
        submissions,
        loading,
    } = useSelector((state) => state.adminSubmissions);

    const [filter, setFilter] = useState("all");

    useEffect(() => {
        dispatch(fetchAdminSubmissions());
    }, [dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearAdminSubmissionFeedback());
        };
    }, [dispatch]);

    const visible =
        filter === "all"
            ? submissions
            : submissions.filter(
                  (submission) => submission.status === filter
              );

    return (
        <div>
            <h1 className="page-title">Submissions</h1>

            <p className="-mt-1 mb-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
                Review student project submissions ({submissions.length}{" "}
                total).
            </p>

            {/* Filter tabs */}
            <div className="mb-6 flex flex-wrap gap-2">
                {filterTabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setFilter(tab.key)}
                        className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                            filter === tab.key
                                ? "btn-primary"
                                : "card ring-1 ring-inset ring-warm-border hover:bg-muted"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading && submissions.length === 0 ? (
                <SkeletonList count={4} />
            ) : visible.length === 0 ? (
                <div className="card px-6 py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                    No submissions match this filter.
                </div>
            ) : (
                <div className="space-y-4">
                    {visible.map((submission) => (
                        <ReviewCard key={submission.id} submission={submission} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Submissions;
