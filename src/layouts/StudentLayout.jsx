import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import {
    Award,
    Bell,
    BookOpen,
    FileText,
    FolderGit2,
    LayoutDashboard,
    Pencil,
    UserCog,
} from "lucide-react";

import { logoutUser } from "../features/auth/authSlice";
import { fetchProfile } from "../features/student/profileSlice";
import DashboardShell from "./DashboardShell";

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

    const { user, loading } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.studentProfile);

    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        if (!profile) {
            dispatch(fetchProfile());
        }
    }, [dispatch, profile]);

    const handleLogout = async () => {
        setLoggingOut(true);
        await dispatch(logoutUser());
    };

    return (
        <DashboardShell
            navItems={navItems}
            headerLabel="Learning workspace"
            homePath="/student"
            user={user}
            avatarSrc={profile?.profile_image}
            roleLabel="Student"
            onLogout={handleLogout}
            loggingOut={loggingOut}
            disabled={loading}
            menuActions={[
                {
                    label: "Edit profile",
                    icon: UserCog,
                    onClick: () => {
                        navigate("/student/profile");
                    },
                },
            ]}
        >
            <Outlet />
        </DashboardShell>
    );
};

export default StudentLayout;
