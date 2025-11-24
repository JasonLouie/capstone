import Button from "../Button";

export default function Legal({classes}) {
    return (
        <>
            <Button className={classes} path="/terms">Terms of Use</Button>
            <Button className={classes} path="/privacy">Privacy Policy</Button>
        </>
    );
}