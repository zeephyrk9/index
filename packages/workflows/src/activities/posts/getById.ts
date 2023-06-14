import getUnifiedPostId from "@workflows/helpers/getUnifiedPostId";
import { Context } from "../../context";
import { ContentEntry, VendorType } from "../../database";
import { GetPostByIdQuery } from "../../database/queries";

export async function getPostById(context: Context, vendor: VendorType, id: string): Promise<ContentEntry | null> {
    const response = await context.getDatabaseSession().run<ContentEntry>(GetPostByIdQuery(getUnifiedPostId(vendor, id)));

    // @todo notify someone about response.records.length > 1?
    if (response.records.length <= 0 || response.records.length > 1) return;

    return response.records[0].toObject();
};