import { Context } from "@workflows/context";
import { CreateTagQuery, TagEntry } from "../../../database";
import { runSessionableRequest } from "@workflows/utilities/runSessionableRequest";

export async function createTag(context: Context, payload: TagEntry) {
    return await runSessionableRequest<TagEntry>(context, CreateTagQuery(payload));
};