import userApi from "../configs/userApi";
// Base endpoint is url/api/...

export async function signup(body) {
    const { data } = await userApi.post(`/users/signup`, body);
    return data;
}

export async function login(body) {
    const { data } = await userApi.post(`/users/login`, body);
    return data;
}

export async function logout() {
    await userApi.post(`/users/logout`, { refreshToken });
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