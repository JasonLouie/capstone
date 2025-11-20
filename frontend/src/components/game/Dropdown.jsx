import { useState } from "react";
import { useGameStore } from "../../store";

export default function Dropdown({ children, name, type }) {
    const { settings, modifyGameSetting } = useGameStore(state => state);

    return (
        <select name={name} id={name} value={settings[type]} onChange={(e) => modifyGameSetting(type, e.target.value)}>
            {children}
        </select>
    );
}