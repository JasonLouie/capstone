import { useUserStore } from "../../stores/userStore";
import Button from "../Button";

export default function ConfirmForm({ title, closeForm }) {

    const { resetUserPokedex, pokedex, deleteAccount } = useUserStore(state => state);
    return (
        <div className={`form-container auth settings`}>
            <h1 className="form-title auth">{title}</h1>
            <p className="text-center">Are you sure you want to {title.toLowerCase()}?</p>
            <div className="confirm-btn-container">
                <Button className={`form-submit confirm cancel`} buttonType="submit" onClick={closeForm}>Cancel</Button>
                <Button className={`form-submit confirm`} buttonType="submit" onClick={() => title === "Delete Account" ? deleteAccount() : resetUserPokedex()} disabled={title === "Delete Account" ? null : pokedex.length === 0}>{title}</Button>
            </div>
        </div>
    );
}