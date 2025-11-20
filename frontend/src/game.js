// Get the generation for that pokemon
export const generations = {Kanto: [1, 151], Johto: [152, 251], Hoenn: [252, 386], Sinnoh: [387, 493], Unova: [494, 649], Kalos: [650, 721], Alola: [722, 809], "Galar/Hisui": [810, 905], Paldea: [906, 1025]};

export function findGeneration(id) {
    for (const key in generations) {
        if (id >= generations[key][0] && id <= generations[key][1]) return key;
    }
    // Invalid id detected
    console.log(`Cannot find a generation for pokemon #${id}.`);
    return "";
}

export function randomPokemon(generations = ["all"]) {
    const [min, max] = handleGeneration(generations);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function compareGuessAndAnswer(answerTypes, guessedTypes) {
    // Check if any types are correct
    return guessedTypes.map((g, i) => {
        if (g === answerTypes[i]) {
            return "correct";
        } else if (answerTypes.includes(g)) {
            return "partial";
        } else {
            return "wrong";
        }
    });
}

export function compareMeasurements(answer, guess) {
    if (answer === guess) return "correct";
    else if (answer > guess) return "wrong lower";
    else return "wrong higher";
}

export function compareGenerations(answer, guess) {
    const generationIds = {Kanto: 1, Johto: 2, Hoenn: 3, Sinnoh: 4, Unova: 5, Kalos: 6, Alola: 7, "Galar/Hisui": 8, Paldea: 9};
    if (answer === guess) return "correct";
    else if (generationIds[answer] > generationIds[guess]) return "wrong lower";
    else return "wrong higher";
}

function handleGeneration(gens) {
    if (gens.length === 1){
        if (gens[0] === "all") return [1, 1025];
        return generations[gens[0]];
    }
    return generations[gens[Math.floor(Math.random() * gens.length)]];
}