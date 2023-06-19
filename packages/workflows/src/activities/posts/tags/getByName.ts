import { Context } from "@workflows/context";
import { GetTagByNameQuery, TagEntry } from "../../../database";
import { runSessionableRequest } from "@workflows/utilities/runSessionableRequest";

export async function getTagByName(context: Context, name: string) {
    const response = await runSessionableRequest<TagEntry>(context, GetTagByNameQuery(name));

    console.log("GetTagByName response:", response);
    return;
};