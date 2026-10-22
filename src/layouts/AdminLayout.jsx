import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import {
    Award,
    BookOpen,
    Camera,
    ClipboardCheck,
    FolderGit2,
    LayoutDashboard,
    ListChecks,
    Users,
} from "lucide-react";

import { logoutUser, updateUser } from "../features/auth/authSlice";
import { updateAdminProfile } from "../api/adminApi";
import { getApiError } from "../utils/api";
import { uploadImage } from "../utils/upload";
import DashboardShell from "./DashboardShell";

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

    const { user, loading } = useSelector((state) => state.auth);

    const [loggingOut, setLoggingOut] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleLogout = async () => {
        setLoggingOut(true);
        await dispatch(logoutUser());
    };

    const handleImageChange = async (event) => {
        const file = event.target.files?.[0];
        // Value reset karo warna same file dobara choose karne par onChange
        // fire hi nahi hota aur upload "kaam nahi karta" lagta hai.
        event.target.value = "";
        if (!file) return;

        setUploading(true);

        try {
            const url = await uploadImage(file);
            const response = await updateAdminProfile({ profile_image: url });
            dispatch(updateUser(response.data.user));
            toast.success("Profile photo updated!");
        } catch (err) {
            toast.error(getApiError(err).message || "Upload failed. Try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <DashboardShell
            navItems={navItems}
            headerLabel="Control room"
            homePath="/admin"
            user={user}
            avatarSrc={user?.profile_image}
            roleLabel="Admin"
            onLogout={handleLogout}
            loggingOut={loggingOut}
            disabled={loading}
            menuActions={[
                {
                    label: uploading ? "Uploading photo…" : "Change photo",
                    icon: Camera,
                    disabled: uploading,
                    onClick: () => fileInputRef.current?.click(),
                },
            ]}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
            />

            <Outlet />
        </DashboardShell>
    );
};

export default AdminLayout;
