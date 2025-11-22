import { useState } from "react";
import AuthForm from "../components/forms/AuthForm";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { validateSignUp } from "../utils/validate";
import { signupUser } from "../api/userApiCalls";
import { useNavigate } from "react-router";
import { useUserStore } from "../stores/userStore";

export default function Signup() {
    const { login } = useUserStore(state => state);
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
            const user = await signupUser(formData);
            login(user);
            navigate("/users/profile");
        } catch (err) {
            if (err.status === 400 || err.status === 409) {
                const { message = [] } = err.response.data;
                setFormErrors(message);
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