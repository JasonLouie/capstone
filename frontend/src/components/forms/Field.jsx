import { camelCaseToTitleCase } from "../../utils/funcs";
import PasswordInput from "./PasswordInput";

const inputTypes = { name: "text", username: "text", email: "email", confirmPassword: "password" };

export default function Field({ fieldName, formData, setFormData, formErrors }) {
    const label = camelCaseToTitleCase(fieldName);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <>
            <label htmlFor={fieldName} className={`form-label${fieldName === "password" ? " password" : ""}`}>
                {label}
                {fieldName === "password" ? <PasswordInput handleChange={handleChange} value={formData[fieldName]}/> : <input type={inputTypes[fieldName]} className="field" name={fieldName} id={fieldName} value={formData[fieldName]} onChange={handleChange} />}
            </label>
            {formErrors[fieldName]?.length > 0 && <FieldErrors errors={formErrors[fieldName]}/>}
        </>
    );
}