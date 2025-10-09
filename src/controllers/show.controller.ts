import { Request, Response, NextFunction } from "express";
import { MovieService } from "../services/movie.service";
import { ScreenService } from "../services/screen.service";
import { ShowService } from "../services/show.service";
import { SeatService } from "../services/seat.service";
import { ApiError } from "../utils/apiError";
import { UserRole } from "../entities/user.entity";

export class ShowController {

    static createShow = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { movieId, screenId, startTime, basePrice } = req.body;
            const user = (req as any).user;

            const screen = await ScreenService.getScreenById(screenId);
            if (!screen) throw new ApiError("Screen not found", 404);

            if (user.role === UserRole.THEATER_ADMIN && screen.theater.managedBy.userId !== user.userId) {
                throw new ApiError("You are not authorized to create a show in this theater", 403);
            }

            const movie = await MovieService.getMovieById(movieId);
            if (!movie) throw new ApiError("Movie not found", 404);

            const show = await ShowService.createShow({ movie, screen, startTime, basePrice });

            await SeatService.generateSeatsForShow(show, screen.seatMap);

            res.status(201).json({
                success: true,
                message: "Show created successfully",
                show
            });
        } catch (error) {
            next(error);
        }
    }

    static getAllShows = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const shows = await ShowService.getAllShows();
            res.status(200).json({
                success: true,
                message: "Shows fetched successfully",
                shows
            });
        } catch (error) {
            next(error);
        }
    }

    static getShowsByMovie = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { movieId } = req.params;
            const shows = await ShowService.getShowsByMovie(movieId);

            const grouped: Record<string, any> = {};

            shows.forEach(show => {
                const theaterId = show.screen.theater.theaterId;
                const screenId = show.screen.screenId;
                const date = new Date(show.startTime).toISOString().split("T")[0];

                grouped[theaterId] ??= {
                    theaterId,
                    name: show.screen.theater.name,
                    location: show.screen.theater.location,
                    city: show.screen.theater.city,
                    state: show.screen.theater.state,
                    screens: {}
                };

                grouped[theaterId].screens[screenId] ??= { screenId, name: show.screen.name, dates: {} };
                grouped[theaterId].screens[screenId].dates[date] ??= [];
                grouped[theaterId].screens[screenId].dates[date].push({
                    showId: show.showId,
                    startTime: show.startTime,
                    basePrice: show.basePrice
                });
            });

            const theaters = Object.values(grouped).map(theater => ({
                ...theater,
                screens: Object.values(theater.screens).map((screen: any) => ({
                    ...screen,
                    dates: Object.entries(screen.dates).map(([date, shows]) => ({ date, shows }))
                }))
            }));

            res.status(200).json({
                success: true,
                message: "Shows fetched successfully",
                theaters
            });
        } catch (error) {
            next(error);
        }
    }

    static getShowById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { showId } = req.params;
            const show = await ShowService.getShowById(showId);

            if (!show) throw new ApiError("Show not found", 404);

            res.status(200).json({
                success: true,
                message: "Show fetched successfully",
                show
            });
        } catch (error) {
            next(error);
        }
    }

    static deleteShow = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).user;
            const { showId } = req.params;

            const show = await ShowService.getShowById(showId);
            if (!show) throw new ApiError("Show not found", 404);

            if (user.role === UserRole.THEATER_ADMIN && show.screen.theater.managedBy.userId !== user.userId) {
                throw new ApiError("You are not authorized to delete this show", 403);
            }

            await ShowService.deleteShow(showId);

            res.status(200).json({
                success: true,
                message: "Show deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}
