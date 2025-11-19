import { compareGuessAndAnswer, compareMeasurements } from "../../game";
import Image from "../Image";

export default function Guess({answer, name, img, generation, types, colors = [], stage = 2, height, weight}) {
    const typeClasses = compareGuessAndAnswer(answer.types, types);
    const colorClasses = compareGuessAndAnswer(answer.colors || [], colors);
    const stageClasses = compareMeasurements(answer.stage || 2, stage);
    const heightClasses = compareMeasurements(answer.height, height);
    const weightClasses = compareMeasurements(answer.weight, weight);

    return (
        <tr className="guess">
            <td className={`info-td pokemon-img ${answer.img === img ? "correct" : "wrong"}`}><Image src={img} size="medium"/></td>
            <td className={`info-td pokemon-name ${answer.name === name ? "correct" : "wrong"}`}>{name}</td>
            <td className={`info-td pokemon-generation ${answer.generation === generation ? "correct" : "wrong"}`}>{generation}</td>
            <td className={`info-td pokemon-types`}><div className="info-multi">{types.map((t, i) => <span key={`name-${t}`} className={`info-item type ${typeClasses[i]}`}>{t}</span>)}</div></td>
            <td className={`info-td pokemon-colors`}><div className="info-multi">{colors.map((c, i) => <span key={`name-${c}`} className={`info-item color ${colorClasses[i]}`}>{c}</span>)}</div></td>
            <td className={`info-td pokemon-stage ${stageClasses}`}>{stage || "Stage"}</td>
            <td className={`info-td pokemon-height ${heightClasses}`}>{height}</td>
            <td className={`info-td pokemon-weight ${weightClasses}`}>{weight}</td>
        </tr>
    );
}