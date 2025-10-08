import Joi from "joi";

export const paymentSchema = Joi.object({

    bookingId: Joi.string().uuid().required().messages({
        "any.required": "bookingId is required",
        "string.guid": "bookingId must be a valid UUID"
    }),
    amount: Joi.number()
        .min(1)
        .required()
        .messages({
            "any.required": "Amount is required",
            "number.base": "Amount must be a number",
            "number.min": "Amount cannot be negative"
        })

})
    .unknown(false)
    .messages({
        "object.unknown": "Extra field {{#key}} is not allowed in request body"
    });