import GameMode from "./GameMode";
import Generations from "./Generations";
import "../../styles/gameSettings.css";

export default function GameSettings() {
    
    return (
        <div className="game-settings">
            <div className="game-setting">
                <h2 className="setting-title">Generations</h2>
                <Generations />
            </div>
            <div className="game-setting">
                <h2 className="setting-title">Game Mode</h2>
                <GameMode />
            </div>
        </div>
    );
}