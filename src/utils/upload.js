import api from "../api/axios";
import { getApiError } from "./api";

/* Raw file ka upper bound — isse bada mat padho, memory me load karna hai. */
const MAX_FILE_BYTES = 20 * 1024 * 1024;

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const loadImage = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Could not read that file."));
        reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error("That file could not be read as an image."));
            img.onload = () => resolve(img);
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });

/*
| Transparent pixels hain ya nahi — JPEG alpha nahi rakhta, aur bina background
| fill kiye PNG ko JPEG me encode karne par transparent area BLACK ho jata hai.
| Isliye pehle pata karo, phir output format choose karo.
*/
const hasTransparency = (ctx, width, height) => {
    try {
        const { data } = ctx.getImageData(0, 0, width, height);
        // Poore pixels scan karne se bache ke liye har 4th pixel dekho.
        for (let i = 3; i < data.length; i += 16) {
            if (data[i] < 250) return true;
        }
        return false;
    } catch {
        // Cross-origin canvas taint ho gaya — assume transparent mat lo.
        return false;
    }
};

const resizeImage = async (file, maxSize = 1024) => {
    if (!file) throw new Error("No file selected.");
    if (!ACCEPTED.includes(file.type)) {
        throw new Error("Please pick a JPG, PNG, WEBP or GIF image.");
    }
    if (file.size > MAX_FILE_BYTES) {
        throw new Error("Image is too large. Please pick one under 20 MB.");
    }

    const img = await loadImage(file);

    let { naturalWidth: width, naturalHeight: height } = img;
    if (!width || !height) throw new Error("That image has no readable dimensions.");

    if (width > maxSize || height > maxSize) {
        const scale = maxSize / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not process that image.");

    // JPEG me flatten karne se pehle white background bhar do.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    const transparent = hasTransparency(ctx, width, height);
    const mime = transparent ? (file.type === "image/webp" ? "image/webp" : "image/png") : "image/jpeg";

    return canvas.toDataURL(mime, 0.85);
};

/*
| Photo upload karo aur uska URL wapas do. Axios ka raw error.message user ko
| "Request failed with status code 422" dikhata hai, isliye Laravel ke message
| ko `getApiError` se nikalke aage badhao.
*/
export const uploadImage = async (file) => {
    const dataUrl = await resizeImage(file);

    try {
        const response = await api.post("/auth/upload-image", { image: dataUrl });
        return response.data.url;
    } catch (error) {
        throw new Error(getApiError(error).message || "Upload failed. Please try again.", {
            cause: error,
        });
    }
};
