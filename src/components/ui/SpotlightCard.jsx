import { useRef } from "react";

import { cn } from "../../utils/cn";

/*
|--------------------------------------------------------------------------
| SpotlightCard
|--------------------------------------------------------------------------
| Cursor ke saath ek soft accent light pool chalta hai. Sirf CSS variables
| update hote hain (no re-render), touch devices pe mouse tracking disabled.
*/

const SpotlightCard = ({ as: Tag = "div", className, children, intensity = 1, ...props }) => {
    const ref = useRef(null);
    const frame = useRef(0);

    const handleMove = (event) => {
        if (event.pointerType === "touch" || !ref.current) return;

        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
            const rect = ref.current.getBoundingClientRect();
            ref.current.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
            ref.current.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
            ref.current.style.setProperty("--spot-alpha", String(intensity));
        });
    };

    return (
        <Tag
            ref={ref}
            onPointerMove={handleMove}
            className={cn("spotlight", className)}
            {...props}
        >
            {children}
        </Tag>
    );
};

export default SpotlightCard;
