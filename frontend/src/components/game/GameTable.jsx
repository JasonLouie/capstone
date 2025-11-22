import { useGameStore } from "../../stores/gameStore";
import Guess from "./Guess";

export default function GameTable() {
    const {answer, guesses } = useGameStore(state => state);
    return (
        <div className="table-container">
            <table className="game-table">
                <thead>
                    <tr>
                        <th className="info-th pokemon-img">Picture</th>
                        <th className="info-th pokemon-name">Name</th>
                        <th className="info-th pokemon-generation">Generation</th>
                        <th className="info-th pokemon-types">Type 1</th>
                        <th className="info-th pokemon-types">Type 2</th>
                        <th className="info-th pokemon-color">Color</th>
                        <th className="info-th pokemon-stage">Stage</th>
                        <th className="info-th pokemon-height">Height</th>
                        <th className="info-th pokemon-weight">Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {guesses.map(guess => <Guess key={guess.id} answer={answer} {...guess} />)}
                </tbody>
            </table>
        </div>
    );
}