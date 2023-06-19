import { ContentEntry, ContentType, VendorType } from "@workflows/database/index";
import { Context } from "../../context";

interface TaggableContentEntry extends ContentEntry {
    tags: Array<string>;
};

// wtf is this shit???
export async function search(context: Context, query?: string): Promise<Array<TaggableContentEntry>> {
    const session = context.getDatabaseSession();

    const result = await session.run(`
        MATCH (tag:Tag)<-[rel:HAS_TAG]-(post:Post)-[post_tags_rel:HAS_TAG]->(post_tag:Tag)
        WHERE tag.name IN [${ query.split(" ").map((query) => (`"${query}"`)).join(", ") }]
        RETURN post, post_tags_rel, post_tag
        LIMIT 1000
    `);

    session.close();

    const posts: Map<string, TaggableContentEntry> = new Map();

    result.records.forEach((record) => {
        const postRecord = record.get("post");
        const tagRecord = record.get("post_tag");

        // Checking if we have this post in our posts array
        if (posts.has(postRecord.properties.id)) {
            // Adding this tag to this post (if not exists yet)
            const mappedPost = posts.get(postRecord.properties.id);

            if (mappedPost.tags.find((x) => x == tagRecord.properties.name) == undefined) {
                mappedPost.tags.push(tagRecord.properties.name);
            };
        } else {
            const post: TaggableContentEntry = {
                id: postRecord.properties.id,
                created_at: postRecord.properties.created_at?.toInt(),
                scraped_at: postRecord.properties.updated_at?.toInt(),
                tags: [],
                type: ContentType.IMAGE,
                imageUrl: postRecord.properties.imageUrl,
                vendor: VendorType.E621,
            };

            posts.set(post.id, post);
        };
    });

    return [...posts.values()];
    // return result.records.map((record) => {
    //     console.log("record:", record);
    //     return {
    //         ...record.get("post").properties,
    //     };
    // });
};