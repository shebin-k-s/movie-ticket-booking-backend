import { Request, Response, NextFunction } from "express";
import { MovieService } from "../services/movie.service";
import { HallService } from "../services/hall.service";
import { ShowService } from "../services/show.service";
import { SeatService } from "../services/seat.service";
import { ApiError } from "../utils/apiError";
import { UserRole } from "../entities/user.entity";

export class ShowController {

    static createShow = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { movieId, hallId, startTime, basePrice } = req.body;
            const user = (req as any).user;

            const hall = await HallService.getHallById(hallId);
            if (!hall) throw new ApiError("Hall not found", 404);

            if (user.role === UserRole.THEATER_ADMIN && hall.theater.managedBy.userId !== user.userId) {
                throw new ApiError("You are not authorized to create a show in this theater", 403);
            }

            const movie = await MovieService.getMovieById(movieId);
            if (!movie) throw new ApiError("Movie not found", 404);

            const show = await ShowService.createShow({ movie, hall, startTime, basePrice });

            await SeatService.generateSeatsForShow(show, hall.seatMap);

            res.status(201).json({
                success: true,
                message: "Show created successfully",
                show
            });
        } catch (error) {
            next(error);
        }
    }

    static getAllShows = async (req: Request, res: Response, next: NextFunction) => {
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
                const theaterId = show.hall.theater.theaterId;
                const hallId = show.hall.hallId;
                const date = new Date(show.startTime).toISOString().split("T")[0];

                grouped[theaterId] ??= {
                    theaterId,
                    name: show.hall.theater.name,
                    location: show.hall.theater.location,
                    city: show.hall.theater.city,
                    state: show.hall.theater.state,
                    halls: {}
                };

                grouped[theaterId].halls[hallId] ??= { hallId, name: show.hall.name, dates: {} };
                grouped[theaterId].halls[hallId].dates[date] ??= [];
                grouped[theaterId].halls[hallId].dates[date].push({
                    showId: show.showId,
                    startTime: show.startTime,
                    basePrice: show.basePrice
                });
            });

            const theaters = Object.values(grouped).map(theater => ({
                ...theater,
                halls: Object.values(theater.halls).map((hall: any) => ({
                    ...hall,
                    dates: Object.entries(hall.dates).map(([date, shows]) => ({ date, shows }))
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

            if (user.role === UserRole.THEATER_ADMIN && show.hall.theater.managedBy.userId !== user.userId) {
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
