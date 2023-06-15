import AbstractWorkflowMeta from "@workflows/helpers/AbstractWorkflowMeta";
import { ProxiedActivities } from "@workflows/activities/proxiedActivities";
import { z } from "zod";
import { nanoid } from "nanoid";
import { PostEntry } from "../scrapper/types";
import { ParentClosePolicy, continueAsNew, executeChild, startChild } from "@temporalio/workflow";
import { e621CreatePost } from "../utility";

const MAX_ITERATIONS = 100;

const {
    e621DownloadAndProcessCsvFile
} = ProxiedActivities;

const Input = z.object({
    url: z.string()
})

const Output = z.object({});

export async function e621Reconciler(payload: z.infer<typeof Input>) {
    // Reading CSV file
    const entries = await e621DownloadAndProcessCsvFile(payload.url);

    console.log("entries:", entries);

    // Starting reconciler loop
    await executeChild<typeof e621ReconcilerLoop>(e621ReconcilerLoop, {
        workflowId: (`e621-reconciler-loop`),
        args: [ entries, 0 ]
    });
};

export async function e621ReconcilerLoop(posts: Array<PostEntry>, startFrom: number) {
    let entriesProcessed = 0;
    
    // Looping through all posts
    for (let index = startFrom; index < posts.length; index++) {
        const rawPost = posts[index];

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
                        url: rawPost.file.url,
                    },
                    tags: [
                        ...rawPost.tags.general,
                        ...rawPost.tags.species,
                        ...rawPost.tags.character,
                        ...rawPost.tags.artist,
                        ...rawPost.tags.lore,
                        ...rawPost.tags.meta,
                    ]
                }
            ]
        });

        // Checking if we need to start new workflow
        entriesProcessed++;

        if (entriesProcessed >= MAX_ITERATIONS) {
            // Continue as new
            return await continueAsNew<typeof e621ReconcilerLoop>(posts, index + 1);
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
