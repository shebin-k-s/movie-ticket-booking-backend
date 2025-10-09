import { AppDataSource } from "../config/data-source";
import { Screen } from "../entities/screen.entity";

export class ScreenService {
    private static screenRepo = AppDataSource.getRepository(Screen);

    static createScreen = async (screen: Partial<Screen>) => {
        const newScreen = this.screenRepo.create(screen);
        return await this.screenRepo.save(newScreen);
    }

    static getAllScreens = async (managedBy?: string) => {
        
        const where = managedBy
            ? { theater: { managedBy: { userId: managedBy } } }
            : {};
        return await this.screenRepo.find({
            where,
            relations: ["theater"],
            select: {
                screenId: true,
                name: true,
                theater: true
            },

        });
    }

    static getScreenById = async (screenId: string) => {
        return await this.screenRepo.findOne({
            where: { screenId },
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

    static getScreensByTheater = async (theaterId: string) => {
        return await this.screenRepo.find({
            where: { theater: { theaterId } }
        });
    }

    static getScreensByTheaterAndName = async (theaterId: string, screenName: string) => {
        return await this.screenRepo.findOne({
            where: {
                theater: { theaterId },
                name: screenName
            }
        });
    }

    static deleteScreen = async (screenId: string) => {
        return await this.screenRepo.delete({ screenId });
    }
}
