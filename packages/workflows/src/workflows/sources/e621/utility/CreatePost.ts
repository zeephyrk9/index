import { z } from "zod";
import { ProxiedActivities } from "@workflows/activities/proxiedActivities";
import getUnifiedPostId from "@workflows/helpers/getUnifiedPostId";
import { ContentEntry, ContentType, ImageContentEntry, TagType, VendorType } from "@workflows/database";

// Activities
const {
    getPostById,

    createPost,
    createTagForPost,
} = ProxiedActivities;

// Input
const Input = z.object({
    id: z.number(),
    created_at: z.string(),
    updated_at: z.string(),
    file: z.object({
        url: z.string(),
    }),
    tags: z.array(z.string()),
});

// Workflow
export async function e621CreatePost(payload: z.infer<typeof Input>): Promise<ImageContentEntry> {
    Input.parse(payload);

    // Checking if this post exists or no
    const postId = getUnifiedPostId(VendorType.E621, payload.id);
    const existingPost = await getPostById(VendorType.E621, String(payload.id));

    if (existingPost != null) {
        // @todo
        // update this post
        return existingPost
    } else {
        // Creating this post
        const post: ContentEntry = {
            id: postId,
            type: ContentType.IMAGE,
            imageUrl: payload.file.url,
            vendor: VendorType.E621,

            // @todo parse this
            created_at: Date.now(),
            scraped_at: Date.now(),
        }

        await createPost(post);

        // Creating this post tags
        for await (const tag of payload.tags) {
            await createTagForPost(postId, {
                name: tag,
                type: TagType.GENERAL,
            });
        };

        return post;
    };
};