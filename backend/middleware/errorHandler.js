import EndpointError from "../classes/EndpointError.js";
import { titleCase } from "../utils/utils.js";

export default function handleServerErrors(err, req, res, next) {
    // Format errors
    const messages = {};
    if (err.name === "ValidationError") {
        console.log("Mongoose ValidationError thrown");
        // Must store errors as an array to be consistent with the middleware validate functions
        for (const key in err.errors) {
            messages[key] = [err.errors[key].message];
        }
    } else if (err.name === "CastError") {
        console.log(`Mongoose CastError thrown for ${err.path}`);
        messages[err.path] = err.kind === "ObjectId" ? "Invalid user id." : err.message;
    } else if (err.code && err.code === 11000) { // If validator fails to catch a uniqueness error from the validator, expect a MongoDB error
        console.log("MongoDB UniqueError thrown");
        const field = Object.keys(err.keyValue)[0];
        messages[field] = `${titleCase(field)} is taken`;
    }

    if (Object.keys(messages).length > 0) {
        res.status(400).json(new EndpointError(400, messages));
    } else {
        const status = err.status || 500;
        console.log(err.toString());
        res.status(status).json(new EndpointError(status, err.message || "Unspecified error occurred."));
    }
}