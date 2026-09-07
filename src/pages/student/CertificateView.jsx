import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Download, Loader2, ArrowLeft } from "lucide-react";

import {
    fetchCertificateDetail,
    clearCurrentCertificate,
    clearCertificateError,
} from "../../features/student/certificateSlice";
import { generateQrDataUrl, downloadCertificatePdf } from "../../utils/certificate";
import CertificatePaper from "../../components/CertificatePaper";

const CertificateView = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { certificateId } = useParams();

    const {
        currentCertificate: certificate,
        loading,
        error,
    } = useSelector((state) => state.studentCertificates);
    const { user } = useSelector((state) => state.auth);

    const [qrDataUrl, setQrDataUrl] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const paperRef = useRef(null);

    useEffect(() => {
        dispatch(fetchCertificateDetail(certificateId));
        return () => {
            dispatch(clearCurrentCertificate());
            dispatch(clearCertificateError());
        };
    }, [dispatch, certificateId]);

    useEffect(() => {
        if (!certificate) return;
        generateQrDataUrl(
            certificate?.verification_url ||
                `${window.location.origin}/certificates/verify/${certificate.certificate_code || ""}`
        )
            .then(setQrDataUrl)
            .catch(() => setQrDataUrl(null));
    }, [certificate]);

    const studentName = certificate?.student?.user?.name || user?.name || "Student";

    const handleDownload = useCallback(async () => {
        if (!paperRef.current) return;
        setDownloading(true);
        try {
            await downloadCertificatePdf({
                node: paperRef.current,
                filename: `${certificate.certificate_code || "certificate"}-${studentName
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`,
            });
        } catch (err) {
            console.error("Download failed", err);
        } finally {
            setDownloading(false);
        }
    }, [certificate, studentName]);

    if (loading && !certificate) {
        return (
            <div>
                {/* back button skeleton */}
                <div className="mb-4 flex items-center gap-2">
                    <div className="skeleton h-4 w-4 rounded-full" />
                    <div className="skeleton h-3 w-28 rounded-full" />
                </div>
                {/* certificate skeleton */}
                <div className="card p-4 sm:p-8">
                    <div className="skeleton aspect-video w-full rounded-md" />
                </div>
                {/* action button skeleton */}
                <div className="mt-5 flex items-center justify-center gap-3">
                    <div className="skeleton h-10 w-40 rounded-md" />
                </div>
            </div>
        );
    }

    if (error && !certificate) {
        return (
            <div className="rounded-md px-4 py-3 text-sm" style={{ background: "var(--error-bg)", color: "var(--error)" }}>
                {error}
            </div>
        );
    }

    if (!certificate) return null;

    return (
        <div>
            <button
                type="button"
                onClick={() => navigate("/student/certificates")}
                className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium transition hover:underline"
                style={{ color: "var(--muted-foreground)" }}
            >
                <ArrowLeft size={15} />
                Back to Certificates
            </button>

            <div className="card p-4 sm:p-8">
                <div ref={paperRef}>
                    <CertificatePaper certificate={certificate} qrDataUrl={qrDataUrl} studentName={studentName} />
                </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button type="button" onClick={handleDownload} disabled={downloading} className="btn-primary">
                    {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {downloading ? "Generating PDF..." : "Download PDF"}
                </button>
            </div>

            <p className="mt-4 text-center text-xs" style={{ color: "var(--muted-foreground)" }}>
                LearnSpace — Verified Certificate · {certificate.certificate_code || certificate.certificate_number}
            </p>
        </div>
    );
};

export default CertificateView;
