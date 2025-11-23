import { compareGenerations, compareGuessAndAnswer, compareMeasurements, inchesToFeet } from "../../game";
import { useGameStore } from "../../stores/gameStore";
import { usePokemonStore } from "../../stores/pokemonStore";
import Image from "../Image";

export default function Guess({ guessId }) {
    const { answer } = useGameStore(state => state);
    const { pokemonObject } = usePokemonStore(state => state);
    const guess = pokemonObject[guessId];

    const renderAnswer = () => {
        const { name, img, generation, types, color, stage, height, weight } = answer;
        return (
            <>
                <td className="info-td pokemon-img"><Image src={img} size="medium" /></td>
                <td className="info-td pokemon-name">{name}</td>
                <td className="info-td pokemon-generation">{generation}</td>
                <td className="info-td pokemon-types">{types[0]}</td>
                <td className="info-td pokemon-types">{types[1]}</td>
                <td className="info-td pokemon-color">{color}</td>
                <td className="info-td pokemon-stage">{stage}</td>
                <td className="info-td pokemon-height">{inchesToFeet(height)}</td>
                <td className="info-td pokemon-weight">{`${weight} lbs`}</td>
            </>
        );
    }

    const renderGuess = () => {
        const { name, img, generation, types, color, stage, height, weight } = guess;
        const generationClasses = compareGenerations(answer.generation, generation);
        const typeClasses = compareGuessAndAnswer(answer.types, types);
        const stageClasses = compareMeasurements(answer.stage, stage);
        const heightClasses = compareMeasurements(answer.height, height);
        const weightClasses = compareMeasurements(answer.weight, weight);
        return (
            <>
                <td className={`info-td pokemon-img ${answer.img === img ? "correct" : "wrong"}`}><Image src={img} size="medium" /></td>
                <td className={`info-td pokemon-name ${answer.name === name ? "correct" : "wrong"}`}>{name}</td>
                <td className={`info-td pokemon-generation ${generationClasses}`}>{generation}</td>
                <td className={`info-td pokemon-types ${typeClasses[0]}`}>{types[0]}</td>
                <td className={`info-td pokemon-types ${typeClasses[1]}`}>{types[1]}</td>
                <td className={`info-td pokemon-color ${answer.color === color ? "correct" : "wrong"}`}>{color}</td>
                <td className={`info-td pokemon-stage ${stageClasses}`}>{stage}</td>
                <td className={`info-td pokemon-height ${heightClasses}`}>{inchesToFeet(height)}</td>
                <td className={`info-td pokemon-weight ${weightClasses}`}>{`${weight} lbs`}</td>
            </>
        );
    }

    return (
        <tr className="guess">
            {guess ? renderGuess() : renderAnswer()}
        </tr>
    );
}