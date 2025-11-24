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

export default function Settings() {
    useDocumentTitle("Settings");
    const { user, updateUsername, resetUserPokedex, pokedex } = useUserStore(state => state);
    const [username, setUsername] = useState(user.username);
    const [errors, setErrors] = useState({ username: "" });
    const [hiddenStates, setHiddenStates] = useState({ emailForm: true, passwordForm: true })

    const handleChange = (e) => setUsername(e.target.value);

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
                    <Button className="user-settings-btn" onClick={() => setHiddenStates({ ...hiddenStates, emailForm: !hiddenStates.emailForm })} disabled={!hiddenStates.passwordForm}>Change Email</Button>
                    <Button className="user-settings-btn" onClick={() => setHiddenStates({ ...hiddenStates, passwordForm: !hiddenStates.passwordForm })} disabled={!hiddenStates.emailForm}>Change Password</Button>
                    <Button className="user-settings-btn" onClick={() => resetUserPokedex()} disabled={pokedex.length === 0}>Reset Pokédex</Button>
                    <Button className="user-settings-btn">Delete Account</Button>
                </div>
                <EmailForm hidden={hiddenStates.emailForm} />
                <PasswordForm hidden={hiddenStates.passwordForm} />
            </div>
        </Main>
    )
}