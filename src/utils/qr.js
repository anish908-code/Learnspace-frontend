import QRCode from "qrcode";

export const generateQrDataUrl = async (text) => {
    return QRCode.toDataURL(text, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 300,
        color: {
            dark: "#1A2F1D",
            light: "#FFFFFF",
        },
    });
};

export default generateQrDataUrl;
