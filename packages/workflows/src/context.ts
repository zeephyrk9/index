import { DatabaseSession } from "./neo4j";

export class Context {
    public database = DatabaseSession;
};

export const ContextInstance = new Context();