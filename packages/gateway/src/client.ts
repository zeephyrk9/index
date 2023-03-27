import { Client, Connection, ClientOptions } from "@temporalio/client";

class WorkflowClientClass {
    private connection: Connection | undefined;

    public async getClient(clientOptions?: Omit<ClientOptions, "connection">) {
        // Checking if our connection is open
        if (this.connection == undefined) {
            this.connection = await Connection.connect({
                address: process.env.TEMPORAL_URL ?? 'localhost:7233'
            });
        };

        return new Client({
            ...clientOptions,
            connection: this.connection,
        });
    };
};

export const WorkflowClient = new WorkflowClientClass();