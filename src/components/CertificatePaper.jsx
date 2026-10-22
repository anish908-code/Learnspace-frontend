import {
    GraduationCap,
    CalendarDays,
    UserRound,
    Medal,
    Sparkles,
    Star,
} from "lucide-react";
import { COLORS, BRAND } from "../utils/certificate";
import { formatDate } from "../utils/date";

/*
|--------------------------------------------------------------------------
| CertificatePaper — LearnSpace course completion certificate
|--------------------------------------------------------------------------
| Landscape 16:9, ivory paper, deep-green ink + gold ornament. Ye ek
| *document* hai, app UI nahi — isliye:
|
|   · apna light paper palette rakhta hai (dark mode me bhi), taaki print
|     aur html2canvas PDF dono hamesha legible rahein
|   · cqw units container ke width se resolve hoti hain (viewport se nahi),
|     to 375px preview se A4 landscape tak same proportions
|   · gold sirf rule lines / seal / ornamental frame me
|   · `data-certificate` + `certificate-paper` capture ke liye rakhe gaye
|     markers hain — inhe hatana mat
*/

const InfoBlock = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2" style={{ marginBottom: "2.1%" }}>
        <span
            className="flex shrink-0 items-center justify-center rounded-full"
            style={{ width: "2.1cqw", height: "2.1cqw", background: COLORS.sage, color: COLORS.green }}
        >
            <Icon size="1.1cqw" strokeWidth={1.8} />
        </span>

        <div style={{ minWidth: 0, flex: 1 }}>
            <div
                className="font-mono uppercase"
                style={{ fontSize: "0.55cqw", fontWeight: 600, letterSpacing: "0.14em", color: COLORS.muted, lineHeight: 1.2 }}
            >
                {label}:
            </div>

            <div
                className="font-mono"
                style={{
                    fontSize: "0.72cqw",
                    fontWeight: 600,
                    color: COLORS.green,
                    lineHeight: 1.5,
                    paddingBottom: "0.3cqw",
                    wordBreak: "break-word",
                }}
            >
                {value || "—"}
            </div>

            {/* gold hairline — the only ornament in the data block */}
            <div
                style={{ height: "1px", background: COLORS.goldSoft, marginTop: "0.2cqw" }}
            />
        </div>
    </div>
);

const SignatureBlock = ({ name, role }) => (
    // `flex: 1` hataya — wo fixed gap ko absorb karke names ko poore
    // 60% width me faila deta tha. Ab har block apne content ke size ka hai.
    <div className="text-center" style={{ flex: "0 1 auto", minWidth: 0 }}>
        <div
            className="font-display uppercase"
            style={{ fontSize: "0.78cqw", fontWeight: 800, letterSpacing: "0.14em", color: COLORS.charcoal }}
        >
            {name || role || "Signatory"}
        </div>

        {role && role !== name && (
            <div
                className="font-mono uppercase"
                style={{ fontSize: "0.6cqw", fontWeight: 600, letterSpacing: "0.12em", color: COLORS.muted, marginTop: "0.18cqw" }}
            >
                {role}
            </div>
        )}
    </div>
);

