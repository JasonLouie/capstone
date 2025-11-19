export default function GameError({title, message}) {
    return (
        <div className="game-error">
            <h2 className="game-error-title">{title}</h2>
            <p className="game-error-message">{message}</p>
        </div>
    )
}