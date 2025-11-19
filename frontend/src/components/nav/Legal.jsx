import Button from "../Button";

export default function Legal({classes}) {
    return (
        <>
            <Button className={classes}>Terms of Use</Button>
            <Button className={classes}>Privacy Policy</Button>
        </>
    );
}