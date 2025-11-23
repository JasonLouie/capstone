import { timeOptions } from "../utils/utils.js";

export default function logRequest(req, res, next) {
    console.log(`Request made: ${req.method} ${req.url} at ${new Date().toLocaleTimeString("en-US", timeOptions)}`);
    next();
}