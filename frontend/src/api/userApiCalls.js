import userApi, { setAuthHeader } from "../configs/userApi";
import { clear, getJSON } from "../utils/storage";
// Base endpoint is url/api/...

export async function signup(body) {
    const { data } = await userApi.post(`/users/signup`, body);
    setAuthHeader(data.token);
    return data;
}

export async function login(body) {
    const { data } = await userApi.post(`/users/login`, body);
    setAuthHeader(data.token);
    return data;
}

export async function logout() {
    await userApi.post(`/users/logout`, { refreshToken });
}

export async function getProfilePic() {
    try {
        const { data } = await userApi.get(`users/profile-pic`);
        return data;
    } catch (err) {
        refreshToken();
    }
}

export async function updateUserFields(fields) {

}

export async function getUser() {

}

export async function deleteUser() {

}

export async function getPokedex() {

}

export async function addToPokedex() {

}

export async function resetPokedex() {

}