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

export function compareGuessAndAnswer(answerTypes, guessedTypes) {
    const styles = [];
    // Answer is duo type or monotype

    // Duo types:
    if (answerTypes.length > 1) {
        // Check if any types are correct
        guessedTypes.forEach((g, i) => {
            if (g === answerTypes[i]) {
                styles[i] = "correct";
            } else if (answerTypes.includes(g)) {
                styles[i] = "partial";
            } else {
                styles[i] = "wrong";
            }
        });

    } else {
        // Monotype answer:
        // Compare length
        if (answerTypes.length === guessedTypes.length) {
            styles[0] = answerTypes[0] === guessedTypes[0] ? "correct" : "wrong";
        } else {
            // Check if any of the guessed types are correct
            guessedTypes.forEach((g, i) => {
                styles[i] = g === answerTypes[0] ? "correct" : "wrong";
            });
        }
    }
    return styles;
}

export function compareMeasurements(answer, guess) {
    if (answer === guess) return "correct";
    else if (answer > guess) return "wrong lower";
    else if (answer < guess) return "wrong higher";
}

export function compareGenerations(answer, guess) {
    const generations = {Kanto: 1, Johto: 2, Hoenn: 3, Sinnoh: 4, Unova: 5, Kalos: 6, Alola: 7, "Galar/Hisui": 8, Paldea: 9};
    if (answer === guess) return "correct";
    else if (generations[answer] > generations[guess]) return "wrong lower";
    else if (generations[answer] < generations[guess]) return "wrong higher";
}