import GameForm from "../components/game/GameForm";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { chooseRandomPokemon } from "../game";
import { getPokemon } from "../api/pokeApiCalls";
import { useEffect, useState } from "react";
import "../styles/game.css";
import GameError from "../components/game/GameError";
import { titleCase } from "../utils/funcs";
import GameTable from "../components/game/GameTable";

const staticPokemon = {
    generation: "Kanto",
    height: 13,
    color: "Brown",
    id: 141,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/141.png",
    name: "Kabutops",
    types: ['Rock', 'Water'],
    weight: 405
};

export default function Game() {
    useDocumentTitle("Game");
    const [answer, setAnswer] = useState();
    const [invalidGuesses, setInvalidGuesses] = useState([]);
    const [error, setError] = useState("");
    const [guesses, setGuesses] = useState([]);
    const [input, setInput] = useState("");
    const [disabled, setDisabled] = useState(false);
    const props = { handleSubmit, disabled, input, setInput };

    async function handleSubmit(e) {
        e.preventDefault();
        const queryName = input.split(" ").join("-").toLowerCase();
        if (input && !guesses.find(g => g.name === titleCase(queryName))) {
            setDisabled(true);
            // Add element to the table of guesses
            if (input.toLowerCase() !== answer.name.toLowerCase()) {
                const invalidGuess = invalidGuesses.find(g => g === input);
                if (invalidGuess) {
                    setError(invalidGuess);
                    setTimeout(() => setError(""), 3000);
                    setDisabled(false);
                } else {
                    try {
                        const guess = await getPokemon(queryName);
                        setGuesses(prev => [guess, ...prev]);
                    } catch (err) {
                        console.log(err);
                        // Overlay display error that the pokemon is invalid
                        if (err.status === 404) {
                            setInvalidGuesses([...invalidGuesses, input]);
                            setError(input);
                            setTimeout(() => setError(""), 3000);
                        }
                    }
                }
                setDisabled(false);
            } else { // User guessed the correct pokemon
                console.log("Correct!");
                setGuesses(prev => [answer, ...prev]);
            }
            setInput("");
        }
    }

    useEffect(() => {
        async function generateAnswer() {
            try {
                const pokemon = await getPokemon(chooseRandomPokemon());
                setAnswer(pokemon);
            } catch (err) {
                console.log("Error fetching data on random pokemon:", err);
                setAnswer(staticPokemon);
            }
        }
        generateAnswer();
    }, []);

    return (
        <Main className="game-container">
            <h1>Guess the pokemon!</h1>
            <GameForm inputState={guesses[0]?.name === answer?.name} {...props} />
            <GameTable answer={answer} guesses={guesses} />
            {error && <GameError title="Invalid Pokemon" message={`${titleCase(error)} is not a valid pokemon.`} />}
        </Main>
    );
}