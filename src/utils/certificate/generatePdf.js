import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const RATIO = 16 / 9;

// Generates a high-quality PNG from the certificate DOM node
async function renderCertificateToCanvas(node, scale = 2) {
    if (!node) throw new Error("Certificate element not found");

    return html2canvas(node, {
        scale,
        backgroundColor: "#FBF8F1",
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: node.scrollWidth,
        height: node.scrollHeight,
    });
}

// Exports the certificate as a landscape PDF preserving the on-screen layout
export async function downloadCertificatePdf({ node, filename = "certificate" }) {
    const canvas = await renderCertificateToCanvas(node, 2);

    const imgWidth = 1123; // A4-ish landscape base width points (~297mm)
    const imgHeight = Math.round(imgWidth / RATIO);

    const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [imgWidth, imgHeight],
        compress: true,
    });

    const imgData = canvas.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

    const safeName = String(filename || "certificate")
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .replace(/\s+/g, "-");

    pdf.save(`${safeName}.pdf`);
    return pdf;
}

export async function generateCertificatePng(node) {
    const canvas = await renderCertificateToCanvas(node, 2);
    return canvas.toDataURL("image/png");
}

// Generates a QR data URL (kept for reuse)
export { generateQrDataUrl } from "../qr";
