import { useState } from "react";
import Field from "./Field";
import Button from "../Button";
import { validateChangeEmail } from "../../utils/validate";
import { useUserStore } from "../../stores/userStore";

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
        <div inert={hidden} className={`form-container auth settings ${hidden ? "hidden" : ""}`}>
            <h1 className="form-title auth">Change Email</h1>
            <p className={`email-message ${msg ? "" : "hidden"}`}>{msg}</p>
            <form className="form auth" onSubmit={handleSubmit} noValidate={true}>
                {Object.keys(formData).map(field => <Field key={field} fieldName={field} {...formInfo} />)}
                <div className="btn-container">
                    <Button className={`form-submit email`} buttonType="submit">Change Email</Button>
                </div>
            </form>
        </div>
    );
}