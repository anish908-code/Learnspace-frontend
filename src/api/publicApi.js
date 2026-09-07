import api from "./axios";

export const getHomeData = () => {
    return api.get("/public/home");
};

export const verifyCertificate = (code) => {
    return api.get(`/certificates/verify/${encodeURIComponent(code)}`);
};
