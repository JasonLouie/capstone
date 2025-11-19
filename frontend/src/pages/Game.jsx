import GameForm from "../components/game/GameForm";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { chooseRandomPokemon } from "../game";
import { getPokemon } from "../api/pokeApiCalls";
import { useEffect, useState } from "react";
import "../styles/game.css";
import Guess from "../components/game/Guess";
import GameError from "../components/game/GameError";
import { titleCase } from "../utils/funcs";

const staticPokemon = {
    generation: "Kanto",
    height: 13,
    id: 141,
    img: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/141.png",
    name: "Kabutops",
    types: ['Rock', 'Water'],
    weight: 405
};

export default function Game() {
    useDocumentTitle("Game");
    const [answer, setAnswer] = useState(staticPokemon);
    const [invalidGuesses, setInvalidGuesses] = useState([]);
    const [guesses, setGuesses] = useState([]);
    const [hidden, setHidden] = useState(true);
    const [input, setInput] = useState("");
    const [disabled, setDisabled] = useState(false);
    const props = { handleSubmit, disabled, input, setInput };

    async function handleSubmit(e) {
        e.preventDefault();
        if (input) {
            setDisabled(true);
            // Add element to the table of guesses
            if (input.toLowerCase() !== answer.name.toLowerCase()) {
                try {
                    const guess = await getPokemon(input);
                    setGuesses(prev => [...prev, guess]);
                } catch (err) {
                    console.log(err);
                    // Overlay display error that the pokemon is invalid
                    if (err.status === 404) {
                        setInvalidGuesses([...invalidGuesses, input]);
                        setHidden(false);
                        setTimeout(() => setHidden(true), 3000);
                    }
                } finally {
                    setDisabled(false);
                }
            } else { // User guessed the correct pokemon
                console.log("Correct!");
                setGuesses(prev => [...prev, answer]);
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
        // generateAnswer();
    }, []);

    return (
        <Main className="game-container">
            <h1>Game</h1>
            <GameForm {...props} />
            <div className="table-container">
                <table className="game-table">
                    <thead>
                        <tr>
                            <th className="info-th pokemon-img">Picture</th>
                            <th className="info-th pokemon-name">Name</th>
                            <th className="info-th pokemon-generation">Generation</th>
                            <th className="info-th pokemon-types">Types</th>
                            <th className="info-th pokemon-colors">Colors</th>
                            <th className="info-th pokemon-stage">Stage</th>
                            <th className="info-th pokemon-height">Height</th>
                            <th className="info-th pokemon-weight">Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {guesses.map(guess => <Guess key={guess.id} answer={answer} {...guess}/>)}
                    </tbody>
                </table>
                {!hidden && <GameError title="Invalid Pokemon" message={`${titleCase(invalidGuesses[invalidGuesses.length-1])} is not a valid pokemon.`}/>}
            </div>
        </Main>
    );
}