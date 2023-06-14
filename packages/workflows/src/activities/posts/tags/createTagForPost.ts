import { Context } from "@workflows/context";
import { CreateTagForPostQuery, TagEntry } from "../../../database";

export async function createTagForPost(context: Context, postId: string, tag: TagEntry) {
    return await context.getDatabaseSession().run(CreateTagForPostQuery(postId, tag));
};