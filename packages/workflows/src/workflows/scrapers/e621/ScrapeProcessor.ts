import { z } from "zod";
import { PostEntry } from "./types";
import { ProxiedActivities } from "../../../activities/proxiedActivities";
import getUnifiedPostId from "../../../helpers/getUnifiedPostId";
import { ContentEntry, ContentType, TagType, VendorType } from "../../../database";
import AbstractWorkflowMeta from "../../../helpers/AbstractWorkflowMeta";
import { nanoid } from "nanoid";

const {
    getAPIRequestContents,
    getPostById,
    createPost,
    createTagForPost,
    createArtistForPost,
} = ProxiedActivities;

const Input = z.object({
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
    // Getting latest post from database
    

    // Getting posts from e621
    const { posts: rawPosts } = await getAPIRequestContents<{ posts: Array<PostEntry> }>({
        // @todo
        // add page number
        url: `https://e621.net/posts.json?limit=${ payload.limit }&tags=status:any`,
        method: "GET"
    });

    const postsAddedIds: Array<string> = [];

    // Checking if we need to update/create these posts
    for (const rawPost of rawPosts) {
        const postExists = await getPostById(VendorType.E621, String(rawPost.id));
        
        if (postExists) {
            // @todo
            // update this post information? or relationships
            console.log("do not create post");
        } else {
            // Creating this post
            const post: ContentEntry = {
                type: ContentType.IMAGE,
                id: getUnifiedPostId(VendorType.E621, rawPost.id),
                imageUrl: rawPost.file.url,
                vendor: VendorType.E621,

                created_at: Date.now(), // @todo: parse post's created_at field and pass it here
                scraped_at: Date.now(),
            };

            await createPost(post);

            // Attaching tags to this post
            for (const [type, tags] of Object.entries({
                [TagType.GENERAL]: [...rawPost.tags.general, ...rawPost.tags.character, ...rawPost.tags.copyright],
                [TagType.SPECIES]: rawPost.tags.species,
                [TagType.META]: rawPost.tags.meta,
                artists: rawPost.tags.artist,
            })) {
                // Handling author group separately
                if (type == "artists") {
                    for (const artist of tags) {
                        await createArtistForPost(post.id, {
                            name: artist,
                        });
                    };
                } else {
                    for (const tag of tags) {
                        await createTagForPost(post.id, {
                            name: tag,
                            type: type as TagType,
                        });
                    };
                }
            };
            
            postsAddedIds.push(post.id);
        };
    };

    return {
        success: true,
        meta: {
            postsAdded: postsAddedIds,
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