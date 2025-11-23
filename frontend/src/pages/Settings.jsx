import { useState } from "react";
import Image from "../components/Image";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useUserStore } from "../stores/userStore";
import Button from "../components/Button";

export default function Settings() {
    useDocumentTitle("Settings");
    const { user } = useUserStore(state => state);
    const [edit, setEdit] = useState(false);
    const [username, setUsername] = useState(user.username);
    return (
        <Main>
            <h1>Settings</h1>
            <Image src={user.profilePicUrl} size="medium" />
            <label htmlFor="username">
                Username
                <input type="text" value={username} disabled={!edit} onChange={setUsername}/>
                <Button onClick={() => setEdit(!edit)}>{edit ? "Cancel" : "Edit"}</Button>
                {edit && <Button>Save Changes</Button>}
            </label>
        </Main>
    )
}