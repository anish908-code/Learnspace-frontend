import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center px-4"
            style={{ background: "var(--background)" }}
        >
            <div className="w-full max-w-lg text-center">
                {/* Decorative top accent */}
                <span className="section-label mb-6 inline-block">
                    Page Not Found
                </span>

                {/* Large 404 number */}
                <div className="relative mb-8">
                    <h1
                        className="select-none text-[9rem] font-bold leading-none tracking-tighter opacity-[0.07]"
                        style={{
                            fontFamily: '"Playfair Display", Georgia, serif',
                            color: "var(--foreground)",
                        }}
                    >
                        404
                    </h1>
                    {/* Floating icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div
                            className="flex h-24 w-24 items-center justify-center rounded-full"
                            style={{
                                background: "var(--accent-muted, #F5ECD7)",
                                boxShadow: "0 8px 30px rgba(184,134,11,0.12)",
                            }}
                        >
                            <Search
                                size={40}
                                strokeWidth={1.5}
                                style={{ color: "var(--accent)" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Message */}
                <h2
                    className="mb-3 text-3xl font-semibold tracking-tight"
                    style={{
                        fontFamily: '"Playfair Display", Georgia, serif',
                        color: "var(--foreground)",
                    }}
                >
                    Lost in the stacks?
                </h2>
                <p
                    className="mx-auto mb-10 max-w-md text-base leading-relaxed"
                    style={{ color: "var(--muted-foreground)" }}
                >
                    The page you are looking for does not exist or has been moved.
                    Let's get you back on track.
                </p>

                {/* Action buttons */}
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn-secondary w-full sm:w-auto"
                    >
                        <ArrowLeft size={16} />
                        Go Back
                    </button>
                    <Link to="/" className="btn-primary w-full sm:w-auto">
                        <Home size={16} />
                        Back to Home
                    </Link>
                </div>

                {/* Decorative divider */}
                <div className="rule-line mx-auto mt-12 max-w-xs" />

                {/* Footer hint */}
                <div className="mt-8 flex items-center justify-center gap-2">
                    <BookOpen size={14} style={{ color: "var(--border)" }} />
                    <p
                        className="text-xs"
                        style={{
                            color: "var(--muted-foreground)",
                            fontFamily: '"IBM Plex Mono", monospace',
                        }}
                    >
                        LearnSpace &mdash; Keep exploring
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
