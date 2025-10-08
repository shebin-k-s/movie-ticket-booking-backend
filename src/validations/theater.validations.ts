import Joi from "joi";
import { email, password } from "./commonFields";


export const createTheaterSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "any.required": "Theater name is required",
            "string.empty": "Theater name cannot be empty",
            "string.base": "Theater name must be a string",
            "string.min": "Theater name must be at least 3 characters long",
            "string.max": "Theater name cannot exceed 100 characters"
        }),

    location: Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({
            "any.required": "Location is required",
            "string.empty": "Location cannot be empty",
            "string.base": "Location must be a string",
            "string.min": "Location must be at least 3 characters long",
            "string.max": "Location cannot exceed 200 characters"
        }),

    city: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "any.required": "City is required",
            "string.empty": "City cannot be empty",
            "string.base": "City must be a string",
            "string.min": "City must be at least 2 characters long",
            "string.max": "City cannot exceed 50 characters"
        }),

    state: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "any.required": "State is required",
            "string.empty": "State cannot be empty",
            "string.base": "State must be a string",
            "string.min": "State must be at least 2 characters long",
            "string.max": "State cannot exceed 50 characters"
        }),

    email,
    password
})
    .unknown(false)
    .messages({
        "object.unknown": "Extra field '{{#key}}' is not allowed in request body"
    });


export const updateTheaterSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .optional()
        .messages({
            "string.empty": "Theater name cannot be empty",
            "string.base": "Theater name must be a string",
            "string.min": "Theater name must be at least 3 characters long",
            "string.max": "Theater name cannot exceed 100 characters"
        }),

    location: Joi.string()
        .min(3)
        .max(200)
        .optional()
        .messages({
            "string.empty": "Location cannot be empty",
            "string.base": "Location must be a string",
            "string.min": "Location must be at least 3 characters long",
            "string.max": "Location cannot exceed 200 characters"
        }),


})
    .unknown(false)
    .messages({
        "object.unknown": "Extra field '{{#key}}' is not allowed in request body"
    });
