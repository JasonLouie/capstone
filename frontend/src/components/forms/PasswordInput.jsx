import { useState } from "react";
import passwordIcon from "../../assets/password-icon.png";
import Button from "../Button";

export default function PasswordInput({ handleChange, value }) {
    const [hidden, setHidden] = useState(false);

    return (
        <>
            <input className="field" type={hidden ? "text" : "password"} name="password" id="password" value={value} onChange={handleChange} placeholder="Password"/>
            <Button className={`password-icon-btn${hidden ? "" : " line"}`} buttonType="button" onClick={() => setHidden(!hidden)}>
                <img src={passwordIcon} alt="Password icon" className="password-icon" />
            </Button>
        </>
    );
}