import { Monitor, Moon, Sun } from "lucide-react";

import { useTheme } from "./themeContext";

/*
| Day / Night switch — teen states, selected state obvious, restrained
| motion. Icon well (neumorphic) ke andar rehta hai taaki control physical
| lage, header ke saath blend ho jaaye.
*/

const OPTIONS = [
    { value: "light", label: "Day", icon: Sun },
    { value: "dark", label: "Night", icon: Moon },
    { value: "system", label: "Auto", icon: Monitor },
];

export const ThemeToggle = ({ className = "", compact = false }) => {
    const { theme, setTheme } = useTheme();

    return (
        <div
            role="radiogroup"
            aria-label="Colour theme"
            className={`icon-well inline-flex items-center gap-0.5 p-1 ${className}`}
        >
            {OPTIONS.map(({ value, label, icon: Icon }) => {
                const active = theme === value;

                return (
                    <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        title={`${label} theme`}
                        onClick={() => setTheme(value)}
                        className={`flex items-center justify-center rounded-[0.6rem] transition-all duration-200 ease-out-expo ${
                            compact ? "h-8 w-8" : "h-9 w-9"
                        } ${active ? "bg-accent text-white shadow-lift" : "text-subtle hover:text-fg"}`}
                    >
                        <Icon size={compact ? 15 : 16} strokeWidth={2.1} />
                        <span className="sr-only">{label}</span>
                    </button>
                );
            })}
        </div>
    );
};

/* Sirf day/night toggle — headers ke liye compact */
export const ThemeSwitch = ({ className = "" }) => {
    const { mode, toggle } = useTheme();
    const isDark = mode === "dark";

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? "Switch to day theme" : "Switch to night theme"}
            title={isDark ? "Day" : "Night"}
            className={`icon-well icon-well-round h-10 w-10 ${className}`}
        >
            <Sun
                size={17}
                strokeWidth={2.1}
                className={`absolute text-gold transition-all duration-500 ease-out-expo ${
                    isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"
                }`}
            />
            <Moon
                size={17}
                strokeWidth={2.1}
                className={`absolute text-accent transition-all duration-500 ease-out-expo ${
                    isDark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"
                }`}
            />
        </button>
    );
};

export default ThemeToggle;
