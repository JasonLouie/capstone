import { generations } from "../../game";
import { useGameStore } from "../../store";

export default function Generations() {
    const { settings, modifyGameSetting } = useGameStore(state => state);
    return (
        <>
            <label htmlFor="all-generations">
                <input type="checkbox" name="all" id="all" checked={settings.all} onChange={(e) => modifyGameSetting("all", e.target.checked)} />
                All
            </label>
            {Object.keys(generations).map(gen =>
                <label key={gen} htmlFor={gen}>
                    <input type="checkbox" name={gen} id={gen} value={gen} disabled={settings.all} />
                    {gen}
                </label>
            )}
        </>
    );
}