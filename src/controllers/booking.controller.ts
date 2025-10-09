import { Request, Response, NextFunction } from "express";
import { BookingService } from "../services/booking.service";
import { ApiError } from "../utils/apiError";
import { UserRole } from "../entities/user.entity";

export class BookingController {

    static getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const bookings = await BookingService.getBookingsByUser(user.userId);

            res.status(200).json({
                success: true,
                message: "Bookings fetched successfully",
                bookings
            });
        } catch (error) {
            next(error);
        }
    }

    static getUserBookings = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { userId } = req.params;
            const bookings = await BookingService.getBookingsByUser(userId);

            res.status(200).json({
                success: true,
                message: "Bookings fetched successfully",
                bookings
            });
        } catch (error) {
            next(error);
        }
    }

    static getBookingById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const { bookingId } = req.params;
            const booking = await BookingService.getBookingById(bookingId);

            if (!booking) throw new ApiError("Booking not found", 404);


            if (user.userId === booking.user.userId || user.role === UserRole.ADMIN) {
                return res.status(200).json({
                    success: true,
                    message: "Booking fetched successfully",
                    booking
                });
            }

            if (user.role === UserRole.THEATER_ADMIN && booking.show.screen.theater.managedBy.userId === user.userId) {
                return res.status(200).json({
                    success: true,
                    message: "Booking fetched successfully",
                    booking
                });
            }

            throw new ApiError("You are not authorized to view this booking", 403);
        } catch (error) {
            next(error);
        }
    }
}
