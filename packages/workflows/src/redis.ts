import { createClient } from "redis";

export const RedisInstance = createClient({
    url: process.env.REDIS_URL,
});