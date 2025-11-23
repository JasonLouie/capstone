import Image from "../components/Image";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useUserStore } from "../stores/userStore";

export default function Profile() {
    const { user, pokedex } = useUserStore.getState();
    const { username, profilePicUrl, gamesPlayed, totalGuesses } = user;
    useDocumentTitle(`${username}'s Profile`);
    return (
        <Main>
            <h1>Profile</h1>
            <Image src={profilePicUrl} size="medium"/>
            <p>Username: {username}</p>
            <p>Games Played: {gamesPlayed}</p>
            <p>Total Guesses: {totalGuesses}</p>
            <p>Pokemon Guessed: {pokedex.length}</p>
        </Main>
    );
}