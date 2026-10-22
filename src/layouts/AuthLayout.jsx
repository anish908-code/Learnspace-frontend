import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { BrandGlyph } from "../components/ui/BrandMark";
import { OrbitRings, Sunburst, GeoMark } from "../components/ui/Deco";
import { ThemeSwitch } from "../theme/ThemeToggle";
import { StatusLabel } from "../components/ui/Badge";

/*
|--------------------------------------------------------------------------
| AuthLayout
|--------------------------------------------------------------------------
| Split composition — left: architecture (brand, geometry, technical labels),
| right: the form. Mobile pe sirf form.
|
| `image` prop router se already aa raha hai (login / register / forgot /
| reset) par pehle kabhi use nahi hota tha. Ab wahi variant key hai: har
| page ka left panel apna story aur apne teen facts rakhta hai, isliye
| login aur register ek doosre nahi lagte.
|
| NOTE: facts me percentage ya hardcoded metrics nahi — sirf wahi baate
| jo product sach me karta hai (lessons → quiz → project → certificate).
*/

const COPY = {
    login: {
        marker: "returning learner",
        headline: (
            <>
                Pick up exactly
                <br />
                <span className="text-gradient">where you stopped.</span>
            </>
        ),
        body: "Your lessons, quiz attempts and submissions are already saved. Nothing resets, nothing re-explains itself — you sign in and the work is right there.",
        facts: [
            { title: "Resume in one click", text: "no losing your place" },
            { title: "Synced on the server", text: "any device, any browser" },
            { title: "One path to finish", text: "lessons → quiz → certificate" },
        ],
    },

    register: {
        marker: "new workspace",
        headline: (
            <>
                Build the skill,
                <br />
                <span className="text-gradient">prove the work.</span>
            </>
        ),
        body: "Three gates stand between you and a certificate: every lesson, the final quiz, then a real project that gets reviewed. LearnSpace keeps score of all three — so you only have to do the work.",
        facts: [
            { title: "Three gates", text: "lessons, quiz, project" },
            { title: "One certificate", text: "verifiable by anyone" },
            { title: "Zero deadlines", text: "your own schedule" },
        ],
    },

    forgot: {
        marker: "account recovery",
        headline: (
            <>
                Locked out is
                <br />
                <span className="text-gradient">a solvable problem.</span>
            </>
        ),
        body: "Enter the email on your account and we'll send a single-use link. Open it anywhere, choose a new password, and every course you were halfway through is exactly where you left it.",
        facts: [
            { title: "One email", text: "with a single-use link" },
            { title: "Short window", text: "links expire for safety" },
            { title: "Nothing lost", text: "courses and progress stay" },
        ],
    },

    reset: {
        marker: "new credentials",
        headline: (
            <>
                Set a stronger
                <br />
                <span className="text-gradient">passphrase.</span>
            </>
        ),
        body: "Pick something you haven't used before. The moment you save it, the old password stops working everywhere — and you can sign straight back in.",
        facts: [
            { title: "Takes effect at once", text: "across all devices" },
            { title: "Sign in again", text: "straight after saving" },
            { title: "Progress untouched", text: "courses stay enrolled" },
        ],
    },

    default: {
        marker: "authenticated access",
        headline: (
            <>
                Your craft,
                <br />
                <span className="text-gradient">measured.</span>
            </>
        ),
        body: "Enrol in a course, finish every lesson, clear the final quiz, then ship a real project. Progress is calculated server-side — no guesswork.",
        facts: [
            { title: "Lessons first", text: "finish them all" },
            { title: "Quiz unlocks", text: "after the lessons" },
            { title: "Certificate", text: "once you complete" },
        ],
    },
};

const AuthLayout = ({ image, children }) => {
    const copy = COPY[image] ?? COPY.default;

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Atmosphere */}
            <div aria-hidden="true" className="auth-ambient absolute inset-0" />
            <div aria-hidden="true" className="grid-fine absolute inset-0 opacity-70" />

            <div className="relative mx-auto grid min-h-screen w-full max-w-shell grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
                {/* ---------------- Left: architecture ---------------- */}
                <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-line p-12 lg:flex xl:p-16">
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                        <OrbitRings rings={4} />
                        <Sunburst className="-right-24 top-1/3 h-[26rem] w-[26rem] opacity-40" />
                        <GeoMark shape="diamond" tone="gold" className="left-[42%] top-[22%] h-2.5 w-2.5" />
                        <GeoMark shape="square" tone="accent" className="left-[58%] top-[68%] h-2 w-2" />
                        <GeoMark shape="circle" tone="teal" className="left-[18%] top-[78%] h-1.5 w-1.5" />
                    </div>

                    <div className="relative flex items-center justify-between gap-4">
                        <Link to="/" className="flex items-center gap-3">
                            <BrandGlyph size="sm" />
                            <span className="font-display text-lg font-extrabold tracking-[-0.015em]">
                                <span className="text-fg">Learn</span>
                                <span className="text-accent">Space</span>
                            </span>
                        </Link>

                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-xs text-subtle transition-colors hover:text-accent"
                        >
                            <ArrowLeft size={14} />
                            Back to site
                        </Link>
                    </div>

                    <div className="relative max-w-lg py-16">
                        <StatusLabel>{copy.marker}</StatusLabel>

                        <h1 className="display-hero mt-6 text-[3.1rem] xl:text-[3.4rem]">{copy.headline}</h1>

                        <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-muted">{copy.body}</p>

                        {/* Facts — words me, koi percentage nahi */}
                        <dl className="mt-12 max-w-sm">
                            {copy.facts.map((fact, index) => (
                                <div
                                    key={fact.title}
                                    className="flex items-baseline gap-4 border-t border-line py-3.5 last:border-b"
                                >
                                    <span className="numeric w-6 shrink-0 text-[0.6875rem] font-semibold text-gold">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <dt className="text-sm font-semibold text-fg">{fact.title}</dt>
                                        <dd className="mt-0.5 text-xs text-subtle">{fact.text}</dd>
                                    </div>
                                </div>
                            ))}
                        </dl>
                    </div>

                    <div className="relative flex items-center justify-between gap-4">
                        <p className="technical-label">build 2026.09</p>
                        <p className="text-xs text-subtle">· secure session</p>
                    </div>
                </aside>

                {/* ---------------- Right: form ---------------- */}
                <div className="relative flex flex-col">
                    <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
                        <Link to="/" className="flex items-center gap-3 lg:invisible">
                            <BrandGlyph size="sm" />
                            <span className="font-display text-base font-extrabold tracking-[-0.015em]">
                                <span className="text-fg">Learn</span>
                                <span className="text-accent">Space</span>
                            </span>
                        </Link>

                        <div className="ml-auto">
                            <ThemeSwitch />
                        </div>
                    </div>

                    <div className="flex flex-1 items-center justify-center px-5 pb-16 pt-6 sm:px-8">
                        <div className="w-full max-w-md reveal">{children}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
