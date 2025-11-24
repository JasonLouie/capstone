import userApi from "../configs/userApi";
// Base endpoint is url/api/...

export async function signupUser(body) {
    const { data } = await userApi.post("/auth/signup", body);
    return data;
}

export async function loginUser(body) {
    const { data } = await userApi.post("/auth/login", body);
    return data;
}

export async function logoutUser() {
    await userApi.post("/auth/logout");
}

// Delete the user's account and all related data in the db
export async function deleteUser() {
    await userApi.delete("/auth/delete");
}

// Update email (fields are newEmail, password)
export async function modifyEmail(fields) {
    await userApi.post("/auth/email", fields);
}

// Update password (fields are oldPassword, newPassword)
export async function modifyPassword(fields) {
    await userApi.post("/auth/password", fields);
}

// Update username or profile picture
export async function updateUserFields(fields) {
    await userApi.patch("/users/me", fields);
}

// Get user data (also the way that the app knows the user is logged in)
export async function getUserData() {
    const { data } = await userApi.get("/users/me");
    return data;
}

// Reset the user's pokedex
export async function resetPokedex() {
    await userApi.delete("/users/me/pokedex");
}

// Update the "allGenerations" boolean or the "mode" (when used, proper object must be passed)
export async function updateBasicSettings(basicSettings) {
    await userApi.patch("/users/me/settings", basicSettings);
}

// Add a generation to the user's settings
export async function addToGenerations(generation) {
    await userApi.post("/users/me/settings/generations/add", generation);
}

// Remove a generation from the user's settings
export async function removeFromGenerations(generation) {
    await userApi.delete(`/users/me/settings/generations/${generation}`);
}


// GAME API CALLS
export async function getOrResumeGame(settings) {
    const { data } = await userApi.post("/games/me", settings);
    return data;
}

export async function newGame(settings) {
    const { data } = await userApi.post("/games/me/new", settings);
    return data;
}

export async function setGameState(gameState) {
    const { data } = await userApi.put("/games/me", gameState);
    return data;
}

export async function addToGuesses(guess) {
    await userApi.post("/games/me/guesses", guess);
}

export async function updateAnswer(answer) {
    await userApi.put("/games/me/answer", answer);
}

// Adding pokemon
export async function addPokemon(pokemon) {
    await userApi.post("/pokemon", pokemon);
}

// Get all pokemon
export async function getAllPokemon(pokemon) {
    const { data } = await userApi.get("/pokemon", pokemon);
    return data;
}