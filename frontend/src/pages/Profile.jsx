import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Profile() {
    useDocumentTitle("Profile");
    return (
        <Main>
            <h1>Profile</h1>
        </Main>
    );
}