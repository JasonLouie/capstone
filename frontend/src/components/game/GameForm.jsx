import { useGameStore } from "../../stores/gameStore";
import { useUserStore } from "../../stores/userStore";
import Button from "../Button";

export default function GameForm({handleSubmit, input, setInput}) {
    const { settings } = useUserStore(state => state);
    const { gameState } = useGameStore(state => state);
    return (
        <div className="form-container game">
            <form onSubmit={handleSubmit} className="form-game">
                <input disabled={gameState !== "playing"} type="text" className="field game-input" id="game-input" placeholder="Enter a Pokémon name" value={input} onChange={(e) => setInput(e.target.value)} autoComplete="none" spellCheck={false}/>
                <Button buttonType="submit" className="submit-guess" disabled={(!settings.allGenerations && settings.generations.length === 0) || !input}>Guess</Button>
            </form>
        </div>
    );
}