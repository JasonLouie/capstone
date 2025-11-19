import { useState } from "react";
import AuthForm from "../components/forms/AuthForm";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Signup() {
    useDocumentTitle("Sign Up")
    const [formData, setFormData] = useState({username: "", email: "", password: "", confirmPassword: ""});
    const [formErrors, setFormErrors] = useState({});
    const formInfo = { formData, setFormData, formErrors };

    function handleSubmit(e) {
        e.preventDefault();
        console.log("Triggered");
    }

    return (
        <Main className="form flex-center">
            <AuthForm type="signup" formInfo={formInfo} handleSubmit={handleSubmit}/>
        </Main>
    );
}