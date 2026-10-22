import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

import { ButtonLink } from "../components/ui/Button";
import { GeoMark, SectionMarker } from "../components/ui/Deco";

/*
|--------------------------------------------------------------------------
| NotFound
|--------------------------------------------------------------------------
| "Instrument ne kuch nahi mila" — 404 ko bhi design system ka hissa banaya
| gaya hai: architecture panel + technical readout, zero custom colors.
*/

const NotFound = () => (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-16">
        <div aria-hidden="true" className="hero-ambient absolute inset-0" />
        <div aria-hidden="true" className="grid-fine absolute inset-0 opacity-50 [mask-image:radial-gradient(60%_50%_at_50%_50%,#000,transparent)]" />
        <GeoMark shape="diamond" tone="gold" className="left-[18%] top-[24%] h-2.5 w-2.5" />
        <GeoMark shape="square" tone="accent" className="right-[20%] top-[32%] h-2 w-2" />

        <div className="relative w-full max-w-lg text-center">
            <div className="flex justify-center">
                <SectionMarker index={4} align="center">
                    signal lost
                </SectionMarker>
            </div>

            <p className="numeric mt-8 bg-gradient-to-b from-fg to-transparent bg-clip-text text-[7rem] font-extrabold leading-none text-transparent sm:text-[9rem]">
                404
            </p>

            <span className="icon-well icon-well-round mx-auto -mt-8 h-20 w-20">
                <Compass size={30} strokeWidth={1.4} />
            </span>

            <h1 className="mt-8 font-display text-2xl font-bold tracking-[-0.022em] text-fg sm:text-3xl">
                This page is off the map
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
                The address does not resolve to anything in the catalog. Head back, or start from the
                homepage and pick a direction.
            </p>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <ButtonLink to="/" size="lg" fullWidth className="sm:w-auto">
                    <ArrowLeft size={16} />
                    Back to homepage
                </ButtonLink>
            </div>

            <div className="mt-12 flex items-center justify-center gap-3">
                <span aria-hidden="true" className="h-px w-10 bg-gradient-to-r from-transparent to-line-strong" />
                <Link
                    to="/login"
                    className="technical-label transition-colors hover:text-accent"
                >
                    or sign in to continue
                </Link>
                <span aria-hidden="true" className="h-px w-10 bg-gradient-to-l from-transparent to-line-strong" />
            </div>
        </div>
    </div>
);

export default NotFound;
