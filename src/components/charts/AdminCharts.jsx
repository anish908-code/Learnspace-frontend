import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import { useTheme } from "../../theme/themeContext";
import { getChartTheme, SERIES_META } from "./chartTheme";
import { TooltipCard } from "./ChartTooltip";

/*
|--------------------------------------------------------------------------
| Growth chart — multi-series area
|--------------------------------------------------------------------------
| Sirf horizontal grid, gradient fills, no dots until hover. Tooltip shared
| component use karta hai taaki poore app ka tooltip language ek jaisa rahe.
|
| HEIGHT CONTRACT (zaroori): ResponsiveContainer ko definite height chahiye.
| Iska matlab poora parent chain height-resolved hona chahiye — warna
| recharts 0 height render karta hai aur chart "gayab" ho jata hai.
| Isliye root flex column hai (`h-full`), aur chart wala hissa `flex-1
| min-h-0` — flex child ko parent ki height se height milti hai.
| `min-h-16rem` safety net hai: agar koi future consumer ise height-less
| wrapper me daal de, tab bhi chart dikhega instead of collapsing to 0.
*/

const Legend = ({ theme }) => (
    <div className="flex flex-wrap items-center gap-4">
        {SERIES_META.map((series) => (
            <span key={series.key} className="inline-flex items-center gap-2 text-xs text-muted">
                <span
                    aria-hidden="true"
                    className="h-2 w-2 rounded-[3px]"
                    style={{ background: theme[series.key] }}
                />
                {series.name}
            </span>
        ))}
    </div>
);

export const GrowthChart = ({ data, showLegend = false }) => {
    const { mode } = useTheme();
    const theme = getChartTheme(mode);

    return (
        <div className="flex h-full min-h-64 flex-col gap-4">
            {showLegend && <Legend theme={theme} />}

            <div className="min-h-0 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                        <defs>
                            {SERIES_META.map((series) => (
                                <linearGradient
                                    key={series.key}
                                    id={`fill-${series.key}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop offset="0%" stopColor={theme[series.key]} stopOpacity={0.26} />
                                    <stop offset="100%" stopColor={theme[series.key]} stopOpacity={0.01} />
                                </linearGradient>
                            ))}
                        </defs>

                        <CartesianGrid strokeDasharray="2 6" stroke={theme.grid} vertical={false} />

                        <XAxis
                            dataKey="label"
                            tick={{ fontSize: 11, fill: theme.tick, fontFamily: "JetBrains Mono, monospace" }}
                            tickLine={false}
                            axisLine={{ stroke: theme.axis }}
                            dy={8}
                        />

                        <YAxis
                            tick={{ fontSize: 11, fill: theme.tick, fontFamily: "JetBrains Mono, monospace" }}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                            width={44}
                        />

                        <Tooltip
                            cursor={{ fill: theme.cursor }}
                            content={({ active, payload, label }) => {
                                if (!active || !payload?.length) return null;

                                return (
                                    <TooltipCard
                                        title={label}
                                        rows={payload.map((entry) => ({
                                            label: entry.name,
                                            value: entry.value,
                                            color: theme[entry.dataKey] ?? entry.color,
                                        }))}
                                    />
                                );
                            }}
                        />

                        {SERIES_META.map((series) => (
                            <Area
                                key={series.key}
                                type="monotone"
                                dataKey={series.key}
                                name={series.name}
                                stroke={theme[series.key]}
                                strokeWidth={2.2}
                                fill={`url(#fill-${series.key})`}
                                dot={false}
                                activeDot={{ r: 4.5, strokeWidth: 2.2, stroke: "var(--surface)", fill: theme[series.key] }}
                                animationDuration={800}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

/* Chart ke andar loading state — technical bars */
export const ChartSkeleton = ({ bars = 5 }) => (
    <div className="flex h-full items-end gap-2 px-1 pb-2">
        {Array.from({ length: bars }, (_, index) => (
            <div
                key={index}
                className="skeleton flex-1 rounded-t-md"
                style={{ height: `${30 + ((index * 17) % 55)}%` }}
            />
        ))}
    </div>
);

/* Chart ke andar empty state */
export const ChartPlaceholder = ({ message = "No activity in this period" }) => (
    <div className="flex h-full flex-col items-center justify-center gap-2">
        <span className="technical-label">No data</span>
        <p className="text-sm text-muted">{message}</p>
    </div>
);
