import {
    GraduationCap,
    CalendarDays,
    UserRound,
    ShieldCheck,
    Medal,
    Sparkles,
    Star,
} from "lucide-react";
import { COLORS, FONTS, BRAND } from "../utils/certificate";
import { formatDate } from "../utils/date";

/*
|--------------------------------------------------------------------------
| CertificatePaper — LearnSpace premium course completion certificate
|--------------------------------------------------------------------------
| Landscape 16:9, ivory background, forest green + metallic gold.
| Rendered in a container with aspect-ratio 16/9 so it scales responsively
| and can be captured to PDF without clipping.
*/

const InfoBlock = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2" style={{ marginBottom: "2.1%" }}>
        <span
            className="flex shrink-0 items-center justify-center rounded-full"
            style={{ width: "2.1vw", height: "2.1vw", background: COLORS.sage, color: COLORS.green }}
        >
            <Icon size="1.1vw" strokeWidth={1.8} />
        </span>
        <div style={{ minWidth: 0 }}>
            <div
                className="uppercase"
                style={{ fontSize: "0.55vw", fontWeight: 700, letterSpacing: "0.12em", color: COLORS.gold, lineHeight: 1.1 }}
            >
                {label}:
            </div>
            <div
                style={{
                    fontSize: "0.72vw",
                    fontWeight: 600,
                    color: COLORS.green,
                    lineHeight: 1.5,
                    paddingBottom: "0.3vw",
                    wordBreak: "break-word",
                }}
            >
                {value || "—"}
            </div>
            <div style={{ height: "1px", background: COLORS.line, marginTop: "0.18vw" }} />
        </div>
    </div>
);

const SignatureBlock = ({ name, role }) => (
    <div className="text-center" style={{ flex: 1, minWidth: 0 }}>
        <div className="uppercase" style={{ fontSize: "0.82vw", fontWeight: 800, letterSpacing: "0.12em", color: COLORS.charcoal }}>
            {name || role || "Signatory"}
        </div>
        {role && role !== name && (
            <div className="uppercase" style={{ fontSize: "0.62vw", fontWeight: 600, letterSpacing: "0.1em", color: COLORS.charcoal, marginTop: "0.16vw" }}>
                {role}
            </div>
        )}
    </div>
);

// Elegant gold ornamental flourish for corners
const Ornament = ({ style }) => (
    <svg
        className="pointer-events-none"
        style={{ ...style, position: "absolute", color: COLORS.gold, opacity: 0.85 }}
        width="24%"
        height="24%"
        viewBox="0 0 200 200"
        fill="none"
    >
        <path d="M20 120 C20 60 60 20 120 20" stroke="currentColor" strokeWidth="2" />
        <path d="M8 136 C8 50 50 8 136 8" stroke="currentColor" strokeWidth="1.3" strokeDasharray="3 3" />
        <circle cx="132" cy="68" r="4" fill="currentColor" />
        <path d="M14 162 C14 90 90 14 162 14" stroke="currentColor" strokeWidth="1.1" opacity="0.6" />
        <circle cx="26" cy="174" r="2.6" fill="currentColor" />
        <circle cx="174" cy="26" r="2.6" fill="currentColor" />
    </svg>
);

