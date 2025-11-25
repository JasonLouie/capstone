import Button from "../Button";
import Image from "../Image";

export default function PokeResult({pokemon, handleGuess}) {
    const { name, img, id } = pokemon;
    return (
        <Button className="poke-result" id={id} onClick={() => handleGuess(pokemon)}>
            <Image src={img} alt={name} size="medium" />
            {name}
        </Button>
    );
}