import { io } from "../..";


export function emitSeatUpdate(
    showId: string,
    seatIds: string[],
    isBooked: boolean,
    isLocked: boolean
) {
   

    io.to(`show-${showId}`).emit("seatUpdate", {
        showId,
        seatIds,
        isBooked,
        isLocked
    });
}