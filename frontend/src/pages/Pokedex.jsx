import Image from "../components/Image";
import Main from "../components/Main";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { usePokemonStore } from "../stores/pokemonStore";
import { useUserStore } from "../stores/userStore";
import "../styles/pokedex.css";

export default function Pokedex() {
    useDocumentTitle("Pokédex");
    const { pokedex } = useUserStore(state => state);
    const { pokemonObject } = usePokemonStore(state => state);

    const renderPokedex = () => pokedex.map(p => {
        const pokemon = pokemonObject[p.id];
        let img = pokemon.img;
        if (p.isShiny) {
            img = img.replace(id, `shiny/${id}`);
        }
        return (
            <div key={p.id} className="pokedex-entry">
                <Image src={img} size="medium"/>
            </div>
        );
    });

    return (
        <Main>
            <h1>Pokédex</h1>
            <div className="pokedex">
                {pokedex.length > 0 ? renderPokedex() : <p>No pokémon successfully guessed.</p>}
            </div>
        </Main>
    )
}