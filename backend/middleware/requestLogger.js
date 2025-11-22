import { timeOptions } from "../utils/utils.js";

export default function logRequest(req, res, next) {
    // Saw random GET request to "/" not made by me.
    if (process.env.NODE_ENV === "production" && req.url === "/") console.log("Unknown request made:", req);
    console.log(`Request made: ${req.method} ${req.url} at ${new Date().toLocaleTimeString("en-US", timeOptions)}`);
    next();
}