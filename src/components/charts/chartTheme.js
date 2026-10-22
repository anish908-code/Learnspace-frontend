/*
|--------------------------------------------------------------------------
| Chart theme
|--------------------------------------------------------------------------
| Charts ko bhi wahi accent language mili hai jo UI me hai: indigo = digital
| identity, teal = growth/system, gold = emphasis. Day aur night me same
| hues, bas lighting (contrast) badalti hai.
|
| Ye constants alag file me hain kyunke react-refresh rule component files
| me non-component exports allow nahi karta.
*/

/* Day values stone-canvas palette se match karte hain (index.css :root).
   Purane lighter values fade ho jate the, aur 0.07 ka grid line
   practically invisible tha. */
const DAY = {
    students: "#474DC5",
    enrollments: "#0F625D",
    submissions: "#A37A1B",
    grid: "rgba(13,15,19,0.13)",
    axis: "rgba(13,15,19,0.38)",
    tick: "#5A616C",
    track: "rgba(13,15,19,0.14)",
    active: "#474DC5",
    done: "#0F625D",
    cursor: "rgba(71,77,197,0.14)",
};

const NIGHT = {
    students: "#8B91FF",
    enrollments: "#31B8AD",
    submissions: "#D6AE4A",
    grid: "rgba(255,255,255,0.07)",
    axis: "rgba(255,255,255,0.16)",
    tick: "#747A87",
    track: "rgba(255,255,255,0.09)",
    active: "#8B91FF",
    done: "#31B8AD",
    cursor: "rgba(139,145,255,0.12)",
};

export const getChartTheme = (mode) => (mode === "dark" ? NIGHT : DAY);

export const SERIES_META = [
    { key: "students", name: "New Students" },
    { key: "enrollments", name: "Enrollments" },
    { key: "submissions", name: "Submissions" },
];

/* Backwards-compatible exports (purane imports) */
export const SERIES_COLORS = DAY;
export const AXIS_TICK = { fontSize: 11, fill: DAY.tick, fontFamily: "JetBrains Mono, monospace" };

export const PROGRESS_COLORS = {
    active: DAY.active,
    done: DAY.done,
    track: DAY.track,
};

export const PROGRESS_GRADIENTS = {
    active: { from: "#474DC5", to: "#6067DA" },
    done: { from: "#0F625D", to: "#24908A" },
};
