import AbstractWorkflowMeta from "@workflows/helpers/AbstractWorkflowMeta";
import { ProxiedActivities } from "@workflows/activities/proxiedActivities";
import { z } from "zod";
import { nanoid } from "nanoid";
import { ParentClosePolicy, continueAsNew, startChild } from "@temporalio/workflow";
import { e621CreatePost } from "../utility";
import { ReconcilerPostEntry } from "@workflows/types";

const MAX_ITERATIONS = 100;

const {
    e621DownloadAndProcessCsvFile,
    getFromRedis,
} = ProxiedActivities;

const Input = z.object({
    url: z.string()
})

const Output = z.object({
    length: z.number()
});

export async function e621Reconciler(payload: z.infer<typeof Input>) {
    // Reading CSV file

    // @todo rewrite to use redis as temporary storage
    const meta = await e621DownloadAndProcessCsvFile(payload.url);

    // Starting reconciler loop
    await startChild<typeof e621ReconcilerLoop>(e621ReconcilerLoop, {
        workflowId: (`e621-reconciler-loop`),
        parentClosePolicy: ParentClosePolicy.PARENT_CLOSE_POLICY_ABANDON,
        args: [ 0, meta.length ]
    });

    return meta;
};

export async function e621ReconcilerLoop(startFrom: number, length: number) {
    let entriesProcessed = 0;
    
    // Looping through all posts
    for (let index = startFrom; index < length; index++) {
        const rawPost = await getFromRedis<ReconcilerPostEntry>(`e621ReconcilerEntry:${index}`, true);

        // @todo
        // notify someone about this
        if (rawPost == null) continue;
        
        // Starting child workflow to process this post
        // independently
        await startChild<typeof e621CreatePost>(e621CreatePost, {
            workflowId: (`createPost-e621-${ rawPost.id }`),
            parentClosePolicy: ParentClosePolicy.PARENT_CLOSE_POLICY_ABANDON,
            args: [
                {
                    id: rawPost.id,
                    created_at: rawPost.created_at,
                    updated_at: rawPost.updated_at,
                    file: {
                        url: rawPost.imageUrl,
                    },
                    tags: rawPost.tags,
                }
            ]
        });

        // Checking if we need to start new workflow
        entriesProcessed++;

        if (entriesProcessed >= MAX_ITERATIONS) {
            // Continue as new
            return await continueAsNew<typeof e621ReconcilerLoop>(index + 1, length);
        }
    };
};

export const e621ReconcilerMeta: AbstractWorkflowMeta = {
    path: "/reconcilers/e621",
    handler: e621Reconciler,

    generateWorkflowId: () => (`e621-reconciler-${ nanoid() }`),

    input: Input,
    output: Output
};
