import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getHomeData } from "../api/publicApi";

import {
    BookOpen,
    Play,
    Target,
    ArrowRight,
    Users,
    TrendingUp,
    Shield,
    Sparkles,
    Clock,
    Zap,
} from "lucide-react";

const features = [
    {
        icon: BookOpen,
        title: "Courses",
        text: "Browse published courses and enroll in the ones that match your interests.",
    },
    {
        icon: Play,
        title: "Lessons",
        text: "Complete lessons in order and track your progress as you learn.",
    },
    {
        icon: Target,
        title: "Final Quiz",
        text: "Unlock the final quiz after finishing all lessons. Pass it to complete the course.",
    },
];

const steps = [
    "Create your account by registering (student role by default).",
    "Browse courses and enroll in the one you like.",
    "Complete all lessons (up to 80% progress).",
    "Pass the final quiz to reach 100% progress.",
    "Submit your course project for review.",
];

const testimonials = [
    {
        name: "Priya Sharma",
        role: "Web Development Student",
        text: "LearnSpace made it so easy to track my progress. The step-by-step courses and quizzes kept me motivated throughout.",
    },
    {
        name: "Arjun Mehta",
        role: "Data Science Learner",
        text: "The project-based learning approach really works. The step-by-step courses and quizzes kept me motivated throughout.",
    },
    {
        name: "Sneha Patel",
        role: "UI/UX Design Student",
        text: "Clean interface, well-structured lessons, and a fair quiz system. I recommend LearnSpace to everyone.",
    },
];

const whyUs = [
    {
        icon: Shield,
        title: "Tracked Progress",
        text: "Monitor your learning with detailed progress analytics and revisit lessons anytime.",
    },
    {
        icon: Clock,
        title: "Learn at Your Pace",
        text: "No deadlines, no pressure. Complete courses on your own schedule, revisit lessons anytime.",
    },
    {
        icon: Zap,
        title: "Instant Feedback",
        text: "Get quiz results immediately and track your improvement with detailed progress analytics.",
    },
    {
        icon: Sparkles,
        title: "Project-Based Learning",
        text: "Apply what you learn with real projects. Get expert feedback on your submissions.",
    },
];

const defaultStats = [
    { icon: Users, number: "0", label: "Learners on the Platform" },
    { icon: BookOpen, number: "0", label: "Active Courses" },
    { icon: TrendingUp, number: "0", label: "Enrollments Made" },
];

