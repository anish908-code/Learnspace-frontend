import api from "../api/axios";

const resizeImage = (file, maxSize = 1024) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Could not read file."));
        reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error("Invalid image file."));
            img.onload = () => {
                let { width, height } = img;
                if (width > maxSize || height > maxSize) {
                    const scale = maxSize / Math.max(width, height);
                    width = Math.round(width * scale);
                    height = Math.round(height * scale);
                }
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                const mime = ["image/png", "image/webp", "image/gif"].includes(file.type) ? file.type : "image/jpeg";
                resolve(canvas.toDataURL(mime, 0.85));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
};

export const uploadImage = async (file) => {
    const dataUrl = await resizeImage(file);
    const response = await api.post("/auth/upload-image", { image: dataUrl });
    return response.data.url;
};