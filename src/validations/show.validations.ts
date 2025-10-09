import Joi from "joi";

export const createShowSchema = Joi.object({
    movieId: Joi.string()
        .guid({ version: ["uuidv4"] })
        .required()
        .messages({
            "any.required": "Movie ID is required",
            "string.guid": "Movie ID must be a valid UUID"
        }),

    screenId: Joi.string()
        .guid({ version: ["uuidv4"] })
        .required()
        .messages({
            "any.required": "Screen ID is required",
            "string.guid": "Screen ID must be a valid UUID"
        }),

    startTime: Joi.date()
        .iso()
        .required()
        .messages({
            "any.required": "Show start time is required",
            "date.base": "Start time must be a valid date",
            "date.format": "Start time must be in ISO format"
        }),

    basePrice: Joi.number()
        .min(0)
        .required()
        .messages({
            "any.required": "Base price is required",
            "number.base": "Base price must be a number",
            "number.min": "Base price cannot be negative"
        })
})
    .unknown(false)
    .messages({
        "object.unknown": "Extra field {{#key}} is not allowed in request body"
    })
