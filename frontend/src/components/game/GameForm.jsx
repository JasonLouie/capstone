import { useState } from "react";
import { useGameStore } from "../../stores/gameStore";
import { useUserStore } from "../../stores/userStore";
import Button from "../Button";
import PokeResult from "./PokeResults";

export default function GameForm({handleSubmit, input, disabled, setInput, searchResults, handleGuess}) {
    const { settings } = useUserStore(state => state);
    const { gameState } = useGameStore(state => state);
    const [hidden, setHidden] = useState(true);
    
    return (
        <div className="form-container game">
            <form onSubmit={handleSubmit} className="form-game">
                <input onFocus={() => setHidden(false)} onBlur={() => setHidden(true)} disabled={(gameState !== "playing") || disabled} type="text" className="field game-input" id="game-input" placeholder="Enter a Pokémon name" value={input} onChange={(e) => setInput(e.target.value)} autoComplete="off" spellCheck={false} autoCorrect="none"/>
                <Button buttonType="submit" className="submit-guess" disabled={(!settings.allGenerations && settings.generations.length === 0) || !input || disabled}>Guess</Button>
                {searchResults.length > 0 && <div className={`poke-results ${hidden ? "hidden" : ""}`}>{searchResults.map(s => <PokeResult key={`${s.id}-${s.name}`} pokemon={s} handleGuess={handleGuess} />)}</div>}
            </form>
        </div>
    );
}