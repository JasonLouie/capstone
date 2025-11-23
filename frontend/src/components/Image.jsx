import defaultAvatar from "/images/default-avatar.png";

export default function Image({src, alt, size, className}) {
    return <img src={src|| defaultAvatar} alt={alt} className={`pic ${size}${className ? (" " + className) : ""}`} />
}