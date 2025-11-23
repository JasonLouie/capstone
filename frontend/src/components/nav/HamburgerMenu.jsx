import { useState } from "react";
import Button from "../Button";

export default function HamburgerMenu() {
    const [hidden, setHidden] = useState(true);
    const classes = "top nav mobile-links flex-center";
    const handleClick = () => {
        setHidden(!hidden);
    };
    return (
        <>
            <Button className={`hamburger-btn ${hidden ? "" : "open"}`} onClick={handleClick}></Button>
            <div className={`mobile-menu ${hidden ? "" : "open"}`}>
                <Button path="/" className={classes} onClick={handleClick}>Home</Button>
                <Button path="/play" className={classes} onClick={handleClick}>Play</Button>
                <Button path="/about" className={classes} onClick={handleClick}>About</Button>
                <Button path="/pokedex" className={classes} onClick={handleClick}>Pokédex</Button>
            </div>
        </>
    );
} 