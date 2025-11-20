import Dropdown from "./Dropdown";
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
                <h2 className="setting-title dropdown">Game Mode</h2>
                <Dropdown name="game-mode" type="mode">
                    <option value="regular">Regular</option>
                    <option value="silhouette">Silhouette</option>
                </Dropdown>
            </div>
            <div className="game-setting dropdown">
                <h2 className="setting-title">Time Limit</h2>
                <Dropdown name="game-time" type="time">
                    <option value="unlimited">Unlimited</option>
                    <option value="15m">15 Minutes</option>
                    <option value="30m">30 Minutes</option>
                </Dropdown>
            </div>
        </div>
    );
}