import GameForm from "../components/game/GameForm";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { randomPokemon } from "../game";
import { getPokemon } from "../api/pokeApiCalls";
import { useEffect, useState } from "react";
import { titleCase } from "../utils/funcs";
import GameError from "../components/game/GameError";
import GameSettings from "../components/game/GameSettings";
import GameTable from "../components/game/GameTable";
import { useGameStore } from "../stores/gameStore";
import Button from "../components/Button";
import "../styles/game.css";
import { useUserStore } from "../stores/userStore";

const headingText = {playing: "Guess the Pokémon", won: "Congratulations! You Guessed the Pokémon!", lost: "You Failed to Guess the Pokémon!"};

export default function Game() {
    useDocumentTitle("Game");
    const {answer, guesses, addGuess, gameState, initGame, endGame, resetGame } = useGameStore(state => state);
    const { settings } = useUserStore(state => state);
    const [invalidGuesses, setInvalidGuesses] = useState([]); // Save API calls! If the API already said the name was invalid, do not allow guessing it again
    const [error, setError] = useState("");
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
                        addGuess(guess);
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
                addGuess(answer);
                endGame("won");
            }
            setInput("");
        }
    }

    useEffect(() => {
        if (!answer) initGame();
    }, [answer]);

    return (
        <Main className="game-container">
            <h1>{headingText[gameState]}</h1>
            <GameForm inputState={guesses[0]?.name === answer?.name} {...props} />
            <Button onClick={() => resetGame()} className="game-btn" disabled={!settings.allGenerations && settings.generations.length === 0}>{gameState === "playing" ? "New Game" : "Reset Game"}</Button>
            <GameSettings />
            <GameTable />
            {error && <GameError title="Invalid Pokemon" message={`${titleCase(error)} is not a valid pokemon.`} />}
        </Main>
    );
}