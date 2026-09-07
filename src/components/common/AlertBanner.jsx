const AlertBanner = ({ type = "error", message, errors, className }) => {
    if (!message && !errors) return null;

    const isError = type === "error";
    const boxStyle = isError
        ? { background: "var(--error-bg)", color: "var(--error)" }
        : { background: "var(--success-bg)", color: "var(--success)" };

    const errorItems = errors
        ? Object.values(errors).flat().filter(Boolean)
        : [];

    return (
        <div
            className={`mb-5 rounded-md px-4 py-3 text-sm ${className || ""}`}
            style={boxStyle}
        >
            {message}
            {errorItems.length > 0 &&
                errorItems.map((item, index) => (
                    <span key={index} className="mt-1 block">
                        • {item}
                    </span>
                ))}
        </div>
    );
};

export default AlertBanner;
