import GameForm from "../components/game/GameForm";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { chooseRandomPokemon } from "../game";
import { getPokemon } from "../api/pokeApiCalls";
import { useEffect, useState } from "react";
import "../styles/game.css";
import Guess from "../components/game/Guess";

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
        <Main>
            <h1>Game</h1>
            <GameForm {...props} />
            <table className="game-table">
                <thead>
                    <tr>
                        <th>Picture</th>
                        <th>Name</th>
                        <th>Generation</th>
                        <th>Types</th>
                        <th>Colors</th>
                        <th>Stage</th>
                        <th>Height</th>
                        <th>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {guesses.map(guess => <Guess key={guess.id} {...guess}/>)}
                </tbody>
            </table>
        </Main>
    );
}