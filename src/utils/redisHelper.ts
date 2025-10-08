import redis from "../config/redis.config";

export const appName = 'ticket_booking'

export const setCache = async (key: string, data: any, ttlSeconds?: number) => {
    try {
        if (ttlSeconds) {
            await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);

        } else {
            await redis.set(key, JSON.stringify(data));
        }
    } catch (error) {
        console.log(error.message);

    }
};



export const setCacheIfNotExists = async (key: string, data: any, ttlSeconds: number): Promise<boolean> => {
    try {
        const setnxResult = await redis.setnx(key, JSON.stringify(data)); // returns 1 if set, 0 if exists
        if (setnxResult === 1) {
            await redis.expire(key, ttlSeconds);
            return true;
        }
        return false;
    } catch (error: any) {
        console.log(error.message);
        return false;
    }
};





export const getCache = async<T>(key: string) => {
    try {
        const cached = await redis.get(key);

        return cached ? JSON.parse(cached) : null;

    } catch (error) {
        console.log(error.message);
        return null
    }
}


export const deleteCache = async (key: string) => {

    try {
        await redis.del(key)
    } catch (error) {
        console.log(error.message);

    }
}
