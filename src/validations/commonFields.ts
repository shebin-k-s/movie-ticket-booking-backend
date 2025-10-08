import Joi from "joi"

export const email = Joi.string()
    .email()
    .required()
    .messages({
        "string.empty": "Email cannot be empty",
        "string.email": "Email must be valid",
        "any.required": "Email is required",
    })


export const password = Joi.string()
    .min(6)
    .required()
    .messages({
        "string.empty": "Password cannot be empty",
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password cannot be null",
    }) 