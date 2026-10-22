import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ClipboardCheck, Inbox } from "lucide-react";

import {
    fetchAdminSubmissions,
    submitReview,
    clearAdminSubmissionFeedback,
} from "../../features/admin/adminSubmissionSlice";
import { formatDate } from "../../utils/date";
import { SkeletonList } from "../../components/common/Skeleton";
import { PageHeader, EmptyState } from "../../components/common";
import Button from "../../components/ui/Button";
import Badge, { StatusLabel } from "../../components/ui/Badge";
import { Field, Select, Textarea } from "../../components/ui/Field";
import { SectionMarker } from "../../components/ui/Deco";

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

/* Review state ka ek hi accent — pending/under review quiet, approve teal,
   reject/changes danger, graded accent. */
const statusTone = {
    pending: "neutral",
    under_review: "neutral",
    approved: "teal",
    rejected: "danger",
    changes_required: "danger",
    graded: "accent",
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

    // Server data change hone par local form reset karne ke liye effect ki
    // jagah `key` use hota hai (parent me) — isse cascading render nahi hota
    // aur component ka initial state hamesha props se match karta hai.

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
            className="card-hover spotlight cursor-pointer select-none p-5 sm:p-6"
            onClick={() => setOpen((prev) => !prev)}
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="icon-well h-9 w-9 shrink-0 text-accent">
                            <ClipboardCheck size={16} strokeWidth={2.1} />
                        </span>

                        <h3 className="font-display text-base font-bold text-fg">
                            {submission.project?.title || "-"}
                        </h3>

                        <StatusLabel>
                            {submission.status.replace("_", " ")}
                        </StatusLabel>

                        <Badge
                            tone={statusTone[submission.status] || "neutral"}
                            dot
                        >
                            {submission.status.replace("_", " ")}
                        </Badge>
                    </div>

                    <p className="mt-2 text-sm text-muted">
                        {submission.student?.user?.name || "-"} ·{" "}
                        {submission.student?.college || "—"}
                    </p>

                    <div className="mt-3 space-y-2">
                        {submission.github_link && (
                            <a
                                href={submission.github_link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-accent-bright"
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
                                className="flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-accent-bright"
                            >
                                <span className="shrink-0 text-muted">Live Demo:</span>
                                <span className="break-all">{submission.live_demo}</span>
                            </a>
                        )}

                        {submission.documentation && (
                            <div className="text-xs text-muted">
                                <span className="font-semibold text-fg">
                                    Documentation:
                                </span>
                                <p className="mt-0.5 whitespace-pre-wrap break-words">
                                    {submission.documentation}
                                </p>
                            </div>
                        )}

                        {submission.description && (
                            <div className="text-xs text-muted">
                                <span className="font-semibold text-fg">
                                    Description:
                                </span>
                                <p className="mt-0.5 whitespace-pre-wrap break-words">
                                    {submission.description}
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="mt-3 flex flex-wrap items-center gap-x-2 text-[0.6875rem] text-subtle">
                        <span className="numeric">
                            Submitted {formatDate(submission.created_at)}
                            {submission.reviewed_at &&
                                ` · Reviewed ${formatDate(
                                    submission.reviewed_at
                                )}`}
                        </span>
                    </p>

                    {submission.feedback && !open && (
                        <p className="mt-3 rounded-xl border border-line bg-surface-2/70 px-3.5 py-2.5 text-sm text-fg">
                            <span className="font-semibold">Feedback:</span>{" "}
                            {submission.feedback}
                        </p>
                    )}
                </div>

                <Button
                    variant="secondary"
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpen((prev) => !prev);
                    }}
                    aria-expanded={open}
                    className="shrink-0"
                >
                    <ClipboardCheck size={15} />
                    {open
                        ? "Close"
                        : submission.status.replace("_", " ").charAt(0).toUpperCase() +
                          submission.status.replace("_", " ").slice(1)}
                </Button>
            </div>

            {/* Review form */}
            {open && (
                <div
                    className="mt-5 border-t border-line pt-5"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="surface-technical rounded-2xl p-5">
                        <Field label="Status">
                            <Select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="capitalize"
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
                            </Select>
                        </Field>

                        <Field
                            label="Feedback"
                            className="mt-5"
                        >
                            <Textarea
                                rows={3}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Feedback for the student (optional)"
                            />
                        </Field>

                        <Button
                            type="button"
                            onClick={handleReview}
                            disabled={saving}
                            loading={saving}
                            loadingText="Saving…"
                            className="mt-5"
                        >
                            Save Review
                        </Button>
                    </div>
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
            <PageHeader
                eyebrow="review desk"
                title="Submissions"
                subtitle={`Review student project submissions (${submissions.length} total).`}
            />

            {/* Filter tabs */}
            <div className="mb-6">
                <SectionMarker index={1}>Review queue</SectionMarker>

                <div className="mt-4 flex flex-wrap gap-2">
                    {filterTabs.map((tab) => (
                        <Button
                            key={tab.key}
                            variant={filter === tab.key ? "primary" : "outline"}
                            size="sm"
                            type="button"
                            onClick={() => setFilter(tab.key)}
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* List */}
            {loading && submissions.length === 0 ? (
                <SkeletonList count={4} />
            ) : visible.length === 0 ? (
                <EmptyState
                    icon={Inbox}
                    title="No submissions match this filter."
                />
            ) : (
                <div className="stagger space-y-4">
                    {visible.map((submission) => (
                        <ReviewCard
                            key={`${submission.id}-${submission.status}-${submission.feedback || ""}`}
                            submission={submission}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Submissions;
