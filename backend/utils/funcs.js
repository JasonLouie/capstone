export function filterBody(keys) {
    const body = {};
    keys.forEach(key => {
        if (keys[key]) body.key = keys[key];
    });
    return body;
}