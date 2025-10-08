import { Request, Response, NextFunction } from "express"
import { UserRole } from "../entities/user.entity";
import { ApiError } from "../utils/apiError";


export const authorizeRole = (...allowedRoles: UserRole[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = (req as any).user;


        if (!user) {
            throw new ApiError("Unauthorized", 401)
        }

        const role = user.role

        if (!allowedRoles.includes(role)) {
            throw new ApiError("Forbidden: Access denied", 403)

        }

        next()

    } catch (error) {
        next(error)
    }

}