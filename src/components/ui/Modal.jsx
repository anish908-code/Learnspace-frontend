import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { cn } from "../../utils/cn";
import Button from "./Button";

/*
|--------------------------------------------------------------------------
| Modal — cinematic glass, technical header strip
|--------------------------------------------------------------------------
| Esc se band, backdrop click se band, focus trap + body scroll lock.
| Admin ke create/edit forms isko share karte hain.
*/

const SIZES = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
};

const Modal = ({ open, onClose, title, subtitle, size = "md", footer, children, className }) => {
    const panelRef = useRef(null);
    const lastFocused = useRef(null);

    useEffect(() => {
        if (!open) return undefined;

        lastFocused.current = document.activeElement;
        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";

        const onKeyDown = (event) => {
            if (event.key === "Escape") onClose?.();

            if (event.key === "Tab" && panelRef.current) {
                const focusables = panelRef.current.querySelectorAll(
                    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
                );
                if (!focusables.length) return;

                const first = focusables[0];
                const last = focusables[focusables.length - 1];

                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener("keydown", onKeyDown);
        const focusTarget = panelRef.current?.querySelector(
            "input:not([type=hidden]), textarea, select, button",
        );
        focusTarget?.focus({ preventScroll: true });

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = overflow;
            lastFocused.current?.focus?.({ preventScroll: true });
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
            <button
                type="button"
                aria-label="Close dialog"
                onClick={onClose}
                className="absolute inset-0 cursor-default bg-[rgb(4_5_8)]/55 backdrop-blur-md"
            />

            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={typeof title === "string" ? title : undefined}
                className={cn(
                    "card-glass relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden",
                    "rounded-t-3xl sm:rounded-3xl",
                    SIZES[size] ?? SIZES.md,
                    "reveal",
                    className,
                )}
            >
                {(title || subtitle) && (
                    <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
                        <div>
                            <span className="technical-label">Panel</span>
                            <h2 className="mt-1.5 font-display text-xl font-bold text-fg">{title}</h2>
                            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
                        </div>

                        <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
                            <X size={16} />
                        </Button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

                {footer && (
                    <div className="flex flex-wrap items-center justify-end gap-3 border-t border-line bg-bg-2/40 px-6 py-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
