const PageHeader = ({ title, subtitle, action, className }) => (
    <div className={`mb-6 flex flex-wrap items-start justify-between gap-4 ${className || ""}`}>
        <div>
            <h1 className="page-title">{title}</h1>
            {subtitle && (
                <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                    {subtitle}
                </p>
            )}
        </div>
        {action}
    </div>
);

export default PageHeader;
