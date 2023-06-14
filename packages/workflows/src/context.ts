import { DatabaseInstance } from "./neo4j";

export class Context {
    public database = DatabaseInstance;
    public getDatabaseSession() {
        return this.database.session({
            database: process.env.NEO4J_DATABASE ?? "zeephyr-index"
        });
    }
};

export const ContextInstance = new Context();