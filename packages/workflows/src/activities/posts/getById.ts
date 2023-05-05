import { Context } from "../../context";
import { ContentEntry } from "../../database";
import { GetPostByIdQuery } from "../../database/queries";

export async function getPostById(context: Context, id: string): Promise<ContentEntry | null> {
    const response = await context.database.run<ContentEntry>(GetPostByIdQuery(id));
    
    // @todo
    // implement this as a normal human
    if (response.records.length <= 0 || response.records.length > 1) return;

    console.log("GetByIdResponse:", response);
    return;
};