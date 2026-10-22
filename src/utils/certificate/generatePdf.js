const RATIO = 16 / 9;

/*
|--------------------------------------------------------------------------
| Lazy PDF engine
|--------------------------------------------------------------------------
| jspdf + html2canvas milkar ~450 kB hain. Pehle ye top-level import se
| certificate page ke chunk me aa jaate the, isliye certificates page
| kholne pe hi pura payload download hota tha. Ab dynamic import se
| sirf tab load hote hain jab user actually "Download PDF" dabata hai.
*/

let enginePromise = null;

const loadEngine = () => {
    if (!enginePromise) {
        enginePromise = Promise.all([import("html2canvas"), import("jspdf")])
            .then(([canvasModule, pdfModule]) => ({
                html2canvas: canvasModule.default,
                jsPDF: pdfModule.jsPDF,
            }))
            .catch((error) => {
                // Reset so a later attempt can retry instead of caching the failure
                enginePromise = null;
                throw error;
            });
    }

    return enginePromise;
};

// Generates a high-quality PNG from the certificate DOM node
async function renderCertificateToCanvas(html2canvas, node, scale = 2) {
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
    const { html2canvas, jsPDF } = await loadEngine();

    const canvas = await renderCertificateToCanvas(html2canvas, node, 2);

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
    const { html2canvas } = await loadEngine();
    const canvas = await renderCertificateToCanvas(html2canvas, node, 2);

    return canvas.toDataURL("image/png");
}

// Generates a QR data URL (kept for reuse)
