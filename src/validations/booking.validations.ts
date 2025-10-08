import Joi from "joi";

export const bookSeatsSchema = Joi.object({
    seatIds: Joi.array()
        .items(
            Joi.string()
                .uuid()
                .required()
        )
        .required()
        .messages({
            "any.required": "seatIds array is required",
            "array.base": "seatIds must be an array of UUIDs"
        }),
    showId: Joi.string().uuid().required().messages({
        "any.required": "ShowId is required",
        "string.guid": "ShowId must be a valid UUID"
    })
})
    .unknown(false)
    .messages({
        "object.unknown": "Extra field {{#key}} is not allowed in request body"
    });


export const updateBookingSchema = Joi.object({

    bookingId: Joi.string().uuid().required().messages({
        "any.required": "bookingId is required",
        "string.guid": "bookingId must be a valid UUID"
    })

})
    .unknown(false)
    .messages({
        "object.unknown": "Extra field {{#key}} is not allowed in request body"
    });