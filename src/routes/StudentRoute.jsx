import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FullScreenLoader } from "../components/common/Skeleton";

const StudentRoute = () => {
    const { role, loading } = useAuth();

    if (loading) {
        return <FullScreenLoader />;
    }

    if (role !== "student") {
        return <Navigate to="/admin" replace />;
    }

    return <Outlet />;
};

export default StudentRoute;