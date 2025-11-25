import Main from "../components/Main";
import GameForm from "../components/game/GameForm";
import GameSettings from "../components/game/GameSettings";
import GameTable from "../components/game/GameTable";
import Button from "../components/Button";
import Image from "../components/Image";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useEffect, useState } from "react";
import { useGameStore } from "../stores/gameStore";
import { headingText } from "../utils/game";
import "../styles/game.css";
import { useUserStore } from "../stores/userStore";
import { usePokemonSearch } from "../hooks/usePokemonSearch";

export default function Game() {
    useDocumentTitle("Game");
    const { settings } = useUserStore(state => state);
    const gameSettings = useGameStore(state => state.settings);
    const { answer, guesses, addGuess, gameState, initGame, endGame, createNewGame } = useGameStore(state => state);
    const [input, setInput] = useState("");
    const searchResults = usePokemonSearch(input);
    const [hidden, setHidden] = useState(true); // Controls showing/hiding settings
    const [disabled, setDisabled] = useState(false); // Controls state of the guess button

    // Props for GameForm
    const props = { handleSubmit, disabled, input, setInput, searchResults, handleGuess };

    async function handleNewGame() {
        setDisabled(false);
        await createNewGame();
    }

    async function handleGuess(guess) {
        setDisabled(true);
        if (!guess) {
            setDisabled(false);
            return;
        }
        if (input && !guesses.includes(guess.id)) {
            // Add element to the table of guesses
            try {
                await addGuess(guess._id);
            } catch (err) {
                console.log(err);
            }
            if (guess.name !== answer.name) {
                setDisabled(false);
            } else { // User guessed the correct pokemon
                endGame("won");
            }
            setInput("");
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const search = searchResults.find(p => p.name.toLowerCase() === input);
        await handleGuess(search);
    }

    function showPokemon() {
        return <div className="silhouette-background"><Image src={answer.img} size={`large ${gameSettings.mode === "silhouette" && gameState === "playing" ? "silhouette" : ""}`}/></div>;
    }

    useEffect(() => {
        initGame();
    }, [settings.mode, gameState]);

    return (
        <Main className="game-container">
            <h1>{headingText[gameState]}</h1>
            {(gameSettings.mode === "silhouette" || gameState !== "playing") && answer && showPokemon()}
            <div className="game-controls">
                <Button onClick={handleNewGame} disabled={!settings.allGenerations && settings.generations.length === 0} className="game-btn" >{gameState === "playing" ? "New Game" : "Play Again"}</Button>
                <Button onClick={() => setHidden(!hidden)} className="game-btn" >Settings</Button>
                {gameState === "playing" && <Button onClick={() => endGame("lost")} className="game-btn">Give Up</Button>}
            </div>
            <GameSettings hidden={hidden} />
            <GameForm {...props} />
            <GameTable />
        </Main>
    );
}