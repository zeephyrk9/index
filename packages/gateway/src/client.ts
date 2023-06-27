import { Connection, WorkflowClientOptions, WorkflowClient } from "@temporalio/client";

export async function getClient(clientOptions?: WorkflowClientOptions) {
    const connection = await Connection.connect({
        address: process.env.TEMPORAL_URL ?? 'localhost:7233'
    });

    return new WorkflowClient({
        ...clientOptions,
        connection: connection,
        namespace: process.env.NAMESPACE ?? "default"
    });
};