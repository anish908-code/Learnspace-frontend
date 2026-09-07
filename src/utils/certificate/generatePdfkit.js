import PDFDocument, { registerStdFonts } from "pdfkit";
import Helvetica from "pdfkit/standard-fonts/Helvetica";
import HelveticaBold from "pdfkit/standard-fonts/HelveticaBold";
import TimesRoman from "pdfkit/standard-fonts/TimesRoman";
import TimesBold from "pdfkit/standard-fonts/TimesBold";
import Courier from "pdfkit/standard-fonts/Courier";
import CourierBold from "pdfkit/standard-fonts/CourierBold";

registerStdFonts(
    Helvetica,
    HelveticaBold,
    TimesRoman,
    TimesBold,
    Courier,
    CourierBold
);

const W = 1280;
const H = 720;

const COLORS = {
    green: "#1A3B2E",
    gold: "#B8860B",
    goldLight: "#D4A84B",
    ivory: "#FBF8F1",
    sage: "#E9F0EA",
    charcoal: "#2B332D",
    muted: "#7A837B",
    line: "#C9B27C",
    white: "#FFFFFF",
};

const centerX = W / 2;

function drawFrame(doc) {
    doc.rect(0, 0, W, H).fill(COLORS.ivory);

    // Double-line border
    doc.strokeColor(COLORS.gold)
        .lineWidth(2)
        .rect(14, 14, W - 28, H - 28)
        .stroke();
    doc.strokeColor(COLORS.green)
        .lineWidth(2)
        .rect(28, 28, W - 56, H - 56)
        .stroke();
}

// Circular corner decorations
function drawCorner(doc, cx, cy, r, reverse) {
    doc.save();
    // NOTE: pdfkit's browser build does not support linear gradients
    // (doc.linearGradient() returns null), so we use a solid translucent fill.
    const fillColor = reverse ? "rgba(184,134,11,0.10)" : "rgba(184,134,11,0.06)";
    doc.fillColor(fillColor);
    doc.path(`M ${cx} ${cy} L ${cx + r} ${cy} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z`)
        .fill();
    doc.restore();
}

function drawEmblem(doc, cx, cy, r) {
    // Gold outer ring
    doc.circle(cx, cy, r).fill(COLORS.gold);
    // Ivory inner
    doc.circle(cx, cy, r * 0.84).fill(COLORS.ivory);
    // Green core with cap
    doc.circle(cx, cy, r * 0.62).fill(COLORS.green);

    // Simple graduation cap (mortarboard)
    doc.strokeColor(COLORS.ivory).lineWidth(3).fillColor(COLORS.ivory);
    // board (horizontal line)
    doc.moveTo(cx - r * 0.38, cy - r * 0.08)
        .lineTo(cx + r * 0.38, cy - r * 0.08)
        .stroke();
    // slant sides of board
    doc.moveTo(cx - r * 0.38, cy - r * 0.08)
        .lineTo(cx - r * 0.18, cy - r * 0.3)
        .lineTo(cx + r * 0.18, cy - r * 0.3)
        .lineTo(cx + r * 0.38, cy - r * 0.08)
        .stroke();
    // vertical graduation/holder lines
    doc.moveTo(cx, cy - r * 0.3).lineTo(cx, cy + r * 0.08).stroke();
    doc.moveTo(cx - r * 0.14, cy - r * 0.1).lineTo(cx - r * 0.3, cy + r * 0.2).stroke();
    doc.moveTo(cx + r * 0.14, cy - r * 0.1).lineTo(cx + r * 0.3, cy + r * 0.2).stroke();
}

