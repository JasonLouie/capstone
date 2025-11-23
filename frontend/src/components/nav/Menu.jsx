import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import Image from "../Image";
import { useUserStore } from "../../stores/userStore";

export default function Menu() {
    const { user, logout } = useUserStore(state => state);
    const [hidden, setHidden] = useState(true);
    const divRef = useRef(null);

    // Close the menu when clicking anywhere else on the page
    const closeMenu = (e) => {
        if (divRef.current && !divRef.current.contains(e.target)) setHidden(true);
    }

    const handleLogout = () => {
        logout();
    }

    useEffect(() => {
        if (!hidden && divRef.current) document.body.addEventListener("click", closeMenu);
        else document.body.removeEventListener("click", closeMenu);
        // Clean up for rendering different page without clicking on a link/button
        return () => document.body.removeEventListener("click", closeMenu);
    }, [hidden]);

    return (
        <div className="menu-container" onClick={() => setHidden(!hidden) } ref={divRef}>
            <Button className="show-menu-btn"><Image src={user.profilePicUrl} alt="User's profile picture" size="smaller" /></Button>
            <div inert={hidden} className={`menu${hidden ? " hidden" : ""}`}>
                <Button path="/users/profile" className="menu-item" buttonType="button" >Profile</Button>
                <Button path="/users/settings" className="menu-item" buttonType="button" >Settings</Button>
                <Button className="menu-item" buttonType="button" onClick={handleLogout}>Logout</Button>
            </div>
        </div>
    );
}