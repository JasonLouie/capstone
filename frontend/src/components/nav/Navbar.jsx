import Button from "../Button";
import Logo from "../Logo";
import "../../styles/navbar.css";

export default function Navbar({top}) {
    const classes = `${top ? "top" : "bottom"} nav`;

    const renderElements = () => top ? <Menu /> : <Legal />;

    return (
        <nav>
            <Logo size="small" text={top}/>
            <Button path="/" className={classes}>Home</Button>
            <Button path="/game/play" className={classes}>Play</Button>
            <Button path="/about" className={classes}>About</Button>
        </nav>
    );
}