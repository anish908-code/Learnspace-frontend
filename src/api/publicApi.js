import api from "./axios";

export const getHomeData = () => {
    return api.get("/public/home");
};
