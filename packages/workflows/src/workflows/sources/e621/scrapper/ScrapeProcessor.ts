import { z } from "zod";
import { PostEntry } from "./types";
import { ProxiedActivities, getCustomProxiedActivities } from "@workflows/activities/proxiedActivities";
import AbstractWorkflowMeta from "@workflows/helpers/AbstractWorkflowMeta";
import { ChildWorkflowHandle, ParentClosePolicy, startChild } from "@temporalio/workflow";
import { e621CreatePost } from "../utility";
import { nanoid } from "nanoid";

const {
    getAPIRequestContents,
} = getCustomProxiedActivities({
    retry: {
        initialInterval: '2 seconds',
    }
});

const Input = z.object({
    limit: z.number().default(10),
});

const Output = z.object({
    success: z.boolean().default(false),
});

// Workflow implementation
export async function e621ScrapeProcessor(payload: z.infer<typeof Input>): Promise<z.infer<typeof Output>> {
    // @todo
    // Getting latest post from database    

    // Getting posts from e621
    const { posts: rawPosts } = await getAPIRequestContents<{ posts: Array<PostEntry> }>({
        // @todo
        // add page number
        url: `https://e621.net/posts.json?limit=${ payload.limit }&tags=status:any`,
        method: "GET"
    });

    // const handles: Array<ChildWorkflowHandle<typeof e621CreatePost>> = [];

    for await (const rawPost of rawPosts) {
        // handles.push(
        await startChild(e621CreatePost, {
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
        })
        // );
    };

    // Waiting for all workflows to end and returning result
    // const posts = await Promise.all(handles.map((handle) => handle.result()));

    return {
        success: true,
        // posts
    };
};

export const e621ScraperProcessorMeta: AbstractWorkflowMeta = {
    path: "/scrapers/e621",
    handler: e621ScrapeProcessor,
  
    generateWorkflowId: () => (`e621Scraper-${ nanoid() }`),
  
    input: Input,
    output: Output,
};