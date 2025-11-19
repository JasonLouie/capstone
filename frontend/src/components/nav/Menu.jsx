import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import defaultAvatar from "/images/default-avatar.png";
import Image from "../Image";

export default function Menu() {
    const user = {};
    const [hidden, setHidden] = useState(true);
    const divRef = useRef(null);

    // Close the menu when clicking anywhere else on the page
    const closeMenu = (e) => {
        if (divRef.current && !divRef.current.contains(e.target)) setHidden(true);
    }

    useEffect(() => {
        if (!hidden && divRef.current) document.body.addEventListener("click", closeMenu);
        else document.body.removeEventListener("click", closeMenu);
        // Clean up for rendering different page without clicking on a link/button
        return () => document.body.removeEventListener("click", closeMenu);
    }, [hidden]);

    return (
        <div className="menu-container" onClick={() => setHidden(!hidden) } ref={divRef}>
            <Button className="show-menu-btn"><Image src={user?.profilePicUrl ? user.profilePicUrl : defaultAvatar} alt="User's profile picture" size="smaller" /></Button>
            <div inert={hidden} className={`menu${hidden ? " hidden" : ""}`}>
                <Button className="menu-item" buttonType="button" >Profile</Button>
                <Button className="menu-item" buttonType="button" >Settings</Button>
                <Button className="menu-item" buttonType="button" >Logout</Button>
            </div>
        </div>
    );
}