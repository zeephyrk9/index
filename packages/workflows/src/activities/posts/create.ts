import { Context } from "@workflows/context";
import { ContentEntry, CreatePostQuery } from "../../database";
import { QueryResult } from "neo4j-driver";

export async function createPost(context: Context, payload: ContentEntry): Promise<QueryResult<ContentEntry>> {
    return await context.getDatabaseSession().run<ContentEntry>(CreatePostQuery(payload));
};