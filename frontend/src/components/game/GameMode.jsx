import { useUserStore } from "../../stores/userStore";

export default function GameMode() {
    const { settings, updateMode } = useUserStore(state => state);

    return (
        <select name="game-mode" id="game-mode" value={settings.mode} onChange={(e) => updateMode(e.target.value)}>
            <option value="regular">Regular</option>
            <option value="silhouette">Silhouette</option>
        </select>
    );
}