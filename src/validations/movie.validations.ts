import Joi from "joi";

export const createMovieSchema = Joi.object({
    title: Joi.string()
        .required()
        .messages({
            "any.required": "Movie title is required",
            "string.empty": "Movie title cannot be empty",
            "string.base": "Movie title must be a string"
        }),
    genre: Joi.string()
        .optional()
        .messages({
            "string.base": "Genre must be a string"
        }),
    duration: Joi.number()
        .required()
        .messages({
            "any.required": "Duration is required",
            "number.base": "Duration must be a number"
        }),
    rating: Joi.number()
        .optional()
        .messages({
            "number.base": "Rating must be a number"
        }),
    description: Joi.string()
        .optional()
        .messages({
            "string.base": "Description must be a string"
        }),
    posterUrl: Joi.string()
        .uri()
        .optional()
        .messages({
            "string.uri": "Poster URL must be a valid URI"
        }),
    releaseDate: Joi.date()
        .required()
        .messages({
            "any.required": "Release date is required",
            "date.base": "Release date must be a valid date"
        })
})
    .unknown(false)
    .messages({
        "object.unknown": "Extra field {{#key}} is not allowed in request body"
    });
