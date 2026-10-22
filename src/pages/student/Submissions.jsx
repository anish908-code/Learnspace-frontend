import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CalendarDays, FolderGit2, Link2, MessageSquareQuote } from "lucide-react";

import { fetchSubmissions, clearSubmissionError } from "../../features/student/submissionSlice";
import { formatDate } from "../../utils/date";
import { SkeletonList } from "../../components/common/Skeleton";
import { PageHeader, AlertBanner, EmptyState } from "../../components/common";
import { ButtonLink } from "../../components/ui/Button";
import Badge, { StatusLabel } from "../../components/ui/Badge";

/* Status → badge tone. Sirf presentation map hai — label text wahi rehta
   hai jo backend status se render hota tha. */
const STATUS_TONES = {
    pending: "neutral",
    under_review: "neutral",
    approved: "teal",
    rejected: "danger",
    changes_required: "danger",
    graded: "accent",
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
                <PageHeader eyebrow="submission log" title="My Submissions" />

                <SkeletonList count={4} />
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                eyebrow="submission log"
                title="My Submissions"
                subtitle={`Total ${submissions.length} submission(s).`}
            />

            {error && <AlertBanner type="error" message={error} />}

            {submissions.length === 0 ? (
                <EmptyState
                    icon={FolderGit2}
                    title="No submissions yet."
                    action={<ButtonLink to="/student/projects">Go to Projects</ButtonLink>}
                />
            ) : (
                <div className="space-y-4">
                    {submissions.map((submission) => (
                        <article
                            key={submission.id}
                            className="card p-5 sm:p-6"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
                                <div className="min-w-0">
                                    <StatusLabel status={submission.status}>
                                        {submission.status.replace("_", " ")}
                                    </StatusLabel>

                                    <h2 className="mt-2.5 break-words font-display text-lg font-bold text-fg">
                                        {submission.project?.title || `Project #${submission.project_id}`}
                                    </h2>

                                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                                        <CalendarDays
                                            size={14}
                                            strokeWidth={2}
                                            aria-hidden="true"
                                            className="shrink-0 text-subtle"
                                        />
                                        Submitted on: {formatDate(submission.submitted_at)}
                                    </p>
                                </div>

                                <Badge
                                    tone={STATUS_TONES[submission.status] || "neutral"}
                                    dot
                                    className="shrink-0 capitalize"
                                >
                                    {submission.status.replace("_", " ")}
                                </Badge>
                            </div>

                            <div className="mt-4 space-y-2 border-t border-line pt-4 text-sm text-fg">
                                <p className="flex items-center gap-1.5">
                                    <span className="shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-subtle">
                                        GitHub:
                                    </span>
                                    <a
                                        href={submission.github_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex min-w-0 items-center gap-1.5 truncate font-medium text-accent transition-colors hover:text-accent-bright hover:underline"
                                    >
                                        <Link2 size={13} strokeWidth={2.2} aria-hidden="true" className="shrink-0" />
                                        <span className="truncate">{submission.github_link}</span>
                                    </a>
                                </p>

                                {submission.live_demo && (
                                    <p className="flex items-center gap-1.5">
                                        <span className="shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-subtle">
                                            Live Demo:
                                        </span>
                                        <a
                                            href={submission.live_demo}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex min-w-0 items-center gap-1.5 truncate font-medium text-accent transition-colors hover:text-accent-bright hover:underline"
                                        >
                                            <Link2 size={13} strokeWidth={2.2} aria-hidden="true" className="shrink-0" />
                                            <span className="truncate">{submission.live_demo}</span>
                                        </a>
                                    </p>
                                )}

                                {submission.description && (
                                    <p className="whitespace-pre-wrap leading-relaxed text-muted">
                                        {submission.description}
                                    </p>
                                )}
                            </div>

                            {submission.feedback && (
                                <div className="surface-technical relative mt-4 overflow-hidden rounded-2xl p-4 sm:p-5">
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent"
                                    />

                                    <div className="flex items-center gap-2.5">
                                        <span className="icon-well h-8 w-8 shrink-0 text-gold">
                                            <MessageSquareQuote size={15} strokeWidth={2.1} />
                                        </span>
                                        <span className="technical-label">Admin Feedback</span>
                                    </div>

                                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-fg">
                                        {submission.feedback}
                                    </p>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Submissions;
