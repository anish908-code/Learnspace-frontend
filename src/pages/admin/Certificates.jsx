import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Award, Plus, X, Eye, EyeOff, Trash2 } from "lucide-react";

import {
    fetchAdminCertificates,
    issueCertificate,
    removeCertificate,
    clearAdminCertificateFeedback,
} from "../../features/admin/adminCertificateSlice";
import { fetchAdminStudents } from "../../features/admin/adminStudentSlice";
import { fetchAdminCourses } from "../../features/admin/adminCourseSlice";
import { formatDate } from "../../utils/date";
import { generateCertificateQr } from "../../utils/certificate";
import { PageHeader, EmptyState } from "../../components/common";
import { SkeletonList } from "../../components/common/Skeleton";
import CertificatePaper from "../../components/CertificatePaper";
import Button from "../../components/ui/Button";
import { Field, Select } from "../../components/ui/Field";
import { SectionMarker } from "../../components/ui/Deco";

const AdminCertificates = () => {
    const dispatch = useDispatch();

    const {
        certificates,
        loading,
        saving,
        deleting,
    } = useSelector((state) => state.adminCertificates);
    const studentsLoading = useSelector((state) => state.adminStudents?.loading);
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

    useEffect(() => {
        certificates.forEach((certificate) => {
            if (qrUrls[certificate.id]) return;
            generateCertificateQr(certificate)
                .then((url) => setQrUrls((current) => ({ ...current, [certificate.id]: url })))
                .catch(() => {});
        });
    }, [certificates, qrUrls]);

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
                    "Delete this certificate? The student will no longer see it."
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
                eyebrow="credential registry"
                title="Certificates"
                subtitle="Issue and manage course completion certificates."
                action={
                    <Button type="button" onClick={() => setShowModal(true)}>
                        <Plus size={16} />
                        Issue Certificate
                    </Button>
                }
            />

            <div className="mb-5">
                <SectionMarker index={1}>Issued certificates</SectionMarker>
            </div>

            {loading && certificates.length === 0 ? (
                <SkeletonList count={3} />
            ) : certificates.length === 0 ? (
                <EmptyState
                    icon={Award}
                    title="No certificates issued yet"
                    action={
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={() => setShowModal(true)}
                        >
                            <Plus size={16} /> Issue the first certificate
                        </Button>
                    }
                />
            ) : (
                <div className="stagger space-y-3">
                    {certificates.map((certificate) => {
                        const isOpen = expandedId === certificate.id;
                        return (
                            <div key={certificate.id} className="card overflow-hidden">
                                {/* Clickable header row */}
                                <div
                                    className={`flex w-full flex-wrap items-center justify-between gap-3 px-4 py-4 transition-colors duration-200 sm:px-5 ${
                                        isOpen
                                            ? "bg-surface-2/70"
                                            : "hover:bg-surface-2/50"
                                    }`}
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleExpand(certificate.id)}
                                        aria-expanded={isOpen}
                                        className="flex min-w-0 flex-1 items-center gap-3 text-left"
                                    >
                                        <span className="icon-well h-9 w-9 shrink-0 text-gold">
                                            <Award size={16} strokeWidth={2.1} />
                                        </span>

                                        <span className="min-w-0 text-sm">
                                            <span className="block truncate font-display text-sm font-bold text-fg">
                                                {certificate.student?.user?.name || `Student #${certificate.student_id}`}
                                            </span>

                                            <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted">
                                                <span className="truncate">
                                                    {certificate.course?.title || `Course #${certificate.course_id}`}
                                                </span>

                                                <span aria-hidden="true" className="text-subtle">
                                                    ·
                                                </span>

                                                <span className="numeric text-[0.6875rem] text-fg">
                                                    {certificate.certificate_number}
                                                </span>

                                                <span aria-hidden="true" className="text-subtle">
                                                    ·
                                                </span>

                                                <span className="numeric text-[0.6875rem] text-subtle">
                                                    {formatDate(certificate.issue_date)}
                                                </span>
                                            </span>
                                        </span>
                                    </button>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            type="button"
                                            onClick={() => toggleExpand(certificate.id)}
                                            aria-expanded={isOpen}
                                        >
                                            {isOpen ? <EyeOff size={16} /> : <Eye size={16} />}
                                            {isOpen ? "Hide" : "View"}
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            type="button"
                                            onClick={() => handleDelete(certificate.id)}
                                            disabled={deleting}
                                            loading={deleting}
                                            loadingText="Deleting…"
                                            title="Delete certificate"
                                        >
                                            <Trash2 size={15} />
                                            Delete
                                        </Button>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="border-t border-line bg-bg-2/40 p-4 sm:p-6">
                                        <div className="card-luxury p-3 sm:p-6">
                                            <CertificatePaper certificate={certificate} qrDataUrl={qrUrls[certificate.id]} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgb(4_5_8)]/55 p-4 sm:items-center"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Issue certificate"
                >
                    <div className="card my-auto w-full max-w-lg p-6">
                        <div className="mb-5 flex items-center justify-between gap-4 border-b border-line pb-4">
                            <div>
                                <span className="technical-label">Credential</span>
                                <h2 className="mt-1.5 font-display text-xl font-bold text-fg">
                                    Issue Certificate
                                </h2>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon-sm"
                                type="button"
                                onClick={() => setShowModal(false)}
                                aria-label="Close"
                            >
                                <X size={18} />
                            </Button>
                        </div>

                        <form onSubmit={handleGenerate} className="space-y-5">
                            <Field
                                label="Student"
                                required
                                error={submitted && !studentId ? "Please select a student." : undefined}
                            >
                                <Select
                                    value={studentId}
                                    onChange={(e) => setStudentId(e.target.value)}
                                    invalid={submitted && !studentId}
                                    required
                                >
                                    <option value="">Select student</option>
                                    {studentsLoading && students.length === 0 ? (
                                        <option value="" disabled>Loading students...</option>
                                    ) : (
                                        students.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.user?.name || `Student #${s.id}`}
                                            </option>
                                        ))
                                    )}
                                </Select>
                            </Field>

                            <Field
                                label="Course"
                                required
                                error={submitted && !courseId ? "Please select a course." : undefined}
                            >
                                <Select
                                    value={courseId}
                                    onChange={(e) => setCourseId(e.target.value)}
                                    invalid={submitted && !courseId}
                                    required
                                >
                                    <option value="">Select course</option>
                                    {courses.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.title || `Course #${c.id}`}
                                        </option>
                                    ))}
                                </Select>
                            </Field>

                            <div className="flex flex-wrap justify-end gap-2 pt-2">
                                <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    loading={saving}
                                    loadingText="Issuing…"
                                >
                                    <Award size={16} />
                                    Issue Certificate
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCertificates;
