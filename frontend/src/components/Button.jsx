import { Link } from "react-router";

export default function Button({disabled, path, onClick, className, toggle, children, buttonType, id}) {
    const classes = `button${className ? ` ${className}` : ""}`;

    const renderButton = () => !toggle ? <button className={classes} id={id} type={buttonType ? buttonType : "button"} disabled={disabled} onClick={onClick}>{children}</button> : <button className={classes} id={id} type={buttonType} disabled={disabled} onMouseEnter={toggle} onMouseLeave={toggle}>{children}</button>

    const renderLink = () => disabled ? <button className={classes} id={id} disabled={disabled}>{children}</button> : <Link to={path} id={id} className={classes} onClick={onClick}>{children}</Link>

    return path ? renderLink() : renderButton();
}