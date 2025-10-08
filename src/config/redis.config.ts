import Redis from "ioredis";

let redis: Redis;

if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL);
} else {
    redis = new Redis({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT || 6379),
        password: process.env.REDIS_PASSWORD || undefined,
        db: 0,
        connectTimeout: 1000,
        maxRetriesPerRequest: 0,
        retryStrategy: () => null,
    });
}

redis.on("connect", () => {
    console.log("Connected to Redis");
});

redis.on("error", (err) => {
    console.log("Redis error:", err.message);
});


export default redis;
