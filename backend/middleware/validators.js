import EndpointError from "../classes/EndpointError.js";
import { titleCase } from "../utils/utils.js";

function validate(validations, req, res, next ) {
    if (!req.body) return res.status(400).json(new EndpointError(400, "Request body is required."));
    const validationErrors = {};

    for (const field in validations) {
        const fieldName = titleCase(field);
        const rules = validations[field];
        const value = req.body[field];
        const errors = [];

        if (rules.required && !value) {
            errors.push(`${fieldName} is required.`);
        }

        // Handle multiple regex tests
        if (value && rules.regexes) {
            rules.regexes.forEach(r => {
                if (value && r.regex && !r.regex.test(value)) {
                    errors.push(r.message);
                }
            });
        } else if (value && rules.regex && !rules.regex.test(value)) { // Handle a singular regex test
            errors.push(rules.message);
        }

        // Handle minLength tests
        if (value && rules.minLength && value.length < rules.minLength) {
            errors.push(`${fieldName} must be at least ${rules.minLength} characters.`)
        }

        // Handle exact value matches
        if (value && rules.match !== undefined) {
            // If confirmPassword is an empty string or doesn't password doesn't match confirm password
            if (!rules.match || value !== rules.match) errors.push(`Both ${field}s must match.`);
        }

        // Handle enums
        if (value && rules.enum) {
            if (typeof value === "string" && !rules.enum.includes(value)) errors.push(`${fieldName} is an invalid ${field}.`);
            else if (value instanceof Array) {
                value.forEach((v, i) => {
                    if (!rules.enum.includes(v)) errors.push(`${fieldName}[${i}] is an invalid ${field}`);
                });
            }
        }

        if (value && rules.isNum) {
            if (isNaN(value)) {
                errors.push(`${fieldName} must be a number.`);
            }

            if (rules.min && value < rules.min) {
                errors.push(`${fieldName} must be greater than or equal to ${rules.min}`);
            }
    
            if (rules.min && value < rules.max) {
                errors.push(`${fieldName} must be less than or equal to ${rules.max}`);
            }
        }

        if (errors.length > 0) {
            validationErrors[field] = errors;
        }
    }

    if (Object.keys(validationErrors).length > 0) {
        console.log("Validation Error!");
        res.status(400).json(new EndpointError(400, validationErrors));
    } else {
        console.log("Validation passed!");
        next();
    }
}

const usernameRules = {
    regex: !/^[a-zA-Z0-9_.]+$/,
    message: "Username can only contain letters, numbers, underscores, and periods.",
    required: true,
    minLength: 3
};

const emailRules = {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email format.",
    required: true
};

const passwordRules = {
    regexes: [
        {
            regex: /[a-z]/,
            message: "Must contain at least one lowercase letter."
        },
        {
            regex: /[A-Z]/,
            message: "Must contain at least one uppercase letter."
        },
        {
            regex: /\d/,
            message: "Must contain at least one number."
        },
        {
            regex: /^\S+$/,
            message: "Password cannot contain whitespace."
        }
    ],
    minLength: 8,
    required: true
};

const modeRules = {
    enum: ["regular", "silhouette"]
};

const generationRules = {
    enum: ["Kanto", "Johto", "Hoenn", "Sinnoh", "Unova", "Kalos", "Alola", "Galar/Hisui", "Paldea"]
};

const allRules = {
    enum: ["true", "false"]
};

const typeRules = {
    enum: ["None", "Normal", "Fighting", "Ghost", "Water", "Fire", "Grass", "Ghost", "Fairy", "Dark", "Steel", "Ground", "Dragon", "Rock", "Poison", "Ice", "Psychic", "Electric", "Bug"]
};

const stageRules = {
    required: true,
    isNum: true,
    min: 1,
    max: 3
};

const measurementRules = {
    required: true,
    isNum: true
};

const versionRules = {
    isNum: true,
    min: 1
}

export function validateSignUp(req, res, next) {
    const confirmPassword = req.body?.confirmPassword || "";
    const validations = {
        username: usernameRules,
        email: emailRules,
        password: {...passwordRules, match: confirmPassword}
    };
    validate(validations, req, res, next);
}

export function validateLogin(req, res, next) {
    const validations = {
        email: emailRules,
        password: passwordRules
    };
    validate(validations, req, res, next);
}

// Middleware for validating req body when modifying user
export function validateModifyUser(req, res, next) {
    const validations = {
        username: {...usernameRules, required: false},
        version: versionRules
    };
    validate(validations, req, res, next);
}

// Middleware for validing password before changing it
export function validatePassword(req, res, next) {
    const validations = {
        password: passwordRules,
        version: versionRules
    }
    validate(validations, req, res, next);
}

// Middleware for validating pokemon before adding it
export function validatePokemon(req, res, next) {
    const validations = {
        name: {required: true},
        img: {required: true},
        generation: {...generationRules, required: true},
        types: typeRules,
        color: {required: true},
        stage: stageRules,
        height: measurementRules,
        weight: measurementRules
    };
    validate(validations, req, res, next);
}

export function validateBasicGameSettings(req, res, next) {
    const validations = {
        mode: modeRules,
        all: allRules,
        version: versionRules
    };
    validate(validations, req, res, next);
}

export function validateGeneration(req, res, next) {
    const validations = {
        generation: generationRules,
        version: versionRules
    }
    validate(validations, req, res, next);
}