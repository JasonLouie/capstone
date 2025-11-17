import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JWTStrategy, ExtractJWT } from "passport-jwt";
import User from "../models/userModel";

// Local strategy for logging in
passport.use(new LocalStrategy({usernameField: "email", session: false}, async (email, password, done) => {
    console.log(`Attempting login for ${email}`);
    const user = await User.findOne({email});
    if (!user) {
        return done(null, false, { message: "Incorrect email or password" });
    }

    if (await user.comparePassword(password)) {
        console.log("Successfully logged in.");
        delete user.password; // Do not include password in the User doc
        return done(null, user);
    } else {
        console.log("Failed login attempt");
        return done(null, false, { message: "Incorrect email or password"});
    }
}));

// JWT strategy for verifying token
const jwtOptions = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
};

passport.use(new JWTStrategy(jwtOptions, async(jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.sub);
        return done(null, user ? user : false); // Return user if found
    } catch (err) {
        return done(err, false);
    }
}));