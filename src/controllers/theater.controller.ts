import { Request, Response, NextFunction } from "express";
import { TheaterService } from "../services/theater.service";
import { UserService } from "../services/user.services";
import { ApiError } from "../utils/apiError";
import { UserRole } from "../entities/user.entity";
import { hashPassword } from "../utils/auth/hash.utils";

export class TheaterController {

    static createTheater = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, location, city, state, email, password } = req.body;

            const existingUser = await UserService.getUserByEmail(email);
            if (existingUser) throw new ApiError("A user with this email already exists", 409);

            const hashedPassword = await hashPassword(password);

            const user = await UserService.createUser({
                name: `${name} - Manager`,
                email,
                password: hashedPassword,
                role: UserRole.THEATER_ADMIN
            });

            const theater = await TheaterService.createTheater({
                name,
                location,
                city,
                state,
                managedBy: user
            });

            // Remove sensitive info before sending response
            const { password: _, role, createdAt, updatedAt, ...managedBy } = theater.managedBy;

            res.status(201).json({
                success: true,
                message: "Theater created successfully",
                theater: { ...theater, managedBy }
            });
        } catch (error) {
            next(error);
        }
    }

    static getAllTheaters = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const theaters = await TheaterService.getAllTheaters();
            res.status(200).json({
                success: true,
                message: "Theaters fetched successfully",
                theaters
            });
        } catch (error) {
            next(error);
        }
    }

    static getTheaterById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { theaterId } = req.params;
            const theater = await TheaterService.getTheaterById(theaterId);

            if (!theater) throw new ApiError("Theater not found", 404);

            res.status(200).json({
                success: true,
                message: "Theater fetched successfully",
                theater
            });
        } catch (error) {
            next(error);
        }
    }

    static updateTheater = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const { theaterId } = req.params;
            const data = req.body;

            const theater = await TheaterService.getTheaterById(theaterId);
            if (!theater) throw new ApiError("Theater not found", 404);

            if (user.role === UserRole.THEATER_ADMIN && theater.managedBy.userId !== user.userId) {
                throw new ApiError("You are not authorized to update this theater", 403);
            }

            const updatedTheater = await TheaterService.updateTheater(theaterId, data);

            res.status(200).json({
                success: true,
                message: "Theater updated successfully",
                theater: updatedTheater
            });
        } catch (error) {
            next(error);
        }
    }

    static deleteTheater = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const { theaterId } = req.params;

            const theater = await TheaterService.getTheaterById(theaterId);
            if (!theater) throw new ApiError("Theater not found", 404);

            if (user.role === UserRole.THEATER_ADMIN && theater.managedBy.userId !== user.userId) {
                throw new ApiError("You are not authorized to delete this theater", 403);
            }

            await TheaterService.deleteTheater(theaterId);

            res.status(200).json({
                success: true,
                message: "Theater deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}
