import { In } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Seat, SeatStatus } from "../entities/seat.entity";
import { Show } from "../entities/show.entity";

export class SeatService {
    private static seatRepo = AppDataSource.getRepository(Seat);

    static generateSeatsForShow = async (show: Show, seatMap: any) => {
        const seats: Seat[] = [];

        seatMap.blocks.forEach((block: any) => {
            block.layout.forEach((row: any) => {
                row.seats.forEach((seat: any) => {
                    const newSeat = this.seatRepo.create({
                        show: show,
                        row: row.row,
                        number: seat.number,
                        type: block.blockName,
                        status: SeatStatus.AVAILABLE,
                        price: show.basePrice + (block.priceAdjustment || 0),
                        positionX: seat.x,
                        positionY: seat.y,
                    });
                    seats.push(newSeat);
                });
            });
        });

        return await this.seatRepo.save(seats);
    }

    static getSeatsByShow = async (showId: string) => {
        return await this.seatRepo.find({
            where: { show: { showId } }
        });
    }

    static getSeatsByIds = async (seatIds: string[], status?: SeatStatus) => {
        return await this.seatRepo.find({
            where: {
                seatId: In(seatIds),
                status
            }
        });
    }

    static getSeatsByIdsAndShow = async (showId: string, seatIds: string[], status?: SeatStatus) => {
        return await this.seatRepo.find({
            where: {
                show: { showId },
                seatId: In(seatIds),
                status
            }
        });
    }

    static bookSeat = async (seats: Seat[]) => {
        seats.forEach(seat => {
            if (seat.status === SeatStatus.BOOKED) {
                throw new Error(`Seat ${seat.row}${seat.number} cannot be booked`);
            }
            seat.status = SeatStatus.BOOKED;
        });

        return await this.seatRepo.save(seats);
    }
}
