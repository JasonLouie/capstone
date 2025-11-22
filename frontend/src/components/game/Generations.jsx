import { generations } from "../../game";
import { useUserStore } from "../../stores/userStore";

export default function Generations() {
    const { settings, addGeneration, removeGeneration, toggleAllGenerations } = useUserStore(state => state);

    function handleChange(e) {
        // Handle removing generation
        if (!e.target.checked) {
            removeGeneration(e.target.value);
        } else {
            // Handle adding generation
            addGeneration(e.target.value);
        }

    }

    return (
        <div className="generations">
            <label htmlFor="all-generations" className="generation">
                <input type="checkbox" name="all-generations" id="all-generations" checked={settings.allGenerations} onChange={(e) => toggleAllGenerations(e.target.checked)} />
                All
            </label>
            {Object.keys(generations).map(gen =>
                <label key={gen} htmlFor={gen} className="generation">
                    <input type="checkbox" name={gen} id={gen} value={gen} checked={settings?.generations.includes(gen)} disabled={settings.allGenerations} onChange={handleChange} />
                    {gen}
                </label>
            )}
        </div>
    );
}