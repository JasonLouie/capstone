import GameForm from "../components/game/GameForm";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useEffect, useState } from "react";
import { useGameStore } from "../stores/gameStore";
import { usePokemonStore } from "../stores/pokemonStore";
import { useUserStore } from "../stores/userStore";
import { titleCase } from "../utils/funcs";
import GameError from "../components/game/GameError";
import GameSettings from "../components/game/GameSettings";
import GameTable from "../components/game/GameTable";
import Button from "../components/Button";
import { headingText } from "../game";
import "../styles/game.css";
import Image from "../components/Image";

export default function Game() {
    useDocumentTitle("Game");
    const { pokemonObject } = usePokemonStore(state => state);
    const { settings } = useGameStore(state => state);
    const { answer, mode, guesses, addGuess, gameState, initGame, endGame, createNewGame } = useGameStore(state => state);
    const [error, setError] = useState("");
    const [input, setInput] = useState("");
    const [hidden, setHidden] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const props = { handleSubmit, disabled, input, setInput };

    async function handleSubmit(e) {
        e.preventDefault();
        setDisabled(true);
        const pokemonList = settings.allGenerations ? Object.values(pokemonObject) : Object.values(pokemonObject).filter(p => settings.generations.includes(p.generation));
        const name = titleCase(input);
        const guess = pokemonList.find(p => p.name === name );
        if (!guess) {
            setError(name);
            setTimeout(() => setError(""), 3000);
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
            if (name !== answer.name) {
                setDisabled(false);
            } else { // User guessed the correct pokemon
                console.log("Correct!");
                endGame("won");
            }
            setInput("");
        }
    }

    function showSilhouette() {
        return <Image src={answer.img} size="large silhouette"/>;
    }

    useEffect(() => {
        if (gameState === "playing") initGame();
    }, []);

    return (
        <Main className="game-container">
            <h1>{headingText[gameState]}</h1>
            <GameForm {...props} />
            <div className="game-controls">
                <Button onClick={() => createNewGame()} disabled={!settings.allGenerations && settings.generations.length === 0} className="game-btn" >{gameState === "playing" ? "New Game" : "Play Again"}</Button>
                <Button onClick={() => setHidden(!hidden)} className="game-btn" >Settings</Button>
                {gameState === "playing" && <Button onClick={() => endGame("lost")} className="game-btn">Give Up</Button>}
            </div>
            <GameSettings hidden={hidden} />
            {mode === "silhouette" && answer && showSilhouette()}
            <GameTable />
            {error && <GameError title="Invalid Pokemon" message={`${titleCase(error)} is not a valid pokemon.`} />}
        </Main>
    );
}