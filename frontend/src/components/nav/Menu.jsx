import { useState } from "react";
import Button from "../Button";
import defaultAvatar from "/images/default-avatar.png";
import Image from "../Image";

export default function Menu() {
    const user = {};
    const [hidden, setHidden] = useState(true);

    return (
        <div className="menu-container">
            <Button className="show-menu-btn"><Image src={user?.profilePicUrl ? user.profilePicUrl : defaultAvatar} alt="User's profile picture" size="smaller" /></Button>
            <div className="menu">
                <Button className="menu-item">Profile</Button>
                <Button className="menu-item">Settings</Button>
            </div>
        </div>
    );
}