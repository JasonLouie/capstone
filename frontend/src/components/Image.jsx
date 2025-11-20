export default function Image({src, alt, size, className}) {
    return <img src={src} alt={alt} className={`pic ${size}${className ? (" " + className) : ""}`} />
}