// Elegant gold ornamental flourish for corners
const Ornament = ({ style }) => (
    <svg
        className="pointer-events-none"
        style={{ ...style, position: "absolute", color: COLORS.gold, opacity: 0.8 }}
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

// Circular academic seal — solid rings (html2canvas conic-gradient par
// support nahi karta, plain stroke har engine me same output deta hai)
const Emblem = () => (
    <div style={{ position: "relative", width: "5.4cqw", height: "5.4cqw", marginTop: "4.6%" }}>
        <div
            className="absolute inset-0 rounded-full"
            style={{ border: "0.22cqw solid " + COLORS.gold }}
        />

        <div
            className="absolute rounded-full"
            style={{ top: "6%", left: "6%", right: "6%", bottom: "6%", border: "1px solid " + COLORS.goldSoft }}
        />

        <div
            className="absolute inset-0 m-auto flex items-center justify-center rounded-full"
            style={{ width: "72%", height: "72%", background: COLORS.green, color: COLORS.ivory }}
        >
            <GraduationCap size="2.1cqw" strokeWidth={1.5} />
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
    gradeOrScore,
    signatures,
}) => {
    const student = studentName || certificate?.student?.user?.name || certificate?.student_name || "Student";
    const course = courseTitle || certificate?.course?.title || "the course";
    const certificateNumber = certificate?.certificate_number || "";
    const date = issueDate || (certificate?.issue_date ? formatDate(certificate.issue_date) : "");
    const issuer = issuedBy || certificate?.issued_by || "LearnSpace";
    const score = gradeOrScore !== undefined ? gradeOrScore : (certificate?.score != null ? `${Math.round(certificate.score)}%` : (certificate?.grade || ""));

    // Backend se aaye signatures use karo. Purana behaviour tab bhi
    // chalta hai jab database me signatures na ho ya empty ho.
    const defaultSignatures = [
        { name: "Anish", role: "Administrator" },
        { name: "Raj", role: "Administrator" },
        { name: "Rishabh", role: "Administrator" },
    ];

    const signatureAreas = Array.isArray(signatures) && signatures.length
        ? signatures
        : defaultSignatures;

    return (
        <div
            className="certificate-paper font-sans"
            data-certificate
            style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                background: COLORS.ivory,
                color: COLORS.charcoal,
                overflow: "hidden",
                // Certificate ke andar ke saare cqw units is container ke
                // width se resolve hote hain — viewport se nahi. Pehle yahan
                // viewport units use ho rahe the, jisse bade screen pe
                // ornaments aur icons certificate se bahar nikal jaate the.
                containerType: "inline-size",
            }}
        >
            {/* Gold double frame — outer hairline + inner rule */}
            <div
                className="pointer-events-none absolute"
                style={{ top: "1.4%", left: "1.6%", right: "1.6%", bottom: "1.4%", border: "1.5px solid " + COLORS.gold }}
            />
            <div
                className="pointer-events-none absolute"
                style={{ top: "2.6%", left: "2.8%", right: "2.8%", bottom: "2.6%", border: "1px solid " + COLORS.goldSoft }}
            />

            {/* Soft paper corners */}
            <div className="pointer-events-none absolute" style={{ top: "-1%", left: "-1%", width: "30%", height: "30%", borderBottomRightRadius: "100%", background: COLORS.sageLight }} />
            <div className="pointer-events-none absolute" style={{ top: "-6.5%", left: "-6.5%", width: "23%", height: "23%", borderBottomRightRadius: "100%", background: "linear-gradient(135deg, rgba(184,134,11,0.14), rgba(184,134,11,0.02))" }} />
            <div className="pointer-events-none absolute" style={{ bottom: "-1%", right: "-1%", width: "30%", height: "30%", borderTopLeftRadius: "100%", background: COLORS.sageLight }} />
            <div className="pointer-events-none absolute" style={{ bottom: "-6.5%", right: "-6.5%", width: "23%", height: "23%", borderTopLeftRadius: "100%", background: "linear-gradient(315deg, rgba(184,134,11,0.14), rgba(184,134,11,0.02))" }} />

            {/* Corner ornaments */}
            <Ornament style={{ top: "4.6%", right: "3.4%", transform: "scaleX(-1)" }} />
            <Ornament style={{ bottom: "4.6%", left: "3.4%", transform: "scaleY(-1)" }} />

            {/* ============ LEFT INFO PANEL ============ */}
            <div className="absolute" style={{ left: "6%", top: "30%", width: "19.5%", zIndex: 3 }}>
                <InfoBlock icon={CalendarDays} label="Issue Date" value={date} />
                <InfoBlock icon={UserRound} label="Issued By" value={issuer} />
                <InfoBlock icon={Medal} label="Certificate No." value={certificateNumber} />
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
                    // Bottom padding signature block ke liye clearance reserve
                    // karta hai, taaki lamba course title 2 lines me wrap ho
                    // tab bhi "Issued By" names se overlap na kare.
                    padding: "5.6% 0.5% 12%",
                }}
            >
                {/* Logo + brand */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.42cqw" }}>
                    <span
                        className="flex items-center justify-center rounded-full"
                        style={{ width: "3.1cqw", height: "3.1cqw", background: COLORS.green, color: COLORS.ivory }}
                    >
                        <GraduationCap size="1.9cqw" strokeWidth={1.8} />
                    </span>

                    <span
                        className="font-display"
                        style={{ fontSize: "1.7cqw", fontWeight: 800, letterSpacing: "0.01em", color: COLORS.green }}
                    >
                        Learn<span style={{ color: COLORS.gold }}>Space</span>
                    </span>
                </div>

                <div
                    className="font-mono"
                    style={{ fontSize: "0.64cqw", letterSpacing: "0.3em", color: COLORS.gold, marginTop: "0.5cqw", fontWeight: 700 }}
                >
                    {BRAND.tagline}
                </div>

                {/* Main title */}
                <div style={{ marginTop: "4.4%" }}>
                    <div
                        className="font-display"
                        style={{ fontSize: "2.7cqw", fontWeight: 800, letterSpacing: "0.12em", color: COLORS.green, lineHeight: 1 }}
                    >
                        CERTIFICATE
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.7cqw", marginTop: "0.7cqw" }}>
                        <span style={{ width: "15%", height: "1.5px", background: COLORS.gold }} />
                        <div
                            className="font-mono"
                            style={{ fontSize: "0.88cqw", letterSpacing: "0.24em", color: COLORS.green, fontWeight: 600, whiteSpace: "nowrap" }}
                        >
                            OF COURSE COMPLETION
                        </div>
                        <span style={{ width: "15%", height: "1.5px", background: COLORS.gold }} />
                    </div>
                </div>

                {/* Ornamental divider */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.4cqw", marginTop: "1.6cqw" }}>
                    <Sparkles size="0.75cqw" style={{ color: COLORS.goldLight }} />
                    <span style={{ width: "5.5cqw", height: "1px", background: COLORS.goldSoft }} />
                    <Sparkles size="0.85cqw" style={{ color: COLORS.gold }} />
                    <span style={{ width: "5.5cqw", height: "1px", background: COLORS.goldSoft }} />
                    <Sparkles size="0.75cqw" style={{ color: COLORS.goldLight }} />
                </div>

                {/* Certify statement */}
                <div
                    className="font-mono"
                    style={{ fontSize: "0.74cqw", letterSpacing: "0.3em", color: COLORS.charcoal, marginTop: "5%", fontWeight: 600 }}
                >
                    THIS IS TO CERTIFY THAT
                </div>

                {/* Student name */}
                <div
                    className="font-display"
                    style={{
                        fontSize: "1.95cqw",
                        fontWeight: 800,
                        color: COLORS.green,
                        lineHeight: 1.15,
                        maxWidth: "86%",
                        wordBreak: "break-word",
                        textAlign: "center",
                        marginTop: "4%",
                    }}
                >
                    {student}
                </div>

                {/* Completion sentence */}
                <div style={{ fontSize: "0.72cqw", color: COLORS.charcoal, marginTop: "3.4%", letterSpacing: "0.02em" }}>
                    has successfully completed the course
                </div>

                {/* Course name */}
                <div
                    className="font-display"
                    style={{
                        fontSize: "1.45cqw",
                        fontWeight: 800,
                        color: COLORS.green,
                        lineHeight: 1.2,
                        marginTop: "2.2%",
                        maxWidth: "92%",
                        wordBreak: "break-word",
                    }}
                >
                    {course}
                </div>

                {/* Two-line statement */}
                <div style={{ fontSize: "0.68cqw", color: COLORS.muted, marginTop: "3.8%", letterSpacing: "0.01em", lineHeight: 1.5 }}>
                    and has demonstrated dedication, consistency, and excellence
                </div>
                <div style={{ fontSize: "0.68cqw", color: COLORS.muted, letterSpacing: "0.01em", lineHeight: 1.5 }}>
                    in achieving the course objectives.
                </div>

                {/* Achievement seal */}
                <Emblem />
            </div>

            {/* ============ RIGHT QR SECTION ============ */}
            <div
                className="absolute"
                style={{
                    right: "6%",
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
                        border: "1.5px solid " + COLORS.gold,
                        background: COLORS.white,
                        padding: "7%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 0 1px " + COLORS.goldSoft,
                    }}
                >
                    {qrDataUrl ? (
                        <img
                            src={qrDataUrl}
                            alt="Certificate details QR code"
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                    ) : (
                        <span className="font-mono" style={{ color: COLORS.muted, fontSize: "0.7cqw" }}>
                            QR
                        </span>
                    )}
                </div>

                <div style={{ textAlign: "center", marginTop: "0.7cqw" }}>
                    <div
                        className="font-mono"
                        style={{ fontSize: "0.55cqw", letterSpacing: "0.16em", textTransform: "uppercase", color: COLORS.green, fontWeight: 700 }}
                    >
                        Visit LearnSpace
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", gap: "0.4cqw", marginTop: "0.5cqw" }}>
                        {[14, 38, 62, 86, 110].map((star) => (
                            <Star key={star} size="0.5cqw" style={{ color: COLORS.gold }} fill={COLORS.gold} />
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
                    className="font-mono uppercase"
                    style={{ fontSize: "0.66cqw", fontWeight: 700, letterSpacing: "0.24em", color: COLORS.muted, marginBottom: "0.5cqw" }}
                >
                    Issued By
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        gap: "3.5cqw",
                        rowGap: "1cqw",
                        flexWrap: "wrap",
                        width: "100%",
                    }}
                >
                    {signatureAreas.map((sig, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <SignatureBlock name={sig.name} role={sig.role} />

                            <div
                                aria-hidden="true"
                                style={{ width: "100%", minWidth: "7cqw", height: "1px", background: COLORS.goldSoft, marginTop: "0.25cqw" }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CertificatePaper;
