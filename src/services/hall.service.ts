import { AppDataSource } from "../config/data-source";
import { Hall } from "../entities/hall.entity";

export class HallService {
    private static hallRepo = AppDataSource.getRepository(Hall);

    static createHall = async (hall: Partial<Hall>) => {
        const newHall = this.hallRepo.create(hall);
        return await this.hallRepo.save(newHall);
    }

    static getAllHalls = async () => {
        return await this.hallRepo.find({
            relations: ["theater"]
        });
    }

    static getHallById = async (hallId: string) => {
        return await this.hallRepo.findOne({
            where: { hallId },
            relations: ["theater.managedBy"],
            select: {
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
        });
    }

    static getHallsByTheater = async (theaterId: string) => {
        return await this.hallRepo.find({
            where: { theater: { theaterId } }
        });
    }

    static getHallsByTheaterAndName = async (theaterId: string, hallName: string) => {
        return await this.hallRepo.findOne({
            where: {
                theater: { theaterId },
                name: hallName
            }
        });
    }

    static deleteHall = async (hallId: string) => {
        return await this.hallRepo.delete({ hallId });
    }
}
