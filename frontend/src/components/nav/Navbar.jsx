import Button from "../Button";
import Logo from "../Logo";
import "../../styles/navbar.css";
import Menu from "./Menu";
import Legal from "./Legal";

export default function Navbar({top}) {
    const user = true;
    const classes = `${top ? "top" : "bottom"} nav`;

    const renderElements = () => top ? (user ? <Menu /> : <Button path="/login" className="nav login">Login</Button>) : <Legal classes={classes}/>;

    return (
        <nav className={top ? null : "flex-center"}>
            {top && <Logo size="small" text={top}/>}
            <Button path="/" className={classes}>Home</Button>
            <Button path="/game/play" className={classes}>Play</Button>
            <Button path="/about" className={classes}>About</Button>
            {renderElements()}
        </nav>
    );
}