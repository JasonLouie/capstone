import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Info({ title, text }) {
    useDocumentTitle(title);
    return (
        <Main>
            <h1>{title}</h1>
            <p>{text}</p>
        </Main>
    );
}