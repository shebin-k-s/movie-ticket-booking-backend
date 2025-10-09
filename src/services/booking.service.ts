import { AppDataSource } from "../config/data-source";
import { Booking, paymentStatus } from "../entities/booking.entity";
import { Seat } from "../entities/seat.entity";
import { Show } from "../entities/show.entity";

export class BookingService {
    private static bookingRepo = AppDataSource.getRepository(Booking);

    static createBooking = async (userId: string, show: Show, seats: Seat[], totalAmount: number) => {
        const booking = this.bookingRepo.create({
            user: { userId },
            show,
            seats,
            paymentStatus: paymentStatus.PENDING,
            totalAmount
        });

        return await this.bookingRepo.save(booking);
    }

    static updateBooking = async (bookingId: string, updatedBooking: Partial<Booking>) => {
        return await this.bookingRepo.update({ bookingId }, updatedBooking);
    }

    static getBookingById = async (bookingId: string) => {
        return await this.bookingRepo.findOne({
            where: { bookingId },
            relations: ["seats", "user", "show.screen.theater.managedBy"],
            select: {
                user: {
                    userId: true,
                    name: true,
                    email: true,
                },
                show: {
                    showId: true,
                    startTime: true,
                    screen: {
                        screenId: true,
                        name: true,
                        theater: {
                            theaterId: true,
                            name: true,
                            location: true,
                            city: true,
                            state: true,
                            managedBy: {
                                userId: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });
    }

    static getBookingsByUser = async (userId: string) => {
        return await this.bookingRepo.find({
            where: {
                user: { userId },
                paymentStatus: paymentStatus.SUCCESS
            },
            relations: ["seats", "show.movie", "show.screen.theater"],
            select: {
                seats: {
                    seatId: true,
                    row: true,
                    number: true,
                    type: true,
                    price: true
                },
                show: {
                    showId: true,
                    startTime: true,
                    movie: true,
                    screen: {
                        screenId: true,
                        name: true,
                        theater: true
                    }
                }
            },
            order: {
                show: { startTime: "DESC" }
            }
        });
    }

    static getBookingsByShow = async (showId: string) => {
        return await this.bookingRepo.find({
            where: { show: { showId } },
            relations: ["seats", "user"],
            order: { createdAt: "DESC" }
        });
    }
}
