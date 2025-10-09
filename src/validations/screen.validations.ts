import Joi from "joi";

export const screenCreateSchema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            "any.required": "Screen name is required",
            "string.empty": "Screen name cannot be empty",
            "string.base": "Screen name must be a string"
        }),

    theaterId: Joi.string()
        .guid({ version: ['uuidv4'] })
        .required()
        .messages({
            "any.required": "Theater ID is required",
            "string.guid": "Theater ID must be a valid UUID"
        }),

    seatMap: Joi.array().items(
        Joi.object({
            blockName: Joi.string()
                .required()
                .messages({
                    "any.required": "Block name is required",
                    "string.empty": "Block name cannot be empty"
                }),
            priceAdjustment: Joi.number()
                .messages({
                    "number.base": "Block price adjustment must be a number"
                }),
            layout: Joi.array().items(
                Joi.object({
                    row: Joi.string()
                        .required()
                        .messages({
                            "any.required": "Row name is required",
                            "string.empty": "Row name cannot be empty"
                        }),
                    seats: Joi.array().items(
                        Joi.object({
                            number: Joi.number()
                                .required()
                                .messages({
                                    "any.required": "Seat number is required",
                                    "number.base": "Seat number must be a number"
                                }),
                            priceAdjustment: Joi.number()
                                .optional()
                                .messages({
                                    "number.base": "Seat price adjustment must be a number"
                                }),
                            x: Joi.number()
                                .required()
                                .messages({
                                    "any.required": "Seat X position is required",
                                    "number.base": "Seat X position must be a number"
                                }),
                            y: Joi.number()
                                .required()
                                .messages({
                                    "any.required": "Seat Y position is required",
                                    "number.base": "Seat Y position must be a number"
                                })
                        })
                    ).required().messages({
                        "any.required": "Seats array is required"
                    })
                })
            ).required().messages({
                "any.required": "Layout array is required"
            })
        })
    ).required().messages({
        "any.required": "Seat array is required"
    })
})

    .unknown(false)
    .messages({
        "object.unknown": "Extra field {{#key}} is not allowed in request body"
    });
