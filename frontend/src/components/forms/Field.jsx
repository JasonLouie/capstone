import { camelCaseToTitleCase } from "../../utils/funcs";
import PasswordInput from "./PasswordInput";

const inputTypes = { name: "text", username: "text", email: "email", confirmPassword: "password" };

export default function Field({ fieldName, formData, setFormData, formErrors }) {
    const label = camelCaseToTitleCase(fieldName);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <>
            <div className="form-input">
                {fieldName === "password" ? <PasswordInput handleChange={handleChange} value={formData[fieldName]}/> : <input type={inputTypes[fieldName]} className="field" name={fieldName} id={fieldName} value={formData[fieldName]} onChange={handleChange} placeholder={label}/>}
            </div>
            {formErrors[fieldName]?.length > 0 && <FieldErrors errors={formErrors[fieldName]}/>}
        </>
    );
}