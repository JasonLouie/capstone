import Image from "../components/Image";
import Main from "../components/Main";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useUserStore } from "../stores/userStore";

export default function Profile() {
    const { user, pokedex } = useUserStore.getState();
    const { username, profilePicUrl, gamesPlayed, totalGuesses } = user;
    useDocumentTitle(`${username}'s Profile`);
    return (
        <Main mainClass="flex-center">
            <div className="profile">
                <h1 className="profile-title text-center">Profile</h1>
                <Image src={profilePicUrl} size="medium profile-pic" />
                <div className="profile-info">
                    <p className="profile-field text-center">Username: {username}</p>
                    <p className="profile-field text-center">Games Played: {gamesPlayed}</p>
                    <p className="profile-field text-center">Total Guesses: {totalGuesses}</p>
                    <p className="profile-field text-center">Pokedex Count: {pokedex.length}</p>
                </div>
            </div>
        </Main>
    );
}