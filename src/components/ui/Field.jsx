import { forwardRef, useId } from "react";
import { AlertCircle } from "lucide-react";

import { cn } from "../../utils/cn";

/*
|--------------------------------------------------------------------------
| Form primitives
|--------------------------------------------------------------------------
| Label hamesha visible rehta hai, validation colour + icon + text se
| communicate hoti hai (sirf colour pe depend nahi).
*/

export const Field = ({ label, htmlFor, error, hint, required, className, children }) => (
    <div className={cn("space-y-1.5", className)}>
        {label && (
            <label htmlFor={htmlFor} className="label-text">
                {label}
                {required && <span className="ml-1 text-danger">*</span>}
            </label>
        )}

        {children}

        {error ? (
            <p className="field-error" role="alert">
                <AlertCircle size={13} strokeWidth={2.4} aria-hidden="true" />
                {error}
            </p>
        ) : (
            hint && <p className="text-xs text-subtle">{hint}</p>
        )}
    </div>
);

export const Input = forwardRef(function Input({ className, invalid, ...props }, ref) {
    return (
        <input
            ref={ref}
            aria-invalid={invalid || undefined}
            className={cn("input-field", className)}
            {...props}
        />
    );
});

export const Textarea = forwardRef(function Textarea({ className, rows = 4, invalid, ...props }, ref) {
    return (
        <textarea
            ref={ref}
            rows={rows}
            aria-invalid={invalid || undefined}
            className={cn("input-field resize-y py-3", className)}
            {...props}
        />
    );
});

export const Select = forwardRef(function Select({ className, invalid, children, ...props }, ref) {
    return (
        <select
            ref={ref}
            aria-invalid={invalid || undefined}
            className={cn("input-field cursor-pointer", className)}
            {...props}
        >
            {children}
        </select>
    );
});

/* Radio group with tactile wells — quiz answers iska main user hai */
export const OptionCard = ({ name, value, checked, onChange, disabled, children, className }) => {
    const id = useId();

    return (
        <label
            htmlFor={id}
            className={cn(
                "group flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3.5",
                "transition-all duration-200 ease-out-expo",
                checked
                    ? "border-accent/60 bg-accent/8 shadow-[0_0_0_3px_rgb(var(--accent-rgb)/0.1)]"
                    : "border-line bg-surface/60 hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface",
                disabled && "pointer-events-none opacity-50",
                className,
            )}
        >
            <input
                id={id}
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="sr-only"
            />

            <span
                aria-hidden="true"
                className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all duration-200",
                    checked ? "border-accent bg-accent text-white" : "border-line-strong bg-bg-2",
                )}
            >
                <span
                    className={cn(
                        "h-2 w-2 rounded-full transition-all duration-200",
                        checked ? "scale-100 bg-white" : "scale-0 bg-transparent",
                    )}
                />
            </span>

            <span className={cn("text-sm", checked ? "font-semibold text-fg" : "text-muted")}>
                {children}
            </span>
        </label>
    );
};

export default Field;
