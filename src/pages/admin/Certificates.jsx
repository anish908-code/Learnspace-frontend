import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Award, Plus, Loader2, X, Eye, EyeOff, Trash2 } from "lucide-react";

import {
    fetchAdminCertificates,
    issueCertificate,
    removeCertificate,
    clearAdminCertificateFeedback,
} from "../../features/admin/adminCertificateSlice";
import { fetchAdminStudents } from "../../features/admin/adminStudentSlice";
import { fetchAdminCourses } from "../../features/admin/adminCourseSlice";
import { generateQrDataUrl } from "../../utils/certificate";
import { formatDate } from "../../utils/date";
import { PageHeader } from "../../components/common";
import CertificatePaper from "../../components/CertificatePaper";

const AdminCertificates = () => {
    const dispatch = useDispatch();

    const {
        certificates,
        loading,
        saving,
        deleting,
    } = useSelector((state) => state.adminCertificates);
    const students = useSelector((state) => state.adminStudents?.students || []);
    const courses = useSelector((state) => state.adminCourses?.courses || []);

    const [showModal, setShowModal] = useState(false);
    const [studentId, setStudentId] = useState("");
    const [courseId, setCourseId] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [qrUrls, setQrUrls] = useState({});

    useEffect(() => {
        dispatch(fetchAdminCertificates());
        dispatch(fetchAdminStudents());
        dispatch(fetchAdminCourses());
        return () => {
            dispatch(clearAdminCertificateFeedback());
        };
    }, [dispatch]);

    const loadQr = useCallback(async (cert) => {
        if (qrUrls[cert.id]) return;
        try {
            const url = await generateQrDataUrl(
                cert?.verification_url ||
                    `${window.location.origin}/certificates/verify/${cert.certificate_code || ""}`
            );
            setQrUrls((prev) => ({ ...prev, [cert.id]: url }));
        } catch {
            /* ignore */
        }
    }, [qrUrls]);

    useEffect(() => {
        certificates.forEach((cert) => loadQr(cert));
    }, [certificates, loadQr]);

    const toggleExpand = useCallback(
        (id) => {
            setExpandedId((prev) => (prev === id ? null : id));
        },
        []
    );

    const handleGenerate = useCallback(
        async (e) => {
            e.preventDefault();
            setSubmitted(true);
            if (!studentId || !courseId) return;
            const result = await dispatch(
                issueCertificate({ student_id: Number(studentId), course_id: Number(courseId) })
            );
            if (result.meta.requestStatus === "fulfilled") {
                setShowModal(false);
                setStudentId("");
                setCourseId("");
                setSubmitted(false);
            }
        },
        [dispatch, studentId, courseId]
    );

    const handleDelete = useCallback(
        async (id) => {
            if (
                !window.confirm(
                    "Delete this certificate? The student will no longer see it and the verification link will stop working."
                )
            ) {
                return;
            }
            await dispatch(removeCertificate(id));
        },
        [dispatch]
    );

    return (
        <div>
            <PageHeader
                title="Certificates"
                subtitle="Issue and manage course completion certificates."
                action={
                    <button type="button" onClick={() => setShowModal(true)} className="btn-primary">
                        <Plus size={16} />
                        Issue Certificate
                    </button>
                }
            />

            {loading && certificates.length === 0 ? (
                <div className="space-y-3">
                    {Array.from({ length: 3 }, (_, i) => (
                        <div key={i} className="card overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-4">
                                <div className="flex-1 space-y-2">
                                    <div className="skeleton h-3.5 w-48 rounded-full" />
                                    <div className="skeleton h-3 w-32 rounded-full" />
                                </div>
                                <div className="skeleton h-8 w-36 shrink-0 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : certificates.length === 0 ? (
                <div className="card p-12 text-center">
                    <Award size={32} className="mx-auto" style={{ color: "var(--border)" }} />
                    <p className="mt-3 font-semibold" style={{ color: "var(--foreground)" }}>
                        No certificates issued yet
                    </p>
                    <button type="button" onClick={() => setShowModal(true)} className="btn-secondary mt-4">
                        <Plus size={16} /> Issue the first certificate
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {certificates.map((certificate) => {
                        const isOpen = expandedId === certificate.id;
                        return (
                            <div key={certificate.id} className="card overflow-hidden">
                                {/* Clickable header row */}
                                <div className="flex w-full items-center justify-between gap-3 px-5 py-4 transition hover:bg-black/5" style={{ background: isOpen ? "var(--muted)" : undefined }}>
                                    <button
                                        type="button"
                                        onClick={() => toggleExpand(certificate.id)}
                                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                                    >
                                        <div className="min-w-0 text-sm" style={{ color: "var(--muted-foreground)" }}>
                                            <span className="font-semibold" style={{ color: "var(--foreground)" }}>
                                                {certificate.student?.user?.name || `Student #${certificate.student_id}`}
                                            </span>
                                            <span className="mx-2">·</span>
                                            {certificate.course?.title || `Course #${certificate.course_id}`}
                                            <span className="mx-2">·</span>
                                            <span className="font-mono text-xs">{certificate.certificate_code}</span>
                                            <span className="mx-2">·</span>
                                            {formatDate(certificate.issue_date)}
                                        </div>
                                    </button>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => toggleExpand(certificate.id)}
                                            className="flex items-center gap-1.5 text-sm font-medium transition hover:opacity-70"
                                            style={{ color: "var(--accent)" }}
                                        >
                                            {isOpen ? <EyeOff size={16} /> : <Eye size={16} />}
                                            {isOpen ? "Hide" : "View"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(certificate.id)}
                                            disabled={deleting}
                                            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium transition hover:opacity-70"
                                            style={{ color: "var(--error)", background: "rgba(220,38,38,0.08)" }}
                                            title="Delete certificate"
                                        >
                                            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="border-t p-4 sm:p-6" style={{ borderColor: "var(--border)" }}>
                                        <CertificatePaper certificate={certificate} qrDataUrl={qrUrls[certificate.id]} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
                    <div className="card w-full max-w-lg p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
                                Issue Certificate
                            </h2>
                            <button type="button" onClick={() => setShowModal(false)} className="rounded p-1 hover:bg-black/5">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleGenerate} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Student</label>
                                <select value={studentId} onChange={(e) => setStudentId(e.target.value)} className="input w-full" required>
                                    <option value="">Select student</option>
                                    {students.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.user?.name || `Student #${s.id}`}
                                        </option>
                                    ))}
                                </select>
                                {submitted && !studentId && (
                                    <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>Please select a student.</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Course</label>
                                <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="input w-full" required>
                                    <option value="">Select course</option>
                                    {courses.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.title || `Course #${c.id}`}
                                        </option>
                                    ))}
                                </select>
                                {submitted && !courseId && (
                                    <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>Please select a course.</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="btn-primary">
                                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Award size={16} />}
                                    {saving ? "Issuing..." : "Issue Certificate"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCertificates;
