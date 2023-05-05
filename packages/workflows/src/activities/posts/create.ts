import { Context } from "@workflows/context";
import { ContentEntry } from "@workflows/database";

export async function createPost(context: Context, payload: ContentEntry): Promise<ContentEntry> {
    console.log('create post!!!', payload);
    return {
        ...payload,
    };
};