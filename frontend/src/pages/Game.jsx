import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Game() {
    useDocumentTitle("Game");
    return (
        <Main>
            <h1>Game</h1>
        </Main>
    );
}