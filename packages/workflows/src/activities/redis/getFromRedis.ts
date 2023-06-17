import { Context } from "@workflows/context";

export async function getFromRedis(context: Context, key: string, parseAsJson = false) {
    const entry = await context.redis.get(key);

    if (entry == null) return null;
    return parseAsJson ? JSON.parse(entry) : entry;
};