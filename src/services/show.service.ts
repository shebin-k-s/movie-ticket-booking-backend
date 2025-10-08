import { AppDataSource } from "../config/data-source";
import { Show } from "../entities/show.entity";

export class ShowService {
    private static showRepo = AppDataSource.getRepository(Show);

    static createShow = async (showData: Partial<Show>) => {
        const newShow = this.showRepo.create(showData);
        return await this.showRepo.save(newShow);
    }

    static getAllShows = async () => {
        return await this.showRepo.find({
            relations: ["movie", "hall"],
            select: {
                hall: {
                    hallId: true,
                    name: true
                }
            }
        });
    }

    static getShowById = async (showId: string) => {
        return await this.showRepo.findOne({
            where: { showId },
            relations: ["movie", "hall.theater.managedBy"],
            select: {
                hall: {
                    hallId: true,
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
        });
    }

    static getShowsByMovie = async (movieId: string) => {
        return await this.showRepo.find({
            where: { movie: { movieId } },
            relations: ["hall.theater"],
            order: { startTime: "ASC" },
            select: {
                hall: {
                    hallId: true,
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
        });
    }

    static deleteShow = async (showId: string) => {
        return await this.showRepo.delete({ showId });
    }
}
