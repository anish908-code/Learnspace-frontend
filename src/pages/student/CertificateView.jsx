import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft } from "lucide-react";

import {
    fetchCertificateDetail,
    clearCurrentCertificate,
    clearCertificateError,
} from "../../features/student/certificateSlice";
import { downloadCertificatePdf, generateCertificateQr } from "../../utils/certificate";
import { Skeleton, SkeletonLine } from "../../components/common/Skeleton";
import { PageHeader, AlertBanner } from "../../components/common";
import CertificatePaper from "../../components/CertificatePaper";
import Button from "../../components/ui/Button";

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

    const [downloading, setDownloading] = useState(false);
    const [qrDataUrl, setQrDataUrl] = useState(null);
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
        generateCertificateQr(certificate)
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
                filename: `${certificate.certificate_number || "certificate"}-${studentName
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
                <div className="mb-6 flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <SkeletonLine className="h-3 w-28" />
                </div>

                {/* certificate skeleton */}
                <SkeletonLine className="mb-8 h-8 w-56" />

                <div className="card-luxury p-4 sm:p-8">
                    <Skeleton className="aspect-video w-full rounded-md" />
                </div>

                {/* action button skeleton */}
                <div className="mt-6 flex items-center justify-center gap-3">
                    <Skeleton className="h-10 w-40 rounded-xl" />
                </div>
            </div>
        );
    }

    if (error && !certificate) {
        return <AlertBanner type="error" message={error} />;
    }

    if (!certificate) return null;

    return (
        <div>
            <Button
                type="button"
                onClick={() => navigate("/student/certificates")}
                variant="ghost"
                size="sm"
                className="-ml-3 mb-6"
            >
                <ArrowLeft size={15} />
                Back to Certificates
            </Button>

            <PageHeader
                eyebrow="earned credential"
                title={certificate.course?.title || "Certificate"}
                action={
                    <Button type="button" onClick={handleDownload} loading={downloading} loadingText="Download PDF">
                        Download PDF
                    </Button>
                }
            />

            <div className="card-luxury p-4 sm:p-8">
                <div ref={paperRef}>
                    <CertificatePaper certificate={certificate} qrDataUrl={qrDataUrl} studentName={studentName} />
                </div>
            </div>

            <p className="mt-5 text-center">
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-subtle">
                    LearnSpace — Certificate · {certificate.certificate_number}
                </span>
            </p>
        </div>
    );
};

export default CertificateView;
