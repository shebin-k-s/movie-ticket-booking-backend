import { AppDataSource } from "../config/data-source";
import { Movie } from "../entities/movie.entity";

export class MovieService {
    private static movieRepo = AppDataSource.getRepository(Movie);

    static createMovie = async (movie: Partial<Movie>) => {
        const newMovie = this.movieRepo.create(movie);
        return await this.movieRepo.save(newMovie);
    }

    static getAllMovies = async () => {
        return await this.movieRepo.find();
    }

    static getMovieById = async (movieId: string) => {
        return await this.movieRepo.findOneBy({ movieId });
    }

    static updateMovie = async (movieId: string, updatedMovie: Partial<Movie>) => {
        return await this.movieRepo.update({ movieId }, updatedMovie);
    }

    static deleteMovie = async (movieId: string) => {
        return await this.movieRepo.delete({ movieId });
    }
}
