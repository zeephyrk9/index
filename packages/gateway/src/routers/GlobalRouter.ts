import { Router, t } from "../router";
import AbstractWorkflowMeta from "@workflows/helpers/AbstractWorkflowMeta";
import * as Workflows from "@workflows";
import { nanoid } from "nanoid";

const routes = Object.fromEntries(
    Object.values(Workflows)
        .filter((workflow) => !(workflow instanceof Function))
        .map((meta: AbstractWorkflowMeta) => {
            return [meta.handler.name, t.procedure
                .meta({
                    openapi: {
                        method: "GET",
                        path: meta.path
                    }
                })
                .input(meta.input)
                .output(meta.output)
                .query(async ({ ctx, input }) => {
                    const workflowHandler = await ctx.client.workflow.start(meta.handler, {
                        args: [input],
                        taskQueue: process.env.TASK_QUEUE ?? "dev-task-queue",
                        workflowId: meta.generateWorkflowId() ?? `workflow-${ nanoid() }`
                    });

                    return await workflowHandler.result();
                })
            ];
        })
);

export const GlobalAppRouter = Router(routes);

export type AppRouter = typeof GlobalAppRouter;