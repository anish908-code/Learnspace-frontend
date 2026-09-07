const EmptyState = ({ icon: Icon = null, title, message, action, className, padded = true }) => (
    <div
        className={`card text-center ${padded ? "p-10" : "p-6"} ${className || ""}`}
    >
        {Icon && <Icon size={32} className="mx-auto" style={{ color: "var(--border)" }} />}
        {title && (
            <p className="mt-3 font-semibold" style={{ color: "var(--foreground)" }}>
                {title}
            </p>
        )}
        {message && (
            <p className={title ? "mt-1" : "mt-3"} style={{ color: "var(--muted-foreground)" }}>
                {message}
            </p>
        )}
        {action && <div className="mt-4">{action}</div>}
    </div>
);

export default EmptyState;
