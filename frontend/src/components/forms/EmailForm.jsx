import { useState } from "react";
import { validateChangeEmail } from "../../utils/validate";
import { useUserStore } from "../../stores/userStore";
import SettingsForm from "./SettingsForm";

export default function EmailForm({hidden}) {
    const { updateEmail } = useUserStore(state => state);
    const [msg, setMsg] = useState("");
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [formErrors, setFormErrors] = useState({});
    const formInfo = { formData, setFormData, formErrors };

    async function handleSubmit(e) {
        e.preventDefault();
        const { email, password } = formData;
        const validationErrors = validateChangeEmail({newEmail: email, password });
        console.log(validationErrors);
        setFormErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            await updateEmail(email, password);
            setFormData({ email: "", password: "" });
            setMsg("Email successfully changed.");
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            if (err.status === 400 || err.status === 401) setFormErrors(err);
        }
    }

    return (
        <SettingsForm msg={msg} hidden={hidden} title="Change Email" formInfo={formInfo} handleSubmit={handleSubmit}/>
    );
}