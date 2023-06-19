import { Context } from "@workflows/context";
import { CreateTagForPostQuery, TagEntry } from "../../../database";
import { runSessionableRequest } from "@workflows/utilities/runSessionableRequest";

export async function createTagForPost(context: Context, postId: string, tag: TagEntry) {
    return await runSessionableRequest<TagEntry>(context, CreateTagForPostQuery(postId, tag));
};