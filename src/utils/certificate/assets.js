// Resolves an image src safely (handles relative public paths, data URLs, remote URLs)
export const resolveImageSrc = (src) => {
    if (!src) return null;

    if (typeof src !== "string") return null;

    if (src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("blob:")) {
        return src;
    }

    if (src.startsWith("/")) {
        return src;
    }

    return `/${src}`;
};

export default resolveImageSrc;
