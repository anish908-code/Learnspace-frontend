import { useSelector } from "react-redux";

const useAuth = () => {
    const {
        user,
        role,
        isAuthenticated,
        loading,
        error,
    } = useSelector((state) => state.auth);

    return {
        user,
        role,
        isAuthenticated,
        loading,
        error,
    };
};

export default useAuth;