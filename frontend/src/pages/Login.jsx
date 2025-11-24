import { useState } from "react";
import AuthForm from "../components/forms/AuthForm";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { validateLogin } from "../utils/validate";
import { loginUser } from "../api/userApiCalls";
import { useUserStore } from "../stores/userStore";

export default function Login() {
    const { login } = useUserStore(state => state);
    useDocumentTitle("Login");
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [formErrors, setFormErrors] = useState({});
    const formInfo = { formData, setFormData, formErrors };

    async function handleSubmit(e) {
        e.preventDefault();

        // Validate the form before sending it
        const validationErrors = validateLogin(formData);
        setFormErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            const user = await loginUser(formData);
            login(user);
        } catch (err) {
            if (err.status === 400) {
                setFormErrors(err.response.data);
            } else if (err.status === 401) {
                setFormErrors({email: [err.response.data.message]})
            } else { // Handle server or frontend error
                console.log("Server error");
            }
        }
    }

    return (
        <Main className="form flex-center">
            <AuthForm type="login" formInfo={formInfo} handleSubmit={handleSubmit} />
        </Main>
    );
}