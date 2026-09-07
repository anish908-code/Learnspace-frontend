import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAdminStudents } from "../../features/admin/adminStudentSlice";
import { formatDate } from "../../utils/date";
import { SkeletonTableRows } from "../../components/common/Skeleton";

const Students = () => {
    const dispatch = useDispatch();

    const { students, loading, error } = useSelector(
        (state) => state.adminStudents
    );

    useEffect(() => {
        dispatch(fetchAdminStudents());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="page-title">Students</h1>

                <SkeletonTableRows count={5} />
            </div>
        );
    }

    if (error) {
        return (
            <>
                <h1 className="page-title">Students</h1>

                <div className="card border-l-4 border-l-red-500 p-6 text-sm text-red-600">
                    {error}
                </div>
            </>
        );
    }

    return (
        <div>
            <h1 className="page-title">Students</h1>

            <p className="-mt-1 mb-6 text-sm" style={{ color: "var(--muted-foreground)" }}>
                Registered students full list ({students.length}).
            </p>

            <div className="card overflow-hidden p-0">
                {students.length === 0 ? (
                    <p className="px-6 py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
                        No students registered yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-warm-border bg-muted text-xs uppercase tracking-wide" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: "0.75rem", letterSpacing: "0.15em", color: "var(--muted-foreground)" }}>
                                <tr>
                                    <th className="px-6 py-4 font-medium">
                                        Student
                                    </th>

                                    <th className="px-6 py-4 font-medium">
                                        College
                                    </th>

                                    <th className="hidden px-6 py-4 font-medium md:table-cell">
                                        Course / Semester
                                    </th>

                                    <th className="hidden px-6 py-4 font-medium lg:table-cell">
                                        Joined
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-warm-border">
                                {students.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="transition hover:bg-muted"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {student.user
                                                    ?.profile_image ? (
                                                    <img
                                                        src={
                                                            student.user
                                                                .profile_image
                                                        }
                                                        alt=""
                                                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <span
                                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-muted text-sm font-semibold"
                                                        style={{ color: "var(--accent)" }}
                                                    >
                                                        {(
                                                            student.user
                                                                ?.name || "?"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </span>
                                                )}

                                                <div className="min-w-0">
                                                    <p className="truncate font-medium" style={{ color: "var(--foreground)" }}>
                                                        {student.user?.name ||
                                                            "-"}
                                                    </p>

                                                    <p className="truncate text-xs" style={{ color: "var(--muted-foreground)" }}>
                                                        {student.user?.email ||
                                                            "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4" style={{ color: "var(--muted-foreground)" }}>
                                            {student.college || "—"}
                                        </td>

                                        <td className="hidden px-6 py-4 md:table-cell" style={{ color: "var(--muted-foreground)" }}>
                                            {student.course || "—"}
                                            {student.semester
                                                ? ` · Sem ${student.semester}`
                                                : ""}
                                        </td>

                                        <td className="hidden px-6 py-4 lg:table-cell" style={{ color: "var(--muted-foreground)" }}>
                                            {formatDate(student.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Students;
