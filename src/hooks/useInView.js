import { useEffect, useRef, useState } from "react";

/*
|--------------------------------------------------------------------------
| useInView
|--------------------------------------------------------------------------
| IntersectionObserver wrapper — scroll-reveal ke liye. `once` default true
| hai, taaki element viewport me aate-jaate re-trigger na ho (content baar
| baar jump karega nahi).
|
| IntersectionObserver na ho (purana browser / test env) to hook shuru se
| hi `true` deta hai — CSS reveal tab bhi turant lagega, aur content
| kabhi invisible nahi rahega.
|
| Sirf class toggle karta hai; motion CSS me rehta hai
| (`[data-reveal]` → `[data-reveal].is-visible`).
*/

const DEFAULTS = {
    threshold: 0.25,
    rootMargin: "0px 0px -12% 0px",
    once: true,
};

export default function useInView({
    threshold = DEFAULTS.threshold,
    rootMargin = DEFAULTS.rootMargin,
    once = DEFAULTS.once,
} = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(() => typeof IntersectionObserver === "undefined");

    useEffect(() => {
        const node = ref.current;
        if (!node || typeof IntersectionObserver === "undefined") return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    if (once) observer.disconnect();
                } else if (!once) {
                    setInView(false);
                }
            },
            { threshold, rootMargin },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [threshold, rootMargin, once]);

    return [ref, inView];
}
