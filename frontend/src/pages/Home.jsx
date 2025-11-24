import Button from "../components/Button";
import Main from "../components/Main";
import Section from "../components/Section";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useGameStore } from "../stores/gameStore";
import "../styles/home.css";
import { useNavigate } from "react-router";

export default function Home() {
    useDocumentTitle("Home");
    const navigate = useNavigate();
    const { answer } = useGameStore(state => state);

    function handleClick() {
        navigate("/play");
    }

    return (
        <Main className="flex-center home">
            <div className="home-container">
                <Section title="Welcome to PokéGuesser!">
                    <p>Think you know your Pokémon? Prove it! Your goal is to find the mystery Pokémon using as few guesses as possible.</p>

                </Section>
                <Section title="How to Play:">
                    <p>Type in a Pokémon name to make a guess. We'll give you hints based on how close you are.</p>
                    <ul>
                        <li><b>Generation:</b> Higher, Lower, or Match?</li>
                        <li><b>Type 1 & 2:</b> Does it share a type?</li>
                        <li><b>Stats:</b> We compare Height, Weight, Color, and Evolution Stage.</li>
                    </ul>
                </Section>
                <Section title="Play Your Way:">
                    <ul>
                        <li><b>Select Your Region</b> Use the settings to choose which Generations you want to play with.</li>
                        <li><b>Type 1 & 2:</b> Try Silhouette Mode for a visual challenge. Don't worry about losing progress. Your classic game and silhouette game are saved in separate slots.</li>
                        <li><b>Play Anywhere:</b> Log in to sync your stats, or play as a Guest. Your game is saved right to your browser so you never lose your streak.</li>
                    </ul>
                    <Button buttonType="button" className="game-btn home-btn" onClick={handleClick}>{answer ? "Continue Playing" : "Start Game"}</Button>
                </Section>
            </div>
        </Main>
    );
}