import userApi, { setAuthHeader } from "../configs/userApi";
// Base endpoint is url/api/...

export async function signup(body) {
    const response = await userApi.post(`/users/signup`, body);
    const {img, ...tokens} = response.data;
    setAuthHeader(tokens.token);
    return response.data;
}

export async function login(body) {
    const response = await userApi.post(`/users/login`, body);
    const {img, ...tokens} = response.data;
    setAuthHeader(tokens.token);
    return response.data;
}

export async function logout() {

}

export async function refreshToken() {

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