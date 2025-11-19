export default function Image({src, alt, size}) {
    return <img src={src} alt={alt} className={`pic ${size}`} />
}