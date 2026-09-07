import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FullScreenLoader } from "../components/common/Skeleton";

const AdminRoute = () => {
    const { role, loading } = useAuth();

    if (loading) {
        return <FullScreenLoader />;
    }

    if (role !== "admin") {
        return <Navigate to="/student" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;