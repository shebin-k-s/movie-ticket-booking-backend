import { Request, Response, NextFunction } from "express";
import { HallService } from "../services/hall.service";
import { TheaterService } from "../services/theater.service";
import { ApiError } from "../utils/apiError";
import { UserRole } from "../entities/user.entity";

export class HallController {

    static createHall = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const { name, theaterId, seatMap } = req.body;

            const theater = await TheaterService.getTheaterById(theaterId);
            if (!theater) throw new ApiError("Theater not found", 404);

            if (user.role === UserRole.THEATER_ADMIN && theater.managedBy.userId !== user.userId) {
                throw new ApiError("You are not authorized to create a hall in this theater", 403);
            }

            const existingHall = await HallService.getHallsByTheaterAndName(theaterId, name);
            if (existingHall) throw new ApiError("A hall with this name already exists in the theater", 409);

            const hall = await HallService.createHall({
                name,
                theater,
                seatMap
            });

            res.status(201).json({
                success: true,
                message: "Hall created successfully",
                hall
            });
        } catch (error) {
            next(error);
        }
    }

    static getAllHalls = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const halls = await HallService.getAllHalls();
            res.status(200).json({
                success: true,
                message: halls.length ? "Halls fetched successfully" : "No halls found",
                halls
            });
        } catch (error) {
            next(error);
        }
    }

    static getHallsByTheater = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { theaterId } = req.params;
            const theater = await TheaterService.getTheaterById(theaterId);
            if (!theater) throw new ApiError("Theater not found", 404);

            const halls = await HallService.getHallsByTheater(theaterId);
            res.status(200).json({
                success: true,
                message: halls.length ? "Halls fetched successfully" : "No halls found for this theater",
                halls
            });
        } catch (error) {
            next(error);
        }
    }

    static getHallById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { hallId } = req.params;
            const hall = await HallService.getHallById(hallId);
            if (!hall) throw new ApiError("Hall not found", 404);

            res.status(200).json({
                success: true,
                message: "Hall fetched successfully",
                hall
            });
        } catch (error) {
            next(error);
        }
    }

    static deleteHall = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { hallId } = req.params;
            const hall = await HallService.getHallById(hallId);
            if (!hall) throw new ApiError("Hall not found", 404);

            const user = (req as any).user;
            if (user.role === UserRole.THEATER_ADMIN && hall.theater.managedBy.userId !== user.userId) {
                throw new ApiError("You are not authorized to delete a hall in this theater", 403);
            }

            await HallService.deleteHall(hallId);

            res.status(200).json({
                success: true,
                message: "Hall deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}
