export const timeOptions = { hour12: true, hour: "numeric", minute: "2-digit" };

export function filterBody(keys, body) {
    const filteredBody = {};
    keys.forEach(key => {
        if (obj[key]) filteredBody.key = body[key];
    });
    return filteredBody;
}

export function titleCase(string) {
    return string.split(" ").map(word => word[0].toUppercase() + word.slice(1));
}

// Strict validation that ensures the object only contains the expected keys
export function validateObject(expectedKeys, obj) {
    expectedKeys.forEach(key => {
        if (!obj[key]) return false;
    });
    return expectedKeys.length === Object.keys(obj).length;
} 