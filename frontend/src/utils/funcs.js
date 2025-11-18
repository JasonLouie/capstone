export function camelCaseToTitleCase(camelCaseString) {
    let tempString = "";

    for (let i = 0; i < camelCaseString.length; i++) {
        const char = camelCaseString[i];
        if (i === 0) tempString += char.toUpperCase();
        else tempString += /[A-Z]/.test(char) ? ` ${char}` : char;
    }
    return tempString;
}