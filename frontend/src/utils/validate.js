import { titleCase } from "./funcs.js";

function validate(validations, formData ) {
    const validationErrors = {};

    for (const field in validations) {
        const fieldName = titleCase(field);
        const rules = validations[field];
        const value = formData[field];
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
    return validationErrors;
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

export function validateSignUp(formData) {
    const confirmPassword = formData?.confirmPassword || "";
    const validations = {
        username: usernameRules,
        email: emailRules,
        password: {...passwordRules, match: confirmPassword}
    };
    return validate(validations, formData);
}

export function validateLogin(formData) {
    const requiredErrors = {};
    if (!formData?.email) requiredErrors.email = ["Email is required"];
    if (!formData?.password) requiredErrors.password = ["Password is required"];
    if (Object.keys(requiredErrors).length > 0) return requiredErrors;

    const validations = {
        email: {...emailRules, required: false},
        password: {...passwordRules, required: false}
    };
    const validationErrors = validate(validations, formData);
    // Don't attempt to make the api call for logging in if either field fails validation
    return (validationErrors.email || validationErrors.password) ? {email: ["Invalid email or password"]} : {};
}

export function validateModifyUser(formData) {
    const validations = {
        username: {...usernameRules, required: false},
        email: {...emailRules, required: false}
    };
    return validate(validations, formData);
}

export function validatePassword(password) {
    return validate({password: passwordRules}, {password});
}

export function validateNewPokedexEntry(pokemon) {
    const validations = {
        name: pokedexNameRules,
        imgUrl: {required: true}
    };
    return validate(validations, pokemon);
}