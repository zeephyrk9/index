import { TagEntry } from "@workflows/database/types";
import { CreateTagQueryBody } from "./CreateTag";

export function CreateTagForPostQuery(postId: string, tag: TagEntry) {
    return `
        MATCH (post:Post)
        WHERE post.id = "${ postId }"
        MERGE (tag:Tag {
            ${ CreateTagQueryBody(tag) }
        })
        MERGE (post)-[rel:HAS_TAG]->(tag)
        RETURN post, rel, tag;
    `;
};