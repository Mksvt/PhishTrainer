import { createClient, RedisClientOptions } from "redis";

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        reconnectStrategy: (retries: number) => {
            const delay = Math.min(retries * 50, 500);
            return delay;
        },
    },
} as RedisClientOptions);

redisClient.on("error", (err: Error) =>
    console.error("Redis Client Error", err)
);
redisClient.on("connect", () => console.log("Redis Client Connected"));
redisClient.on("ready", () => console.log("Redis Client Ready"));

export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (error) {
        console.error("Redis connection error:", error);
    }
};

export const disconnectRedis = async () => {
    try {
        if (redisClient.isOpen) {
            await redisClient.quit();
        }
    } catch (error) {
        console.error("Redis disconnection error:", error);
    }
};

export default redisClient;
