import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

import { useTheme } from "../../theme/themeContext";
import { getChartTheme } from "./chartTheme";
import { TooltipCard } from "./ChartTooltip";

/*
|--------------------------------------------------------------------------
| Student course progress — horizontal bar chart
|--------------------------------------------------------------------------
| Admin ka chart time-series hai (area, month-wise), isliye yahan jaan-boojh
| ke vertical orientation chuni gayi hai: data categorical hai (ek row per
| course) aur course titles lambe hain — horizontal axis me poori width milti
| hai, tick me clean truncate ho jaata hai. Vertical bars me title beech se
| kat-ta tha.
|
| Poori language `getChartTheme(mode)` se aati hai — grid, axes, ticks, bar
| fills, track aur cursor sab day/night ke hisaab se. Tooltip bhi app ke
| shared TooltipCard family me hai.
*/

const truncate = (value = "") =>
    value.length > 16 ? `${value.slice(0, 15)}…` : value;

const LegendItem = ({ color, label }) => (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
        <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 rounded-[3px]"
            style={{ background: color }}
        />
        {label}
    </span>
);

const StudentProgressChart = ({ data }) => {
    const { mode } = useTheme();
    const theme = getChartTheme(mode);

    // Recharts category axis first item ko bottom pe render karta hai, to
    // ascending sort karne se sabse zyada progress upar dikhta hai.
    const rows = data
        .map((row) => ({ ...row, progress: Number(row.progress || 0) }))
        .sort((a, b) => a.progress - b.progress);

    const completedCount = rows.filter((row) => row.completed).length;
    const average = rows.length
        ? Math.round(rows.reduce((sum, row) => sum + row.progress, 0) / rows.length)
        : 0;

    // Har bar ko thoda vertical breathing room — count ke saath height badhe,
    // taaki 1 course aur 8 courses dono readable lagein.
    const chartHeight = Math.max(190, rows.length * 46 + 44);

    const axisTick = {
        fontSize: 11,
        fill: theme.tick,
        fontFamily: "JetBrains Mono, monospace",
    };

    return (
        <div className="card p-5 sm:p-6">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <span className="technical-label">Course Progress</span>

                    <p className="numeric mt-2 text-3xl font-bold leading-none text-fg">
                        {average}%
                    </p>

                    <p className="mt-1.5 text-xs text-muted">
                        average across {rows.length} {rows.length === 1 ? "course" : "courses"}
                        {completedCount > 0 && ` · ${completedCount} completed`}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <LegendItem color={theme.done} label="Completed" />
                    <LegendItem color={theme.active} label="In progress" />
                </div>
            </div>

            <div style={{ height: chartHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={rows}
                        layout="vertical"
                        margin={{ top: 4, right: 12, left: 0, bottom: 4 }}
                        barCategoryGap="30%"
                    >
                        {/* Vertical grid — horizontal chart me yahi orientation
                            percentages padhne ke liye kaam aata hai */}
                        <CartesianGrid
                            strokeDasharray="4 4"
                            stroke={theme.grid}
                            horizontal={false}
                        />

                        <XAxis
                            type="number"
                            domain={[0, 100]}
                            ticks={[0, 25, 50, 75, 100]}
                            tick={axisTick}
                            tickLine={false}
                            axisLine={{ stroke: theme.axis }}
                            tickFormatter={(value) => `${value}%`}
                        />

                        <YAxis
                            type="category"
                            dataKey="name"
                            tick={axisTick}
                            tickLine={false}
                            axisLine={false}
                            width={124}
                            tickFormatter={truncate}
                        />

                        <Tooltip
                            cursor={{ fill: theme.cursor }}
                            content={({ active, payload }) => {
                                if (!active || !payload?.length) return null;

                                const { name, progress, completed, lessons } =
                                    payload[0].payload;

                                return (
                                    <TooltipCard
                                        title={name}
                                        rows={[
                                            {
                                                label: "Progress",
                                                value: `${progress}%`,
                                                color: completed
                                                    ? theme.done
                                                    : theme.active,
                                            },
                                            {
                                                label: "Status",
                                                value: completed
                                                    ? "Completed"
                                                    : "In progress",
                                                color: completed
                                                    ? theme.done
                                                    : theme.active,
                                            },
                                            {
                                                label: "Lessons",
                                                value: `${lessons} ${
                                                    lessons === 1 ? "lesson" : "lessons"
                                                } completed`,
                                                color: theme.track,
                                            },
                                        ]}
                                    />
                                );
                            }}
                        />

                        <Bar
                            dataKey="progress"
                            radius={[0, 6, 6, 0]}
                            barSize={16}
                            background={{
                                fill: theme.track,
                                radius: 6,
                            }}
                            animationDuration={700}
                        >
                            {rows.map((row, index) => (
                                <Cell
                                    key={`sp-cell-${index}`}
                                    fill={row.completed ? theme.done : theme.active}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StudentProgressChart;
