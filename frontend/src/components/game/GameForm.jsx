import Button from "../Button";

export default function GameForm({handleSubmit, inputState, disabled, input, setInput}) {
    return (
        <div className="form-container game">
            <form onSubmit={handleSubmit} className="form-game">
                <input disabled={inputState} type="text" className="field game-input" id="game-input" placeholder="Enter a Pokémon name" value={input} onChange={(e) => setInput(e.target.value)} autoComplete="none" spellCheck={false}/>
                <Button buttonType="submit" className="submit-guess" disabled={disabled}>Guess</Button>
            </form>
        </div>
    );
}