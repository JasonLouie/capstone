export function findGeneration(id) {
    if (id >= 1 && id <= 151){
        return "Kanto";
    }
    else if (id <= 251){
        return "Johto";
    }
    else if (id <= 386) {
        return "Hoenn";
    }
    else if (id <= 493) {
        return "Sinnoh";
    }
    else if (id <= 649){
        return "Unova";
    }
    else if (id <= 721){
        return "Kalos";
    }
    else if (id <= 809){
        return "Alola";
    }
    else if (id <= 905){
        return "Galar/Hisui";
    }
    else if (id <= 1025){
        return "Paldea";
    }
    // Invalid id detected
    console.log(`Cannot find a generation for pokemon #${id}.`);
    return "";
}

export function chooseRandomPokemon(min = 1, max = 1025) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}