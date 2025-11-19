import { useState } from "react";
import AuthForm from "../components/forms/AuthForm";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Login() {
    useDocumentTitle("Login");
    const [formData, setFormData] = useState({email: "", password: ""});
    const [formErrors, setFormErrors] = useState({});
    const formInfo = { formData, setFormData, formErrors };

    function handleSubmit(e) {
        e.preventDefault();
    }

    return (
        <Main className="form flex-center">
            <AuthForm type="login" formInfo={formInfo} handleSubmit={handleSubmit}/>
        </Main>
    );
}