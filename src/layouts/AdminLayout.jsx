import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    LayoutDashboard,
    Users,
    BookOpen,
    ListChecks,
    FolderGit2,
    ClipboardCheck,
    LogOut,
    Menu,
    X,
    GraduationCap,
    Camera,
    ChevronDown,
    Award,
} from "lucide-react";

import { logoutUser, updateUser } from "../features/auth/authSlice";
import { updateAdminProfile } from "../api/adminApi";
import { uploadToCloudinary } from "../utils/cloudinary";
import Avatar from "../components/common/Avatar";

const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/students", label: "Students", icon: Users },
    { to: "/admin/courses", label: "Courses", icon: BookOpen },
    { to: "/admin/quizzes", label: "Quizzes", icon: ListChecks },
    { to: "/admin/projects", label: "Projects", icon: FolderGit2 },
    { to: "/admin/submissions", label: "Submissions", icon: ClipboardCheck },
    { to: "/admin/certificates", label: "Certificates", icon: Award },
];

const AdminLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, loading } = useSelector((state) => state.auth);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setLoggingOut(true);
        setDropdownOpen(false);
        await dispatch(logoutUser());
        navigate("/login", { replace: true });
    };

    const handleImageClick = () => {
        fileInputRef.current?.click();
        setDropdownOpen(false);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
        }

        setUploading(true);

        try {
            const url = await uploadToCloudinary(file);
            const response = await updateAdminProfile({ profile_image: url });

            if (response.data?.user) {
                dispatch(updateUser(response.data.user));
                toast.success("Profile photo updated!");
            } else {
                toast.error(response.data?.message || "Failed to save photo.");
            }
        } catch (err) {
            console.error("Upload failed", err);
            toast.error(err.message || "Upload failed. Try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen" style={{ background: "var(--background)" }}>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r transition-transform duration-200 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
                <div className="flex h-16 items-center gap-2.5 border-b px-5" style={{ borderColor: "var(--border)" }}>
                    <NavLink to="/admin" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white">
                            <GraduationCap size={18} />
                        </span>
                        <span className="text-lg font-semibold" style={{ fontFamily: '"Playfair Display", Georgia, serif', color: "var(--foreground)" }}>
                            LearnSpace
                        </span>
                        <span
                            className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase"
                            style={{ fontFamily: '"IBM Plex Mono", monospace', letterSpacing: "0.1em", background: "var(--accent-muted)", color: "var(--accent)" }}
                        >
                            Admin
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
                            Admin Dashboard
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() => setDropdownOpen((prev) => !prev)}
                                className="flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-muted"
                            >
                                <Avatar
                                    name={user?.name}
                                    src={user?.profile_image}
                                    className="h-9 w-9 text-xs"
                                />
                                <span className="hidden text-sm font-medium md:block" style={{ color: "var(--foreground)" }}>
                                    {user?.name || "Admin"}
                                </span>
                                <ChevronDown
                                    size={14}
                                    className={`hidden transition-transform md:block ${dropdownOpen ? "rotate-180" : ""}`}
                                    style={{ color: "var(--muted-foreground)" }}
                                />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 rounded-lg border shadow-card-md" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
                                    <div className="border-b p-4" style={{ borderColor: "var(--border)" }}>
                                        <div className="flex items-center gap-3">
                                            <div className="relative group">
                                                <Avatar
                                                    name={user?.name}
                                                    src={user?.profile_image}
                                                    className="h-14 w-14 text-base"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleImageClick}
                                                    disabled={uploading}
                                                    className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                                >
                                                    {uploading ? (
                                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                                    ) : (
                                                        <Camera size={18} />
                                                    )}
                                                </button>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                                                    {user?.name || "Admin"}
                                                </p>
                                                <p className="truncate text-xs" style={{ color: "var(--muted-foreground)" }}>
                                                    {user?.email || ""}
                                                </p>
                                                <span
                                                    className="mt-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase"
                                                    style={{ fontFamily: '"IBM Plex Mono", monospace', letterSpacing: "0.1em", background: "var(--accent-muted)", color: "var(--accent)" }}
                                                >
                                                    Admin
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="py-2">
                                        <button
                                            type="button"
                                            onClick={handleImageClick}
                                            disabled={uploading}
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition hover:bg-muted"
                                            style={{ color: "var(--foreground)" }}
                                        >
                                            <Camera size={16} style={{ color: "var(--muted-foreground)" }} />
                                            {uploading ? "Uploading..." : "Change Photo"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            disabled={loading || loggingOut}
                                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition hover:bg-red-50"
                                        >
                                            <LogOut size={16} />
                                            {loggingOut ? "Logging out..." : "Logout"}
                                        </button>
                                    </div>
                                </div>
                            )}
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

export default AdminLayout;
