import { compareGenerations, compareGuessAndAnswer, compareMeasurements } from "../../game";
import Image from "../Image";

export default function Guess({answer, name, img, generation, types, color, stage, height, weight}) {
    const generationClasses = compareGenerations(answer.generation, generation);
    const typeClasses = compareGuessAndAnswer(answer.types, types);
    const stageClasses = compareMeasurements(answer.stage, stage);
    const heightClasses = compareMeasurements(answer.height, height);
    const weightClasses = compareMeasurements(answer.weight, weight);

    return (
        <tr className="guess">
            <td className={`info-td pokemon-img ${answer.img === img ? "correct" : "wrong"}`}><Image src={img} size="medium"/></td>
            <td className={`info-td pokemon-name ${answer.name === name ? "correct" : "wrong"}`}>{name}</td>
            <td className={`info-td pokemon-generation ${generationClasses}`}>{generation}</td>
            <td className={`info-td pokemon-types ${typeClasses[0]}`}>{types[0]}</td>
            <td className={`info-td pokemon-types ${typeClasses[1]}`}>{types[1]}</td>
            <td className={`info-td pokemon-color ${answer.color === color ? "correct" : "wrong"}`}>{color}</td>
            <td className={`info-td pokemon-stage ${stageClasses}`}>{stage || "Stage"}</td>
            <td className={`info-td pokemon-height ${heightClasses}`}>{height}</td>
            <td className={`info-td pokemon-weight ${weightClasses}`}>{weight}</td>
        </tr>
    );
}