import neo4j from "neo4j-driver";

// Driver Configuration

// @todo
// add real authorization
const uri = process.env.NEO4J_URI;
const authorization = neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD);

// Creating Neo4j driver and session instance
export const DatabaseInstance = neo4j.driver(uri, authorization, {
    // I don't know if this is the best value or no, because I can't find
    // default value for this option in the documentation
    maxConnectionPoolSize: 50
});