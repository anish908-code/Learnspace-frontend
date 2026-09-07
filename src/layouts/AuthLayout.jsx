const AuthLayout = ({ image, children }) => {
    void image;

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b1020] px-4 py-12">
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(124,58,237,0.45),transparent_42%),radial-gradient(circle_at_82%_18%,rgba(37,99,235,0.45),transparent_45%),radial-gradient(circle_at_70%_85%,rgba(236,72,153,0.4),transparent_45%),radial-gradient(circle_at_15%_80%,rgba(14,165,233,0.4),transparent_45%)]"
            />

            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(160deg,rgba(2,6,23,0.35),rgba(2,6,23,0.15)_45%,rgba(2,6,23,0.4))]"
            />

            <div
                aria-hidden="true"
                className="auth-anim-float absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-violet-500/30 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="auth-anim-float absolute right-[8%] top-[55%] h-80 w-80 rounded-full bg-sky-500/25 blur-3xl"
                style={{ animationDelay: "-3s" }}
            />
            <div
                aria-hidden="true"
                className="auth-anim-float absolute bottom-[6%] left-[40%] h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl"
                style={{ animationDelay: "-6s" }}
            />

            <div className="relative z-10 w-full max-w-md">
                <div className="auth-anim-fade-up auth-delay-200">{children}</div>
            </div>
        </div>
    );
};

export default AuthLayout;
