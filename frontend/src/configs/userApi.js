import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const userApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export function setAuthHeader(accessToken) {
    if (accessToken) {
        userApi.defaults.headers["Authorization"] = `bearer ${accessToken}`;
    } else {
        delete userApi.defaults.headers["Authorization"];
    }
}

export default userApi;