export default function Overlay({ hidden, closeOverlay, children }) {
    return (
        <div inert={hidden} className={`overlay ${hidden ? "hidden" : ""}`} onClick={closeOverlay}>
            {children}
        </div>
    );
}