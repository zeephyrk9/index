import { DatabaseInstance } from "./neo4j";
import { RedisInstance } from "./redis";
import { WebhooksContainer } from "./webhooks";

export class Context {
    public database = DatabaseInstance;
    public redis = RedisInstance;
    public webhooks = new WebhooksContainer(this);

    public async initialize() {
        // Initializing redis client
        await this.redis.connect().catch((error) => {
            console.log("Unable to connect to redis storage:");
            throw error;
        });
        await this.webhooks.initialize();
    };

    public getDatabaseSession() {
        return this.database.session({
            database: process.env.NEO4J_DATABASE ?? "zeephyr-index"
        });
    }
};

export const ContextInstance = new Context();