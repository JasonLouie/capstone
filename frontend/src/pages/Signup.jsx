import { useState } from "react";
import AuthForm from "../components/forms/AuthForm";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { validateSignUp } from "../utils/validate";
import { signup } from "../api/userApiCalls";
import { updateTokens } from "../utils/storage";
import { setAuthHeader } from "../configs/userApi";
import { useNavigate } from "react-router";

export default function Signup() {
    useDocumentTitle("Sign Up");
    const navigate = useNavigate();
    const [formData, setFormData] = useState({username: "", email: "", password: "", confirmPassword: ""});
    const [formErrors, setFormErrors] = useState({});
    const formInfo = { formData, setFormData, formErrors };

    async function handleSubmit(e) {
        e.preventDefault();
        
        // Validate the form before sending it
        const validationErrors = validateSignUp(formData);
        setFormErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            const tokens = await signup(formData);
            updateTokens(tokens);
            setAuthHeader(tokens?.token);
            navigate("/");
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
            <AuthForm type="signup" formInfo={formInfo} handleSubmit={handleSubmit}/>
        </Main>
    );
}