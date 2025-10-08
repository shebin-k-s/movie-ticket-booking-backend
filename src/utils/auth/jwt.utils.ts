
import jwt from 'jsonwebtoken'
import { ApiError } from '../apiError'
import dotenv from "dotenv";


dotenv.config(
    
)
const JWT_SECRET = process.env.JWT_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET


export const generateAccessToken = (payload: Object) => {
    try {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: '10d' })

    } catch (error) {
        console.log(error);

        throw new ApiError("Failed to generate access token", 500)
    }
}


export const verifyAccessToken = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        throw new ApiError("Invalid or expired access token", 401)
    }
}


// ------------ Refresh Token --------

export const generateRefreshToken = (payload: Object) => {
    try {
        return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' })

    } catch (error) {
        throw new ApiError("Failed to generate refresh token", 500)

    }
}


export const verifyRefreshToken = (token: string) => {
    try {
        return jwt.verify(token, REFRESH_SECRET)
    } catch (error) {
        throw new ApiError("Invalid or expired refresh token", 401)
    }
}