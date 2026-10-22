import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Award, ExternalLink, BookOpen, Hash, Medal } from "lucide-react";

import {
    fetchCertificates,
    clearCertificateError,
} from "../../features/student/certificateSlice";
import { getCertificateDetail } from "../../api/studentApi";
import { downloadCertificatePdf, generateCertificateQr } from "../../utils/certificate";
import { formatDate } from "../../utils/date";
import { PageHeader, AlertBanner, EmptyState } from "../../components/common";
import { Skeleton, SkeletonLine } from "../../components/common/Skeleton";
import CertificatePaper from "../../components/CertificatePaper";
import Button from "../../components/ui/Button";

const Certificates = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { certificates, loading, error } = useSelector(
        (state) => state.studentCertificates
    );
    const { user } = useSelector((state) => state.auth);

    const [downloadingId, setDownloadingId] = useState(null);
    const [activeCert, setActiveCert] = useState(null);
    const [qrDataUrl, setQrDataUrl] = useState(null);
    const hiddenRef = useRef(null);

    useEffect(() => {
        dispatch(fetchCertificates());
        return () => {
            dispatch(clearCertificateError());
        };
    }, [dispatch]);

    const handleDownloadPdf = useCallback(
        async (certId) => {
            try {
                const response = await getCertificateDetail(certId);
                const cert = response.data?.certificate;
                if (!cert) throw new Error("Certificate not found");

                const studentName = cert?.student?.user?.name || user?.name || "Student";
                setDownloadingId(certId);
                setActiveCert(cert);
                setQrDataUrl(await generateCertificateQr(cert));

                if (!hiddenRef.current) throw new Error("Certificate element not found");

                await downloadCertificatePdf({
                    node: hiddenRef.current,
                    filename: `${cert.certificate_number || "certificate"}-${studentName
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`,
                });
            } catch (err) {
                console.error("Download failed", err);
            } finally {
                setDownloadingId(null);
                setActiveCert(null);
                setQrDataUrl(null);
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
            <div>
                <PageHeader eyebrow="earned credentials" title="My Certificates" />

                <div className="space-y-4">
                    {Array.from({ length: 3 }, (_, i) => (
                        <div key={i} className="card p-5 sm:p-6">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-11 w-11 shrink-0 rounded-xl" />

                                <div className="min-w-0 flex-1">
                                    <SkeletonLine className="h-4 w-48" />
                                    <SkeletonLine className="mt-2.5 h-3 w-32" />
                                </div>

                                <div className="hidden shrink-0 gap-2 sm:flex">
                                    <Skeleton className="h-10 w-20 rounded-xl" />
                                    <Skeleton className="h-10 w-28 rounded-xl" />
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
                <PageHeader eyebrow="earned credentials" title="My Certificates" />

                <AlertBanner type="error" message={error} />
            </>
        );
    }

    return (
        <div>
            <PageHeader
                eyebrow="earned credentials"
                title="My Certificates"
                subtitle={`Total ${certificates.length} certificate(s) earned.`}
            />

            {certificates.length === 0 ? (
                <EmptyState
                    icon={Award}
                    title="No certificates yet"
                    message="Complete a course and pass its quiz to earn a certificate."
                />
            ) : (
                <div className="space-y-4">
                    {certificates.map((certificate) => (
                        <article key={certificate.id} className="card-accent-top overflow-hidden">
                            <div className="flex flex-wrap items-center gap-4 p-5 sm:p-6">
                                {/* Award icon */}
                                <span className="icon-well h-11 w-11 shrink-0 text-gold">
                                    <BookOpen size={20} strokeWidth={2} />
                                </span>

                                {/* Certificate info */}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-display text-sm font-bold text-fg">
                                        {certificate.course?.title || `Course #${certificate.course_id}`}
                                    </p>

                                    <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2">
                                        <span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
                                            <Hash
                                                size={14}
                                                strokeWidth={2.2}
                                                aria-hidden="true"
                                                className="shrink-0 text-accent"
                                            />
                                            <span className="numeric truncate text-xs text-muted">
                                                {certificate.certificate_number || "—"}
                                            </span>
                                        </span>

                                        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                                            <Medal
                                                size={14}
                                                strokeWidth={2.2}
                                                aria-hidden="true"
                                                className="shrink-0 text-accent"
                                            />
                                            Score: {renderScore(certificate)}
                                        </span>

                                        <span className="inline-flex items-center gap-1.5 text-sm text-muted">
                                            <Award
                                                size={14}
                                                strokeWidth={2.2}
                                                aria-hidden="true"
                                                className="shrink-0 text-gold"
                                            />
                                            Issued: {formatDate(certificate.issue_date)}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
                                    <Button type="button" onClick={() => handleView(certificate.id)} variant="secondary">
                                        <ExternalLink size={15} />
                                        View
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => handleDownloadPdf(certificate.id)}
                                        loading={downloadingId === certificate.id}
                                        loadingText="Download"
                                    >
                                        Download
                                    </Button>
                                </div>
                            </div>
                        </article>
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
                        <CertificatePaper certificate={activeCert} qrDataUrl={qrDataUrl} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificates;