const Landing = () => {
    const tickerRef = useRef(null);
    const [stats, setStats] = useState(defaultStats);
    const [tickerItems, setTickerItems] = useState(["Loading LearnSpace updates..."]);

    useEffect(() => {
        getHomeData()
            .then((res) => {
                const data = res.data?.data ?? res.data ?? {};
                const s = data.stats ?? {};
                setStats([
                    { icon: Users, number: String(s.learners ?? 0), label: "Learners on the Platform" },
                    { icon: BookOpen, number: String(s.courses ?? 0), label: "Active Courses" },
                    { icon: TrendingUp, number: String(s.enrollments ?? 0), label: "Enrollments Made" },
                ]);

                const courses = Array.isArray(data.courses) ? data.courses : [];
                const items = [];
                courses.forEach((c) => {
                    items.push(`Enroll in ${c.title} — Learn and Master New Skills`);
                });
                if (s.enrollments) items.push(`${s.enrollments} Course Enrollments Made`);
                items.push("Complete Lessons, Pass the Quiz & Advance");
                items.push("Submit Your Projects for Expert Review");
                setTickerItems(items.length ? items : ["LearnSpace — Learn Skills. Track Progress."]);
            })
            .catch(() => {
                setTickerItems(["LearnSpace — Learn Skills. Track Progress."]);
            });
    }, []);

    useEffect(() => {
        const el = tickerRef.current;
        if (!el) return;
        let animId;
        let pos = 0;
        const speed = 0.5;
        const tick = () => {
            pos -= speed;
            if (Math.abs(pos) >= el.scrollWidth / 2) pos = 0;
            el.style.transform = `translateX(${pos}px)`;
            animId = requestAnimationFrame(tick);
        };
        animId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animId);
    }, []);

    return (
        <div>
            {/* Ticker Bar */}
            <div
                className="overflow-hidden border-b"
                style={{ background: "var(--foreground)", borderColor: "rgba(255,255,255,0.08)" }}
            >
                <div className="flex items-center">
                    <span
                        className="shrink-0 px-4 py-2.5 text-xs font-bold uppercase tracking-wider"
                        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
                    >
                        Latest
                    </span>
                    <div className="relative overflow-hidden flex-1 py-2.5">
                        <div ref={tickerRef} className="flex whitespace-nowrap gap-12">
                            {[...tickerItems, ...tickerItems].map((item, i) => (
                                <span key={i} className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
                {/* Hero */}
                <section className="text-center">
                    <span className="section-label">Online Learning Platform</span>

                    <h1
                        className="mx-auto mt-7 max-w-4xl text-5xl leading-tight sm:text-6xl lg:text-7xl"
                        style={{
                            fontFamily: '"Playfair Display", Georgia, serif',
                            color: "var(--foreground)",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.08,
                        }}
                    >
                        Learn Skills. Track Progress.{" "}
                        <span style={{ color: "var(--accent)" }}>Master New Skills.</span>
                    </h1>

                    <p
                        className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed sm:text-xl"
                        style={{ color: "var(--muted-foreground)", lineHeight: 1.8 }}
                    >
                        Enroll in courses, complete lessons, pass the final quiz
                        and showcase your skills with real projects — all
                        in one place.
                    </p>

                    <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            to="/register"
                            className="btn-primary px-10 py-4 text-base"
                        >
                            Get Started — It&apos;s Free
                            <ArrowRight size={18} />
                        </Link>

                        <Link
                            to="/login"
                            className="btn-secondary px-10 py-4 text-base"
                        >
                            Login
                        </Link>
                    </div>
                </section>

                {/* Decorative rule */}
                <div className="mx-auto mt-20 max-w-xs">
                    <div className="rule-line" />
                </div>

                {/* Stats */}
                <section className="mt-20 flex flex-wrap items-center justify-center gap-x-16 gap-y-10">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="text-center">
                                <span
                                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                                    style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
                                >
                                    <Icon size={26} />
                                </span>
                                <p
                                    className="mt-5 text-3xl font-bold sm:text-4xl"
                                    style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)" }}
                                >
                                    {stat.number}
                                </p>
                                <p className="mt-2 text-sm" style={{ color: "var(--muted-foreground)" }}>
                                    {stat.label}
                                </p>
                            </div>
                        );
                    })}
                </section>

                {/* Decorative rule */}
                <div className="mx-auto mt-20 max-w-xs">
                    <div className="rule-line" />
                </div>

                {/* Features */}
                <section className="mt-20">
                    <div className="text-center">
                        <span className="section-label">What You Get</span>
                        <h2
                            className="mx-auto mt-5 max-w-xl text-3xl sm:text-4xl"
                            style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)", fontWeight: 600 }}
                        >
                            Everything You Need to Learn
                        </h2>
                        <p className="mx-auto mt-4 max-w-lg text-base" style={{ color: "var(--muted-foreground)" }}>
                            From enrolling in a course to learning new skills, we have you covered.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
