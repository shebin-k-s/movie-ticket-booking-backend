import express from 'express'
import { validateBody } from '../middlewares/body.validator'
import { userLoginSchema, userRegisterSchema } from '../validations/auth.validations'
import { AuthController } from '../controllers/auth.controller'


const authRouter = express.Router()


authRouter.route("/register")
    .post(
        validateBody(userRegisterSchema),
        AuthController.registerUser
    )


authRouter.route("/login")
    .post(
        validateBody(userLoginSchema),
        AuthController.loginUser
    )



export default authRouter