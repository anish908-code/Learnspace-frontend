/*
|--------------------------------------------------------------------------
| Shared chart tooltip card
|--------------------------------------------------------------------------
| Recharts ka default tooltip plain dikhta hai. Yeh card-style hai with ek
| coloured marker per series, value mono + right-aligned. Admin aur student
| dono ke charts isko share karte hain.
*/

export const TooltipCard = ({ title, rows }) => (
    <div className="card-glass min-w-[11rem] rounded-2xl px-3.5 py-3">
        {title && <p className="technical-label mb-2.5">{title}</p>}

        <div className="space-y-1">
            {rows.map((row) => (
                <div key={row.label} className="flex items-center gap-2">
                    <span
                        aria-hidden="true"
                        className="h-2 w-2 shrink-0 rounded-[3px]"
                        style={{ background: row.color }}
                    />
                    <span className="text-xs text-muted">{row.label}</span>
                    <span className="numeric ml-auto pl-3 text-xs font-semibold text-fg">{row.value}</span>
                </div>
            ))}
        </div>
    </div>
);

export default TooltipCard;
