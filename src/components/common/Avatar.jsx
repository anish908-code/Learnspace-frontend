const Avatar = ({ name = "", src, className = "h-10 w-10 text-sm" }) => {
    const initials = (name || "?")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    if (src) {
        return (
            <img
                src={src}
                alt={name || "avatar"}
                className={`${className} shrink-0 rounded-full border border-warm-border object-cover`}
            />
        );
    }

    return (
        <span
            className={`${className} flex shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-white`}
        >
            {initials}
        </span>
    );
};

export default Avatar;
