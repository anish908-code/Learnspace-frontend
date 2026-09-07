import { Link, Outlet } from "react-router-dom";
import { GraduationCap } from "lucide-react";

const PublicLayout = () => {
    return (
        <div className="flex min-h-screen flex-col" style={{ background: "var(--background)" }}>
            <header className="sticky top-0 z-20 border-b" style={{ borderColor: "var(--border)", background: "rgba(250,250,248,0.9)", backdropFilter: "blur(12px)" }}>
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:py-4">
                    <Link to="/" className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
                            <GraduationCap size={18} />
                        </span>
                        <span className="text-lg font-semibold tracking-tight" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)" }}>
                            LearnSpace
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link to="/login" className="btn-ghost text-sm">
                            Login
                        </Link>
                        <Link to="/register" className="btn-primary text-sm">
                            Register
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="border-t py-6" style={{ borderColor: "var(--border)" }}>
                <div className="mx-auto max-w-5xl px-4 text-center">
                    <span className="section-label text-warm-gray" style={{ color: "var(--muted-foreground)" }}>
                        LearnSpace
                    </span>
                    <p className="mt-1 text-sm" style={{ color: "var(--muted-foreground)" }}>
                        Online Learning Platform
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
