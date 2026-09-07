const AuthField = ({ id, label, error, children }) => (
    <div>
        <label htmlFor={id} className="label-text">{label}</label>
        {children}
        {error && (
            <p className="mt-1 text-sm font-medium" style={{ color: "var(--error)" }}>
                {error}
            </p>
        )}
    </div>
);

export default AuthField;
