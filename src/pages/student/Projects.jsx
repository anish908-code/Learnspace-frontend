import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ArrowRight, CalendarClock, FolderGit2 } from "lucide-react";

import { fetchProjects, clearProjectError } from "../../features/student/projectSlice";
import { formatDate } from "../../utils/date";
import { SkeletonCardGrid } from "../../components/common/Skeleton";
import { PageHeader, AlertBanner, EmptyState } from "../../components/common";
import { ButtonLink } from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const Projects = () => {
    const dispatch = useDispatch();
    const { projects, loading, error } = useSelector((state) => state.studentProjects);

    useEffect(() => {
        dispatch(fetchProjects());
        return () => { dispatch(clearProjectError()); };
    }, [dispatch]);

    if (loading) {
        return (
            <div>
                <PageHeader
                    eyebrow="project board"
                    title="Projects"
                    subtitle="Projects unlock when you complete a course and pass its final quiz."
                />

                <SkeletonCardGrid count={6} />
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                eyebrow="project board"
                title="Projects"
                subtitle="Projects unlock when you complete a course and pass its final quiz."
            />

            {error && <AlertBanner type="error" message={error} />}

            {projects.length === 0 ? (
                <EmptyState
                    icon={FolderGit2}
                    title="No unlocked projects yet"
                    message="Complete a course and pass its quiz to unlock projects."
                />
            ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <article
                            key={project.id}
                            className="card-hover spotlight group flex h-full flex-col p-5 sm:p-6"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <span className="icon-well h-11 w-11 shrink-0">
                                    <FolderGit2 size={19} strokeWidth={2} />
                                </span>

                                <Badge tone="neutral" className="shrink-0">
                                    {project.difficulty || "-"}
                                </Badge>
                            </div>

                            <span className="technical-label mt-5 line-clamp-1 min-w-0">
                                {project.course?.title || project.difficulty}
                            </span>

                            <h2 className="mt-2 line-clamp-2 font-display text-base font-bold text-fg">
                                {project.title}
                            </h2>

                            <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
                                {project.description || "No description."}
                            </p>

                            <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4">
                                <div className="min-w-0">
                                    <dt className="technical-label">Difficulty</dt>
                                    <dd className="mt-1.5 break-words text-sm font-medium text-fg">
                                        {project.difficulty || "-"}
                                    </dd>
                                </div>

                                <div className="min-w-0">
                                    <dt className="technical-label">Deadline</dt>
                                    <dd className="mt-1.5 flex items-center gap-1.5 text-sm font-medium text-fg">
                                        <CalendarClock
                                            size={14}
                                            strokeWidth={2}
                                            aria-hidden="true"
                                            className="shrink-0 text-subtle"
                                        />
                                        <span className="min-w-0 break-words">
                                            {formatDate(project.deadline)}
                                        </span>
                                    </dd>
                                </div>
                            </dl>

                            <div className="mt-5">
                                <ButtonLink to={`/student/projects/${project.id}`} fullWidth>
                                    View &amp; Submit
                                    <ArrowRight size={15} />
                                </ButtonLink>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Projects;
