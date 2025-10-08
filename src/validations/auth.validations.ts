import Joi from "joi";
import { UserRole } from "../entities/user.entity";
import { email, password } from "./commonFields";


export const userRegisterSchema = Joi.object({

    email: email,
    password: password,
    name: Joi.string()
        .required()
        .messages({
            "any.required": "Name is required",
            "string.empty": "Name cannot be empty",
            "string.base": "Name must be a string"
        }),
    role: Joi.string()
        .optional()
        .valid(...Object.values(UserRole).filter(role => role !== UserRole.THEATER_ADMIN))
        .messages({
            "any.required": "Role is required",
            "string.empty": "Role cannot be empty",
            "string.base": "Role must be a string",
            "string.min": "Role must be at least 2 characters long"
        }),

    warehouseId: Joi.string()
        .guid({ version: ['uuidv4'] })
        .optional()
        .messages({
            "string.guid": "Warehouse ID must be a valid UUID"
        }),

})
    .messages({
        "object.unknown": "Extra field {{#key}} is not allowed in request body"

    });


export const userLoginSchema = Joi.object({
    email: email,
    password: password
})
    .unknown(false)
    .messages({
        "object.unknown": "Extra field {{#key}} is not allowed in request body"

    });


