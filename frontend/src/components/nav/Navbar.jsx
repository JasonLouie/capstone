import Button from "../Button";
import Logo from "../Logo";
import "../../styles/navbar.css";
import Menu from "./Menu";
import Legal from "./Legal";
import { useUserStore } from "../../stores/userStore";
import HamburgerMenu from "./HamburgerMenu";

export default function Navbar({ top }) {
    const { authenticated } = useUserStore(state => state);
    const classes = `${top ? "top" : "bottom"} nav desktop-links`;

    const renderRightElements = () => top ? (authenticated ? <Menu /> : <Button path="/login" className="nav login">Login</Button>) : <Legal classes={classes} />;

    return (
        <nav className={top ? "top" : "flex-center"}>
            {top && <Logo size="small" text={top} />}
            <Button path="/" className={classes}>Home</Button>
            <Button path="/about" className={classes}>About</Button>
            <Button path="/play" className={classes}>Play</Button>
            <Button path="/pokedex" className={classes}>Pokédex</Button>
            {top && <HamburgerMenu />}
            {renderRightElements()}
        </nav>
    );
}