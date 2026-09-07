import api from "./axios";

export const register = (data) => {
    return api.post("/auth/register", data);
};

export const login = (data) => {
    return api.post("/auth/login", data);
};

export const logout = () => {
    return api.post("/auth/logout");
};

export const getCurrentUser = () => {
    return api.get("/auth/user");
};

export const forgotPassword = (data) => {
    return api.post("/auth/forgot-password", data);
};

export const resetPassword = (data) => {
    return api.post("/auth/reset-password", data);
};