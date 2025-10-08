import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { comparePassword, hashPassword } from "../utils/auth/hash.utils";
import { generateAccessToken, generateRefreshToken } from "../utils/auth/jwt.utils";
import { UserService } from "../services/user.services";

export class AuthController {
    static registerUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, name, password, role } = req.body;

            const existingUser = await UserService.getUserByEmail(email);
            if (existingUser) {
                throw new ApiError("Email already exists", 409);
            }

            const hashedPassword = await hashPassword(password);

            const user = await UserService.createUser({
                name,
                email,
                password: hashedPassword,
                role
            });

            const { password: _, ...userWithoutPassword } = user;

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: userWithoutPassword
            });
        } catch (error) {
            next(error);
        }
    }

    static loginUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;

            const user = await UserService.getUserByEmail(email);
            if (!user) {
                throw new ApiError("Email doesn't exist", 401);
            }

            const isPasswordSame = await comparePassword(password, user.password);
            if (!isPasswordSame) {
                throw new ApiError("Invalid Email or Password", 401);
            }

            const jwtPayload = {
                userId: user.userId,
                email: user.email,
                role: user.role
            };

            const accessToken = generateAccessToken(jwtPayload);
            const refreshToken = generateRefreshToken(jwtPayload);

            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                success: true,
                message: "Login successful",
                user: userWithoutPassword,
                accessToken,
                refreshToken
            });
        } catch (error) {
            next(error);
        }
    }
}
