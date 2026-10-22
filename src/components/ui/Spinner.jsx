export const Spinner = ({ className = "", label = "Loading" }) => (
    <span
        role="status"
        aria-label={label}
        className={`inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
);

export default Spinner;
