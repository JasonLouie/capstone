import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const userApi = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Interceptor to refresh the access token
userApi.interceptors.response.use((response) => response, async(err) => {
    const req = err.config;
    if (err.response.status === 401 && req._retry) {
        req._try = true;

        try {
            // Attempt to refresh the token using axios.post to prevent an infinite loop
            await axios.post(`${BASE_URL}/api/users/refresh`, {}, { withCredentials: true });
            
            // Try the req again
            return userApi(req);
        } catch (refreshErr) {
            // Refresh failed. Log user out.
            return Promise.reject(refreshErr);
        }
    }
    return Promise.reject(err);
});

export default userApi;