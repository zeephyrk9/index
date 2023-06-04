import { Context } from "@workflows/context";
import { CreateTagQuery, TagEntry } from "../../../database";

export async function createTag(context: Context, payload: TagEntry) {
    return await context.database.run<TagEntry>(CreateTagQuery(payload));
};