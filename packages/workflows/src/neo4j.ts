import neo4j from "neo4j-driver";

// Driver Configuration

// @todo
// add real authorization
const uri = process.env.NEO4J_URI;
const authorization = neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD);

// Creating Neo4j driver and session instance
export const DatabaseInstance = neo4j.driver(uri, authorization);