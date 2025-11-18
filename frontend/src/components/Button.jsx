import { Link } from "react-router";

export default function Button({disabled, path, onClick, className, toggle, children, buttonType}) {
    const classes = `button${className ? ` ${className}` : ""}`;

    const renderButton = () => !toggle ? <button className={classes} type={buttonType} disabled={disabled} onClick={onClick}>{children}</button> : <button className={classes} type={buttonType} disabled={disabled} onMouseEnter={toggle} onMouseLeave={toggle}>{children}</button>

    const renderLink = () => disabled ? <button className={classes} disabled={disabled}>{children}</button> : <Link to={path} className={classes}>{children}</Link>

    return path ? renderLink() : renderButton();
}