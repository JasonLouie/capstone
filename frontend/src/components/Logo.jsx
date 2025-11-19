import logo from "../assets/logo.png";
import Image from "./Image";

export default function Logo({size, text}) {
    return (
        <div className="logo-container">
            <Image src={logo} alt="PokéGuesser Logo" size={size}/>
            {text && <h1 className="logo">PokéGuesser</h1>}
        </div>
    )
}