export function findGeneration(id) {
    switch (id) {
        case (id >= 1 && id <= 151):
            return "Kanto";
        case (id >= 152 && id <= 251):
            return "Johto";
        case (id >= 252 && id <= 386):
            return "Hoenn";
        case (id >= 387 && id <= 493):
            return "Sinnoh";
        case (id >= 494 && id <= 649):
            return "Unova";
        case (id >= 650 && id <= 721):
            return "Kalos";
        case (id >= 722 && id <= 809):
            return "Alola";
        case (id >= 810 && id <= 905):
            return "Galar/Hisui";
        case (id >= 906 && id <= 1025):
            return "Paldea";
        default:
            return "Unknown pokemon";
    }
}

export function chooseRandomPokemon(min=1, max=1025) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}