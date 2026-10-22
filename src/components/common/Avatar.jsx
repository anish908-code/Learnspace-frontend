import { useState } from "react";
import { cn } from "../../utils/cn";

/* Avatar — gold-free: accent initials in a tactile well, hairline ring */
const Avatar = ({ name = "", src, className = "h-10 w-10 text-sm", ring = true }) => {
    // Purani/badli hui photo ka URL 404 ho sakta hai — tab broken image icon
    // dikhne ke bajaye initials pe wapas aa jao. Fail hua URL yaad rakhte hain,
    // isliye naya src aate hi apne aap retry ho jata hai (effect ki zaroorat nahi).
    const [failedSrc, setFailedSrc] = useState(null);

    const initials = (name || "?")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

    if (src && failedSrc !== src) {
        return (
            <img
                src={src}
                alt={name || "avatar"}
                onError={() => setFailedSrc(src)}
                className={cn(
                    className,
                    "shrink-0 rounded-full object-cover",
                    ring && "ring-1 ring-inset ring-line-strong",
                )}
            />
        );
    }

    return (
        <span
            aria-hidden={name ? undefined : "true"}
            className={cn(
                className,
                "flex shrink-0 items-center justify-center rounded-full",
                "bg-accent/12 font-display font-bold text-accent",
                ring && "ring-1 ring-inset ring-accent/25",
            )}
        >
            {initials}
        </span>
    );
};

export default Avatar;
