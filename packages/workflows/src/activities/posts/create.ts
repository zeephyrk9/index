import { Context } from "@workflows/context";
import { ContentEntry, CreatePostQuery } from "../../database";
import { QueryResult } from "neo4j-driver";
import { runSessionableRequest } from "@workflows/utilities/runSessionableRequest";

export async function createPost(context: Context, payload: ContentEntry): Promise<QueryResult<ContentEntry>> {
    return await runSessionableRequest<ContentEntry>(context, CreatePostQuery(payload));
};