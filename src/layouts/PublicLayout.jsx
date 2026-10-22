import { Link, Outlet } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { BrandGlyph } from "../components/ui/BrandMark";
import { ButtonLink } from "../components/ui/Button";
import { ThemeSwitch } from "../theme/ThemeToggle";
import { GeoMark } from "../components/ui/Deco";

/*
|--------------------------------------------------------------------------
| PublicLayout
|--------------------------------------------------------------------------
| Lightweight header — transparent, semi-transparent surface, minimal border.
| Environment me blend hota hai, phir bhi brand + ek dominant CTA rakhta hai.
*/

const PublicLayout = () => (
    <div className="relative flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-line bg-bg/70 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-shell items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
                <Link to="/" className="flex items-center gap-3">
                    <BrandGlyph size="sm" />
                    <span className="font-display text-lg font-extrabold tracking-[-0.015em]">
                        <span className="text-fg">Learn</span>
                        <span className="text-accent">Space</span>
                    </span>
                </Link>

                <nav className="flex items-center gap-2 sm:gap-3">
                    <Link to="/login" className="nav-item hidden h-10 px-4 sm:inline-flex">
                        Log in
                    </Link>

                    <ButtonLink to="/register" size="md" className="hidden sm:inline-flex">
                        Get started
                        <ArrowUpRight size={15} />
                    </ButtonLink>

                    <ThemeSwitch />
                </nav>
            </div>
        </header>

        <main className="flex-1">
            <Outlet />
        </main>

        <footer className="relative mt-auto border-t border-line bg-bg-2/40">
            <GeoMark shape="diamond" tone="gold" className="left-[8%] top-8 h-2.5 w-2.5" />
            <GeoMark shape="circle" tone="accent" className="right-[12%] top-14 h-2 w-2" />

            <div className="mx-auto w-full max-w-shell px-5 py-14 sm:px-8">
                <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
                    <div className="max-w-sm">
                        <div className="flex items-center gap-3">
                            <BrandGlyph size="sm" />
                            <span className="font-display text-lg font-extrabold tracking-[-0.015em]">
                                <span className="text-fg">Learn</span>
                                <span className="text-accent">Space</span>
                            </span>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-muted">
                            A project-based learning platform. Courses, lessons, quizzes and
                            certificates — tracked in one instrument.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:grid-cols-3">
                        <div className="space-y-3">
                            <p className="technical-label">Product</p>
                            <Link to="/login" className="block text-sm text-muted transition-colors hover:text-accent">
                                Log in
                            </Link>
                            <Link to="/register" className="block text-sm text-muted transition-colors hover:text-accent">
                                Create account
                            </Link>
                        </div>

                        <div className="space-y-3">
                            <p className="technical-label">System</p>
                            <p className="numeric text-sm text-muted">build 2026.09</p>
                            <p className="flex items-center gap-2 text-sm text-muted">
                                <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />
                                all systems normal
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row">
                    <p className="text-xs text-subtle">© {new Date().getFullYear()} LearnSpace</p>
                    <p className="technical-label">Built for learners · designed for focus</p>
                </div>
            </div>
        </footer>
    </div>
);

export default PublicLayout;
