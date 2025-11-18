import { useState } from "react";
import AuthForm from "../components/forms/AuthForm";
import Main from "../components/Main";

export default function Signup() {

    const [formData, setFormData] = useState({name: "", username: "", email: "", password: "", confirmPassword: ""});
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