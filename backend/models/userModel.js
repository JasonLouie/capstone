import mongoose from "mongoose";
import bcrypt from "bcrypt";

const pokedexEntrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    imgUrl: {
        type: String,
        required: true,
    },
    isShiny: {
        type: Boolean,
        default: false
    },
    time_added: {
        type: Date,
        default: Date.now()
    }
}, { versionKey: false, _id: false });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required."],
        match: [/^[a-zA-Z0-9_.\s]+$/, "Name can only contain letters, numbers, underscores, periods, and whitespaces."]
    },
    username: {
        type: String,
        unique: true,
        required: [true, "Username is required."],
        lowercase: true,
        minLength: [5, "Username must be at least 5 characters long"],
        match: [/^[a-zA-Z0-9_.]+$/, "Username can only contain letters, numbers, underscores, and periods."],
        validate: {
            validator: function (v) {
                const userModel = this.getQuery ? this.model : this.constructor;
                const userId = this.getQuery ? this.getQuery()._id : this._id;

                return userModel.findOne({ username: v, _id: { $ne: userId } }).then(user => !user);
            },
            message: "Username is taken."
        }
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required."],
        unique: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format."],
        validate: {
            validator: function (v) {
                const userModel = this.getQuery ? this.model : this.constructor;
                const userId = this.getQuery ? this.getQuery()._id : this._id;

                return userModel.findOne({ email: v, _id: { $ne: userId } }).then(user => !user);
            },
            message: "Email is taken."
        }
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S+$/, "Password must contain at least one lowercase letter, at least one uppercase letter, at least one number, and cannot contain whitespace."]
    },
    profilePicUrl: {
        type: String,
        default: "/images/default-avatar.png"
    },
    pokedex: {
        type: [pokedexEntrySchema],
        default: []
    }
}, { versionKey: false, timestamps: true });

// Hash password before saving document to the db
userSchema.pre("save", async function (next) {
    // Only hash the password if the field was modified
    if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 12);

    next();
});

// Compare password
userSchema.methods.comparePassword = async function (comparedPassword) {
    return await bcrypt.compare(comparedPassword, this.password);
}

const User = mongoose.model("User", userSchema, "users");
export default User;