// Circular academic achievement emblem
const Emblem = () => (
    <div style={{ position: "relative", width: "5.4vw", height: "5.4vw", marginTop: "1.2%" }}>
        {/* gold outer ring */}
        <div
            className="absolute inset-0 rounded-full"
            style={{ background: "conic-gradient(from 0deg, " + COLORS.gold + ", " + COLORS.goldLight + ", " + COLORS.gold + ")" }}
        />
        <div
            className="absolute rounded-full"
            style={{ top: "4%", left: "4%", right: "4%", bottom: "4%", background: COLORS.ivory, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            <div
                className="absolute inset-0 m-auto flex items-center justify-center rounded-full"
                style={{ background: COLORS.green, color: COLORS.ivory, width: "76%", height: "76%" }}
            >
                <GraduationCap size="2.1vw" strokeWidth={1.5} />
            </div>
        </div>
    </div>
);

const CertificatePaper = ({
    certificate,
    studentName,
    qrDataUrl,
    issuedBy,
    courseTitle,
    issueDate,
    certificateCode,
    gradeOrScore,
    signatures,
}) => {
    const student = studentName || certificate?.student?.user?.name || certificate?.student_name || "Student";
    const course = courseTitle || certificate?.course?.title || "the course";
    const code = certificateCode || certificate?.certificate_code || certificate?.certificate_number || "";
    const date = issueDate || (certificate?.issue_date ? formatDate(certificate.issue_date) : "");
    const issuer = issuedBy || certificate?.issued_by || "LearnSpace";
    const score = gradeOrScore !== undefined ? gradeOrScore : (certificate?.score != null ? `${Math.round(certificate.score)}%` : (certificate?.grade || ""));

    const signatureAreas = [
        { name: "Anish", role: "Administrator" },
        { name: "Raj", role: "Administrator" },
        { name: "Rishabh", role: "Administrator" },
    ];

    const stars = [14, 38, 62, 86, 110];

    return (
        <div
            className="certificate-paper"
            data-certificate
            style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                background: COLORS.ivory,
                color: COLORS.charcoal,
                fontFamily: FONTS.sans,
                overflow: "hidden",
            }}
        >
            {/* Double-line border */}
            <div className="pointer-events-none absolute" style={{ top: "1%", left: "1.1%", right: "1.1%", bottom: "1%", border: `1.5px solid ${COLORS.gold}` }} />
            <div className="pointer-events-none absolute" style={{ top: "2%", left: "2.2%", right: "2.2%", bottom: "2%", border: `1.5px solid ${COLORS.green}` }} />

            {/* Large curved corner decorations */}
            <div className="pointer-events-none absolute" style={{ top: "-1%", left: "-1%", width: "30%", height: "30%", borderBottomRightRadius: "100%", background: COLORS.sage }} />
            <div className="pointer-events-none absolute" style={{ top: "-6.5%", left: "-6.5%", width: "23%", height: "23%", borderBottomRightRadius: "100%", background: "linear-gradient(135deg, rgba(184,134,11,0.16), rgba(184,134,11,0.02))" }} />
            <div className="pointer-events-none absolute" style={{ bottom: "-1%", right: "-1%", width: "30%", height: "30%", borderTopLeftRadius: "100%", background: COLORS.sage }} />
            <div className="pointer-events-none absolute" style={{ bottom: "-6.5%", right: "-6.5%", width: "23%", height: "23%", borderTopLeftRadius: "100%", background: "linear-gradient(315deg, rgba(184,134,11,0.16), rgba(184,134,11,0.02))" }} />

            {/* Corner ornaments */}
            <Ornament style={{ top: "4%", right: "3%", transform: "scaleX(-1)" }} />
            <Ornament style={{ bottom: "4%", left: "3%", transform: "scaleY(-1)" }} />

            {/* ============ LEFT INFO PANEL ============ */}
            <div className="absolute" style={{ left: "5.5%", top: "31%", width: "19%", zIndex: 3 }}>
                <InfoBlock icon={CalendarDays} label="Issue Date" value={date} />
                <InfoBlock icon={UserRound} label="Issued By" value={issuer} />
                <InfoBlock icon={ShieldCheck} label="Certificate Code" value={code} />
                <InfoBlock icon={Medal} label="Grade / Score" value={score} />
            </div>

            {/* ============ MAIN CENTER CONTENT ============ */}
            <div
                className="absolute"
                style={{
                    left: "26%",
                    top: "0",
                    width: "44%",
                    height: "100%",
                    zIndex: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "3.4% 0.5% 0",
                }}
            >
                {/* Logo + brand */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.42vw", marginLeft: "-0.6vw" }}>
                    <span
                        className="flex items-center justify-center rounded-full"
                        style={{ width: "3.1vw", height: "3.1vw", background: COLORS.green, color: COLORS.ivory }}
                    >
                        <GraduationCap size="1.9vw" strokeWidth={1.8} />
                    </span>
                    <span style={{ fontFamily: FONTS.serif, fontSize: "1.8vw", fontWeight: 700, letterSpacing: "0.02em", color: COLORS.green }}>
                        Learn<span style={{ color: COLORS.gold }}>Space</span>
                    </span>
                </div>
                <div style={{ fontSize: "0.68vw", letterSpacing: "0.32em", color: COLORS.gold, marginTop: "0.45vw", fontWeight: 700 }}>
                    {BRAND.tagline}
                </div>

                {/* Main title */}
                <div style={{ marginTop: "1.7%" }}>
                    <div style={{ fontFamily: FONTS.serif, fontSize: "3.2vw", fontWeight: 700, letterSpacing: "0.14em", color: COLORS.green, lineHeight: 1 }}>
                        CERTIFICATE
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.7vw", marginTop: "0.6vw" }}>
                        <span style={{ width: "15%", height: "1.5px", background: COLORS.gold }} />
                        <div style={{ fontSize: "0.92vw", letterSpacing: "0.24em", color: COLORS.green, fontWeight: 600, whiteSpace: "nowrap" }}>
                            OF COURSE COMPLETION
                        </div>
                        <span style={{ width: "15%", height: "1.5px", background: COLORS.gold }} />
                    </div>
                </div>

                {/* Ornamental divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.4vw", marginTop: "0.7vw" }}>
                    <Sparkles size="0.75vw" style={{ color: COLORS.goldLight }} />
                    <span style={{ width: "5.5vw", height: "1px", background: COLORS.line }} />
                    <Sparkles size="0.85vw" style={{ color: COLORS.gold }} />
                    <span style={{ width: "5.5vw", height: "1px", background: COLORS.line }} />
                    <Sparkles size="0.75vw" style={{ color: COLORS.goldLight }} />
                </div>

                {/* Certify statement */}
                <div style={{ fontSize: "0.78vw", letterSpacing: "0.3em", color: COLORS.charcoal, marginTop: "1.3%", fontWeight: 600 }}>
                    THIS IS TO CERTIFY THAT
                </div>

                {/* Student name */}
                <div
                    style={{
                        fontFamily: FONTS.serif,
                        fontSize: "1.9vw",
                        fontWeight: 700,
                        color: COLORS.green,
                        lineHeight: 1.15,
                        maxWidth: "86%",
                        wordBreak: "break-word",
                        textAlign: "center",
                        marginTop: "1.2%",
                    }}
                >
                    {student}
                </div>

                {/* Completion sentence */}
                <div style={{ fontSize: "0.72vw", color: COLORS.charcoal, marginTop: "1%", letterSpacing: "0.02em" }}>
                    has successfully completed the course
                </div>

                {/* Course name */}
                <div
                    style={{
                        fontFamily: FONTS.serif,
                        fontSize: "1.5vw",
                        fontWeight: 700,
                        color: COLORS.green,
                        lineHeight: 1.2,
                        marginTop: "0.6%",
                        maxWidth: "92%",
                        wordBreak: "break-word",
                    }}
                >
                    {course}
                </div>

                {/* Two-line statement */}
                <div style={{ fontSize: "0.68vw", color: COLORS.muted, marginTop: "0.9%", letterSpacing: "0.01em", lineHeight: 1.5 }}>
                    and has demonstrated dedication, consistency, and excellence
                </div>
                <div style={{ fontSize: "0.68vw", color: COLORS.muted, letterSpacing: "0.01em", lineHeight: 1.5 }}>
                    in achieving the course objectives.
                </div>

                {/* Achievement emblem */}
                <Emblem />
            </div>

            {/* ============ RIGHT QR SECTION ============ */}
            <div
                className="absolute"
                style={{
                    right: "5.5%",
                    top: "26%",
                    width: "15%",
                    zIndex: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        border: `1.5px solid ${COLORS.gold}`,
                        background: COLORS.white,
                        padding: "7%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 0 1px " + COLORS.sage,
                    }}
                >
                    {qrDataUrl ? (
                        <img
                            src={qrDataUrl}
                            alt="Verification QR"
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                    ) : (
                        <span style={{ color: COLORS.muted, fontSize: "0.7vw" }}>QR</span>
                    )}
                </div>
                <div style={{ textAlign: "center", marginTop: "0.7vw" }}>
                    <div style={{ fontSize: "0.55vw", letterSpacing: "0.16em", textTransform: "uppercase", color: COLORS.green, fontWeight: 700 }}>
                        Scan the QR code
                    </div>
                    <div style={{ fontSize: "0.5vw", letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.muted, marginTop: "0.15vw" }}>
                        to visit our website
                    </div>
                    {/* small stars under QR */}
                    <div style={{ display: "flex", justifyContent: "center", gap: "0.4vw", marginTop: "0.5vw" }}>
                        {stars.map((s) => (
                            <Star key={s} size="0.5vw" style={{ color: COLORS.gold }} fill={COLORS.gold} />
                        ))}
                    </div>
                </div>
            </div>

            {/* ============ BOTTOM SIGNATURES ============ */}
            <div
                className="absolute"
                style={{
                    left: "20%",
                    right: "20%",
                    bottom: "6%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    zIndex: 3,
                }}
            >
                <div
                    className="uppercase"
                    style={{ fontSize: "0.78vw", fontWeight: 800, letterSpacing: "0.22em", color: COLORS.charcoal, marginBottom: "0.55vw" }}
                >
                    Issued By
                </div>
                <div style={{ display: "flex", justifyContent: "center", gap: "8%", width: "100%" }}>
                    {signatureAreas.map((sig, i) => (
                        <SignatureBlock key={i} name={sig.name} role={sig.role} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CertificatePaper;
