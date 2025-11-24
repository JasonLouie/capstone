import EndpointError from "../classes/EndpointError.js";
import passport from "passport";

export function authenticateUser(req, res, next) {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        // Handle server errors (db is down)
        if (err) return res.status(500).json(new EndpointError(500));

        // Handle user not found or wrong password
        if (!user) return res.status(401).json(new EndpointError(401, info.message || "Invalid credentials."));
        
        // User is valid and found. Attach the user to the request and move onto the next middleware.
        req.user = user;
        next();
    })(req, res, next);
}

export function protect(req, res, next) {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        // Handle server errors (db is down)
        if (err) return res.status(500).json(new EndpointError(500));

        // Send token error messages to the client if conditions are met
        console.log("Console logging in protect middleware");
        console.log(info);
        const tokenErrors = { TokenExpiredError: "Your token has expired. Please log in again.", JsonWebTokenError: "Invalid token.", NotFound: "Unauthorized. User not found." };
        if (info?.name && tokenErrors[info.name]) return res.status(401).json(new EndpointError(401, tokenErrors[info.name], info.name));
        if (!user) return res.status(401).json(new EndpointError(tokenErrors.NotFound));

        // User is valid and found. Attach the user to the request and move onto the next middleware.
        req.user = user;
        next();
    })(req, res, next);
}