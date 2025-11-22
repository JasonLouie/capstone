import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useUserStore } from "../stores/userStore";

export default function Profile() {
    const { user } = useUserStore.getState()
    useDocumentTitle(`${user.username}`);
    return (
        <Main>
            <h1>Profile</h1>
        </Main>
    );
}