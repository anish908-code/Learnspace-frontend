import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

import { CheckCircle2, ShieldCheck, XCircle, Loader2, GraduationCap } from "lucide-react";

import { verifyCertificate } from "../../api/publicApi";
import { generateQrDataUrl } from "../../utils/certificate";
import { formatDate } from "../../utils/date";
import CertificatePaper from "../../components/CertificatePaper";

const VerifyCertificate = () => {
    const { certificateCode } = useParams();

    const [loading, setLoading] = useState(true);
    const [valid, setValid] = useState(false);
    const [certificate, setCertificate] = useState(null);
    const [error, setError] = useState(null);
    const [qrDataUrl, setQrDataUrl] = useState(null);

    useEffect(() => {
        let active = true;
        setLoading(true);
        verifyCertificate(certificateCode)
            .then((res) => {
                if (!active) return;
                setValid(!!res.data.valid);
                setCertificate(res.data.certificate || null);
                setError(validCheck(!!res.data.valid, res.data.certificate));
            })
            .catch((e) => {
                if (!active) return;
                setValid(false);
                setCertificate(null);
                setError("This certificate could not be verified. Please check the code and try again.");
            })
            .finally(() => active && setLoading(false));

        return () => {
            active = false;
        };
    }, [certificateCode]);

    const validCheck = useCallback((isValid, cert) => {
        if (!isValid || !cert) return "This certificate could not be verified.";
        return null;
    }, []);

    const studentName = certificate?.student_name ||
        certificate?.student?.user?.name || "Student";
    const courseTitle = certificate?.course?.title || "the course";

    useEffect(() => {
        if (!certificate) return;
        generateQrDataUrl(
            certificate?.verification_url ||
                `${window.location.origin}/certificates/verify/${certificate.certificate_code || certificateCode}`
        )
            .then(setQrDataUrl)
            .catch(() => setQrDataUrl(null));
    }, [certificate, certificateCode]);

    return (
        <div className="mx-auto max-w-4xl space-y-6 py-10">
            <div className="text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium" style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}>
                    <ShieldCheck size={16} />
                    Certificate Authentication Service
                </div>
                <h1 style={{ fontFamily: '"Playfair Display", serif', fontSize: "2rem", fontWeight: 700, color: "var(--foreground)" }}>
                    Verify a Certificate
                </h1>
                <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    Code: <span className="font-mono font-semibold">{certificateCode}</span>
                </p>
            </div>

            {loading ? (
                <div className="card p-16 text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin" style={{ color: "var(--accent)" }} />
                    <p className="mt-3 text-sm" style={{ color: "var(--muted-foreground)" }}>Verifying certificate...</p>
                </div>
            ) : (
                <>
                    {valid && certificate ? (
                        <>
                            <div className="flex items-center gap-3 rounded-md px-5 py-4" style={{ background: "rgba(39,103,73,0.1)", color: "var(--success)" }}>
                                <CheckCircle2 size={22} />
                                <div>
                                    <div className="font-semibold">Certificate is valid</div>
                                    <div className="text-sm">
                                        Issued to {studentName} for {courseTitle} on {formatDate(certificate.issue_date)}.
                                    </div>
                                </div>
                            </div>

                            <div className="card p-4 sm:p-8">
                                <CertificatePaper certificate={certificate} qrDataUrl={qrDataUrl} />
                            </div>
                        </>
                    ) : (
                        <div className="card p-12 text-center">
                            <XCircle size={40} className="mx-auto" style={{ color: "var(--error)" }} />
                            <p className="mt-4 font-semibold" style={{ color: "var(--foreground)" }}>
                                Verification Failed
                            </p>
                            <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                                {error}
                            </p>
                        </div>
                    )}
                </>
            )}

            <div className="text-center text-xs" style={{ color: "var(--muted-foreground)" }}>
                <GraduationCap size={14} className="inline" style={{ color: "var(--accent)" }} />{" "}
                LearnSpace — Official Certificate Verification
            </div>
        </div>
    );
};

export default VerifyCertificate;
