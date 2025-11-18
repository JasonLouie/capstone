import { Link } from "react-router";

export default function Button({disabled, path, onClick, className, toggle, children, buttonType}) {
    const classes = `button ${disabled ? "disabled" : ""} ${className ? className : ""}`;

    const renderButton = () => toggle ? <button className={classes} type={buttonType} onClick={onClick}>{children}</button> : <button className={classes} type={buttonType} onMouseEnter={toggle} onMouseLeave={toggle}>{children}</button>

    const renderLink = () => disabled ? <button className={classes}>{children}</button> : <Link to={path} className={classes}>{children}</Link>

    return path ? renderLink() : renderButton();
}