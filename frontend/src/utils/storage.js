export function getRefreshToken() {
    return getTokens().refreshToken;
}

export function updateTokens(tokens) {
    if (tokens) localStorage.setItem("tokens", JSON.stringify(tokens));
    else localStorage.removeItem("tokens");
}

export function getTokens() {
    return JSON.parse(localStorage.getItem("tokens"));
}