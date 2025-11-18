import logo from "../assets/logo.png";

export default function Logo({size, text}) {
    return (
        <div className="logo-container">
            <img src={logo} alt="PokeGuesser Logo" className={`logo ${size}`} />
            {text && <h1 className="logo">PokeGuesser</h1>}
        </div>
    )
}