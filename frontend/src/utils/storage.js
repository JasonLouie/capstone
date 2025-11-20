export const settingTypes = {
    user: {},
    game: {mode: "regular", generations: [], time: "unlimited", all: true}
};

export function addPokemonEntry(key, pokemon) {
    const array = getJSON(key) || [];
    const exists = array.find(p => p.name === pokemon.name);
    if (!exists) {
        if (key === "pokedex") array.push(pokemon);
        else array.unshift(pokemon);
        updateJSON(key, array);
    }
}

export function changeSetting(key, setting, value) {
    const settings = getJSON(key);
    if (Object.keys(settingTypes[key.replace("Settings", "")]).includes(setting)) settings[setting] = value;
    updateJSON(key, settings);
}

export function getJSON(key, fallback = null) {
    const value = localStorage.getItem(key);
    if (value) return JSON.parse(value);

    if (fallback) {
        updateJSON(key, fallback);
        console.log(localStorage.getItem(key));
        return fallback;
    }
    return null;
}

export function updateJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getString(key) {
    return localStorage.getItem(key);
}

export function updateString(key, value) {
    localStorage.setItem(key, value);
}

export function clear(key) {
    localStorage.removeItem(key);
}