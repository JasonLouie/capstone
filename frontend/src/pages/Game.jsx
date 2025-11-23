import GameForm from "../components/game/GameForm";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { getPokemon } from "../api/pokeApiCalls";
import { useEffect, useState } from "react";
import { titleCase } from "../utils/funcs";
import GameError from "../components/game/GameError";
import GameSettings from "../components/game/GameSettings";
import GameTable from "../components/game/GameTable";
import { useGameStore } from "../stores/gameStore";
import Button from "../components/Button";
import "../styles/game.css";

const headingText = {playing: "Guess the Pokémon", won: "Congratulations! You guessed the pokémon!", lost: "Better luck next time! You failed to guess the pokémon."};

export default function Game() {
    useDocumentTitle("Game");
    const {answer, guesses, addGuess, gameState, initGame, endGame, generateNewAnswer } = useGameStore(state => state);
    const [invalidGuesses, setInvalidGuesses] = useState([]); // Save API calls! If the API already said the name was invalid, do not allow guessing it again
    const [error, setError] = useState("");
    const [input, setInput] = useState("");
    const [hidden, setHidden] = useState(true);
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
                        await addGuess(guess);
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
                await addGuess(answer);
                endGame("won");
            }
            setInput("");
        }
    }

    useEffect(() => {
        initGame();
    }, []);

    return (
        <Main className="game-container">
            <h1>{headingText[gameState]}</h1>
            <GameForm {...props} />
            <div className="game-controls">
                <Button onClick={() => generateNewAnswer()} className="game-btn" >{gameState === "playing" ? "New Game" : "Play Again"}</Button>
                <Button onClick={() => setHidden(!hidden)} className="game-btn" >Settings</Button>
                {gameState === "playing" && <Button onClick={() => endGame("lost")} className="game-btn">Give Up</Button>}
            </div>
            <GameSettings hidden={hidden} />
            <GameTable />
            {error && <GameError title="Invalid Pokemon" message={`${titleCase(error)} is not a valid pokemon.`} />}
        </Main>
    );
}