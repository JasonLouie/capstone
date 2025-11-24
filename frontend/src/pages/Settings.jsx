import { useState } from "react";
import Image from "../components/Image";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useUserStore } from "../stores/userStore";
import Button from "../components/Button";
import SettingsField from "../components/SettingsField";
import { validateChangeUsername } from "../utils/validate";
import EmailForm from "../components/forms/EmailForm";
import PasswordForm from "../components/forms/PasswordForm";
import Overlay from "../components/Overlay";

export default function Settings() {
    useDocumentTitle("Settings");
    const { user, updateUsername, resetUserPokedex, pokedex } = useUserStore(state => state);
    const [username, setUsername] = useState(user.username);
    const [errors, setErrors] = useState({ username: "" });
    const [hiddenStates, setHiddenStates] = useState({ emailForm: true, passwordForm: true, deleteAccount: true, deletePokedex: true })

    const handleChange = (e) => setUsername(e.target.value);

    const closeOverlay = (e) => e.target === e.currentTarget && setHiddenStates({ emailForm: true, passwordForm: true, deleteAccount: true, deletePokedex: true });

    const toggleHidden = (e) => setHiddenStates({...hiddenStates, [e.target.id]: !hiddenStates[e.target.id]});

    const checkOtherStates = (exclude) => {
        for (const key in hiddenStates) {
            if (key != exclude && !hiddenStates[key]) {
                return true; // Another overlay is rendered at the moment
            }
        }
    }

    async function handleUsername() {
        const validationErrors = validateChangeUsername(username);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;
        try {
            await updateUsername(username);
        } catch (err) {
            if (err.status === 400 || err.status === 401) setErrors(err);
        }
        
    }

    return (
        <Main className="settings-page">
            <div>
                <h1 className="settings-title">Settings</h1>
                <div className="user-settings-container">
                    <Image src={user.profilePicUrl} size="medium settings" />
                    <SettingsField fieldName="username" value={username} setValue={setUsername} onClick={handleUsername} errors={errors} handleChange={handleChange} />
                    <Button className="user-settings-btn" id="emailForm" onClick={toggleHidden} disabled={checkOtherStates("emailForm")}>Change Email</Button>
                    <Button className="user-settings-btn" id="passwordForm" onClick={toggleHidden} disabled={checkOtherStates("passwordForm")}>Change Password</Button>
                    <Button className="user-settings-btn" id="deletePokedex" onClick={() => resetUserPokedex()} disabled={pokedex.length === 0}>Reset Pokédex</Button>
                    <Button className="user-settings-btn" id="deleteAccount">Delete Account</Button>
                </div>
                <Overlay hidden={hiddenStates.emailForm && hiddenStates.passwordForm && hiddenStates.deleteAccount && hiddenStates.deletePokedex} closeOverlay={closeOverlay}>
                    {!hiddenStates.emailForm && <EmailForm />}
                    {!hiddenStates.passwordForm && <PasswordForm />}
                </Overlay>
                
                
            </div>
        </Main>
    )
}