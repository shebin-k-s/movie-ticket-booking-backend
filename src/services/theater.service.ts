import { AppDataSource } from "../config/data-source";
import { Theater } from "../entities/theater.entity";

export class TheaterService {
    private static theaterRepo = AppDataSource.getRepository(Theater);

    static createTheater = async (theater: Partial<Theater>) => {
        const newTheater = this.theaterRepo.create(theater);
        return await this.theaterRepo.save(newTheater);
    }

    static getAllTheaters = async () => {
        return await this.theaterRepo.find();
    }

    static getTheaterById = async (theaterId: string) => {
        return await this.theaterRepo.findOne({
            where: { theaterId },
            relations: ["managedBy"],
            select: {
                managedBy: {
                    userId: true,
                    name: true,
                    email: true
                }
            }
        });
    }

    static getTheaterByManager = async (managerId: string) => {
        return await this.theaterRepo.findOne({
            where: { managedBy: { userId: managerId } }
        });
    }

    static updateTheater = async (theaterId: string, updatedTheater: Partial<Theater>) => {
        return await this.theaterRepo.update({ theaterId }, updatedTheater);
    }

    static deleteTheater = async (theaterId: string) => {
        return await this.theaterRepo.delete({ theaterId });
    }
}
