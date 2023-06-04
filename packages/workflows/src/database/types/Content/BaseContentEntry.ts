import { ContentType } from "./ContentType";
import { VendorType } from "./VendorType";

export interface BaseContentEntry {
    type: ContentType,
    id: string,

    vendor: VendorType,

    // stored in unix timestamp
    created_at: number,
    scraped_at: number,
};