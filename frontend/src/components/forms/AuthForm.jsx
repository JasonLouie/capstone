import Field from "./Field";
import "../../styles/forms.css";
import Button from "../Button";
import Logo from "../Logo";

export default function AuthForm({type, formInfo, handleSubmit}) {
    const { formData } = formInfo;

    return (
        <div className="form-container auth">
            <h1 className="form-title auth">{type === "login" ? "Login" : "Sign Up"}</h1>
            <Logo size="medium" />
            <form className="form auth" onSubmit={handleSubmit}>
                {Object.keys(formData).map(field => <Field key={field} fieldName={field} {...formInfo} />)}
                <div className="btn-container">
                    <Button className={`form-submit ${type}`} buttonType="submit">{type === "login" ? "Login" : "Sign Up"}</Button>
                </div>
            </form>
            <Button className="form-navigate" buttonType="button" path={type === "login" ? "/signup" : "/login"}>{type === "login" ? "Create new account" : "Already have an account?"}</Button>
        </div>
    );
}