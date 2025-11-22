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
            <Section title="Welcome to PokéGuesser!">
                <p>Think you can guess today's pokémon? Press the Start Game button!</p>
            </Section>
            <Section title="How to Play">
                <p>PokéGuesser</p>
                <Button buttonType="button" className="game-btn" onClick={handleClick}>{answer ? "Continue Playing" : "Start Game"}</Button>
            </Section>
        </Main>
    );
}