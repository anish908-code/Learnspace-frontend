import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";

import { cn } from "../utils/cn";
import Avatar from "../components/common/Avatar";
import Button from "../components/ui/Button";
import { BrandGlyph } from "../components/ui/BrandMark";
import { ThemeSwitch } from "../theme/ThemeToggle";
import { StatusLabel } from "../components/ui/Badge";

/*
|--------------------------------------------------------------------------
| DashboardShell
|--------------------------------------------------------------------------
| Student aur admin dono ka frame — pehle dono layouts me same markup tha
| (duplicate). Ab ek shell hai: sidebar + sticky header + profile menu +
| theme switch. Nav items aur handlers bahar se aate hain, isliye role
| specific logic (jaise admin ka avatar upload) apne layout me rehta hai.
*/

const DashboardShell = ({
    navItems,
    headerLabel,
    homePath,
    user,
    avatarSrc,
    roleLabel = "Student",
    onLogout,
    loggingOut = false,
    disabled = false,
    menuActions = [],
    children,
}) => {
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {
        if (!menuOpen) return undefined;

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    const handleLogout = async () => {
        setMenuOpen(false);
        await onLogout?.();
        navigate("/login", { replace: true });
    };

    const displayName = user?.name || (roleLabel === "Admin" ? "Admin" : "Student");

    return (
        <div className="relative min-h-screen">
            {/* Mobile drawer backdrop */}
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-30 cursor-default bg-[rgb(4_5_8)]/45 backdrop-blur-sm lg:hidden"
                />
            )}

            {/* ---------------------------------------------------------
                Sidebar — surface A (architectural)
                --------------------------------------------------------- */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-40 flex w-[17rem] flex-col border-r border-line",
                    "bg-surface/70 backdrop-blur-xl transition-transform duration-300 ease-out-expo lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex h-[4.5rem] items-center gap-3 border-b border-line px-5">
                    <NavLink to={homePath} className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
                        <BrandGlyph size="sm" />
                        <span className="font-display text-lg font-extrabold tracking-[-0.015em]">
                            <span className="text-fg">Learn</span>
                            <span className="text-accent">Space</span>
                        </span>
                    </NavLink>

                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="ml-auto lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close navigation"
                    >
                        <X size={16} />
                    </Button>
                </div>

                <div className="flex items-center justify-between gap-2 px-5 pb-1 pt-5">
                    <span className="technical-label">Workspace</span>
                    <span className="badge badge-accent">{roleLabel}</span>
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
                                className={({ isActive }) => cn("nav-item", isActive && "nav-item-active")}
                            >
                                {({ isActive }) => (
                                    <>
                                        <span
                                            aria-hidden="true"
                                            className={cn(
                                                "flex h-8 w-8 items-center justify-center rounded-[0.6rem] transition-colors duration-200",
                                                isActive ? "bg-accent/15 text-accent" : "text-subtle",
                                            )}
                                        >
                                            <Icon size={16} strokeWidth={2.1} />
                                        </span>
                                        {item.label}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="border-t border-line p-3">
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={disabled || loggingOut}
                        className="nav-item w-full hover:text-danger"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-[0.6rem] text-subtle">
                            <LogOut size={16} strokeWidth={2.1} />
                        </span>
                        {loggingOut ? "Signing out…" : "Sign out"}
                    </button>
                </div>
            </aside>

            {/* ---------------------------------------------------------
                Content + header
                --------------------------------------------------------- */}
            <div className="lg:pl-[17rem]">
                <header className="sticky top-0 z-20 border-b border-line bg-bg/70 backdrop-blur-xl">
                    <div className="flex h-[4.5rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon-md"
                                className="lg:hidden"
                                onClick={() => setSidebarOpen(true)}
                                aria-label="Open navigation"
                            >
                                <Menu size={18} />
                            </Button>

                            <div className="hidden flex-col sm:flex">
                                <span className="technical-label">{headerLabel}</span>
                                <span className="mt-0.5 text-sm font-bold tracking-[-0.01em] text-fg">
                                    {displayName}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <StatusLabel className="hidden md:inline-flex">online</StatusLabel>

                            <ThemeSwitch />

                            <div className="relative" ref={menuRef}>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen((prev) => !prev)}
                                    aria-expanded={menuOpen}
                                    aria-haspopup="menu"
                                    className="flex items-center gap-2.5 rounded-xl border border-transparent px-1.5 py-1.5 transition-colors duration-200 hover:border-line hover:bg-surface-2/70"
                                >
                                    <Avatar name={displayName} src={avatarSrc} className="h-9 w-9 text-xs" />
                                    <span className="hidden max-w-[9rem] truncate text-sm font-medium text-fg md:block">
                                        {displayName}
                                    </span>
                                    <ChevronDown
                                        size={15}
                                        className={cn(
                                            "text-subtle transition-transform duration-300",
                                            menuOpen && "rotate-180",
                                        )}
                                    />
                                </button>

                                {menuOpen && (
                                    <div
                                        role="menu"
                                        className="popover absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl"
                                    >
                                        <div className="flex flex-col items-center border-b border-line bg-surface-2 px-6 py-6 text-center">
                                            <Avatar name={displayName} src={avatarSrc} className="h-16 w-16 text-base" />
                                            <p className="mt-3 w-full truncate text-sm font-semibold text-fg">
                                                {displayName}
                                            </p>
                                            <p className="mt-0.5 w-full truncate text-xs text-subtle">
                                                {user?.email || "—"}
                                            </p>
                                        </div>

                                        <div className="space-y-1 p-3">
                                            {menuActions.map((action) => {
                                                const Icon = action.icon;
                                                return (
                                                    <button
                                                        key={action.label}
                                                        type="button"
                                                        role="menuitem"
                                                        onClick={action.onClick}
                                                        disabled={action.disabled}
                                                        className="nav-item w-full disabled:opacity-50"
                                                    >
                                                        <span className="flex h-8 w-8 items-center justify-center rounded-[0.6rem] text-subtle">
                                                            <Icon size={16} strokeWidth={2.1} />
                                                        </span>
                                                        {action.label}
                                                    </button>
                                                );
                                            })}

                                            <Button
                                                variant="secondary"
                                                size="md"
                                                fullWidth
                                                onClick={handleLogout}
                                                disabled={disabled || loggingOut}
                                            >
                                                <LogOut size={15} />
                                                {loggingOut ? "Signing out…" : "Sign out"}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="relative px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
                    <div className="mx-auto max-w-6xl">{children ?? <Outlet />}</div>
                </main>
            </div>
        </div>
    );
};

export default DashboardShell;
