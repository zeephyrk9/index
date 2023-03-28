import neo4j from "neo4j-driver";

// Driver Configuration
const uri = process.env.URI ?? "localhost:7687";
const authorization = neo4j.auth.basic("neo4j", "12344321");

// Creating Neo4j driver and session instance
const DatabaseInstance = neo4j.driver(uri, authorization);

export const DatabaseSession = DatabaseInstance.session();