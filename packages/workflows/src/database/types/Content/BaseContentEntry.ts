import { ContentType } from "./ContentType";

export interface BaseContentEntry {
    type: ContentType,
    id: string,

    // stored in unix timestamp
    created_at: number,
    scraped_at: number,
};