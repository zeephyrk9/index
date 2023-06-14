import { Context } from "@workflows/context";
import { GetTagByNameQuery, TagEntry } from "../../../database";

export async function getTagByName(context: Context, name: string) {
    const response = await context.getDatabaseSession().run<TagEntry>(GetTagByNameQuery(name));

    console.log("GetTagByName response:", response);
    return;
};