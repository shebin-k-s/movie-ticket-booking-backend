import { AppDataSource } from "../config/data-source";
import { User } from "../entities/user.entity";

export class UserService {
    private static userRepo = AppDataSource.getRepository(User);

    static createUser = async (user: Partial<User>) => {
        const newUser = this.userRepo.create(user);
        return await this.userRepo.save(newUser);
    }

    static getUserByEmail = async (email: string) => {
        return await this.userRepo.findOneBy({ email });
    }

    static getUserById = async (userId: string) => {
        return await this.userRepo.findOneBy({ userId });
    }
}
