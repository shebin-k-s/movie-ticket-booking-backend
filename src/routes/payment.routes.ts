import express from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validateBody } from "../middlewares/body.validator";
import { paymentSchema } from "../validations/payment.validation";

const paymentRouter = express.Router();

paymentRouter.route("/initiate")
    .post(authenticate, validateBody(paymentSchema), PaymentController.initiatePayment);


paymentRouter.route("/webhook")
    .post(express.raw({ type: "application/json" }), PaymentController.webhookHandler);


export default paymentRouter;
