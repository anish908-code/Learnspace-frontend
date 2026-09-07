import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    BookOpen,
    FolderGit2,
    FileText,
    Bell,
    LogOut,
    Menu,
    X,
    GraduationCap,
    Pencil,
    ChevronDown,
    Award,
} from "lucide-react";

import { logoutUser } from "../features/auth/authSlice";
import { fetchProfile } from "../features/student/profileSlice";
import Avatar from "../components/common/Avatar";

const navItems = [
    { to: "/student", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/student/courses", label: "Browse Courses", icon: BookOpen },
    { to: "/student/projects", label: "Projects", icon: FolderGit2 },
    { to: "/student/submissions", label: "My Submissions", icon: FileText },
    { to: "/student/certificates", label: "My Certificates", icon: Award },
    { to: "/student/notifications", label: "Notifications", icon: Bell },
    { to: "/student/profile", label: "Profile", icon: Pencil },
];

const StudentLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.studentProfile);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {
        if (!profile) {
            dispatch(fetchProfile());
        }
    }, [dispatch, profile]);

    useEffect(() => {
        if (!menuOpen) return;
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    const handleLogout = async () => {
        setLoggingOut(true);
        await dispatch(logoutUser());
        navigate("/login", { replace: true });
    };

    const handleEditProfile = () => {
        setMenuOpen(false);
        navigate("/student/profile");
    };

    return (
        <div className="min-h-screen" style={{ background: "var(--background)" }}>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r transition-transform duration-200 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
                <div className="flex h-16 items-center gap-2.5 border-b px-5" style={{ borderColor: "var(--border)" }}>
                    <NavLink to="/student" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
                            <GraduationCap size={18} />
                        </span>
                        <span className="text-lg font-semibold" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)" }}>
                            LearnSpace
                        </span>
                    </NavLink>

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto lg:hidden"
                        style={{ color: "var(--muted-foreground)" }}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                                        isActive
                                            ? "bg-accent/8 text-accent font-semibold"
                                            : "hover:bg-muted"
                                    }`
                                }
                                style={({ isActive }) => isActive ? {} : { color: "var(--muted-foreground)" }}
                            >
                                <Icon size={18} />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="border-t p-3" style={{ borderColor: "var(--border)" }}>
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loading || loggingOut}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                        style={{ color: "var(--muted-foreground)" }}
                    >
                        <LogOut size={18} />
                        {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </aside>

            {/* Content area */}
            <div className="lg:pl-64">
                <header className="sticky top-0 z-20 border-b" style={{ borderColor: "var(--border)", background: "rgba(250,250,248,0.9)", backdropFilter: "blur(12px)" }}>
                    <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-md p-2 transition hover:bg-muted lg:hidden"
                            style={{ color: "var(--muted-foreground)" }}
                        >
                            <Menu size={22} />
                        </button>

                        <div className="hidden text-sm sm:block" style={{ fontFamily: '"IBM Plex Mono", monospace', letterSpacing: "0.1em", color: "var(--muted-foreground)" }}>
                            Learning Dashboard
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                    className="flex items-center gap-2 rounded-md py-1.5 pl-1.5 pr-2.5 transition hover:bg-muted"
                                >
                                    <Avatar
                                        name={user?.name}
                                        src={profile?.profile_image}
                                        className="h-9 w-9 text-xs"
                                    />
                                    <span className="hidden max-w-[140px] truncate text-sm font-medium md:block" style={{ color: "var(--foreground)" }}>
                                        {user?.name || "Student"}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition ${menuOpen ? "rotate-180" : ""}`}
                                        style={{ color: "var(--muted-foreground)" }}
                                    />
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-lg border shadow-card-md" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                                        <div className="flex flex-col items-center border-b px-6 py-6 text-center" style={{ borderColor: "var(--border)", background: "var(--muted)" }}>
                                            <Avatar
                                                name={user?.name}
                                                src={profile?.profile_image}
                                                className="h-16 w-16 text-base"
                                            />
                                            <p className="mt-3 truncate text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                                                {user?.name || "Student"}
                                            </p>
                                            <p className="mt-0.5 w-full truncate text-xs" style={{ color: "var(--muted-foreground)" }}>
                                                {user?.email || "-"}
                                            </p>
                                        </div>
                                        <div className="p-3">
                                            <button
                                                type="button"
                                                onClick={handleEditProfile}
                                                className="btn-primary w-full"
                                            >
                                                <Pencil size={15} />
                                                Edit Profile
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={loading || loggingOut}
                                title="Logout"
                                className="hidden rounded-md p-2.5 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:block"
                                style={{ color: "var(--muted-foreground)" }}
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
