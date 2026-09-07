import AlertBanner from "../common/AlertBanner";

const AuthCard = ({ title, subtitle, children, error, success }) => (
    <div className="flex w-full items-center justify-center px-4 py-20 sm:py-28">
        <div className="w-full max-w-md">
            <div className="mb-8 text-center">
                <h1
                    className="text-4xl sm:text-5xl"
                    style={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        color: "#ffffff",
                        fontWeight: 600,
                        textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                    }}
                >
                    {title}
                </h1>
                {subtitle && (
                    <p
                        className="mt-2 text-sm"
                        style={{
                            color: "#e2e8f0",
                            textShadow: "0 1px 8px rgba(0,0,0,0.5)",
                        }}
                    >
                        {subtitle}
                    </p>
                )}
            </div>

            <div
                className="auth-card-glass rounded-2xl p-6 shadow-2xl backdrop-blur-xl sm:p-8"
                style={{
                    background:
                        "linear-gradient(150deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 40%, rgba(237,233,254,0.97) 100%)",
                    border: "1px solid rgba(255,255,255,0.7)",
                    boxShadow:
                        "0 24px 60px -20px rgba(2,6,23,0.7), 0 0 0 1px rgba(124,58,237,0.08), 0 12px 40px -12px rgba(124,58,237,0.25)",
                }}
            >
                {success && <AlertBanner type="success" message={success} />}
                {error && <AlertBanner type="error" message={error} />}
                {children}
            </div>
        </div>
    </div>
);

export default AuthCard;
