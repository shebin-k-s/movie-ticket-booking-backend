import express from "express";
import { SeatController } from "../controllers/seat.controller";
import { validateBody } from "../middlewares/body.validator";
import { bookSeatsSchema, updateBookingSchema } from "../validations/booking.validations";
import { authenticate } from "../middlewares/auth.middleware";



const seatRouter = express.Router();

seatRouter.route("/shows/:showId")
    .get(SeatController.getSeatsByShow);


seatRouter.route("/book/initiate")
    .post(authenticate, validateBody(bookSeatsSchema), SeatController.initiateBooking);

seatRouter.route("/book/confirm")
    .post(authenticate, validateBody(updateBookingSchema), SeatController.confirmBooking);

seatRouter.route("/book/cancel")
    .post(authenticate, validateBody(updateBookingSchema), SeatController.cancelBooking);

export default seatRouter;
