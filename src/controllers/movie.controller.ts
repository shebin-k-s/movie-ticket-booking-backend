import { Request, Response, NextFunction } from "express";
import { MovieService } from "../services/movie.service";
import { ApiError } from "../utils/apiError";

export class MovieController {

    static createMovie = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { title, genre, duration, rating, description, posterUrl, releaseDate } = req.body;

            const movie = await MovieService.createMovie({
                title,
                genre,
                duration,
                rating,
                description,
                posterUrl,
                releaseDate
            });

            res.status(201).json({
                success: true,
                message: "Movie created successfully",
                movie
            });
        } catch (error) {
            next(error);
        }
    }

    static getAllMovies = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const movies = await MovieService.getAllMovies();
            res.status(200).json({
                success: true,
                message: "Movies fetched successfully",
                movies
            });
        } catch (error) {
            next(error);
        }
    }

    static getMovieById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { movieId } = req.params;
            const movie = await MovieService.getMovieById(movieId);

            if (!movie) throw new ApiError("Movie not found", 404);

            res.status(200).json({
                success: true,
                message: "Movie fetched successfully",
                movie
            });
        } catch (error) {
            next(error);
        }
    }

    static updateMovie = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { movieId } = req.params;
            const updates = req.body;

            const movie = await MovieService.getMovieById(movieId);
            if (!movie) throw new ApiError("Movie not found", 404);

            const updatedMovie = await MovieService.updateMovie(movieId, updates);

            res.status(200).json({
                success: true,
                message: "Movie updated successfully",
                movie: updatedMovie
            });
        } catch (error) {
            next(error);
        }
    }

    static deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { movieId } = req.params;

            const movie = await MovieService.getMovieById(movieId);
            if (!movie) throw new ApiError("Movie not found", 404);

            await MovieService.deleteMovie(movieId);

            res.status(200).json({
                success: true,
                message: "Movie deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}
