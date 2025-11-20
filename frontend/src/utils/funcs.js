export function camelCaseToTitleCase(camelCaseString) {
    let tempString = "";

    for (let i = 0; i < camelCaseString.length; i++) {
        const char = camelCaseString[i];
        if (i === 0) tempString += char.toUpperCase();
        else tempString += /[A-Z]/.test(char) ? ` ${char}` : char;
    }
    return tempString;
}

export function titleCase(string, delimiter= " ") {
    if (!string) return string;
    return string.split(delimiter).map(word => word[0].toUpperCase() + word.slice(1)).join(" ");
}