import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Award, Download, ExternalLink, Loader2, BookOpen, Hash, Medal } from "lucide-react";

import {
    fetchCertificates,
    clearCertificateError,
} from "../../features/student/certificateSlice";
import { getCertificateDetail } from "../../api/studentApi";
import { generateQrDataUrl, downloadCertificatePdf } from "../../utils/certificate";
import { formatDate } from "../../utils/date";
import { PageHeader, AlertBanner } from "../../components/common";
import CertificatePaper from "../../components/CertificatePaper";

const Certificates = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { certificates, loading, error } = useSelector(
        (state) => state.studentCertificates
    );
    const { user } = useSelector((state) => state.auth);

    const [downloadingId, setDownloadingId] = useState(null);
    const [qrUrls, setQrUrls] = useState({});
    const [activeCert, setActiveCert] = useState(null);
    const hiddenRef = useRef(null);

    useEffect(() => {
        dispatch(fetchCertificates());
        return () => {
            dispatch(clearCertificateError());
        };
    }, [dispatch]);

    // Load QR only for certificate detail views (used on hidden paper for PDF)
    const loadQr = useCallback(async (cert) => {
        if (qrUrls[cert.id]) return;
        try {
            const url = await generateQrDataUrl(
                cert?.verification_url ||
                    `${window.location.origin}/certificates/verify/${cert.certificate_code || ""}`
            );
            setQrUrls((prev) => ({ ...prev, [cert.id]: url }));
        } catch {
            /* ignore QR errors */
        }
    }, [qrUrls]);

    useEffect(() => {
        certificates.forEach((cert) => loadQr(cert));
    }, [certificates, loadQr]);

    const handleDownloadPdf = useCallback(
        async (certId) => {
            try {
                const response = await getCertificateDetail(certId);
                const cert = response.data?.certificate;
                if (!cert) throw new Error("Certificate not found");

                const studentName = cert?.student?.user?.name || user?.name || "Student";
                setDownloadingId(certId);
                setActiveCert(cert);

                if (!qrUrls[certId]) {
                    const url = await generateQrDataUrl(
                        cert?.verification_url ||
                            `${window.location.origin}/certificates/verify/${cert.certificate_code || ""}`
                    );
                    setQrUrls((prev) => ({ ...prev, [certId]: url }));
                }

                // Allow the hidden paper (with loaded QR) to render before capture.
                await new Promise((resolve) => setTimeout(resolve, 60));

                if (!hiddenRef.current) throw new Error("Certificate element not found");

                await downloadCertificatePdf({
                    node: hiddenRef.current,
                    filename: `${cert.certificate_code || "certificate"}-${studentName
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`,
                });
            } catch (err) {
                console.error("Download failed", err);
            } finally {
                setDownloadingId(null);
                setActiveCert(null);
            }
        },
        [user]
    );

    const handleView = useCallback(
        (certId) => navigate(`/student/certificates/${certId}`),
        [navigate]
    );

    const renderScore = (certificate) => {
        const score = certificate?.score;
        if (score != null) return `${Math.round(score)}%`;
        return "—";
    };

    if (loading && certificates.length === 0) {
        return (
            <div className="space-y-6">
                <h1 className="page-title">My Certificates</h1>
                <div className="space-y-4">
                    {Array.from({ length: 3 }, (_, i) => (
                        <div key={i} className="card overflow-hidden">
                            <div className="flex items-center justify-between gap-4 p-6">
                                <div className="flex items-center gap-4">
                                    <div className="skeleton h-12 w-12 shrink-0 rounded-lg" />
                                    <div className="space-y-2">
                                        <div className="skeleton h-4 w-48 rounded-full" />
                                        <div className="skeleton h-3 w-32 rounded-full" />
                                    </div>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    <div className="skeleton h-9 w-20 rounded-md" />
                                    <div className="skeleton h-9 w-24 rounded-md" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <>
                <h1 className="page-title">My Certificates</h1>
                <AlertBanner type="error" message={error} />
            </>
        );
    }

    return (
        <div>
            <PageHeader
                title="My Certificates"
                subtitle={`Total ${certificates.length} certificate(s) earned.`}
            />

            {certificates.length === 0 ? (
                <div className="card p-12 text-center">
                    <Award size={32} className="mx-auto" style={{ color: "var(--border)" }} />
                    <p className="mt-3 font-semibold" style={{ color: "var(--foreground)" }}>
                        No certificates yet
                    </p>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Complete a course and pass its quiz to earn a certificate.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {certificates.map((certificate) => (
                        <div
                            key={certificate.id}
                            className="card overflow-hidden"
                            style={{ borderTop: "3px solid var(--accent)" }}
                        >
                            <div className="flex flex-wrap items-center gap-4 p-5">
                                {/* Award icon */}
                                <span
                                    className="flex shrink-0 items-center justify-center rounded-xl"
                                    style={{ width: 44, height: 44, background: "rgba(184,134,11,0.12)", color: "var(--accent)" }}
                                >
                                    <BookOpen size={22} />
                                </span>

                                {/* Certificate info */}
                                <div className="min-w-0 flex-1 space-y-1.5">
                                    <p className="truncate font-semibold" style={{ color: "var(--foreground)" }}>
                                        {certificate.course?.title || `Course #${certificate.course_id}`}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Hash size={14} style={{ color: "var(--accent)" }} />
                                            <span className="font-mono text-xs">
                                                {certificate.certificate_code || certificate.certificate_number || "—"}
                                            </span>
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Medal size={14} style={{ color: "var(--accent)" }} />
                                            Score: {renderScore(certificate)}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Award size={14} style={{ color: "var(--accent)" }} />
                                            Issued: {formatDate(certificate.issue_date)}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex shrink-0 items-center gap-2">
                                    <button type="button" onClick={() => handleView(certificate.id)} className="btn-secondary text-sm">
                                        <ExternalLink size={15} />
                                        View
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDownloadPdf(certificate.id)}
                                        disabled={downloadingId === certificate.id}
                                        className="btn-primary text-sm"
                                    >
                                        {downloadingId === certificate.id ? (
                                            <Loader2 size={15} className="animate-spin" />
                                        ) : (
                                            <Download size={15} />
                                        )}
                                        {downloadingId === certificate.id ? "Generating..." : "Download"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeCert && (
                <div
                    style={{
                        position: "fixed",
                        left: "-9999px",
                        top: 0,
                        zIndex: -1,
                        width: 1000,
                        pointerEvents: "none",
                    }}
                    aria-hidden="true"
                >
                    <div ref={hiddenRef}>
                        <CertificatePaper certificate={activeCert} qrDataUrl={qrUrls[activeCert.id]} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificates;