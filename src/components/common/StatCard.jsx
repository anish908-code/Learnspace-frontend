import { Link } from "react-router-dom";

const StatCard = ({ to, icon: Icon, label, value, colorClass = "bg-accent-muted text-accent" }) => (
    <Link
        to={to}
        className="card group flex items-center gap-4 p-6 transition hover:-translate-y-0.5 hover:shadow-card-hover"
    >
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
            <Icon size={22} />
        </span>
        <span>
            <span
                className="block text-2xl font-bold"
                style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 600, color: "var(--foreground)" }}
            >
                {value ?? 0}
            </span>
            <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                {label}
            </span>
        </span>
    </Link>
);

export default StatCard;
