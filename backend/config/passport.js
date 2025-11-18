import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { getUserByEmail, getUserById } from "../services/userService.js";
import EndpointError from "../classes/EndpointError.js";

// Local strategy for logging in
passport.use(new LocalStrategy({usernameField: "email", session: false}, async (email, password, done) => {
    console.log(`Attempting login for ${email}`);
    let user;
    try {
        user = await getUserByEmail(email);
    } catch { // User not found
        return done(null, false, { message: "Incorrect email or password" });
    }

    if (await user.comparePassword(password)) {
        console.log("Successfully logged in.");
        return done(null, user);
    } else { // Incorrect password
        console.log("Failed login attempt");
        return done(null, false, { message: "Incorrect email or password"});
    }
}));

// JWT strategy for verifying token
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
};

passport.use(new JWTStrategy(jwtOptions, async(jwt_payload, done) => {
    try {
        const user = await getUserById(jwt_payload.sub);
        return done(null, user);
    } catch (err) { // err is either the custom not found error or a server error
        return err instanceof EndpointError ? done(null, false) : done(err, false);
    }
}));