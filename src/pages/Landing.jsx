import { useEffect, useState } from "react";
import {
    ArrowRight,
    ArrowUpRight,
    Award,
    BookOpen,
    Layers,
    Play,
    Shield,
    Sparkles,
    Target,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";

import { getHomeData } from "../api/publicApi";
import { ButtonLink } from "../components/ui/Button";
import SpotlightCard from "../components/ui/SpotlightCard";
import { CornerBrackets, DecoDivider, GeoMark, SectionMarker, Sunburst } from "../components/ui/Deco";
import { StatusLabel } from "../components/ui/Badge";
import useInView from "../hooks/useInView";
import useCountUp from "../hooks/useCountUp";
import { cn } from "../utils/cn";

/*
|--------------------------------------------------------------------------
| Landing
|--------------------------------------------------------------------------
| Structure aur data flow (getHomeData → stats + ticker) wahi hai; sirf
| presentation badli hai. Composition:
|   I    readout ticker + asymmetric hero (layered architecture panel)
|   II   live readout panel (scroll-reveal + count-up + sweep)
|   III  the three pillars (lessons / quiz / project)
|   IV   split: how it works (numbered rails) + capabilities
|   V    testimonials as a ledger, then closing CTA
*/

/*
|--------------------------------------------------------------------------
| ReadoutCell
|--------------------------------------------------------------------------
| Ek telemetry cell. Number 0 se target tak count hota hai (sirf jab panel
| viewport me aaye), cell apni position se thoda late reveal hota hai, aur
| peeche ek ghost number depth deta hai. Icon well ka tone cycle hota hai
| taaki 5 cells ek rhythm banayein — random rainbow nahi.
*/

const READOUT_TONES = [
    { well: "text-accent", number: "text-accent" },
    { well: "text-teal", number: "text-teal" },
    { well: "text-gold", number: "text-gold" },
    { well: "text-accent-bright", number: "text-fg" },
    { well: "text-teal", number: "text-fg" },
];

const ReadoutCell = ({ stat, index, active }) => {
    const Icon = stat.icon;
    const tone = READOUT_TONES[index % READOUT_TONES.length];
    const count = useCountUp(stat.number, { active, duration: 1600 + index * 120 });

    return (
        <div
            className={cn("readout-cell bg-surface/70", active && "is-visible")}
            data-reveal
            style={{ "--reveal-delay": `${180 + index * 110}ms` }}
        >
            <span aria-hidden="true" className="readout-ghost">
                {String(index + 1).padStart(2, "0")}
            </span>

            <div className="relative flex items-center justify-between gap-3">
                <span className={cn("icon-well h-8 w-8 rounded-[0.55rem]", tone.well)}>
                    <Icon size={15} strokeWidth={2.2} />
                </span>

                <span className="numeric text-[0.625rem] text-subtle">
                    ch{String(index + 1).padStart(2, "0")}
                </span>
            </div>

            <div className="relative">
                <p className={cn("numeric text-[2.1rem] font-bold leading-none tracking-tight", tone.number)}>
                    {count}
                </p>

                <p className="technical-label mt-2.5">{stat.label}</p>
            </div>
        </div>
    );
};

const features = [
    {
        icon: Play,
        title: "Lessons",
        text: "Complete lessons in order and watch your progress bar move as you learn.",
    },
    {
        icon: Target,
        title: "Final Quiz",
        text: "The final quiz unlocks at 80%. Pass it and the course is yours.",
    },
    {
        icon: Sparkles,
        title: "Projects",
        text: "Submit a real project and get it reviewed — the proof that you learnt it.",
    },
];

const steps = [
    { title: "Register", text: "Create an account. Student is the default role." },
    { title: "Enroll", text: "Browse published courses and pick the one you want." },
    { title: "Complete lessons", text: "Work through every lesson to reach 80% progress." },
    { title: "Pass the quiz", text: "Clear the final quiz to hit 100% and unlock certificates." },
    { title: "Submit the project", text: "Ship your project and wait for the review." },
];

const testimonials = [
    {
        name: "Priya Sharma",
        role: "Web Development",
        text: "Progress tracking is what kept me going. Every lesson moved a number I could actually see.",
    },
    {
        name: "Arjun Mehta",
        role: "Data Science",
        text: "Project-based learning works. Finishing the project meant I had genuinely understood the course.",
    },
    {
        name: "Sneha Patel",
        role: "UI/UX Design",
        text: "Clean structure, fair quiz system, and a certificate I could point at in an interview.",
    },
];

const whyUs = [
    { icon: Shield, title: "Tracked progress", text: "Detailed progress analytics. Revisit any lesson, any time." },
    { icon: Zap, title: "Instant feedback", text: "Quiz results land immediately, so you know where you stand." },
    { icon: Award, title: "Certificates", text: "Earn a certificate after completing your course and project." },
    { icon: TrendingUp, title: "Built on your data", text: "Enrollments, submissions and scores — one source of truth." },
];

const fallbackTicker = ["LearnSpace — Learn skills. Track progress."];

const Ticker = ({ label, items }) => (
    <div className="ticker">
        <span className="ticker-badge">{label}</span>

        <div className="ticker-viewport">
            <div className="ticker-track">
                <div className="ticker-half">
                    {items.map((item, index) => (
                        <span key={`${item}-${index}`} className="ticker-item">
                            {item}
                        </span>
                    ))}
                </div>
                <div className="ticker-half" aria-hidden="true">
                    {items.map((item, index) => (
                        <span key={`${item}-${index}`} className="ticker-item">
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const Landing = () => {
    const [stats, setStats] = useState([
        { icon: Users, number: "0", label: "Learners" },
        { icon: BookOpen, number: "0", label: "Courses" },
        { icon: TrendingUp, number: "0", label: "Enrollments" },
        { icon: Layers, number: "0", label: "Lessons" },
        { icon: Award, number: "0", label: "Certificates" },
    ]);
    const [tickerItems, setTickerItems] = useState(["Loading LearnSpace updates..."]);

    /* Platform readout — scroll pe reveal + count-up ka trigger.
       threshold 0.2 + neeche ka margin: panel tab trigger ho jab uska
       khaas hissa screen par aa jaye (puri tarah scroll karne ka wait
       nahi karna padta). */
    const [panelRef, inView] = useInView({ threshold: 0.2 });

    useEffect(() => {
        let active = true;

        getHomeData()
            .then((res) => {
                if (!active) return;

                const data = res.data?.data ?? res.data ?? {};
                const s = data.stats ?? {};

                setStats([
                    { icon: Users, number: String(s.learners ?? 0), label: "Learners" },
                    { icon: BookOpen, number: String(s.courses ?? 0), label: "Courses" },
                    { icon: TrendingUp, number: String(s.enrollments ?? 0), label: "Enrollments" },
                    { icon: Layers, number: String(s.lessons ?? 0), label: "Lessons" },
                    { icon: Award, number: String(s.certificates ?? 0), label: "Certificates" },
                ]);

                const courses = Array.isArray(data.courses) ? data.courses : [];
                const items = [];
                courses.forEach((c) => items.push(`Enroll in ${c.title}`));
                if (s.enrollments) items.push(`${s.enrollments} enrollments made`);
                items.push("Complete lessons, pass the quiz, advance");
                items.push("Submit projects for review");

                setTickerItems(items.length ? items : fallbackTicker);
            })
            .catch(() => {
                if (active) setTickerItems(fallbackTicker);
            });

        return () => {
            active = false;
        };
    }, []);

    return (
        <div className="relative">
            <Ticker label="Live" items={tickerItems} />

            {/* =====================================================
                HERO — asymmetric: content left, architecture panel right
                ===================================================== */}
            <section className="relative overflow-hidden">
                <div aria-hidden="true" className="hero-ambient absolute inset-0" />
                <div aria-hidden="true" className="grid-fine absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_40%,#000,transparent)]" />
                <GeoMark shape="diamond" tone="gold" className="left-[6%] top-[18%] h-2.5 w-2.5" />
                <GeoMark shape="square" tone="accent" className="right-[46%] top-[12%] h-2 w-2" />
                <GeoMark shape="circle" tone="teal" className="bottom-[14%] left-[42%] h-1.5 w-1.5" />

                <div className="relative mx-auto grid w-full max-w-shell grid-cols-1 items-center gap-16 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:pb-32 lg:pt-24">
                    <div className="reveal max-w-2xl">
                        <StatusLabel>Project-based learning platform</StatusLabel>

                        <h1 className="display-hero mt-7 text-[2.5rem] sm:text-[3.5rem] lg:text-[4.25rem]">
                            Learn the craft.
                            <br />
                            <span className="text-gradient">Prove the work.</span>
                        </h1>

                        <p className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                            Enroll in a course, finish every lesson, clear the final quiz, then ship a
                            real project. Progress is measured, not guessed — and the certificate is
                            verifiable by anyone.
                        </p>

                        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <ButtonLink to="/register" size="lg">
                                Start learning — free
                                <ArrowRight size={17} />
                            </ButtonLink>

                            <ButtonLink to="/login" variant="secondary" size="lg">
                                Log in
                            </ButtonLink>
                        </div>

                        <dl className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-6">
                            {[
                                { value: "80%", label: "lessons gate the quiz" },
                                { value: "20%", label: "quiz completes the course" },
                                { value: "100%", label: "verified certificate" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-baseline gap-2.5">
                                    <dt className="numeric text-xl font-bold text-accent">{item.value}</dt>
                                    <dd className="technical-label">{item.label}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {/* Architecture panel */}
                    <div className="reveal reveal-3 relative">
                        <div className="surface-a relative overflow-hidden rounded-[1.75rem] p-8 shadow-float sm:p-10">
                            <CornerBrackets />
                            <Sunburst className="-right-16 -top-16 h-64 w-64 opacity-45" />

                            <div className="relative flex items-center justify-between">
                                <span className="technical-label">Progress model</span>
                                <span className="badge badge-accent">live</span>
                            </div>

                            <div className="relative mt-10 space-y-7">
                                {[
                                    { label: "Lessons", pct: 80, state: "gate" },
                                    { label: "Final quiz", pct: 20, state: "unlocks at 80" },
                                    { label: "Project review", pct: 0, state: "after completion" },
                                ].map((row) => (
                                    <div key={row.label}>
                                        <div className="flex items-baseline justify-between gap-4">
                                            <span className="text-sm font-medium text-fg">{row.label}</span>
                                            <span className="technical-label">{row.state}</span>
                                        </div>

                                        <div
                                            className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-fg/8"
                                            role="presentation"
                                        >
                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-bright"
                                                style={{ width: `${row.pct}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="relative mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line">
                                {[
                                    { k: "lessons", v: "80%" },
                                    { k: "quiz", v: "20%" },
                                    { k: "server", v: "calculated" },
                                ].map((cell) => (
                                    <div key={cell.k} className="bg-surface/80 px-4 py-4">
                                        <p className="technical-label">{cell.k}</p>
                                        <p className="mt-1.5 text-sm font-bold tracking-[-0.01em] text-fg">{cell.v}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                PLATFORM READOUT — instrument panel
                Scroll me dikhte hi: sweep + blur-off focus + count-up.
                Numbers API se aate hain, animation sirf unhe roll out
                karti hai.
            ===================================================== */}
            <section className="relative border-y border-line bg-bg-2/40">
                <div className="mx-auto w-full max-w-shell px-5 py-14 sm:px-8 sm:py-20">
                    <div
                        data-reveal
                        className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", inView && "is-visible")}
                    >
                        <div>
                            <SectionMarker index={2}>Platform readout</SectionMarker>

                            <h2 className="display-section mt-5 text-[1.875rem] sm:text-[2.375rem]">
                                The instrument,
                                <br />
                                <span className="text-gradient">live off the API.</span>
                            </h2>
                        </div>

                        <p className="max-w-sm text-sm leading-relaxed text-muted">
                            Figures are pulled from the public endpoint on every load — nothing here is
                            hardcoded.
                        </p>
                    </div>

                    <div
                        ref={panelRef}
                        data-reveal
                        className={cn(
                            "readout-panel readout-sweep mt-12",
                            inView && "is-visible",
                        )}
                    >
                        <div aria-hidden="true" className="readout-grid" />
                        <span aria-hidden="true" className="readout-notch -left-px -top-px border-l border-t" />
                        <span aria-hidden="true" className="readout-notch -right-px -top-px border-r border-t" />
                        <span aria-hidden="true" className="readout-notch -bottom-px -left-px border-b border-l" />
                        <span aria-hidden="true" className="readout-notch -bottom-px -right-px border-b border-r" />

                        {/* Device-style header strip */}
                        <div className="readout-bar">
                            <span className="sonar" aria-hidden="true" />
                            <span className="technical-label">live telemetry</span>

                            <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-line-strong to-transparent" />

                            <span className="numeric text-[0.6875rem] text-subtle">
                                {String(stats.length).padStart(2, "0")} signals
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-px bg-line md:grid-cols-3 lg:grid-cols-5">
                            {stats.map((stat, index) => (
                                <ReadoutCell key={stat.label} stat={stat} index={index} active={inView} />
                            ))}
                        </div>

                        {/* Footer rail — mono, hairline, gold tick */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3.5">
                            <p className="technical-label">source — /api/public/home</p>
                            <p className="flex items-center gap-2 text-[0.6875rem] text-subtle">
                                <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-gold" />
                                updated on load
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* =====================================================
                PILLARS
                ===================================================== */}
            <section className="relative mx-auto w-full max-w-shell px-5 py-20 sm:px-8 sm:py-24">
                <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
                    <div className="lg:sticky lg:top-28 lg:self-start">
                        <SectionMarker index={3}>The three pillars</SectionMarker>
                        <h2 className="display-section mt-6 text-[2rem] sm:text-[2.5rem]">
                            One path,
                            <br />
                            <span className="text-muted">three gates.</span>
                        </h2>
                        <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
                            Nothing is decorative. Each stage unlocks the next one, and every
                            transition is recorded on your profile.
                        </p>

                        <div className="mt-8">
                            <ButtonLink to="/register" variant="ghost" size="md">
                                Create your account
                                <ArrowUpRight size={16} />
                            </ButtonLink>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <SpotlightCard
                                    key={feature.title}
                                    className="reveal flex items-start gap-5 p-6 sm:gap-6 sm:p-8"
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <span
                                            className={
                                                index === 0
                                                    ? "icon-well icon-well-round"
                                                    : index === 1
                                                      ? "icon-well icon-well-diamond"
                                                      : "icon-well"
                                            }
                                        >
                                            <Icon size={18} />
                                        </span>

                                        <span className="numeric text-[0.625rem] font-semibold text-gold">
                                            0{index + 1}
                                        </span>
                                    </div>

                                    <div>
                                        <h3 className="font-display text-lg font-bold tracking-tight text-fg">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-2 text-sm leading-relaxed text-muted">
                                            {feature.text}
                                        </p>
                                    </div>
                                </SpotlightCard>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* =====================================================
                HOW IT WORKS + CAPABILITIES
                ===================================================== */}
            <section className="relative border-y border-line bg-bg-2/40">
                <div className="mx-auto grid w-full max-w-shell grid-cols-1 gap-16 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-20">
                    <div>
                        <SectionMarker index={4}>How it works</SectionMarker>
                        <h2 className="display-section mt-6 text-[2rem] sm:text-[2.5rem]">
                            Registration to
                            <br />
                            <span className="text-gradient">reviewed project.</span>
                        </h2>

                        <ol className="mt-12 space-y-0">
                            {steps.map((step, index) => (
                                <li key={step.title} className="group relative flex gap-5 pb-9 last:pb-0">
                                    {/* rail */}
                                    {index < steps.length - 1 && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute left-[0.9375rem] top-9 h-[calc(100%-1.5rem)] w-px bg-line-strong"
                                        />
                                    )}

                                    <span className="numeric relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-strong bg-bg text-[0.6875rem] font-semibold text-muted transition-colors duration-300 group-hover:border-accent/50 group-hover:text-accent">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <div className="pt-1">
                                        <h3 className="font-display text-base font-bold text-fg">
                                            {step.title}
                                        </h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-muted">
                                            {step.text}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <div className="flex flex-col">
                        <SectionMarker index={5}>Why LearnSpace</SectionMarker>
                        <h2 className="display-section mt-6 text-[2rem] sm:text-[2.5rem]">
                            Built for
                            <br />
                            <span className="text-muted">real learners.</span>
                        </h2>

                        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                            {whyUs.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div key={item.title} className="group bg-surface/80 p-6 transition-colors duration-300 hover:bg-surface-2/70">
                                        <span className="icon-well">
                                            <Icon size={17} />
                                        </span>
                                        <h3 className="mt-5 font-display text-sm font-bold text-fg">{item.title}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                </div>
            </section>

            {/* =====================================================
                TESTIMONIALS
                ===================================================== */}
            <section className="relative mx-auto w-full max-w-shell px-5 py-20 sm:px-8 sm:py-24">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <SectionMarker index={6}>From the cohort</SectionMarker>
                        <h2 className="display-section mt-6 text-[2rem] sm:text-[2.5rem]">What they say</h2>
                    </div>

                    <DecoDivider className="hidden h-24 lg:block" />
                </div>

                <div className="mt-14 grid gap-5 sm:grid-cols-3">
                    {testimonials.map((entry) => (
                        <figure key={entry.name} className="surface-a flex flex-col justify-between rounded-2xl p-7">
                            <blockquote className="text-sm leading-relaxed text-muted">
                                &ldquo;{entry.text}&rdquo;
                            </blockquote>

                            <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-5">
                                <span className="icon-well icon-well-round h-9 w-9 shrink-0 rounded-full text-[0.625rem] font-semibold">
                                    {entry.name
                                        .split(" ")
                                        .map((part) => part[0])
                                        .join("")}
                                </span>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-fg">{entry.name}</p>
                                    <p className="truncate text-xs text-subtle">{entry.role}</p>
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            {/* =====================================================
                CTA
                ===================================================== */}
            <section className="relative mx-auto w-full max-w-shell px-5 pb-24 sm:px-8 sm:pb-32">
                <div className="surface-a relative overflow-hidden rounded-[1.75rem] px-6 py-14 text-center sm:px-12 sm:py-20">
                    <div aria-hidden="true" className="hero-ambient absolute inset-0 opacity-70" />
                    <Sunburst className="left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 opacity-25" />

                    <div className="relative mx-auto max-w-2xl">
                        <StatusLabel>free to start</StatusLabel>

                        <h2 className="display-section mt-6 text-[2rem] sm:text-[2.75rem]">
                            Start the first step
                            <br />
                            <span className="text-gradient">today.</span>
                        </h2>

                        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted">
                            Register, pick a course, and finish it. The instrument shows the rest.
                        </p>

                        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                            <ButtonLink to="/register" size="lg">
                                Create free account
                                <ArrowRight size={17} />
                            </ButtonLink>

                            <ButtonLink to="/login" variant="secondary" size="lg">
                                I already have one
                            </ButtonLink>
                        </div>
                    </div>
                </div>
            </section>

            <Ticker label="Trending" items={tickerItems} />
        </div>
    );
};

export default Landing;
