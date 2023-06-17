import { DatabaseInstance } from "./neo4j";
import { RedisInstance } from "./redis";

export class Context {
    public database = DatabaseInstance;

    public redis = RedisInstance;

    public async initialize() {
        // Initializing redis client
        await this.redis.connect();

    };

    public getDatabaseSession() {
        return this.database.session({
            database: process.env.NEO4J_DATABASE ?? "zeephyr-index"
        });
    }
};

export const ContextInstance = new Context();