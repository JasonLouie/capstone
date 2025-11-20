import { generations } from "../../game";
import { useGameStore } from "../../store";

export default function Generations() {
    const { settings, modifyGameSetting } = useGameStore(state => state);

    function handleChange(e) {
        // Handle removing generation
        if (!e.target.checked) {
            modifyGameSetting("generations", settings.generations.filter(g => g !== e.target.value));
        } else {
            // Handle adding generation
            modifyGameSetting("generations", [...settings.generations, e.target.value]);
        }

    }

    return (
        <div className="generations">
            <label htmlFor="all-generations" className="generation">
                <input type="checkbox" name="all-generations" id="all-generations" checked={settings.all} onChange={(e) => modifyGameSetting("all", e.target.checked)} />
                All
            </label>
            {Object.keys(generations).map(gen =>
                <label key={gen} htmlFor={gen} className="generation">
                    <input type="checkbox" name={gen} id={gen} value={gen} checked={settings.generations.includes(gen)} disabled={settings.all} onChange={handleChange} />
                    {gen}
                </label>
            )}
        </div>
    );
}