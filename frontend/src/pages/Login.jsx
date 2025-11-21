import { useState } from "react";
import AuthForm from "../components/forms/AuthForm";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { validateLogin } from "../utils/validate";
import { useNavigate } from "react-router";
import { login } from "../api/userApiCalls";
import { useUserStore } from "../store";

export default function Login() {
    const { setTokens } = useUserStore(state => state);
    useDocumentTitle("Login");
    const navigate = useNavigate();
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
            const tokens = await login(formData);
            navigate("/users/profile");
            setTokens(tokens);
        } catch (err) {
            console.log(err);
            if (err.status === 400) {
                setFormErrors(err);
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