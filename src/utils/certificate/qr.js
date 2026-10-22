import QRCode from "qrcode";

export const generateCertificateQr = () => {
    const websiteUrl = `${window.location.origin}/`;

    return QRCode.toDataURL(websiteUrl, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 420,
        color: {
            dark: "#17352B",
            light: "#FFFFFF",
        },
    });
};
