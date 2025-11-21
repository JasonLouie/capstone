import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authSchema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required."],
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format."],
        validate: {
            validator: function (v) {
                const authModel = this.getQuery ? this.model : this.constructor;
                const authId = this.getQuery ? this.getQuery()._id : this._id;

                return authModel.findOne({ email: v, _id: { $ne: authId } }).then(auth => !auth);
            },
            message: "Email is taken."
        }
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S+$/, "Password must contain at least one lowercase letter, at least one uppercase letter, at least one number, and cannot contain whitespace."]
    }
}, { optimisticConcurrency: true, versionKey: "version" } );

// Hash password before saving document to the db
authSchema.pre("save", async function (next) {
    // Only hash the password if the field was modified
    if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password
authSchema.methods.comparePassword = async function (comparedPassword) {
    return await bcrypt.compare(comparedPassword, this.password);
}

const Auth = mongoose.model("Auth", authSchema, "auth");
export default Auth;