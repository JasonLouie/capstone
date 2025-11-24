import { useState } from "react";
import Field from "./Field";
import Button from "../Button";
import { validateChangePassword } from "../../utils/validate";
import { useUserStore } from "../../stores/userStore";

export default function PasswordForm({hidden}) {
    const { updatePassword } = useUserStore(state => state);
    const [msg, setMsg] = useState("");
    const [formData, setFormData] = useState({ password: "", newPassword: "" });
    const [formErrors, setFormErrors] = useState({});
    const formInfo = { formData, setFormData, formErrors };

    async function handleSubmit(e) {
        e.preventDefault();
        const { password, newPassword } = formData;
        const validationErrors = validateChangePassword({password, newPassword });
        console.log(validationErrors);
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
        <div inert={hidden} className={`form-container auth settings ${hidden ? "hidden" : ""}`}>
            <h1 className="form-title auth">Change Password</h1>
            <p className={`form-message ${msg ? "" : "hidden"}`}>{msg}</p>
            <form className="form auth" onSubmit={handleSubmit} noValidate={true}>
                {Object.keys(formData).map(field => <Field key={field} fieldName={field} {...formInfo} type="password"/>)}
                <div className="btn-container">
                    <Button className={`form-submit email`} buttonType="submit">Change Password</Button>
                </div>
            </form>
        </div>
    );
}