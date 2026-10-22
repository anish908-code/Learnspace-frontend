import { useEffect, useState } from "react";

/*
|--------------------------------------------------------------------------
| useCountUp
|--------------------------------------------------------------------------
| Number ko 0 se target tak animate karta hai — but sirf jab `active` true
| ho (usually `useInView` se). easeOutExpo curve: shuru me tez, end me
| smooth settle, taaki digits "instrument" jaisa count karein.
|
| Teen shortcuts — inme koi bhi ho to animation chalti hi nahi:
|   1. value numeric nahi hai      → as-is return
|   2. prefers-reduced-motion      → seedha final value
|   3. duration <= 0               → seedha final value
|
| Reduced-motion ko subscribe karke track karte hain (runtime me preference
| badal to bhi sahi behaviour). Listener callback me setState hota hai, isliye
| effect body me nahi.
*/

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export default function useCountUp(target, { active = true, duration = 1500, decimals } = {}) {
    const numericTarget = typeof target === "number" ? target : parseFloat(target);
    const isNumber = Number.isFinite(numericTarget);
    const precision = decimals ?? (String(Math.abs(numericTarget)).includes(".") ? 2 : 0);

    const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion);
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return undefined;
        }

        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const onChange = () => setReducedMotion(query.matches);

        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, []);

    const instant = !isNumber || reducedMotion || duration <= 0;

    useEffect(() => {
        if (!active || instant) return undefined;

        let frame = 0;
        let start = null;

        const step = (timestamp) => {
            if (start === null) start = timestamp;

            const progress = Math.min((timestamp - start) / duration, 1);
            const next = numericTarget * easeOutExpo(progress);

            setValue(progress === 1 ? numericTarget : Number(next.toFixed(precision)));

            if (progress < 1) frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [active, instant, numericTarget, duration, precision]);

    if (!isNumber) return target;
    if (instant) return numericTarget.toLocaleString(undefined, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
    });

    return value.toLocaleString(undefined, {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
    });
}
