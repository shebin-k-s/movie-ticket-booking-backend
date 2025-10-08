import { Request, Response, NextFunction } from "express";
import { BookingService } from "../services/booking.service";
import { ApiError } from "../utils/apiError";
import { PaymentService } from "../services/payment.service";
import { paymentStatus } from "../entities/booking.entity";


export class PaymentController {


    static initiatePayment = async (req: Request, res: Response, next: NextFunction) => {

        try {

            const { bookingId, amount } = req.body;

            const booking = await BookingService.getBookingById(bookingId);

            if (!booking) {
                throw new ApiError("Booking not found", 404)
            }

            if (booking.totalAmount !== amount) {
                throw new ApiError("Amount mismatch", 400);
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

                    await BookingService.updateBooking(bookingId, {
                        paymentStatus: paymentStatus.SUCCESS
                    });
                }
            }

        } catch (error) {
            next(error)
        }

    }
}