export async function downloadCertificatePdfkit({ data, filename = "certificate" }) {
    const doc = new PDFDocument({
        size: [W, H],
        layout: "landscape",
        margin: 0,
        autoFirstPage: false,
        info: { Title: "LearnSpace Certificate", Creator: "LearnSpace" },
    });
    doc.addPage({ size: [W, H], layout: "landscape", margin: 0 });

    drawFrame(doc);

    // Corner decorations (top-left sage, bottom-right sage)
    drawCorner(doc, 30, 30, 200, false);
    drawCorner(doc, W - 30, H - 30, 200, true);

    // ===== LEFT INFO PANEL =====
    const panelX = 90;
    const infoLabels = [
        ["ISSUE DATE", data.date || ""],
        ["ISSUED BY", data.issuer || "LearnSpace"],
        ["CERTIFICATE CODE", data.code || ""],
        ["GRADE / SCORE", data.score || "—"],
    ];
    let iy = 250;
    for (const [label, value] of infoLabels) {
        doc.font("Times-Bold").fontSize(13).fillColor(COLORS.gold)
            .text(label, panelX, iy, { lineBreak: false });
        doc.font("Times-Bold").fontSize(19).fillColor(COLORS.green)
            .text(value, panelX, iy + 18, { lineBreak: false });
        doc.moveTo(panelX, iy + 44).lineTo(panelX + 250, iy + 44)
            .lineWidth(1).strokeColor(COLORS.line).stroke();
        iy += 62;
    }

    // ===== RIGHT QR SECTION =====
    const qrSize = 190;
    const qrX = W - 90 - qrSize;
    const qrY = 150;
    doc.strokeColor(COLORS.gold).lineWidth(1.5)
        .rect(qrX, qrY, qrSize, qrSize).stroke();
    if (data.qrDataUrl) {
        try {
            doc.image(data.qrDataUrl, qrX + 10, qrY + 10, {
                width: qrSize - 20,
                height: qrSize - 20,
            });
        } catch {
            /* QR embed failed - skip gracefully */
        }
    } else {
        doc.font("Helvetica").fontSize(16).fillColor(COLORS.muted)
            .text("QR", qrX + qrSize / 2 - 12, qrY + qrSize / 2 - 8, { lineBreak: false });
    }
    doc.font("Helvetica-Bold").fontSize(11).fillColor(COLORS.green)
        .text("SCAN THE QR CODE", qrX, qrY + qrSize + 22, { width: qrSize, align: "center", lineBreak: false });
    doc.font("Helvetica").fontSize(9).fillColor(COLORS.muted)
        .text("to visit our website", qrX, qrY + qrSize + 42, { width: qrSize, align: "center", lineBreak: false });

    // ===== CENTER CONTENT =====
    // Logo + brand
    drawEmblem(doc, centerX - 150, 86, 26);
    doc.font("Times-Bold").fontSize(30).fillColor(COLORS.green)
        .text("Learn", centerX - 70, 70, { lineBreak: false });
    doc.font("Times-Bold").fontSize(30).fillColor(COLORS.gold)
        .text("Space", centerX - 70 + doc.widthOfString("Learn"), 70, { lineBreak: false });

    doc.font("Helvetica-Bold").fontSize(10).fillColor(COLORS.gold)
        .text("LEARN • BUILD • SUCCEED", centerX, 104, { align: "center", lineBreak: false });

    // Main title
    doc.font("Times-Bold").fontSize(56).fillColor(COLORS.green)
        .text("CERTIFICATE", centerX, 150, { align: "center", lineBreak: false });

    // Divider + subtitle
    const subtitle = "OF COURSE COMPLETION";
    doc.font("Helvetica-Bold").fontSize(15).fillColor(COLORS.green);
    const sw = doc.widthOfString(subtitle);
    doc.strokeColor(COLORS.gold).lineWidth(1.2);
    doc.moveTo(centerX - sw / 2 - 60, 238).lineTo(centerX - sw / 2 - 8, 238).stroke();
    doc.text(subtitle, centerX, 232, { align: "center", lineBreak: false });
    doc.moveTo(centerX + sw / 2 + 8, 238).lineTo(centerX + sw / 2 + 60, 238).stroke();

    // Ornamental divider
    const sparkY = 272;
    doc.strokeColor(COLORS.line).lineWidth(1);
    doc.moveTo(centerX - 90, sparkY).lineTo(centerX - 12, sparkY).stroke();
    doc.strokeColor(COLORS.goldLight).lineWidth(1);
    doc.moveTo(centerX + 12, sparkY).lineTo(centerX + 90, sparkY).stroke();

    // Certify statement
    doc.font("Helvetica-Bold").fontSize(14).fillColor(COLORS.charcoal)
        .text("THIS IS TO CERTIFY THAT", centerX, 300, { align: "center", lineBreak: false });

    // Student name
    const name = data.studentName || "Student";
    doc.font("Times-Bold").fontSize(46).fillColor(COLORS.green)
        .text(name, centerX, 330, { align: "center", width: 520, lineBreak: true });

    doc.font("Helvetica").fontSize(14).fillColor(COLORS.muted)
        .text("has successfully completed the course", centerX, 402, { align: "center", lineBreak: false });

    // Course name
    const course = data.courseTitle || "the course";
    doc.font("Times-Bold").fontSize(26).fillColor(COLORS.green)
        .text(course, centerX, 428, { align: "center", width: 560, lineBreak: true });

    doc.font("Helvetica").fontSize(13).fillColor(COLORS.muted)
        .text("and has demonstrated dedication, consistency, and excellence", centerX, 466, { align: "center", lineBreak: false });

    // ===== BOTTOM SIGNATURES =====
    const sigY = H - 108;
    doc.font("Helvetica-Bold").fontSize(13).fillColor(COLORS.charcoal)
        .text("ISSUED BY", centerX, sigY - 24, { align: "center", lineBreak: false });

    const names = Array.isArray(data.signatures) && data.signatures.length
        ? data.signatures
        : ["Anish", "Rishabh", "Raj"];
    const gap = 160;
    const startX = centerX - gap * (names.length - 1);
    names.forEach((n, i) => {
        const nx = startX + i * gap * 2 + 40;
        doc.strokeColor(COLORS.line).lineWidth(1).moveTo(nx - 110, sigY).lineTo(nx + 110, sigY).stroke();
        doc.font("Times-Bold").fontSize(16).fillColor(COLORS.charcoal)
            .text(String(n).toUpperCase(), nx, sigY + 14, { align: "center", width: 220, lineBreak: false });
    });

    doc.end();

    // Collect bytes
    const chunks = [];
    doc.on("data", (c) => chunks.push(c));
    const done = new Promise((resolve, reject) => {
        doc.on("end", resolve);
        doc.on("error", reject);
    });
    await done;

    // pdfkit browser build emits Uint8Array chunks
    const total = chunks.reduce((sum, c) => sum + c.byteLength, 0);
    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) {
        bytes.set(c, offset);
        offset += c.byteLength;
    }

    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const safeName = String(filename || "certificate")
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .replace(/\s+/g, "-");
    a.href = url;
    a.download = `${safeName}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    return blob;
}
