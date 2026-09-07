import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchProjects, clearProjectError } from "../../features/student/projectSlice";
import { formatDate } from "../../utils/date";
import { SkeletonCardGrid } from "../../components/common/Skeleton";

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
                <div className="mb-6">
                    <h1 className="page-title">Projects</h1>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>Projects unlock when you complete a course and pass its final quiz.</p>
                </div>
                <SkeletonCardGrid count={6} />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="page-title">Projects</h1>
                <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>Projects unlock when you complete a course and pass its final quiz.</p>
            </div>

            {error && <div className="mb-5 rounded-md px-4 py-3 text-sm" style={{ background: "var(--error-bg)", color: "var(--error)" }}>{error}</div>}

            {projects.length === 0 ? (
                <div className="card p-8 text-center">
                    <p style={{ color: "var(--muted-foreground)" }}>No unlocked projects yet. Complete a course and pass its quiz to unlock projects.</p>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <div key={project.id} className="card flex flex-col p-5">
                            <span className="section-label text-[10px]">{project.course?.title || project.difficulty}</span>
                            <h2 className="mt-3 text-lg font-semibold" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)" }}>{project.title}</h2>
                            <p className="mt-2 flex-1 text-sm" style={{ color: "var(--muted-foreground)" }}>{project.description || "No description."}</p>
                            <div className="mt-4 space-y-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                                <p>Difficulty: {project.difficulty || "-"}</p>
                                <p>Deadline: {formatDate(project.deadline)}</p>
                            </div>
                            <Link to={`/student/projects/${project.id}`} className="btn-primary mt-5 w-full">View & Submit</Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Projects;
