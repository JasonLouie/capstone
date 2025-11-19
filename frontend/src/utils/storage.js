export function updateTokens(tokens = null) {
    if (tokens) localStorage.setItem("tokens", JSON.stringify(tokens));
    else localStorage.removeItem("tokens");
}

export function getTokens() {
    const tokens = localStorage.getItem("tokens");
    return tokens ? JSON.parse(tokens) : null;
}

export function addEntryToPokedex(pokemon) {
    const pokedex = getPokedex();
    const exists = pokedex.find(p => p.name === pokemon.name);
    if (!exists) {
        pokedex.push(pokemon);
        updatePokedex(pokedex);
    }
}

export function clearPokedex() {
    localStorage.removeItem("pokedex");
}

export function updatePokedex(newPokedex = null) {
    if (newPokedex) localStorage.setItem("pokedex", JSON.stringify(newPokedex));
    else localStorage.removeItem("pokedex");
};

export function getPokedex() {
    const pokedex = localStorage.getItem("pokedex");
    return pokedex ? JSON.parse(pokedex) : null;
}

export function getUserImg() {
    return localStorage.getItem("userImg");
}

export function updateUserImg(newImg = null) {
    if (newImg) localStorage.setItem("userImg", newImg);
    else localStorage.removeItem("userImg");
}