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

const pokedexNameRules = {
    required: true
};

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
        email: {...emailRules, required: false}
    };
    validate(validations, req, res, next);
}

// Middleware for validing password before changing it
export function validatePassword(req, res, next) {
    validate({password: passwordRules}, req, res, next);
}

// Middleware for validating pokedexEntry before adding it
export function validateNewPokedexEntry(req, res, next) {
    const validations = {
        name: pokedexNameRules,
        imgUrl: {required: true}
    };
    validate(validations, req, res, next);
}