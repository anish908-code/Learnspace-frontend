import { Navigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import { FullScreenLoader } from "../components/common/Skeleton";

/*
 * Logged-in user ko login/register/landing par form na dikhe —
 * browser band karke wapas aane par bhi seedha apne panel me
 * pahunch jaye (7 din tak valid Sanctum token cookie ke saath).
 *
 * - Auth check chal raha hai (fetchMe) → skeleton loader.
 * - Authenticated → role ke hisaab se panel me redirect.
 * - Guest → children (page) render.
 */
const AuthGate = ({ children }) => {
    const { isAuthenticated, loading, role } = useAuth();
    const location = useLocation();

    if (loading && !isAuthenticated) {
        return <FullScreenLoader />;
    }

    if (isAuthenticated) {
        /*
         * Agar /login pe kisi protected route se bheja gaya tha
         * to wahi page kholo, warna apna panel.
         */
        const from = location.state?.from?.pathname;

        return (
            <Navigate
                to={from || (role === "admin" ? "/admin" : "/student")}
                replace
            />
        );
    }

    return children;
};

export default AuthGate;
