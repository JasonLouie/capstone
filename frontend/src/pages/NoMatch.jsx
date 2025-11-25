import Main from "../components/Main";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

export default function NoMatch() {
    useDocumentTitle("Not Found");
    return (
        <Main>
            <h1>404 Not Found</h1>
        </Main>
    );
}