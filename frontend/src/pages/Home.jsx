import Button from "../components/Button";
import Main from "../components/Main";
import Section from "../components/Section";
import useDocumentTitle from "../hooks/useDocumentTitle";
import "../styles/home.css";

export default function Home() {
    useDocumentTitle();
    return (
        <Main className="flex-center home">
            <Section title="Welcome to PokéGuesser!">
                <p>Think you can guess today's pokémon? Press the Start Game button!</p>
            </Section>
            <Section title="How to Play">
                <p>PokéGuesser</p>
            </Section>
            <Section title="Options">
                <Button buttonType="button" className="start-btn">Start Game</Button>
            </Section>
        </Main>
    );
}