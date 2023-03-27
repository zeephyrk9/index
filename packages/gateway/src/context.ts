import { inferAsyncReturnType } from '@trpc/server';
import * as trpc from '@trpc/server/adapters/express';
import { WorkflowClient } from './client';

export const createContext = async ({
    req,
    res
}: trpc.CreateExpressContextOptions) => {
    // Getting (or creating new) connection
    const client = await WorkflowClient.getClient();

    return {
        client,
    };
};

export type Context = inferAsyncReturnType<typeof createContext>;