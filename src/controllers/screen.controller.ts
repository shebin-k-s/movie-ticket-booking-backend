import { Request, Response, NextFunction } from "express";
import { ScreenService } from "../services/screen.service";
import { TheaterService } from "../services/theater.service";
import { ApiError } from "../utils/apiError";
import { UserRole } from "../entities/user.entity";

export class ScreenController {

    static createScreen = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const { name, theaterId, seatMap } = req.body;

            const theater = await TheaterService.getTheaterById(theaterId);
            if (!theater) throw new ApiError("Theater not found", 404);

            if (user.role === UserRole.THEATER_ADMIN && theater.managedBy.userId !== user.userId) {
                throw new ApiError("You are not authorized to create a screen in this theater", 403);
            }

            const existingScreen = await ScreenService.getScreensByTheaterAndName(theaterId, name);
            if (existingScreen) throw new ApiError("A screen with this name already exists in the theater", 409);

            const screen = await ScreenService.createScreen({
                name,
                theater,
                seatMap
            });

            res.status(201).json({
                success: true,
                message: "Screen created successfully",
                screen
            });
        } catch (error) {
            next(error);
        }
    }

    static getAllScreens = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const screens = await ScreenService.getAllScreens();
            res.status(200).json({
                success: true,
                message: screens.length ? "Screens fetched successfully" : "No screens found",
                screens
            });
        } catch (error) {
            next(error);
        }
    }

    static getMyScreens = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const user = (req as any).user;

            const screens = await ScreenService.getAllScreens(user.userId);
            
            res.status(200).json({
                success: true,
                message: screens.length ? "Screens fetched successfully" : "No screens found",
                screens
            });
        } catch (error) {
            next(error);
        }
    }

    static getScreensByTheater = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { theaterId } = req.params;
            const theater = await TheaterService.getTheaterById(theaterId);
            if (!theater) throw new ApiError("Theater not found", 404);

            const screens = await ScreenService.getScreensByTheater(theaterId);
            res.status(200).json({
                success: true,
                message: screens.length ? "Screens fetched successfully" : "No screens found for this theater",
                screens
            });
        } catch (error) {
            next(error);
        }
    }

    static getScreenById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { screenId } = req.params;
            const screen = await ScreenService.getScreenById(screenId);
            if (!screen) throw new ApiError("Screen not found", 404);

            res.status(200).json({
                success: true,
                message: "Screen fetched successfully",
                screen
            });
        } catch (error) {
            next(error);
        }
    }

    static deleteScreen = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { screenId } = req.params;
            const screen = await ScreenService.getScreenById(screenId);
            if (!screen) throw new ApiError("Screen not found", 404);

            const user = (req as any).user;
            if (user.role === UserRole.THEATER_ADMIN && screen.theater.managedBy.userId !== user.userId) {
                throw new ApiError("You are not authorized to delete a screen in this theater", 403);
            }

            await ScreenService.deleteScreen(screenId);

            res.status(200).json({
                success: true,
                message: "Screen deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}
