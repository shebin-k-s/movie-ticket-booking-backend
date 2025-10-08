import { Request, Response, NextFunction } from "express";
import { SeatService } from "../services/seat.service";
import { ApiError } from "../utils/apiError";
import { appName, deleteCache, getCache, setCacheIfNotExists } from "../utils/redisHelper";
import { SeatStatus } from "../entities/seat.entity";
import { BookingService } from "../services/booking.service";
import { ShowService } from "../services/show.service";
import { paymentStatus } from "../entities/booking.entity";
import { emitSeatUpdate } from "../utils/socketHelper/seatUpdate";

export class SeatController {

    static initiateBooking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const { seatIds, showId } = req.body;

            if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
                throw new ApiError("seatIds array is required", 400);
            }

            const show = await ShowService.getShowById(showId);
            if (!show) throw new ApiError("Show not found", 404);

            if (show.startTime <= new Date()) {
                throw new ApiError("Cannot book seats. Show has already started or finished.", 400);
            }

            const seats = await SeatService.getSeatsByIdsAndShow(showId, seatIds, SeatStatus.AVAILABLE);
            if (!seats || seats.length !== seatIds.length) {
                throw new ApiError("Some seats not found", 404);
            }

            const lockedKeys: string[] = [];
            for (const seat of seats) {
                const key = `${appName}:seat:${seat.seatId}`;
                const success = await setCacheIfNotExists(key, user.userId, 300);
                if (!success) {
                    for (const k of lockedKeys) await deleteCache(k);
                    throw new ApiError(`Seat ${seat.row}${seat.number} is temporarily locked`, 409);
                }
                lockedKeys.push(key);
            }

            emitSeatUpdate(showId, seatIds, false, true);

            let totalAmount = 0;
            const resultantSeats = seats.map(s => {
                totalAmount += s.price;
                return { seatId: s.seatId, row: s.row, number: s.number, price: s.price };
            });

            const booking = await BookingService.createBooking(user.userId, showId, seats, totalAmount);

            res.status(200).json({
                success: true,
                message: "Seats temporarily locked. Complete payment within 5 minutes.",
                bookingId: booking.bookingId,
                seats: resultantSeats,
                totalAmount
            });
        } catch (error) {
            next(error);
        }
    }

    static confirmBooking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const { bookingId } = req.body;

            if (!bookingId) throw new ApiError("bookingId is required", 400);

            const booking = await BookingService.getBookingById(bookingId);
            if (!booking) throw new ApiError("Booking not found", 404);

            for (const seat of booking.seats) {
                const key = `${appName}:seat:${seat.seatId}`;
                const lockedUserId = await getCache(key);
                if (lockedUserId !== user.userId) {
                    throw new ApiError(`Seat ${seat.row}${seat.number} is not locked for this user`, 409);
                }
            }

            await BookingService.updateBooking(bookingId, {
                paymentStatus: paymentStatus.SUCCESS,
                confirmedAt: new Date()
            });

            await SeatService.bookSeat(booking.seats);

            const updatedBooking = await BookingService.getBookingById(bookingId);
            for (const seat of updatedBooking.seats) {
                await deleteCache(`${appName}:seat:${seat.seatId}`);
            }

            res.status(200).json({
                success: true,
                message: "Seats booked successfully",
                booking: updatedBooking
            });
        } catch (error) {
            next(error);
        }
    }

    static cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const { bookingId } = req.body;

            if (!bookingId) throw new ApiError("bookingId is required", 400);

            const booking = await BookingService.getBookingById(bookingId);
            if (!booking) throw new ApiError("Booking not found", 404);

            for (const seat of booking.seats) {
                const key = `${appName}:seat:${seat.seatId}`;
                const lockedUserId = await getCache(key);
                if (lockedUserId === user.userId) await deleteCache(key);
            }

            await BookingService.updateBooking(bookingId, { paymentStatus: paymentStatus.FAILED });

            const seatIds = booking.seats.map(seat => seat.seatId);
            emitSeatUpdate(booking.show.showId, seatIds, false, false);

            res.status(200).json({
                success: true,
                message: "Booking cancelled and seat locks removed successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    static getSeatsByShow = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { showId } = req.params;
            const seats = await SeatService.getSeatsByShow(showId);

            const seatsWithLockStatus = await Promise.all(
                seats.map(async seat => {
                    const key = `${appName}:seat:${seat.seatId}`;
                    const lockedUserId = await getCache(key);
                    return { ...seat, isLocked: !!lockedUserId };
                })
            );

            const groupedSeats: Record<string, { price: number; seats: any[] }> = {};
            seatsWithLockStatus.forEach(seat => {
                if (!groupedSeats[seat.type]) {
                    groupedSeats[seat.type] = { price: seat.price, seats: [] };
                }
                groupedSeats[seat.type].seats.push({
                    seatId: seat.seatId,
                    row: seat.row,
                    number: seat.number,
                    positionX: seat.positionX,
                    positionY: seat.positionY,
                    status: seat.status,
                    isLocked: seat.isLocked,
                    price: seat.price
                });
            });

            res.status(200).json({
                success: true,
                message: "Seats fetched successfully",
                seats: groupedSeats
            });
        } catch (error) {
            next(error);
        }
    }
}
