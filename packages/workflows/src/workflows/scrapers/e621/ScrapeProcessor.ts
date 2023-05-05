import { z } from "zod";
import { PostEntry } from "./types";
import { ProxiedActivities } from "../../../activities/proxiedActivities";
import getUnifiedPostId from "../../../helpers/getUnifiedPostId";
import { ContentType, ImageContentEntry } from "../../../database";
import AbstractWorkflowMeta from "../../../helpers/AbstractWorkflowMeta";
import { nanoid } from "nanoid";

const { getAPIRequestContents, getPostById, createPost } = ProxiedActivities;

const Input = z.object({
    page: z.number().default(0),
    limit: z.number().default(10),
});

const Output = z.object({
    success: z.boolean().default(false),
    meta: z.object({
        postsAdded: z.array(z.string()),
    }).nullable(),
});

// Workflow implementation
export async function e621ScrapeProcessor(payload: z.infer<typeof Input>): Promise<z.infer<typeof Output>> {
    // Getting posts from e621
    const { posts } = await getAPIRequestContents<{ posts: Array<PostEntry> }>({
        // @todo
        // add page number
        url: `https://e621.net/posts.json?limit=${ payload.limit }&tags=status:any`,
        method: "GET"
    });

    const postsAdded: Array<ImageContentEntry> = [];

    // Checking if we need to update/create these posts
    for (const post of posts) {
        const postExists = await getPostById(getUnifiedPostId("E621", post.id));
        
        if (postExists) {
            // @todo
            // update this post information? or relationships
        } else {


            // Creating this post
            postsAdded.push(await createPost({
                type: ContentType.IMAGE,
                id: getUnifiedPostId("E621", post.id),
                imageUrl: post.file.url,

                created_at: Date.now(), // @todo: parse post's created_at field and pass it here
                scraped_at: Date.now(),
            }));
        };
    };

    return {
        success: true,
        meta: {
            postsAdded: postsAdded.map((post) => post.id),
        }
    };
};

export const e621ScraperProcessorMeta: AbstractWorkflowMeta = {
    path: "/scrapers/e621",
    handler: e621ScrapeProcessor,
  
    generateWorkflowId: () => (`e621Scraper-${ nanoid() }`),
  
    input: Input,
    output: Output,
};