import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

/*
|--------------------------------------------------------------------------
| Theme store
|--------------------------------------------------------------------------
| Context + hook + helpers ek hi non-component module me, taaki
| ThemeProvider.jsx sirf components export kare (react-refresh rule).
|
| light · dark · system — "system" browser preference follow karta hai.
*/

export const STORAGE_KEY = "learnspace_theme";

export const ThemeContext = createContext(null);

const isThemeValue = (value) => value === "light" || value === "dark" || value === "system";

export const readStoredTheme = () => {
    try {
        const value = localStorage.getItem(STORAGE_KEY);
        return isThemeValue(value) ? value : "system";
    } catch {
        /* private mode / storage blocked */
        return "system";
    }
};

export const readSystemMode = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

/** Day/night sirf tokens badalta hai — components duplicate nahi hote. */
export const applyThemeToDocument = (mode) => {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
    root.style.colorScheme = mode;
    root.dataset.theme = mode;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
    return context;
};

export const useThemeState = () => {
    const [theme, setTheme] = useState(readStoredTheme);
    const [systemPreference, setSystemPreference] = useState(readSystemMode);

    const mode = theme === "system" ? systemPreference : theme;

    /* Document + persistence — external system, isliye effect theek hai */
    useEffect(() => {
        applyThemeToDocument(mode);

        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            /* ignore */
        }
    }, [mode, theme]);

    /* Sirf "system" mode me preference track karo */
    useEffect(() => {
        if (theme !== "system") return undefined;

        const query = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = () => setSystemPreference(query.matches ? "dark" : "light");

        query.addEventListener("change", onChange);
        return () => query.removeEventListener("change", onChange);
    }, [theme]);

    /* Doosre tab me bhi sync */
    useEffect(() => {
        const onStorage = (event) => {
            if (event.key === STORAGE_KEY) setTheme(readStoredTheme());
        };

        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const toggle = useCallback(() => setTheme(mode === "dark" ? "light" : "dark"), [mode, setTheme]);

    return useMemo(
        () => ({ theme, mode, resolved: mode, setTheme, toggle }),
        [theme, mode, toggle],
    );
};
