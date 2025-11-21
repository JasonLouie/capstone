import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy } from "passport-jwt";
import { getAuthByEmail, getAuthById } from "../services/authService.js";
import EndpointError from "../classes/EndpointError.js";

// Local strategy for logging in
passport.use(new LocalStrategy({usernameField: "email", session: false}, async (email, password, done) => {
    console.log(`Attempting login for ${email}`);
    let user;
    try {
        user = await getAuthByEmail(email);
    } catch { // User not found
        return done(null, false, { message: "Invalid email or password" });
    }

    if (await user.comparePassword(password)) {
        console.log("Successfully logged in.");
        return done(null, user);
    } else { // Incorrect password
        console.log("Failed login attempt");
        return done(null, false, { message: "Invalid email or password"});
    }
}));

function cookieExtractor(req) {
    if (req && req.cookies) {
        return req.cookies["accessToken"];
    }
    return null;
}

// JWT strategy for verifying token
const jwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
};

passport.use(new JWTStrategy(jwtOptions, async(jwt_payload, done) => {
    try {
        const user = await getAuthById(jwt_payload.sub);
        return done(null, user);
    } catch (err) { // err is either the custom not found error or a server error
        return err instanceof EndpointError ? done(null, false) : done(err, false);
    }
}));