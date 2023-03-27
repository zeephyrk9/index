import { Router, t } from "../../router";
import { nanoid } from "nanoid";
import { example } from '@workflows';
import z from "zod";

export const UserRoute = Router({
    getUser: t.procedure
        .meta({
            openapi: {
                method: "GET",
                path: "/user"
            }
        })
        .input(
            z.object({ name: z.string() })
        )
        .output(
            z.object({ id: z.string(), name: z.string() 
        }))
        .query(async ({ ctx, input }) => {
            console.log("trying to create new workflow run");
            const handle = await ctx.client.workflow.start(example, {
                args: ['Temporal'],
                taskQueue: 'hello-world',
                workflowId: 'workflow' + nanoid(),
            })

            console.log("handle result:", await handle.result());

            return { id: input.name, name: 'Bilbo' };
        }),
})