import Button from "../Button";

export default function GameForm({handleSubmit, disabled, input, setInput}) {
    return (
        <div className="form-container game">
            <form onSubmit={handleSubmit}>
                <input type="text" className="field game-input" placeholder="Enter a Pokémon name" value={input} onChange={(e) => setInput(e.target.value)} autoComplete="none" spellCheck={false}/>
                <Button buttonType="submit" disabled={disabled}>Guess</Button>
            </form>
        </div>
    );
}