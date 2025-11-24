import Button from "../Button";
import Field from "./Field";

export default function SettingsForm({ hidden, title, formInfo, handleSubmit, msg }) {
    const { formData } = formInfo;
    return (
        <div inert={hidden} className={`form-container auth settings ${hidden ? "hidden" : ""}`}>
            <h1 className="form-title auth">{title}</h1>
            <p className={`email-message ${msg ? "" : "hidden"}`}>{msg}</p>
            <form className="form auth" onSubmit={handleSubmit} noValidate={true}>
                {Object.keys(formData).map(field => <Field key={field} fieldName={field} {...formInfo} />)}
                <div className="btn-container">
                    <Button className={`form-submit settings`} buttonType="submit">{title}</Button>
                </div>
            </form>
        </div>
    );
}