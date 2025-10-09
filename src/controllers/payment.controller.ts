import { Request, Response, NextFunction } from "express";
import { BookingService } from "../services/booking.service";
import { ApiError } from "../utils/apiError";
import { PaymentService } from "../services/payment.service";
import { paymentStatus } from "../entities/booking.entity";
import { appName, getCache } from "../utils/redisHelper";
import { SeatService } from "../services/seat.service";
import { emitSeatUpdate } from "../utils/socketHelper/seatUpdate";


export class PaymentController {


    static initiatePayment = async (req: Request, res: Response, next: NextFunction) => {

        try {

            const user = (req as any).user;

            const { bookingId, amount } = req.body;

            const booking = await BookingService.getBookingById(bookingId);

            if (!booking) {
                throw new ApiError("Booking not found", 404)
            }

            if (booking.totalAmount !== amount) {
                throw new ApiError("Amount mismatch", 400);
            }
            for (const seat of booking.seats) {
                const key = `${appName}:seat:${seat.seatId}`;
                const lockedUserId = await getCache(key);
                if (lockedUserId !== user.userId) {
                    throw new ApiError(`Seat ${seat.row}${seat.number} is not locked for this user`, 409);
                }
            }

            const paymentOrder = await PaymentService.createOrder(bookingId, amount)

            res.status(200).json({
                success: true,
                message: "Razorpay order created successfully",
                paymentOrder,
            });

        } catch (error) {
            console.log(error);

            next(error)
        }

    }

    static webhookHandler = async (req: Request, res: Response, next: NextFunction) => {

        try {

            const signature = req.headers["x-razorpay-signature"] as string;

            const body = req.body;

            const verified = PaymentService.verifyWebhookSignature(body, signature)

            if (!verified) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid webhook signature"
                });
            }
            const event = body.event;
            const payment = body.payload.payment.entity;
            const bookingId = payment.notes.bookingId;

            if (event === "payment.captured") {
                const booking = await BookingService.getBookingById(bookingId);
                if (booking) {

                    await SeatService.bookSeat(booking.seats);

                    const seatIds = booking.seats.map(seat=>seat.seatId);

                    emitSeatUpdate(booking.show.showId, seatIds, true, false);


                    await BookingService.updateBooking(bookingId, {
                        paymentStatus: paymentStatus.SUCCESS,
                        confirmedAt: new Date()

                    });
                }
            }

        } catch (error) {
            next(error)
        }

    }
}



