import AbstractWorkflowMeta from "@workflows/helpers/AbstractWorkflowMeta";
import { ProxiedActivities } from "@workflows/activities/proxiedActivities";
import { z } from "zod";
import { nanoid } from "nanoid";
import { ContentType, TagType, VendorType } from "@workflows/database";
import getUnifiedPostId from "@workflows/helpers/getUnifiedPostId";

const {
    downloadLargeFile,
    unzipFile,
    e621ProcessCsvFile,

    getPostById,
    createPost,
    createTagForPost,
} = ProxiedActivities;

const Input = z.object({
    url: z.string()
})

const Output = z.object({});

export async function e621Reconciler(payload: z.infer<typeof Input>) {
    // Downloading latest database export
    // @todo scrape list of available database exports and download the latest one
    await downloadLargeFile(payload.url, "./temp/export.zip");
    
    // Unzipping this file
    await unzipFile("./temp/export.zip", "./temp/export.csv");

    // Reading CSV file
    const entries = await e621ProcessCsvFile("./temp/export.csv")

    console.log('entries:', entries);

    for await (const entry of entries) {
        const postExists = await getPostById(VendorType.E621, String(entry.id));

        if (postExists) {
            // @todo
            // update this post?
        } else {
            const postId = getUnifiedPostId(VendorType.E621, entry.id);

            // Creating this post
            await createPost({
                type: ContentType.IMAGE,

                id: postId,
                imageUrl: entry.file.url,
                vendor: VendorType.E621,
                
                created_at: Date.now(), // @todo parse
                scraped_at: Date.now(),
            });

            // Creating post's tags
            // @todo change
            for await (const tag of entry.tags.general) {
                await createTagForPost(postId, {
                    name: tag,
                    type: TagType.GENERAL
                });
            }
        };
    }
};

export const e621ReconcilerMeta: AbstractWorkflowMeta = {
    path: "/reconcilers/e621",
    handler: e621Reconciler,

    generateWorkflowId: () => (`e621-reconciler-${ nanoid() }`),

    input: Input,
    output: Output
};