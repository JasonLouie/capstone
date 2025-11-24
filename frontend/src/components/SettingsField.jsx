import { camelCaseToTitleCase } from "../utils/funcs";
import Button from "./Button";
import FieldErrors from "./forms/FieldErrors";
import { useState } from "react";
import "../styles/user.css";

const inputTypes = { username: "text", email: "email" };
const autoCompleteTypes = { username: "username", email: "email" };

export default function SettingsField({ fieldName, value, setValue, onClick, errors }) {
    const label = camelCaseToTitleCase(fieldName);
    const [edit, setEdit] = useState(false);

    return (
        <>
            <p className="settings-label">{label}</p>
            <div className="user-setting-container">
                <input disabled={!edit} type={inputTypes[fieldName]} className="field settings" name={fieldName} id={fieldName} value={value} onChange={(e) => setValue(e.target.value)} autoComplete={autoCompleteTypes[fieldName]} />
                <Button className="settings-btn" onClick={() => setEdit(!edit)}>{edit ? "Cancel" : "Edit"}</Button>
                {edit && <Button className="settings-btn" onClick={onClick}>Save Changes</Button>}
                {errors.length > 0 && <FieldErrors errors={errors} />}
            </div>
        </>
    );
}