import { useState } from "react";
import { validateChangePassword } from "../../utils/validate";
import { useUserStore } from "../../stores/userStore";
import SettingsForm from "./SettingsForm";

export default function PasswordForm({ hidden }) {
    const { updatePassword } = useUserStore(state => state);
    const [msg, setMsg] = useState("");
    const [formData, setFormData] = useState({ password: "", newPassword: "" });
    const [formErrors, setFormErrors] = useState({});
    const formInfo = { formData, setFormData, formErrors };

    async function handleSubmit(e) {
        e.preventDefault();
        const { password, newPassword } = formData;
        const validationErrors = validateChangePassword({ password, newPassword });
        setFormErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            await updatePassword(password, newPassword);
            setFormData({ password: "", newPassword: "" });
            setMsg("Password successfully changed.");
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            if (err.status === 400 || err.status === 401) setFormErrors(err);
        }
    }

    return (
        <SettingsForm msg={msg} hidden={hidden} title="Change Password" formInfo={formInfo} handleSubmit={handleSubmit} />
    );
}