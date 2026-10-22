import { forwardRef } from "react";
import { Link } from "react-router-dom";

import { cn } from "../../utils/cn";
import { buttonVariants } from "./buttonVariants";
import Spinner from "./Spinner";

/*
|--------------------------------------------------------------------------
| Button / ButtonLink
|--------------------------------------------------------------------------
| Physical, premium, precise. Chhota movement (1–3px), tactile shadow,
| strong focus ring, 32–48px sizes.
|
| Link ke liye ButtonLink use karo — <button> ki role semantics ko <a> pe
| force karna screen readers ke liye galat hota hai.
*/

const Button = forwardRef(function Button(
    {
        variant = "primary",
        size = "md",
        loading = false,
        loadingText,
        disabled = false,
        type = "button",
        fullWidth = false,
        className,
        children,
        ...props
    },
    ref,
) {
    const isDisabled = disabled || loading;

    return (
        <button
            ref={ref}
            type={type}
            disabled={isDisabled}
            aria-busy={loading || undefined}
            className={buttonVariants({
                variant,
                size,
                className: cn(fullWidth && "w-full", className),
            })}
            {...props}
        >
            {loading ? (
                <>
                    <Spinner />
                    {loadingText}
                </>
            ) : (
                children
            )}
        </button>
    );
});

export const ButtonLink = forwardRef(function ButtonLink(
    { variant = "primary", size = "md", fullWidth = false, className, to, children, ...props },
    ref,
) {
    return (
        <Link
            ref={ref}
            to={to}
            className={buttonVariants({
                variant,
                size,
                className: cn(fullWidth && "w-full", className),
            })}
            {...props}
        >
            {children}
        </Link>
    );
});

export default Button;
