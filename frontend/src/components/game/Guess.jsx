import Image from "../Image";

export default function Guess({name, img, generation, types, colors, stage, height, weight}) {
    return (
        <tr className="guess">
            <td className="pokemon-img"><Image src={img} size="medium"/></td>
            <td className="pokemon-name">{name}</td>
            <td className="pokemon-generation">{generation}</td>
            <td className="pokemon-types">{types.join(", ")}</td>
            <td className="pokemon-colors">{colors?.join(", ") || "Colors"}</td>
            <td className="pokemon-stage">{stage || "Stage"}</td>
            <td className="pokemon-height">{height}</td>
            <td className="pokemon-weight">{weight}</td>
        </tr>
    );
}