<div key={feature.title} className="card-accent-top p-7 text-center">
                                <span
                                    className="mx-auto flex h-13 w-13 items-center justify-center rounded-lg"
                                    style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
                                >
                                    <Icon size={26} />
                                </span>

                                    <h3
                                        className="mt-6 text-lg font-semibold"
                                        style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)" }}
                                    >
                                        {feature.title}
                                    </h3>

                                    <p
                                        className="mt-3 text-sm leading-relaxed"
                                        style={{ color: "var(--muted-foreground)", lineHeight: 1.75 }}
                                    >
                                        {feature.text}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="mt-20">
                    <div className="rounded-2xl border p-10 sm:p-14 lg:p-16" style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.35)" }}>
                        <div className="text-center">
                            <span className="section-label">Why Choose Us</span>
                            <h2
                                className="mx-auto mt-5 max-w-xl text-3xl sm:text-4xl"
                                style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)", fontWeight: 600 }}
                            >
                                Built for Real Learners
                            </h2>
                        </div>

                        <div className="mt-14 grid gap-10 sm:grid-cols-2">
                            {whyUs.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <div key={item.title} className="flex items-start gap-5">
                                        <span
                                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                                            style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
                                        >
                                            <Icon size={22} />
                                        </span>
                                        <div>
                                            <h3
                                                className="text-lg font-semibold"
                                                style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)" }}
                                            >
                                                {item.title}
                                            </h3>
                                            <p
                                                className="mt-2 text-sm leading-relaxed"
                                                style={{ color: "var(--muted-foreground)", lineHeight: 1.75 }}
                                            >
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Steps */}
                <section className="mt-20 rounded-2xl border p-10 lg:p-14" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                    <h2
                        className="text-center text-3xl sm:text-4xl"
                        style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)", fontWeight: 600 }}
                    >
                        How It Works
                    </h2>

                    <p
                        className="mx-auto mt-4 max-w-xl text-center text-base"
                        style={{ color: "var(--muted-foreground)" }}
                    >
                        From registration to project completion — five simple steps.
                    </p>

                    <ol className="mx-auto mt-14 grid max-w-4xl gap-x-10 gap-y-8 sm:grid-cols-2">
                        {steps.map((step, index) => (
                            <li key={step} className="flex items-start gap-5">
                                <span
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                                    style={{ background: "var(--accent)" }}
                                >
                                    {index + 1}
                                </span>
                                <span
                                    className="pt-1 text-base leading-relaxed"
                                    style={{ color: "var(--muted-foreground)", lineHeight: 1.75 }}
                                >
                                    {step}
                                </span>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Testimonials */}
                <section className="mt-20">
                    <div className="text-center">
                        <span className="section-label">Testimonials</span>
                        <h2
                            className="mx-auto mt-5 max-w-xl text-3xl sm:text-4xl"
                            style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)", fontWeight: 600 }}
                        >
                            What Our Students Say
                        </h2>
                    </div>

                    <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((t) => (
                            <div key={t.name} className="card p-7">
                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: "var(--muted-foreground)", lineHeight: 1.75 }}
                                >
                                    &ldquo;{t.text}&rdquo;
                                </p>
                                <div className="mt-6 pt-5 border-t" style={{ borderColor: "var(--border)" }}>
                                    <p
                                        className="text-sm font-semibold"
                                        style={{ color: "var(--foreground)" }}
                                    >
                                        {t.name}
                                    </p>
                                    <p className="mt-0.5 text-xs" style={{ color: "var(--muted-foreground)" }}>
                                        {t.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="mt-20 rounded-2xl px-8 py-20 text-center" style={{ background: "var(--foreground)" }}>
                    <h2
                        className="text-3xl sm:text-4xl"
                        style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--background)", fontWeight: 600 }}
                    >
                        Ready to start learning?
                    </h2>

                    <p
                        className="mx-auto mt-4 max-w-lg text-base leading-relaxed"
                        style={{ color: "#A0A0A0", lineHeight: 1.75 }}
                    >
                        Join LearnSpace today and take the first step towards your
                        next skill and project.
                    </p>

                    <Link
                        to="/register"
                        className="mt-10 inline-flex items-center justify-center gap-2 rounded-md px-10 py-4 text-base font-semibold transition-all duration-200"
                        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
                    >
                        Create Free Account
                        <ArrowRight size={18} />
                    </Link>
                </section>
            </div>

            {/* Bottom Ticker */}
            <div
                className="overflow-hidden border-t"
                style={{ background: "var(--foreground)", borderColor: "rgba(255,255,255,0.08)" }}
            >
                <div className="flex items-center">
                    <span
                        className="shrink-0 px-4 py-2.5 text-xs font-bold uppercase tracking-wider"
                        style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
                    >
                        Trending
                    </span>
                    <div className="relative overflow-hidden flex-1 py-2.5">
                        <div className="flex whitespace-nowrap gap-12" style={{ animation: "ticker-reverse 40s linear infinite" }}>
                            {[...tickerItems, ...tickerItems].map((item, i) => (
                                <span key={i} className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes ticker-reverse {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
};

export default Landing;
